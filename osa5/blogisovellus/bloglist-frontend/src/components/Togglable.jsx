import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

/**
 * forwardRef is a function in React that allows you to pass a ref
 * through a component to one of its children (from App to Togglable).
 * The ref prop is special in React and it's not included in the
 * props object passed to a component.
 * You need to use forwardRef if you want to pass ref to a child component
 * or DOM element
 */
const Togglable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenAddBlogVisible = { display: visible ? 'none' : '' }
  const showWhenAddBlogVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  /**
   * useImperativeHandle is a hook in React that lets you customize the instance value
   * that is exposed to parent components when using ref.
   * In other words, you can expose specific properties and methods to a parent component.
   * Imagine you have a box (the Togglable component) that can be open or closed, and inside
   * that box, you have a toy (the AddBlog component). Normally, you can't directly interact
   * with the toy without opening the box. But what if you want to be able to move the toy to
   * a specific position without opening the box?
   *
   * This means that when a parent component gets a ref to the Togglable component,
   * it can only use ref.current.toggleVisibility() to toggle the visibility of the
   * component, and it can't access any other properties or methods of the component.
   */
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <>
      <div style={hideWhenAddBlogVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenAddBlogVisible}>
        {children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

// koska eslint kiukuttelee, että ei ole displayName, niin lisätään se
// johtuu siitä, että forwardRef ei ole React-komponentti
// Display name is a string used in debugging messages.
Togglable.displayName = 'Togglable'

export default Togglable

/**
 * Normally, a ref cannot be passed through a component to its children.
 * The ref prop is special in React and it's not included in the props
 * object passed to a component. This is because a ref is used for direct
 * interactions with a component or DOM element, which is generally discouraged
 * in React in favor of using props and state.

However, there are cases where you might need to directly interact with a
child component or DOM element. For example, you might need to manage focus,
trigger animations, or access third-party DOM libraries. In these cases,
you can use forwardRef to pass a ref to the child component or DOM element.
 */