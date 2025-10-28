const Notification = (props) => {
  if (!props.message) 
    return null

  let notname
  if (props.type === 'error') {
    notname = 'error'
  } else {
    notname = 'success'
  }
  return <div className={notname}>{props.message}</div>
}

export default Notification
