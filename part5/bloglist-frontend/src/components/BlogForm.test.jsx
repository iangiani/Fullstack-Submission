import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('the form calls the event handler it received as props when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Test BlogForm')
  await user.type(authorInput, 'YY2199')
  await user.type(urlInput, 'http://test.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  const callArg = createBlog.mock.calls[0][0]
  expect(callArg.title).toBe('Test BlogForm')
  expect(callArg.author).toBe('YY2199')
  expect(callArg.url).toBe('http://test.com')
})
