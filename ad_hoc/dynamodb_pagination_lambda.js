const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context, callback) => {
  let params = { 
    TableName: 'wodays',
    Limit: 10,
    ExclusiveStartKey: { id: '51258340-aea2-11eb-be13-7fd1c1fe24a7' } // use the LastEvaluatedKey as the ExclusiveStartKey in the next request
  }
  let wodays = []

  try {
    const data = await docClient.scan(params).promise()
    wodays = wodays.concat(data.Items)
    console.log(wodays.length)
    console.log(data.LastEvaluatedKey) // use the LastEvaluatedKey as the ExclusiveStartKey in the next request
    wodays.forEach( woday => {
      console.log(`>>> ${woday.id}`)
    })
  } catch (error) {
    console.log(error.stack)
  }
  
}
