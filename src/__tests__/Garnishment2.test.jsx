import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Garnishment2 from '../pages/Garnishment2';
import { StateList, StateCreditorList, StateLevyContactList } from '../constants/Constant';

// Mock axios
jest.mock('axios');

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaBalanceScaleRight: () => <div>BalanceScaleIcon</div>,
}));

describe('Garnishment2 Component', () => {
  const mockApiResponse = {
    results: [
      {
        disposable_earning: '1000.00',
        allowable_disposable_earning: '850.00',
        total_mandatory_deduction: '150.00',
        agency: [
          { 
            withholding_amt: [
              { child_support: '200.00' }
            ]
          },
          {
            arrear: [
              { withholding_arrear: '50.00' }
            ]
          }
        ],
        er_deduction: {
          garnishment_fees: '10.00'
        }
      }
    ]
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock axios.post to resolve with success
    axios.post.mockResolvedValueOnce({ data: mockApiResponse });
  });

  test('renders Garnishment2 component without crashing', () => {
    render(<Garnishment2 />);
    expect(screen.getByText(/Garnishment Calculator/)).toBeInTheDocument();
  });

  test('displays required fields with asterisks', () => {
    render(<Garnishment2 />);
    
    const requiredFields = [
      'Garnishment Type',
      'Work State',
      'Pay Period',
      'Gross Pay',
      'Total Mandatory Deduction'
    ];

    requiredFields.forEach(field => {
      const element = screen.getByText(new RegExp(`^${field} \\* :$`));
      expect(element).toBeInTheDocument();
    });
  });

  test('changes garnishment type and updates state options', async () => {
    render(<Garnishment2 />);
    
    // Select Child Support
    const garnishmentTypeSelect = screen.getByLabelText(/Garnishment Type \*/);
    fireEvent.change(garnishmentTypeSelect, { target: { value: 'Child Support' } });
    
    // Check if work state options are updated
    const workStateSelect = screen.getByLabelText(/Work State \*/);
    expect(workStateSelect).toBeInTheDocument();
    
    // Verify state options for Child Support
    StateList.forEach(state => {
      expect(screen.getByText(state.label)).toBeInTheDocument();
    });
    
    // Change to Creditor Debt
    fireEvent.change(garnishmentTypeSelect, { target: { value: 'Creditor Debt' } });
    
    // Verify state options for Creditor Debt
    StateCreditorList.forEach(state => {
      expect(screen.getByText(state.label)).toBeInTheDocument();
    });
  });

  test('shows additional fields for Creditor Debt', () => {
    render(<Garnishment2 />);
    
    // Select Creditor Debt
    const garnishmentTypeSelect = screen.getByLabelText(/Garnishment Type \*/);
    fireEvent.change(garnishmentTypeSelect, { target: { value: 'Creditor Debt' } });
    
    // Check for additional fields
    expect(screen.getByLabelText(/Filing Status/)).toBeInTheDocument();
    expect(screen.getByLabelText(/No. of Dependent Child/)).toBeInTheDocument();
    expect(screen.getByLabelText(/No. of Exemptions \*/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Support Second Family \*/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Arrears Greater Than 12 Weeks \*/)).not.toBeInTheDocument();
  });

  test('shows additional fields for Child Support', () => {
    render(<Garnishment2 />);
    
    // Select Child Support
    const garnishmentTypeSelect = screen.getByLabelText(/Garnishment Type \*/);
    fireEvent.change(garnishmentTypeSelect, { target: { value: 'Child Support' } });
    
    // Check for additional fields
    expect(screen.getByLabelText(/Support Second Family \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Arrears Greater Than 12 Weeks \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ordered Amount/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Arrear Amount/)).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    render(<Garnishment2 />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Garnishment Type \*/), { target: { value: 'Child Support' } });
    fireEvent.change(screen.getByLabelText(/Work State \*/), { target: { value: 'California' } });
    fireEvent.change(screen.getByLabelText(/Pay Period \*/), { target: { value: 'biweekly' } });
    fireEvent.change(screen.getByLabelText(/Gross Pay \*/), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Total Mandatory Deduction \*/), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Support Second Family \*/), { target: { value: 'Yes' } });
    fireEvent.change(screen.getByLabelText(/Arrears Greater Than 12 Weeks \*/), { target: { value: 'No' } });
    fireEvent.change(screen.getByLabelText(/Ordered Amount/), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Arrear Amount/), { target: { value: '100' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Calculate'));
    
    // Verify API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/User/garnishment_calculate/'),
        expect.objectContaining({
          batch_id: expect.any(String),
          cases: expect.arrayContaining([
            expect.objectContaining({
              garnishment_data: expect.arrayContaining([
                expect.objectContaining({
                  type: 'Child Support',
                  data: expect.arrayContaining([
                    expect.objectContaining({
                      ordered_amount: 500,
                      arrear_amount: 100
                    })
                  ])
                })
              ])
            })
          ])
        }),
        expect.any(Object)
      );
    });
  });

  test('displays calculation results after successful submission', async () => {
    render(<Garnishment2 />);
    
    // Mock the API response
    axios.post.mockResolvedValueOnce({ data: mockApiResponse });
    
    // Submit the form with minimal required fields
    fireEvent.change(screen.getByLabelText(/Garnishment Type \*/), { target: { value: 'Child Support' } });
    fireEvent.change(screen.getByLabelText(/Work State \*/), { target: { value: 'California' } });
    fireEvent.change(screen.getByLabelText(/Pay Period \*/), { target: { value: 'biweekly' } });
    fireEvent.change(screen.getByLabelText(/Gross Pay \*/), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Total Mandatory Deduction \*/), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Support Second Family \*/), { target: { value: 'Yes' } });
    fireEvent.change(screen.getByLabelText(/Arrears Greater Than 12 Weeks \*/), { target: { value: 'No' } });
    fireEvent.change(screen.getByLabelText(/Ordered Amount/), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Arrear Amount/), { target: { value: '100' } });
    
    fireEvent.click(screen.getByText('Calculate'));
    
    // Check if results are displayed
    await waitFor(() => {
      expect(screen.getByText('Calculation Result:')).toBeInTheDocument();
      expect(screen.getByText('1000.00')).toBeInTheDocument();
      expect(screen.getByText('850.00')).toBeInTheDocument();
      expect(screen.getByText('150.00')).toBeInTheDocument();
      expect(screen.getByText('200.00')).toBeInTheDocument();
      expect(screen.getByText('50.00')).toBeInTheDocument();
      expect(screen.getByText('10.00')).toBeInTheDocument();
    });
  });

  test('resets the form when reset button is clicked', () => {
    render(<Garnishment2 />);
    
    // Fill in some fields
    fireEvent.change(screen.getByLabelText(/Garnishment Type \*/), { target: { value: 'Child Support' } });
    fireEvent.change(screen.getByLabelText(/Gross Pay \*/), { target: { value: '2000' } });
    
    // Click reset button
    fireEvent.click(screen.getByText('Reset'));
    
    // Check if fields are reset
    expect(screen.getByLabelText(/Garnishment Type \*/).value).toBe('');
    expect(screen.getByLabelText(/Gross Pay \*/).value).toBe('');
  });

  test('shows loading state during form submission', async () => {
    // Mock a delayed API response
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    axios.post.mockReturnValueOnce(promise);
    
    render(<Garnishment2 />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Garnishment Type \*/), { target: { value: 'Child Support' } });
    fireEvent.change(screen.getByLabelText(/Work State \*/), { target: { value: 'California' } });
    fireEvent.change(screen.getByLabelText(/Pay Period \*/), { target: { value: 'biweekly' } });
    fireEvent.change(screen.getByLabelText(/Gross Pay \*/), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Total Mandatory Deduction \*/), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Support Second Family \*/), { target: { value: 'Yes' } });
    fireEvent.change(screen.getByLabelText(/Arrears Greater Than 12 Weeks \*/), { target: { value: 'No' } });
    fireEvent.change(screen.getByLabelText(/Ordered Amount/), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Arrear Amount/), { target: { value: '100' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Calculate'));
    
    // Check if loading state is shown
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
    
    // Resolve the promise
    resolvePromise({ data: mockApiResponse });
    
    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Calculating...')).not.toBeInTheDocument();
    });
  });
});
