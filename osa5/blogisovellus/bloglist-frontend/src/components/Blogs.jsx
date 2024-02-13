import Blog from './Blog'

const Blogs = ({
  blogs,
  user,
  updateBlogLikes,
  removeBlogFromState, 
  setNotification,
  deleteBlogFromServer 
}) => {
  return (
    <div>
      {blogs
        .sort((a,b) => b.likes - a.likes)
        .map(blog => 
          <Blog 
            key={blog.id} 
            blog={blog} 
            user={user} 
            updateBlogLikes={updateBlogLikes} 
            removeBlogFromState={removeBlogFromState} 
            setNotification={setNotification} 
            deleteBlogFromServer={deleteBlogFromServer}
          />
        )
      }
    </div>
  )
}

export default Blogs