const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) 
    throw new Error('anecdote service not available due to problems in server')
  return response.json()
}

export const createAnecdote = async (content) => {
  const object = { content, votes: 0 }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
  })
  if (!response.ok) 
    throw new Error('failed to create anecdote')
  return response.json()
}

export const updateAnecdote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote)
  })
  if (!response.ok) 
    throw new Error('failed to update anecdote')
  return response.json()
}