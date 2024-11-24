import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../admin/Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fetch
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              volunteers: [],
              associations: [],
              events: [],
              adminMessages: [],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              volunteers: [],
              associations: [],
            }),
        })
      );
  });

  test('renders Dashboard correctly', async () => {
    render(<Dashboard />);

    const heading = screen.getByText('דף ניהול האתר');
    expect(heading).toBeInTheDocument();

    // Test menu items
    const menuItemHome = screen.getByText('ראשי');
    expect(menuItemHome).toBeInTheDocument();

    // Clicking the menu item updates the selectedType state
    fireEvent.click(menuItemHome);

    // Assert that the data fetching function is called
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // Wait for the fetch to complete before asserting on the elements
    await waitFor(() => {
      // Check if the recent users and associations tables are visible
      const recentVolunteersHeading = screen.getByText('מתנדבים שנרשמו לאחרונה');
      expect(recentVolunteersHeading).toBeInTheDocument();

      const recentAssociationsHeading = screen.getByText('עמותות שנרשמו לאחרונה');
      expect(recentAssociationsHeading).toBeInTheDocument();
    });
  });
});
