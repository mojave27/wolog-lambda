// const randomBytes = require('crypto').randomBytes
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const { v1: uuidv1 } = require('uuid');

exports.handler = async (event, context, callback) => {
  console.error(event.body)
  let woday = JSON.parse(event.body)
  if (woday.id === undefined || woday.id === -1 || woday.id === "-1") {
    console.log('setting id')
    woday["id"] = uuidv1()
  }
  console.error(JSON.stringify(woday))
  // console.error(`uuid: ${uuidv1()}`)

  // let woday = validateId(event.body)
  // let id = woday.id

  let params = { 
    TableName: 'wodays',
    Item: woday
  }

  try {
    data = await docClient.put(params).promise()
    console.log('status: 200')
  } catch (error) {
    console.log('Status code : 400, Error code : ', error.stack)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({"id": "999"}),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}

// const retrieveWoDay = async (woDayId) => {
//     TableName: 'wodays',
//     KeyConditionExpression: 'id = :id',
//     ExpressionAttributeValues: {
//       ':id': woDayId
//     }
//     let data = await docClient.get({TableName: 'wodays'})
//     return data
// }

const validateId = woday => {
  if (woday.id === undefined){
    woday.id = uuidv4()
  }
  return woday
}
