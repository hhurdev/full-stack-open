import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import AddBlog from './AddBlog'

describe('<AddBlog />', () => {

  test('form calls the addNewBlog function with right details when a blog is created', async () => {
    const user = userEvent.setup()
    const handleAddNewBlog = jest.fn()
    const toggleBlogFormVisibility = jest.fn()

    let container = render(<AddBlog
      handleAddNewBlog={handleAddNewBlog}
      toggleBlogFormVisibility={toggleBlogFormVisibility}
      token='1234567890'
    />).container

    const titleInput = container.querySelector('#blogTitle')
    const authorInput = container.querySelector('#blogAuthor')
    const urlInput = container.querySelector('#blogURL')
    const submitButton = screen.getByText('Create')

    await user.type(titleInput, 'Test title')
    await user.type(authorInput, 'Test author')
    await user.type(urlInput, 'TestUrl')
    await user.click(submitButton)

    expect(handleAddNewBlog.mock.calls).toHaveLength(1)
    expect(handleAddNewBlog.mock.calls[0][1].title).toBe('Test title')
  })
})
/**
 * using screen to query the DOM (instead of container), which queries the entire document.
 * This is usually recommended because it more closely resembles how
 * users interact with your app.
 * You could limit the scope of the queries to a specific container (like the one returned from render)
 * In most cases you don't need container
 */

/**
   * Render is from @testing-library/react
   * returns an object that contains several properties and methods
   * that you can use to query and interact with the rendered component
   * for example, querySelector, querySelectorAll, getByText, getByLabelText,
   * getByRole, getByTestId, getByAltText, getByTitle, getByDisplayValue,
   * getByPlaceholderText, getBySelectText
   * container: This is a div that the rendered component is appended to.
   * You can use it to make assertions about what gets rendered.
   * on myös baseElement, rerender, unmount, debug, asFragment etc.
   */