/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For Jest DOM matchers
import { MemoryRouter } from 'react-router-dom'; // Wrap component with MemoryRouter for Link support
import Employee from '../pages/employee';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        data: [
          {
            ee_id: 'EMP001',
            social_security_number: '123-45-6789',
            age: 30,
            gender: 'Male',
            home_state: 'California',
            work_state: 'Nevada',
            pay_period: 'Bi-Weekly',
            case_id: 'CASE001',
            is_blind: false,
            marital_status: 'Single',
            filing_status: 'Head of Household',
            spouse_age: null,
            is_spouse_blind: false,
            number_of_exemptions: 2,
            support_second_family: false,
            number_of_student_default_loan: 1,
            garnishment_fees_status: true,
            garnishment_fees_suspended_till: null,
          },
        ],
      }),
  })
);

describe('Employee Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('renders the Employee table header', async () => {
    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('Employee ID')).toBeInTheDocument();
      expect(screen.getByText('SSN')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
    });
  });

  test('displays loading spinner while fetching data', async () => {
    // Mock fetch to delay the resolution of the promise
    global.fetch.mockImplementationOnce(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            json: () =>
              Promise.resolve({
                data: [],
              }),
          });
        }, 100); // Delay the resolution by 100ms
      })
    );

    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    // Use getByTestId to locate the spinner
    const spinner = await screen.findByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();

    // Wait for the data to load and ensure the spinner is removed
    expect(await screen.findByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  test('renders employee data after fetching', async () => {
    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
      expect(screen.getByText('123-45-6789')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
    });
  });

  test('renders "No data available" when no employees are fetched', async () => {
    // Mock fetch to return no data
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: [] }),
      })
    );

    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('No data available.')).toBeInTheDocument();
    });
  });

  test('navigates to edit employee page when clicking on an employee ID', async () => {
    render(
      <MemoryRouter initialEntries={['/employee']}>
        <Employee />
      </MemoryRouter>
    );

    // Wait for the data to load
    await waitFor(() => {
      const employeeLink = screen.getByRole('link', { name: 'EMP001' });
      expect(employeeLink).toBeInTheDocument();

      // Simulate clicking the link
      fireEvent.click(employeeLink);

      // Verify navigation
      expect(employeeLink.getAttribute('href')).toBe('/employee/edit/CASE001/EMP001');
    });
  });

  test('handles pagination correctly', async () => {
    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    // Wait for the data to load
    await waitFor(() => {
      // Use getByRole to locate the pagination button with the role "button"
      const paginationButtons = screen.getAllByRole('button', { name: '1' });
      expect(paginationButtons.length).toBeGreaterThan(0);

      // Select the correct pagination button (e.g., the first one)
      const paginationButton = paginationButtons[0];
      expect(paginationButton).toBeInTheDocument();

      // Simulate clicking the pagination button
      fireEvent.click(paginationButton);

      // Verify the button has the active class
      expect(paginationButton).toHaveClass('bg-gray-500 text-white');
    });
  });
});
