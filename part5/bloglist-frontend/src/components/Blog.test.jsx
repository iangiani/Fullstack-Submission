import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog',
    author: 'YYTM',
    url: 'http://test.com',
    likes: 21,
    user: {
      username: 'tester',
      name: 'Test User'
    }
  }

  test('renders title and author, but does not render its URL or number by default', () => {
    render(<Blog blog={blog} onLike={() => {}} onRemove={() => {}} currentUser={{ username: 'tester' }} />)

    const summary = screen.getByText('Test Blog YYTM')
    expect(summary).toBeInTheDocument()

    const urlElement = screen.queryByText('http://test.com')
    const likesElement = screen.queryByText(/likes 21/)

    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()
  })

  test('URL and number are shown when the button has been clicked', async () => {
    render(<Blog blog={blog} onLike={() => {}} onRemove={() => {}} currentUser={{ username: 'tester' }} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('http://test.com')
    const likesElement = screen.getByText(/likes 21/)

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const blog = {
      title: 'Test Blog',
      author: 'YYTM',
      url: 'http://test.com',
      likes: 21,
      user: {
        name: 'Test User',
        username: 'tester'
      }
    }
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        onLike={mockHandler}
        onRemove={() => {}}
        currentUser={{ username: 'tester' }}
      />
    )

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
