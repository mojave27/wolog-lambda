const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const { v1: uuidv1 } = require('uuid');

const addMeal = async (food_item) => {
    let params = { 
      TableName: 'food_items',
      Item: food_item
    }
  
    let result_data = {}

    try {
      console.error('fixing to add the item...')
      result_data = await docClient.put(params).promise()
      console.error('got to success')
      console.error(result_data)
      console.error(`success: added ${JSON.stringify(food_item)} to food_items table.`)
      return result_data
    } catch (error) {
      console.error('got to error')
      console.error('Status code : 400, Error code : ', error.stack)
      throw error
    }
  
}


exports.handler = async (event, context, callback) => {
  let food_items = event['body-json']['food_items']

  let food_items_with_valid_ids = food_items.map(food_item => {
    if (food_item.id === undefined || food_item.id === -1 || food_item.id === "-1" || food_item.id === '') {
      console.log('setting id')
      food_item["id"] = uuidv1()
    }
    return food_item
  })
  
  let all_results = []
    
  for (const food_item of food_items_with_valid_ids) {
    let result_data = await addFoodItem(food_item)
    all_results.push(result_data)
    console.error(all_results)
  }
  
  let result_data = await addFoodItem(food_items_with_valid_ids[0])
  all_results.push(result_data)
  console.error(all_results)
  

  return {
    statusCode: 200,
    body: JSON.stringify(all_results),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
}
