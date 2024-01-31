import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

const mockCreateBlog = jest.fn();
let container;

beforeAll(async () => {
  container = render(<BlogForm createBlog={mockCreateBlog} />).container;
});

test('should call createBlog with correct arguments', async () => {
  const user = userEvent.setup();

  const title = 'jest test';
  const author = 'blogform.test.js is the author';
  const url = 'www.jestjs.org';

  const inputs = screen.getAllByRole('textbox');
  await user.type(inputs[0], title);
  await user.type(inputs[1], author);
  await user.type(inputs[2], url);

  const createButton = screen.getByText('Create');
  await user.click(createButton);

  expect(mockCreateBlog.mock.calls).toHaveLength(1);
  expect(mockCreateBlog.mock.calls[0][0].title).toBe(title);
  expect(mockCreateBlog.mock.calls[0][0].author).toBe(author);
  expect(mockCreateBlog.mock.calls[0][0].url).toBe(url);
});
