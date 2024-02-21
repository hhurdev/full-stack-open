/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', content: ''},
  reducers: {
    notificationSetHandler(state, action) {
      console.log('setting notification')
      state.message = action.payload
      console.log('notification set to', action.payload)
    },
    hideNotification(state, action) {
      state.message = ''
      console.log('notification hidden')
    }
  }
})

export const setNotification = (content, seconds) => {
  return async dispatch => {
    dispatch(notificationSetHandler(content))
    setTimeout(() => {
      dispatch(hideNotification())
    }, seconds*1000)
  }
}

export default notificationSlice.reducer
export const { notificationSetHandler, hideNotification } = notificationSlice.actions