const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const { v1: uuidv1 } = require('uuid');

exports.handler = async (event, context, callback) => {
  console.error(event['body-json'])
  //let workout = JSON.parse(event['body-json'])
  let food_items = event['body-json']
  let food_items_with_valid_ids = food_items.map(food_item => {
    if (food_item.id === undefined || food_item.id === -1 || food_item.id === "-1" || food_item.id === '') {
      console.log('setting id')
      food_item["id"] = uuidv1()
    }
    return food_item
    console.error(JSON.stringify(food_item))
  })

  let params = { 
    TableName: 'food_items',
    Item: food_items_with_valid_ids
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
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
}
