import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(
    state => state.notification
  )
  const style = {
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
    border: '3px solid #ffcb85',
  }

  if (notification.message === '') {
    return null
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification