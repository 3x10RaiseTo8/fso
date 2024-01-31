import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const testUser = { username: 'jesttestuser' };
const testBlog = {
  title: 'title of jest test',
  author: 'blog.test.js file',
  url: 'localhost i guess',
  id: 77777,
  likes: 42,
  user: { testUser },
};

const mockAddLike = jest.fn();
const mockRemoveBlog = jest.fn();
const mockLoggedUser = { testUser };

let container;

beforeEach(() => {
  container = render(
    <Blog
      blog={testBlog}
      addLike={mockAddLike}
      removeBlog={mockRemoveBlog}
      loggedUser={mockLoggedUser}
    />
  ).container;
});

test('should show title and author only', () => {
  expect(container.querySelector('.visibleContent')).toBeDefined();
  expect(container.querySelector('.hiddenContent')).toBeNull();
});

test('should show hidden content when show is clicked', async () => {
  expect(container.querySelector('.hiddenContent')).toBeNull();
  const user = userEvent.setup();
  const button = screen.getByText('Show');
  await user.click(button);
  expect(container.querySelector('.hiddenContent')).toBeDefined();
});

test('should update likes when clicked', async () => {
  const user = userEvent.setup();

  const showButton = screen.getByText('Show');
  await user.click(showButton);

  const likeButton = screen.getByText('Like');
  await user.click(likeButton);
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockAddLike.mock.calls).toHaveLength(3);
});
