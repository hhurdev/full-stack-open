/* eslint-disable react/prop-types */
import { createContext, useReducer } from 'react';

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

export default NotificationContext