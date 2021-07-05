// const randomBytes = require('crypto').randomBytes
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const writeClient = new AWS.DynamoDB.DocumentClient()

const update = woday => {
  let updatedWoday = JSON.parse(JSON.stringify(woday))
  if(typeof woday.workouts !== 'undefined') {
    console.log(`__UPDATING: ${updatedWoday.id} - ${updatedWoday.date}`)
    addSetsAndTargets(updatedWoday)

    updatedWoday.workouts.forEach( workout => {
      // for ea wo > sets > set, 
      workout.sets.forEach( set => {
        // for ea exGroup
        set.exerciseGroups.forEach( exGroup => {
          // for ea exercise
          exGroup.exercises.forEach( ex => {
            let tempSet = { weight: ex.weight, reps: ex.reps }
            // copy the weight and reps to corresponding exercise under wo > exGroups
            workout.exerciseGroups.forEach( eg => {
              if (eg.id == exGroup.id) {
                eg.exercises.forEach(thatEx => {
                  if (thatEx.id == ex.id) {
                    thatEx.sets.push(tempSet)
                  }
                })
              }
            })
          })
        })
      })
    })
    updatedWoday.last_updated = Date.now()
    return updatedWoday
  } else {
    console.log(`*** WODAY ${woday.id} INCORRECT FORMAT ***`)
  }
  // delete updatedWoday.sets
}

const addSetsAndTargets = woday => {
  if(typeof woday.workouts !== 'undefined') {
  woday.workouts.forEach(wo => {
    wo.exerciseGroups.forEach(exGroup => {
      exGroup.exercises.forEach(ex => {
        ex.sets = []
        ex.targets = ex.reps
      })
    })
  })
  }
}

const writeUpdates = async (updates) => {
  let count = 0
  for (const woday of updates) {
    count++
    if(count > 0){
      console.log(`updating item: ${count} with id ${woday.id}`)
      let params = { 
        TableName: 'wodays',
        Item: woday
      }
 
      let result = await docClient.put(params).promise()
    }
  } 
}

const addSets = ex => {
  ex.sets = [{reps: '', weight: ''}]
}

const addTargets = ex => {
  ex.targets = ex.reps
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
      if(typeof woday.workouts !== 'undefined' && typeof woday.last_updated === 'undefined') {
        let updatedWoday = update(woday)
        updatedWodays.push(updatedWoday)
      }
    })
    console.log(`updatedWodays count: ${updatedWodays.length}`)
    await writeUpdates(updatedWodays)
  } catch (error) {
    console.log(error.stack)
  }
  
  console.log(wodays.length)
  console.log(updatedWodays.length)
  
}

