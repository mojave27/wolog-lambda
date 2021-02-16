// const randomBytes = require('crypto').randomBytes
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  //   errorResponse(
  //     'Authorization not configured',
  //     context.awsRequestId,
  //     callback
  //   )
  //   return
  // }
  let woDayId = event.pathParameters.id

  let params = {
    TableName: 'wodays',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': woDayId
    }
  }

  let wodays = []

  try {
    const data = await docClient.query(params).promise()
    console.log('status: 200')
    wodays = wodays.concat(data.Items)
  } catch (error) {
    console.log('Status code : 400, Error code : ', error.stack)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(wodays[0]),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
