const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const { v1: uuidv1 } = require('uuid');

exports.handler = async (event, context, callback) => {
  console.error(event['body-json'])
  //let workout = JSON.parse(event['body-json'])
  let workout = event['body-json']
  if (workout.id === undefined || workout.id === -1 || workout.id === "-1" || workout.id === '') {
    console.log('setting id')
    workout["id"] = uuidv1()
  }
  console.error(JSON.stringify(workout))

  let params = { 
    TableName: 'workouts',
    Item: workout
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
    body: JSON.stringify(workout),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
}

// const validateId = workout => {
//   if (workout.id === undefined){
//     workout.id = uuidv4()
//   }
//   return workout
// }
