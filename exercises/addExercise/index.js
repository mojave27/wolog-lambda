const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const { v1: uuidv1 } = require('uuid');

exports.handler = async (event, context, callback) => {
  console.error(event['body-json'])
  //let workout = JSON.parse(event['body-json'])
  let exercise = event['body-json']
  if (exercise.id === undefined || exercise.id === -1 || exercise.id === "-1" || workout.id === '') {
    console.log('setting id')
    exercise["id"] = uuidv1()
  }
  console.error(JSON.stringify(exercise))

  let params = { 
    TableName: 'exercises',
    Item: exercise
  }
  
  let data = {}

  try {
    data = await docClient.put(params).promise()
    console.log('status: 200')
  } catch (error) {
    console.log('Status code : 400, Error code : ', error.stack)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(exercise),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
}
