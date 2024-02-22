import NotificationContext from '../contexts/NotificationContext'
import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  // otetaan vain se arvo, joka on tarpeen
  const notification = useNotificationValue()

  const style = {
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
    border: '3px solid #ffcb85',
  }
  
  if (!notification) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
