/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Ruleslist from '../pages/Ruleslist';

// Mock data
const singleRule = {
  id: 1,
  state: "California",
  deduction_basis: "Basis",
  withholding_limit: 10,
  withholding_limit_rule: "Rule",
};

const ruleDetails = {
  id: 1,
  state: "California",
  deduction_basis: "Disposable Earning",
  withholding_limit: 15,
  withholding_limit_rule: "Updated Rule",
};

const paginationData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  state: `State ${index + 1}`,
  deduction_basis: "Basis",
  withholding_limit: 10,
  withholding_limit_rule: "Rule",
}));

// Mock window.matchMedia
beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe("Ruleslist Component", () => {
  beforeEach(() => {
    // Setup default mock for fetch
    global.fetch = jest.fn((url) => {
      if (url.includes("/User/state-tax-levy-config-data/California")) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: ruleDetails }),
        });
      }
      if (url.includes("/User/state-tax-levy-config-data/")) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: [singleRule] }),
        });
      }
      return Promise.reject(new Error("Unknown API endpoint"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display a loading spinner while fetching data", async () => {
    render(<Ruleslist />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("should open the edit popup when handleEditClick is called", async () => {
    render(<Ruleslist />);
    
    const ruleButton = await screen.findByText("California");
    fireEvent.click(ruleButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Edit Rule/i })).toBeInTheDocument();
      expect(screen.getByDisplayValue("California")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Disposable Earning")).toBeInTheDocument();
      expect(screen.getByDisplayValue("15")).toBeInTheDocument();
    });
  });

  it("should display 'No rules found' when no data is available", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: [] }),
      })
    );

    render(<Ruleslist />);
    
    await waitFor(() => {
      expect(screen.getByText("No rules found.")).toBeInTheDocument();
    });
  });

  it("should open the state tax popup when the button is clicked", async () => {
    render(<Ruleslist />);
    
    fireEvent.click(screen.getByText("State Tax Rules Edit Request"));
    
    await waitFor(() => {
      const popup = screen.getByText((content, element) => 
        element.tagName.toLowerCase() === 'h2' && 
        content.includes("State Tax Rules Edit Request")
      );
      expect(popup).toBeInTheDocument();
    });
  });

  it("should paginate correctly when a page number is clicked", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: paginationData }),
      })
    );

    render(<Ruleslist />);
    
    await waitFor(() => expect(screen.getByText("1")).toBeInTheDocument());
    
    fireEvent.click(screen.getByText("2"));
    
    await waitFor(() => {
      expect(screen.getByText("State 11")).toBeInTheDocument();
    });
  });
});