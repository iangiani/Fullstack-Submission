const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) 
    throw new Error('Failed to fetch anecdotes')

  const data = await response.json()

  if (Array.isArray(data)) {
    return data.map(item => ({
      id: item.id,
      content: typeof item.content === 'string' ? item.content : String(item.content?.content || ''),
      votes: Number(item.votes) || 0
    }))
  }
  
  return Object.values(data).map(item => ({
    id: item.id,
    content: typeof item.content === 'string' ? item.content : String(item.content?.content || ''),
    votes: Number(item.votes) || 0
  }))
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
  })

  if (!response.ok) 
    throw new Error('Failed to create anecdote')

  const data = await response.json()
  const anecdote = data.anecdote || data

  return {
    id: anecdote.id,
    content: String(anecdote.content),
    votes: Number(anecdote.votes) || 0
  }
}

const updateVote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote)
  })

  if (!response.ok) 
    throw new Error('Failed to update vote')

  const data = await response.json()
  const updated = data.anecdote || data
  
  return {
    id: updated.id,
    content: String(updated.content),
    votes: Number(updated.votes)
  }
}

export default { getAll, createNew, updateVote }