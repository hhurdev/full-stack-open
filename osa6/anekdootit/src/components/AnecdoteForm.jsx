import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

export const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createNewAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification(`You created the anecdote '${content}'`, 5))
  }

  const style = {
    marginBottom: 15,
    backgroundColor: '#baffc9',
    padding: 10,
    borderRadius: 5
  }

  return (
    <div style={style}>
      <h2>Create new anecdote</h2>
      <form onSubmit={createNewAnecdote}>
        <div><input name='anecdote' /></div>
        <button type='submit' style={{ marginTop: 5 }}>Create</button>
      </form>
    </div>
  )
}


