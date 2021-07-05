const update = (woday) => {
  let updatedWoday = JSON.parse(JSON.stringify(woday))
  console.log(JSON.stringify(updatedWoday))
  if (typeof woday.workouts !== undefined) {
    addSetsAndTargets(woday)

    console.log(woday.workouts.length)
    woday.workouts.forEach((workout) => {
      console.log(workout.name)
      // for ea wo > sets > set,
      workout.sets.forEach((set) => {
        // for ea exGroup
        set.exerciseGroups.forEach((exGroup) => {
          // for ea exercise
          exGroup.exercises.forEach((ex) => {
            let tempSet = { weight: ex.weight, reps: ex.reps }
            // copy the weight and reps to corresponding exercise under wo > exGroups
            workout.exerciseGroups.forEach((eg) => {
              if (eg.id == exGroup.id) {
                eg.exercises.forEach((thatEx) => {
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
  } else {
    console.log(`*** WODAY ${woday.id} INCORRECT FORMAT ***`)
  }
  // delete updatedWoday.sets
}
