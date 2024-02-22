/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data;
    case 'CLEAR_NOTIFICATION':
      return null;
    default:
      return state;
  }
}

/**
 * The createContext() method returns an object with a Provider and a Consumer component.
  * The Provider component is used to wrap the components that you want to share the state.
  * The Consumer component is used to access the state from the Provider component.
 */
const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer)

  return (
    <NotificationContext.Provider value={[ notification, notificationDispatch ]} >
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

// a custom hook that encapsulates the logic of setting and clearing the notification
// when called, returns a function that sets the notification and clears it after 5 seconds
// then stored in a variable notifyWith
export const useNotify = () => {
  console.log('use notify')
  const valueAndDispatch = useContext(NotificationContext)
  const dispatch = valueAndDispatch[1]
  return (data) => {
    dispatch({ type: 'SET_NOTIFICATION', data })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  } 
}

export default NotificationContext