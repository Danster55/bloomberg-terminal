const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { symbol } = event.queryStringParameters || {};

  if (!symbol) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing symbol parameter' })
    };
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    // Fetch global quote (price, P/E, dividend yield)
    const quoteData = await fetchAlphaVantageData(
      `query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );

    // Extract relevant fields
    const quote = quoteData['Global Quote'] || {};
    
    const data = {
      c: parseFloat(quote['05. price']) || null,
      pc: parseFloat(quote['08. previous close']) || null,
      d: parseFloat(quote['09. change']) || null,
      dp: parseFloat(quote['10. change percent']) || null,
      pe: parseFloat(quote['12. pe ratio']) || null,
      dividend: parseFloat(quote['21. dividend amount']) || null,
      symbol: symbol
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=3600'
      },
      body: JSON.stringify({
        symbol,
        data: data,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch stock data',
        message: error.message
      })
    };
  }
};

function fetchAlphaVantageData(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.alphavantage.co',
      port: 443,
      path: `/query?${endpoint.split('?')[1]}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
