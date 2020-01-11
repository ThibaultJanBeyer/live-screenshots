const screenshot = require('./src/screenshot')

const returnObj = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "image/png"
  },
  isBase64Encoded: true
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {}
  const { url, query, perfect, viewport } = params

  if (!url) return {
    statusCode: 200,
    body: JSON.stringify(params),
  }

  try {
    const image = await screenshot({
      url,
      query,
      perfect: perfect && JSON.parse(perfect),
      viewport: viewport && JSON.parse(viewport),
    })
    return {
      ...returnObj,
      body: image,
    }
  } catch (e) {
    console.log("MESSAGE!!", e.errorMessage || e.message || e);
    return {
      ...returnObj,
      headers: {
        ...returnObj.headers,
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(e),
    }
  }
};
