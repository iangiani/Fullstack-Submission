import { createSelector } from '@reduxjs/toolkit'

const selectAnecdotes = state => state.anecdotes
const selectFilter = state => state.filter

export const selectFilteredAndSortedAnecdotes = createSelector(
  [selectAnecdotes, selectFilter],
  (anecdotes, filter) => {
    const filtered = filter
      ? anecdotes.filter(a => 
          a.content.toLowerCase().includes(filter.toLowerCase())
        )
      : anecdotes

    return [...filtered].sort((a, b) => b.votes - a.votes)
  }
)