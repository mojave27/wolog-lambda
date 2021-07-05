let woday = {
  id: "1ad549c0-c585-11eb-aaf4-6bd0a35c11b0",
  date: {
   month: "5",
   day: "4",
   year: "2021"
  },
  workouts: [
   {
    name: "20s - U1",
    description: "target 20 reps in 3 rounds w/ 30 seconds rest",
    id: "2a91dee0-9a0c-11eb-8ed0-67bfadfeb760",
    sets: [
     {
      exerciseGroups: [
       {
        exercises: [
         {
          name: "dips",
          weight: "",
          id: "1",
          reps: ""
         },
         {
          name: "row, cable (narrow)",
          weight: "",
          id: "24",
          reps: ""
         }
        ],
        id: 0
       },
       {
        exercises: [
         {
          name: "incline bench press",
          weight: "",
          id: "20",
          reps: ""
         },
         {
          name: "pulldown, cable",
          weight: "",
          id: "dd941aa0-45ff-11eb-98df-5f178b717089",
          reps: ""
         }
        ],
        id: 1
       },
       {
        exercises: [
         {
          name: "tricep pushdown (straight bar)",
          weight: "",
          id: "23",
          reps: ""
         },
         {
          name: "curl, ez bar",
          weight: "",
          reps: "",
          id: "3e9fe140-9adc-11eb-8e04-15d1dd84e00e",
          notes: "keep elbows tight to sides"
         }
        ],
        id: 2
       }
      ],
      id: 0
     }
    ],
    exerciseGroups: [
     {
      exercises: [
       {
        name: "dips",
        id: "1",
        reps: "1 rest-pause-ish set, 20 reps",
        type: "compound"
       },
       {
        name: "row, cable (narrow)",
        id: "24",
        reps: "1 rest-pause-ish set, 20 reps",
        type: "compound"
       }
      ],
      id: 0
     },
     {
      exercises: [
       {
        name: "incline bench press",
        id: "20",
        reps: "1 rest-pause-ish set, 20 reps",
        type: "compound"
       },
       {
        name: "pulldown, cable",
        id: "dd941aa0-45ff-11eb-98df-5f178b717089",
        reps: "1 rest-pause-ish set, 20 reps",
        type: "compound"
       }
      ],
      id: 1
     },
     {
      exercises: [
       {
        name: "tricep pushdown (straight bar)",
        id: "23",
        reps: "1 rest-pause-ish set, 20 reps",
        type: "isolation"
       },
       {
        name: "curl, ez bar",
        reps: "1 rest-pause-ish set, 20 reps",
        id: "3e9fe140-9adc-11eb-8e04-15d1dd84e00e",
        notes: "keep elbows tight to sides",
        type: "isolation"
       }
      ],
      id: 2
     }
    ]
   }
  ],
  energy: 10,
  cardio: {
   exercises: [],
   headers: [
    "delete",
    "type",
    "targets",
    "duration",
    "distance",
    "heart rate"
   ]
  },
  notes: "",
  sleep: 10,
  goals: "",
  duration: "0",
  weight: "",
  activeWo: -1
 }

const main = () => {
  update(woday)
}

// const randomBytes = require('crypto').randomBytes
// const AWS = require('aws-sdk')
// const docClient = new AWS.DynamoDB.DocumentClient()
// const writeClient = new AWS.DynamoDB.DocumentClient()

const update = woday => {
  let updatedWoday = JSON.parse(JSON.stringify(woday))
  updatedWoday.workouts.forEach( workout => {
    workout.exerciseGroups.forEach( exGroup => {
      exGroup.exercises.forEach(ex => {
        addTargets(ex)
        addSets(ex)
      })
    })
  })
  delete updatedWoday.sets
}

// const writeUpdates = async (updates) => {
//   let count = 0
//   for (const woday of updates) {
//     count++
//     if(count < 15){
//       console.log(`updating count: ${count}`)
//       let params = { 
//         TableName: 'wodays',
//         Item: woday
//       }
 
//       let result = await docClient.put(params).promise()
//       console.log(JSON.stringify(result))
//     }
//   } 
// }

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
    updatedWodays = wodays.map( (woday,index) => {
      return update(woday)
    })
    console.log(`updatedWodays count: ${wodays.length}`)
    await writeUpdates(updatedWodays)
  } catch (error) {
    console.log(error.stack)
  }
  
  console.log(wodays.length)
  console.log(updatedWodays.length)
  
}


main()
