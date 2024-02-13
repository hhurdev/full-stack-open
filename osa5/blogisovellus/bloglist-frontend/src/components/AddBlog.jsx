import { useState } from 'react'

const AddBlog = ({
  token, // TODO: pitäisikö tämä olla user?
  handleAddNewBlog,
  toggleBlogFormVisibility,
}) => {

  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [URL, setURL] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const blog = {
      title,
      author,
      url: URL,
    }

    handleAddNewBlog(token, blog)

    // Clear the form
    setAuthor('')
    setTitle('')
    setURL('')
    toggleBlogFormVisibility()
  }

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              id="blogTitle"
              name="blogTitle"
              onChange={({ target }) => setTitle(target.value) }
            />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input
              type="text"
              value={author}
              id="blogAuthor"
              name="blogAuthor"
              onChange={({ target }) => setAuthor(target.value) }
            />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input
              type="text"
              value={URL}
              id="blogURL"
              name="blogURL"
              onChange={({ target }) => setURL(target.value) }
            />
          </label>
        </div>
        <button type="submit" id="createButton">Create</button>
      </form>
    </>
  )
}

export default AddBlog