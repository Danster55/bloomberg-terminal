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
    // Fetch company overview (includes P/E, dividend yield, etc)
    const overviewData = await fetchAlphaVantageData(
      `query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    );

    console.log(`DEBUG ${symbol}:`, JSON.stringify(overviewData));

    // Extract relevant fields from OVERVIEW
    const data = {
      c: parseFloat(overviewData['LatestPrice']) || null,
      pe: parseFloat(overviewData['TrailingPE']) || parseFloat(overviewData['ForwardPE']) || null,
      dividend: parseFloat(overviewData['DividendPerShare']) || null,
      symbol: symbol,
      debug: overviewData
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
