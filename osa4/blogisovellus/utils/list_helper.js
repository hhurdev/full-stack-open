const _ = require('lodash')
const logger = require('./logger')

const dummy = (blogs) => {
  console.log('dummy ', blogs)
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  return blogs.reduce(
    (sum, currentBlog) => sum + currentBlog.likes, 0
  )
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const mostLiked = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return (
    {
      title: mostLiked.title,
      author: mostLiked.author,
      likes: mostLiked.likes
    }
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  logger.info('counting authors')
  const authorCounts = _.countBy(blogs, 'author')
  const authorsOrganized = _.toPairs(authorCounts)
  const bestAuthor = _.maxBy(authorsOrganized, author => author[1])
  logger.info(bestAuthor)

  return ({
    author: bestAuthor[0],
    blogs: bestAuthor[1]
  })
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const groupedByAuthor = _.groupBy(blogs, 'author')
  //logger.info(groupedBlogs)
  const groupedByLikes = _.map(groupedByAuthor, (authorsBlogs, author) => {
    //logger.info('logging author: ', author)
    const likes = _.sumBy(authorsBlogs, 'likes')
    return ({
      author,
      likes
    })
  })

  const mostLikedAuthor = _.maxBy(groupedByLikes, 'likes')
  return mostLikedAuthor
  // jee toimii
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

