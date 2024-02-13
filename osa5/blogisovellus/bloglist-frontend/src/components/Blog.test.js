import React from 'react'
import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '1234567890'
    }
  }

  const user = {
    username: 'testuser',
    name: 'Test User',
    token: '1234567890'
  }

  let container

  beforeEach(() => {
    container = render(<Blog
      blog={blog}
      user={user} />).container
  })

  test('Renders the title and the author correctly', () => {
    // getByText throws an error if no element is found
    screen.getByText('Component testing is done with react-testing-library')
    screen.getByText('Test Author')
  })

  test('Does not render the url or likes by default', () => {
    //queryByText returns null if no element is found
    expect(screen.queryByText('www.test.com')).toBeNull()
    expect(screen.queryByText('5')).toBeNull()
  })

  test('Clicking the button shows likes, url and user', async () => {
    /**
     * used to simulate user actions in your tests, such as clicking a button,
     * typing into an input field, or selecting an option from a dropdown.
     * setup function returns a userEvent object that you can use to simulate user actions.
     * Can and is often used in a global setup file.
     */
    const user = userEvent.setup()
    const button = screen.getByText('View details')
    await user.click(button)

    screen.getByText('URL: www.test.com')
    screen.getByText('Likes: 5')
    screen.getByText('User: Test User')
  })

  test('Clicking the like button twice calls event handler twice', async () => {
    cleanup()
    const mockHandler = jest.fn()

    render(<Blog blog={blog} user={user} updateBlogLikes={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('View details')
    await user.click(button)
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})