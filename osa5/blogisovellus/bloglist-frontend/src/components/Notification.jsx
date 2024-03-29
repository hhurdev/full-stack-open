/* eslint-disable react/prop-types */

const Notification = ({ message, type }) => {
  if (message === '') {
    return null
  }

  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 10,
    margin: 10
  }

  const errorStyle = {
    ...notificationStyle,
    color: 'red'
  }

  if (type==='error') {
    return (
      <div style={errorStyle} id="errorNotification">{message}</div>
    )
  }

  if (type==='success') {
    return (
      <div style={notificationStyle} id="successNotification">{message}</div>
    )
  }
}

export default Notification