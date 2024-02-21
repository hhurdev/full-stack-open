import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    filterChange(state, action) {
      // jos haluaa tulostaa tilan, pitää näin koska
      // immerin takia tuloste on muuten aika hassu
      console.log(JSON.parse(JSON.stringify(state)))
      return action.payload
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer