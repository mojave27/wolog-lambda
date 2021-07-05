// const randomBytes = require('crypto').randomBytes
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const writeClient = new AWS.DynamoDB.DocumentClient()

const update = woday => {
  let updatedWoday = JSON.parse(JSON.stringify(woday))
    console.log(`__UPDATING: ${updatedWoday.id} - ${updatedWoday.date}`)
    // console.log(`${JSON.stringify(updatedWoday.date.year)}, ${JSON.stringify(updatedWoday.date.month)}, ${JSON.stringify(updatedWoday.date.day)}`)
    let d = new Date(updatedWoday.date.year, updatedWoday.date.month, updatedWoday.date.day)
    updatedWoday.date_epoch = d.getTime()
    updatedWoday.last_updated = Date.now()
    console.log(updatedWoday.date_epoch)
    console.log(updatedWoday.last_updated)
    return updatedWoday
}

const writeUpdates = async (updates) => {
  let count = 0
  for (const woday of updates) {
    count++
    if(count > 0){
      console.log(`writing item: ${count} with id ${woday.id}`)
      let params = { 
        TableName: 'wodays',
        Item: woday
      }
      await docClient.put(params).promise()
    }
  } 
}

exports.handler = async (event, context, callback) => {
  let params = { TableName: 'wodays' }
  let wodays = []
  let updatedWodays = []

  try {
    const data = await docClient.scan(params).promise()
    wodays = wodays.concat(data.Items)
    console.log(`wodays count: ${wodays.length}`)
    wodays.forEach( (woday,index) => {
      let updatedWoday = update(woday)
      updatedWodays.push(updatedWoday)
    })
    console.log(`updatedWodays count: ${updatedWodays.length}`)
    await writeUpdates(updatedWodays)
  } catch (error) {
    console.log(error.stack)
  }
  
  console.log(wodays.length)
  console.log(updatedWodays.length)
  
}

