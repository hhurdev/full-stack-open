const listHelper = require('../utils/list_helper')
const { initialBlogs, listWithOneBlog } = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs, sum all the likes', () => {
    const result = listHelper.totalLikes(initialBlogs)
    expect(result).toBe(36)
  })
})

describe('blog with most likes', () => {
  test('when list has multiple blogs, return the blog with most likes', () => {
    const mostLiked = listHelper.favoriteBlog(initialBlogs)
    expect(mostLiked).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})

describe('blogger with most blogs', () => {
  test('when list has multiple blogs, return the blogger with most blogs', () => {
    const mostBlogs = listHelper.mostBlogs(initialBlogs)
    expect(mostBlogs).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('blogger with most likes', () => {
  test('when list has multiple blogs, return the blogger with most likes on blogs', () => {
    const mostLikes = listHelper.mostLikes(initialBlogs)
    expect(mostLikes).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})