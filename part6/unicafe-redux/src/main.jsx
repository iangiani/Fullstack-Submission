import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'

const store = createStore(counterReducer)

const App = () => {
  const state = store.getState()

  const handleGood = () => {
    store.dispatch({ type: 'GOOD' })
  }

  const handleOk = () => {
    store.dispatch({ type: 'OK' })
  }

  const handleBad = () => {
    store.dispatch({ type: 'BAD' })
  }

  const handleReset = () => {
    store.dispatch({ type: 'RESET' })
  }

  return (
    <div>
      <div>
        <button onClick={handleGood}>good</button>
        <button onClick={handleOk}>ok</button>
        <button onClick={handleBad}>bad</button>
        <button onClick={handleReset}>reset stats</button>
      </div>

      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
