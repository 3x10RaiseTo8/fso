import { useState } from 'react'

//Helper function
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

// React components
const Header = ({name}) => <h1>{name}</h1>

const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>

const Anecdote = ({anecdotes, votes, index}) => {
  return (
    <>
    <p>{anecdotes[index]}</p>
    <p>Has {votes[index]} votes</p>
    </>
  )
}

// Main component
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const len = anecdotes.length

  // Hooks
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(len).fill(0))

  // Helper Functions
  const handleVotes = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }

  const handleNext = () => setSelected(getRandomInt(len))

  const mostVotes = () => votes.indexOf(Math.max(...votes))

  // Webpage
  return (
    <>
      <Header name="Anecdote of the day" />
      <Anecdote anecdotes={anecdotes} votes={votes} index={selected} />
      <Button text="Vote" handleClick={handleVotes} />
      <Button text="Next Anecdote" handleClick={handleNext} />
      <Header name="Anecdote with most votes" />
      <Anecdote anecdotes={anecdotes} votes={votes} index={mostVotes()} />
    </>
  )
}

export default App