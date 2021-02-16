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
  let exerciseId = event.pathParameters.id

  let params = {
    TableName: 'exercises',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': Number(exerciseId)
    }
  }

  let exercises = []

  try {
    const data = await docClient.query(params).promise()
    console.log('status: 200')
    exercises = exercises.concat(data.Items)
  } catch (error) {
    console.log('Status code : 400, Error code : ', error.stack)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(exercises[0]),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
