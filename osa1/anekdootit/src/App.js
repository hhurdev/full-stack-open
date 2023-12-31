import { useState } from 'react'

const App = () => {
  const [votes, setVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0
  })

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  const randomize = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const vote = () => {
    const copy = { ...votes }
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <>
      <AnecdoteOfDay anecdotes={anecdotes} selected={selected} votes={votes} vote={vote} randomize={randomize}/>     
      <AnecdoteMostVotes anecdotes={anecdotes} votes={votes}/>
    </>
  )
}


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const AnecdoteOfDay = ({ anecdotes, selected, votes, vote, randomize }) => {
  return (
    <>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br/>
      has {votes[selected]} votes
      <br/>
      <Button handleClick={vote} text="vote"/>
      <Button handleClick={randomize} text="next anecdote"/>
    </>
  )
}

// oletus: kahdella ei ole samaa määrää ääniä; jos on, näytetään ensimmäinen.
const AnecdoteMostVotes = ({ anecdotes, votes }) => {
  const mostVotes = Math.max(...Object.values(votes))
  const mostVoted = Object.keys(votes).find(key => votes[key] === mostVotes)
  return (
    <>
      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVoted]}
      <br/>
      has {votes[mostVoted]} votes
    </>
  )
}

export default App