import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../services/anecdotes"
import NotificationContext from "../contexts/NotificationContext"
import { useContext } from 'react'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  /**
   * Voi myös
   * const [mutate, { data, isLoading, isError, error, isSuccess }] = useMutation(createAnecdote);
   * Jos kutsuu useMutation pelkällä funktiolla, niin se palauttaa array
   */
  const newAnecdoteMutation = useMutation(
    createAnecdote, {
    onSuccess: (newAnecdote) => {
      // voisi tehdä myös invalidate, mutta silloin hakee aina uudestaan palvelimelta
      // tämä vähentää palvelinkutsuja, kun ne lisää itse manuaalisesti cacheen
      // jätän äänestämisen vanhaan muotoon, niin muistaa miten tehdään
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatch({ type: 'SET_NOTIFICATION', data: `A new anecdote "${newAnecdote.content}" created!` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
    onError: (error) => {
        const errorMessage = error.response.data.error
        if (errorMessage === 'too short anecdote, must have length 5 or more'){
          dispatch({ type: 'SET_NOTIFICATION', data: `The anecdote is too short. It must have a length of 5 characters or more.` })
          setTimeout(() => {
            dispatch({ type: 'CLEAR_NOTIFICATION' })
          }, 5000)
        }
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate(content)
  }

  const style = {
    marginBottom: 15,
    backgroundColor: '#baffc9',
    padding: 10,
    borderRadius: 5
  }

  return (
    <div style={style}>
      <h3>Create a new anecdote</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit" style= {{ marginLeft: 5 }}>Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
