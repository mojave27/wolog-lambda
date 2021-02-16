const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const { v1: uuidv1 } = require('uuid');

exports.handler = async (event, context, callback) => {
  console.error(event['body-json'])
  //let program = JSON.parse(event['body-json'])
  let program = event['body-json']
  if (program.id === undefined || program.id === -1 || program.id === "-1" || program.id === '') {
    console.log('setting id')
    program["id"] = uuidv1()
  }
  console.error(JSON.stringify(program))

  let params = { 
    TableName: 'programs',
    Item: program
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
    body: JSON.stringify(program),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
}

// const validateId = program => {
//   if (program.id === undefined){
//     program.id = uuidv4()
//   }
//   return program
// }
