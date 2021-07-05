const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context, callback) => {
  console.log(event)
  console.log(event.params.path.id)
  
  const { id } = event.params.path
  
  console.log(`deleting woday with id: ${id}`)

  var params = {
    TableName : 'wodays',
    Key: {
      id: id
    }
  }

  try {
    await docClient.delete(params).promise()
    console.log('status: 200')
  } catch (error) {
    console.log('Status code : 400, Error code : ', error.stack)
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
}
