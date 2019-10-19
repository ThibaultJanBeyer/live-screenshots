const screenshot = require('./src/screenshot')

exports.handler = async (event, context, callback) => {
  const params = event.queryStringParameters || {}
  const { url, query, perfect, viewport } = params

  try {
    const image = await screenshot({
      url,
      query,
      perfect: perfect && JSON.parse(perfect),
      viewport: viewport && JSON.parse(viewport),
    })
    callback({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "image/png"
      },
      body: image,
      isBase64Encoded: true
    })
  } catch (e) {
    console.log("MESSAGE!!", e.errorMessage || e.message || e);
    callback({
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text"
      },
      body: JSON.stringify(e)
    })
  }
};
