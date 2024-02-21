import { useContext } from 'react'
import NotificationContext from '../contexts/NotificationContext'

const Notification = () => {
  const [notification, dispatch] = useContext(NotificationContext)

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
