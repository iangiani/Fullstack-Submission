import { useState, useEffect } from 'react'

const Notification = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (!message) 
    return null

  return <div>{message}</div>
}

export default Notification