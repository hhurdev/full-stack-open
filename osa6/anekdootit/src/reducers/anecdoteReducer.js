import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../../services/anecdotes'

/**
 * Funktio createSlice palauttaa objektin, joka sisältää sekä
 * reducerin että reducers-parametrin actioneiden mukaiset action creatorit.
 * Reducer on palautetussa objektissa noteSlice.reducer-kentässä kun taas
 * action creatorit ovat noteSlice.actions-kentässä. ks export
 */
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    anecdoteVoteHandler(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(anecdote => anecdote.id === id)
      anecdoteToChange.votes += 1
      return state.sort(( a, b ) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload.sort(( a, b ) => b.votes - a.votes)
    }
  }
})

// eli createSlice kutsuessa toolkit generoi action creatorit
// samalla nimellä kuin reducerit. Bundlaa ne sitten tuohon objektin
// actions ominaisuuteen. Nuo sitten palauttavat taas actionin, jota käytetään
// dispatchia kutsuessa.
export const {
  appendAnecdote,
  setAnecdotes,
  anecdoteVoteHandler
} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
      const anecdotes = await anecdoteService.getAll()
      dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const createdAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(createdAnecdote))
  }
}

export const submitVoteForAnecdote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const id = anecdote.id
    await anecdoteService.updateAnecdote(id, updatedAnecdote)
    dispatch(anecdoteVoteHandler(id))
  }
}
export default anecdoteSlice.reducer