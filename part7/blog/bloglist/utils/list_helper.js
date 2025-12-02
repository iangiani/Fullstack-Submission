const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  l = blogs.length
  if (l === 0) 
    return null

  let favorite = blogs[0]
  for (let i = 1; i < l; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  l = blogs.length
  if (l === 0) 
    return null

  const authorblog = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1
    return count
  }, {})

  let mostauthor = null
  let mostblog = 0
  for (const a in authorblog) {
    if (authorblog[a] > mostblog) {
      mostauthor = a
      mostblog = authorblog[a]
    }
  }

  return {
    author: mostauthor,
    blogs: mostblog,
  }
}

const mostLikes = (blogs) => {
  l = blogs.length
  if (l === 0) 
    return null

  const authorlike = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + (blog.likes || 0)
    return count
  }, {})

  let mostauthor = null
  let mostlike = 0
  for (const a in authorlike) {
    if (authorlike[a] > mostlike) {
      mostauthor = a
      mostlike = authorlike[a]
    }
  }

  return {
    author: mostauthor,
    likes: mostlike,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}


