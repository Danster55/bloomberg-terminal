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

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    // Fetch quote data (current price, change, etc)
    const quoteData = await fetchFinnhubData(`quote?symbol=${symbol}&token=${apiKey}`);
    
    // Fetch company financials (P/E, dividend yield, EPS, etc)
    const financialsData = await fetchFinnhubData(`company-basic-financials?symbol=${symbol}&metric=all&token=${apiKey}`);
    
    // Merge the data
    const mergedData = {
      ...quoteData,
      pe: financialsData?.metric?.peBasic || financialsData?.metric?.pe || null,
      dividendYield: financialsData?.metric?.dividendYield || null,
      eps: financialsData?.metric?.epsBasic || financialsData?.metric?.eps || null
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        symbol,
        data: mergedData,
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

function fetchFinnhubData(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'finnhub.io',
      port: 443,
      path: `/api/v1/${endpoint}`,
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
