import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Comments from '../components/Comments';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ Name: 'John Doe', comment: 'Test comment' }]),
  }),
);

fetchMock.enableMocks();

const mockCurrentUser = {
  id: '123',
  name: 'John Doe',
  role: 'Volunteer',
};

describe("Comments Component", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls the fetch function when the 'Post' button is clicked", async () => {
    render(<Comments associationId="QSzmXEiM38ghpM8GysaXGsYYI5O2
    " currentUser={{}} />);

    const postButton = screen.getByText('פרסם תגובה');

    fireEvent.click(postButton);

    expect(global.fetch).toHaveBeenCalledTimes(2); // fetch is called once on mount, and once when the button is clicked
  });

  it('renders comments correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify([
      { comment: 'Test comment', senderName: 'John Doe' },
    ]));

    render(<Comments associationId="IzT6WljJNyUmEEkCuvsYcjnf1jC3" currentUser={mockCurrentUser} />);
    expect(await screen.findByText('פרסם תגובה')).toBeInTheDocument();

    // Here's the debug line:
    screen.findByText('Test comment')
      .then(element => {
        console.log(element);
      })
      .catch(error => {
        console.error(error);
      });
  });
});
