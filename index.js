'use strict'
const _ = require('lodash')
const electionData = require('presidential-election-data')
const years = Object.keys(electionData)

years.forEach((year) => {
  // count up democrat, republican electoral votes
  const votes = electionData[year].votes
  const states = Object.keys(votes)

  // get totals
  const electoral = states.map(state => votes[state].electoral)
  const democratVotes = _.sum(electoral.map(e => e.democrat))
  const republicanVotes = _.sum(electoral.map(e => e.republican))

  console.log(year)
  const overturns = states.filter((state) => {
    const stateElectoral = votes[state].electoral

    // Move the electoral votes to the other team
    let revisedRepublican
    let revisedDemocrat
    if (stateElectoral.democrat) {
      revisedDemocrat = democratVotes - stateElectoral.democrat
      revisedRepublican = republicanVotes + stateElectoral.democrat
    } else {
      revisedRepublican = republicanVotes - stateElectoral.republican
      revisedDemocrat = democratVotes + stateElectoral.republican
    }

    return winner(revisedDemocrat, revisedRepublican) !== winner(democratVotes, republicanVotes)
  })

  if (overturns.length) {
    console.log(overturns.join(', '))
  } else {
    console.log('none')
  }
  console.log('')
})

function winner (dem, rep) {
  return dem > rep ? 'democrat' : 'republican'
}
