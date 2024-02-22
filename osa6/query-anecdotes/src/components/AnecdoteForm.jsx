import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../services/anecdotes"
import NotificationContext from "../contexts/NotificationContext"
import { useContext } from 'react'
import { useNotify } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notifyWith = useNotify()

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
      notifyWith(`A new anecdote "${newAnecdote.content}" created!`)
    },
    onError: (error) => {
      const errorMessage = error.response.data.error
      if (errorMessage === 'too short anecdote, must have length 5 or more'){
        notifyWith(`The anecdote is too short. Use a minimum of five characters.`)
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
