'use strict'
const _ = require('lodash')
const electionData = require('presidential-election-data')
const years = Object.keys(electionData)

const statesThatMatterMap = {}

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

  overturns.forEach((state) => {
    statesThatMatterMap[state] = true
  })

  if (overturns.length) {
    console.log(overturns.join(', '))
  } else {
    console.log('none')
  }
  console.log('')
})

const allStates = Object.keys(electionData[_.last(years)].votes).sort()
const statesThatMatter = Object.keys(statesThatMatterMap).sort()

const statesThatDont = allStates.filter((state) => !_.includes(statesThatMatter, state))

console.log('States that have never had an effect on an election since 1900')
console.log(statesThatDont.join(', '))

function winner (dem, rep) {
  return dem > rep ? 'democrat' : 'republican'
}
