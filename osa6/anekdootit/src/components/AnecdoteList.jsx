/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux"
import { submitVoteForAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

export const AnecdoteList = () => {
  const filter = useSelector(state => state.filter)
  console.log('filter', filter)
  
  const anecdotes = useSelector(state => {
    if (filter === '') {
      return state.anecdotes
    }
    return state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  console.log('anecdotes', anecdotes)
  const dispatch = useDispatch()

  //TODO: ei vielä tallenna tietokantaan
  const vote = (anecdote) => {
    dispatch(submitVoteForAnecdote(anecdote))
    dispatch(setNotification(`You voted for "${anecdote.content}"`, 5000))
  }

  const style = {
    marginBottom: 5,
    backgroundColor: '#bae1ff',
    padding: 10,
    borderRadius: 5
  }

  const anecdoteStyle = {
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
    border: '3px solid #FFF'
  }

  return (
    <div style={style}>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id} style={anecdoteStyle}>
          <div>
            {anecdote.content}
          </div>
          <div>
            Has {anecdote.votes} votes
            <button onClick={() => vote(anecdote)} style={{ display: 'block'}}>Vote!</button>
          </div>
        </div>
      )}
    </div>
  )
}
