/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Employee from '../pages/employee';

// Mock the axios library
jest.mock('axios');

const mockEmployeeData = {
  data: {
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
  },
};

const mockEmptyData = {
  data: {
    data: [],
  },
};

describe('Employee Component', () => {
  beforeEach(() => {
    axios.get.mockClear(); // Clear mocks before each test
  });

  test('renders the Employee table header', async () => {
    axios.get.mockResolvedValueOnce(mockEmployeeData);
    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Employee ID')).toBeInTheDocument();
      expect(screen.getByText('SSN')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
    });
  });

  test('displays loading spinner while fetching data', async () => {
    axios.get.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(mockEmptyData);
          }, 100);
        }),
    );

    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  test('renders employee data after fetching', async () => {
    axios.get.mockResolvedValueOnce(mockEmployeeData);
    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
      expect(screen.getByText('123-45-6789')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
    });
  });

  test('renders "No data available" when no employees are fetched', async () => {
    axios.get.mockResolvedValueOnce(mockEmptyData);

    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No data available.')).toBeInTheDocument();
    });
  });

  test('navigates to edit employee page when clicking on an employee ID', async () => {
    axios.get.mockResolvedValueOnce(mockEmployeeData);
    render(
      <MemoryRouter initialEntries={['/employee']}>
        <Employee />
      </MemoryRouter>
    );

    await waitFor(() => {
      const employeeLink = screen.getByRole('link', { name: 'EMP001' });
      expect(employeeLink).toBeInTheDocument();
      fireEvent.click(employeeLink);
      expect(employeeLink.getAttribute('href')).toBe('/employee/edit/CASE001/EMP001');
    });
  });

  test('handles pagination correctly', async () => {
    const multipleEmployees = {
      data: {
        data: Array.from({ length: 15 }, (_, i) => ({
          ee_id: `EMP${i + 1}`,
          social_security_number: `123-45-67${89 + i}`,
          age: 30 + i,
          gender: 'Male',
          home_state: 'California',
          work_state: 'Nevada',
          pay_period: 'Bi-Weekly',
          case_id: `CASE${i + 1}`,
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
        })),
      },
    };
    axios.get.mockResolvedValueOnce(multipleEmployees);
    render(
      <MemoryRouter>
        <Employee />
      </MemoryRouter>
    );

    await waitFor(() => {
      const page2Button = screen.getByRole('button', { name: '2' });
      expect(page2Button).toBeInTheDocument();
      fireEvent.click(page2Button);
      expect(screen.getByText('EMP11')).toBeInTheDocument();
      expect(screen.queryByText('EMP001')).not.toBeInTheDocument();
    });
  });
});
