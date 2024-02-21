import { useContext } from 'react'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, voteAnecdote } from './services/anecdotes'
import NotificationContext from './contexts/NotificationContext'

const App = () => {

  const [notification, dispatch] = useContext(NotificationContext)

  const style = {
    marginBottom: 5,
    backgroundColor: '#bae1ff',
    padding: 10,
    borderRadius: 5
  }

  const anecdoteStyle = {
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
    border: '3px solid #FFF'
  }

  const queryClient = useQueryClient()

  // palauttaa objektin, jonka sisällä on
  // mm. mutate, data, isLoading, isError, error, isSuccess, reset, mutateAsync
  // eka argumentti on funktio, jonka tulee palauttaa lupaus. .mutate kutsuu tätä funktiota
  // ja sille annettu argumentti on tämän funktion käytössä.
  // toka argumentti on objekti, joka sisältää mm. onMutate(ennen mutaatiota),onSuccess, onError, onSettled
  // se on vapaaehtoinen

  const voteMutation = useMutation(voteAnecdote, {
    onSuccess: (updatedAnecdote) => {
      // tää bugaa tanstack vitosessa, joten käytän nelosta
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET_NOTIFICATION', data: `You voted for "${updatedAnecdote.content}"!` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    voteMutation.mutate(updatedAnecdote)
  }

  // returns an object, joka kertoo kyselyn tilan
  // with properties like isLoading, data, error and refetch
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    // estää palvelimelta datan haun, jos aktivoi tekstikentän
    /**
     * oletusarvoinen toiminnallisuus on se, että kyselyt (joiden tila on stale)
     * päivitetään kun window focus eli sovelluksen käyttöliittymän aktiivinen elementti vaihtuu.
     */
    refetchOnWindowFocus : false,
    retry: 1
  })

  if (result.isLoading) {
    return <div>Loading the data</div>
  } else if (result.isError) {
    return <div>Anecdote service not available due to a problem in the server</div>
  }

  const anecdotes = result.data.sort((a, b) => b.votes - a.votes)

  return (
    
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id} style={style}>
          <div style={anecdoteStyle}>
            <i>{anecdote.content}</i>
          </div>
          <div style={{ marginLeft: 5, }}>
            Has {anecdote.votes} vote
            <button onClick={() => handleVote(anecdote)} style={{ marginLeft: 6}}>Vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
