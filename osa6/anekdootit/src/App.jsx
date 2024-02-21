/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AnecdoteForm } from './components/AnecdoteForm'
import { AnecdoteList } from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

import { initializeAnecdotes } from '../src/reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    // palauttaa funktion > redux thunk nappaa sen kiinni ja suorittaa
    // tarpeelliset toimet ennen kuin dispatchaa varsinaisen actionin
    // reducerille
    dispatch(initializeAnecdotes())
  }, [])
  
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteForm />
      <Filter />
      <AnecdoteList />
    </div>
  )
}

export default App