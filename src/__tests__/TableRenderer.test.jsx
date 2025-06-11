import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// The component module will be imported dynamically within `beforeEach`
let renderTable;

// Mock dependencies at the top level
jest.mock('../utils/dataFormatter', () => ({
  formatGarnishmentData: jest.fn(data => (data && data.results ? data.results : [])),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn((options) => {
    if (options.didOpen) {
      const swalContainer = document.createElement('div');
      swalContainer.id = 'swal-rule-container';
      document.body.appendChild(swalContainer);
      options.didOpen();
    }
    return Promise.resolve({ isConfirmed: true });
  }),
}));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(() => 'worksheet'),
    book_new: jest.fn(() => ({ Sheets: {}, SheetNames: [] })),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(() => 'excel-buffer'),
}));

// Mock child components that are rendered inside Swal
jest.mock('../pages/Rules', () => () => <div data-testid="rules-component">Rules Component</div>);
jest.mock('../pages/StatetaxLevyRules', () => () => <div data-testid="statetaxlevyrules-component">State Tax Levy Rules Component</div>);
jest.mock('../pages/CreditorTaxRule', () => () => <div data-testid="creditortaxrule-component">Creditor Tax Rule Component</div>);

describe('TableRenderer', () => {
  beforeEach(() => {
    // Reset modules before each test to clear module-level state like `swalRoot`.
    jest.resetModules();
    // Re-require the module to get a fresh instance with reset state
    renderTable = require('../component/TableRenderer').renderTable;
  });

  afterEach(() => {
    cleanup();
    const swalContainer = document.getElementById('swal-rule-container');
    if (swalContainer) {
      swalContainer.remove();
    }
    jest.clearAllMocks();
  });

  describe('Error Handling and Edge Cases', () => {
    it('should display a message when no data is provided', () => {
      render(renderTable(null));
      expect(screen.getByText('No valid results found.')).toBeInTheDocument();
    });

    it('should display a message for empty results array', () => {
      render(renderTable({ results: [] }));
      expect(screen.getByText('No valid results found.')).toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    const mockData = {
      results: [
        {
          ee_id: 'EMP001',
          work_state: 'CA',
          pay_period: 'Weekly',
          garnishment_data: [{ type: 'Child Support', data: [{ case_id: 'CASE001' }] }],
          agency: [{ withholding_amt: [{ garnishment_amount: 100 }], arrear: [{ withholding_arrear: 20 }] }],
          disposable_earning: 1000,
          withholding_limit_rule: 'Rule1',
          support_second_family: 'Yes',
          arrears_greater_than_12_weeks: 'No',
        },
      ],
    };

    it('should render table headers and rows correctly', () => {
      render(renderTable(mockData));
      expect(screen.getByText('Employee ID')).toBeInTheDocument();
      expect(screen.getByText('CASE001')).toBeInTheDocument();
      expect(screen.getByText('Child Support')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    const mockData = {
      results: [
        {
          ee_id: 'EMP001',
          work_state: 'CA',
          pay_period: 'Weekly',
          garnishment_data: [{ type: 'Child Support', data: [{ case_id: 'CASE001' }] }],
          agency: [{ withholding_amt: [{ garnishment_amount: 100 }], arrear: [{ withholding_arrear: 20 }] }],
          disposable_earning: 1000,
          withholding_limit_rule: 'Rule1',
          support_second_family: 'Yes',
          arrears_greater_than_12_weeks: 'No',
        },
        {
          ee_id: 'EMP002',
          work_state: 'NY',
          pay_period: 'Bi-Weekly',
          garnishment_data: [{ type: 'State tax levy', data: [{ case_id: 'CASE002' }] }],
          agency: [{ withholding_amt: [{ garnishment_amount: 150 }], arrear: [{ withholding_arrear: 30 }] }],
          disposable_earning: 2000,
          withholding_limit_rule: 'StateRule',
        },
        {
          ee_id: 'EMP003',
          work_state: 'TX',
          pay_period: 'Weekly',
          garnishment_data: [{ type: 'Creditor debt', data: [{ case_id: 'CASE003' }] }],
          agency: [{ withholding_amt: [{ garnishment_amount: 200 }], arrear: [{ withholding_arrear: 40 }] }],
          disposable_earning: 1500,
          withholding_limit_rule: 'CreditorRule',
        },
      ],
    };

    beforeEach(() => {
      render(renderTable(mockData));
    });

    it('should render Rules component in a modal for Child Support rule', async () => {
      fireEvent.click(screen.getByText('Rule1'));
      expect(require('sweetalert2').fire).toHaveBeenCalledTimes(1);
      expect(await screen.findByTestId('rules-component')).toBeInTheDocument();
    });

    it('should render StateTaxLevyRules component in a modal for State tax levy rule', async () => {
      fireEvent.click(screen.getByText('StateRule'));
      expect(require('sweetalert2').fire).toHaveBeenCalledTimes(1);
      expect(await screen.findByTestId('statetaxlevyrules-component')).toBeInTheDocument();
    });

    it('should render CreditorTaxRule component in a modal for Creditor debt rule', async () => {
      fireEvent.click(screen.getByText('CreditorRule'));
      expect(require('sweetalert2').fire).toHaveBeenCalledTimes(1);
      expect(await screen.findByTestId('creditortaxrule-component')).toBeInTheDocument();
    });

    it('should call saveAs when export button is clicked', () => {
      fireEvent.click(screen.getByTitle('EXPORT EXCEL'));
      expect(require('xlsx').utils.json_to_sheet).toHaveBeenCalled();
      expect(require('file-saver').saveAs).toHaveBeenCalledTimes(1);
      expect(require('file-saver').saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Garnishment_data.xlsx');
    });
  });
});