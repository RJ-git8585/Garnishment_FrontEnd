/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'; // Ensure Jest DOM matchers are available
import Ruleslist from '../pages/Ruleslist';

// Properly mock window.matchMedia
beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
});

describe("Ruleslist Component", () => {
    beforeEach(() => {
        // Mock fetch for the initial rules list
        global.fetch = jest.fn((url) => {
            if (url.includes("/User/state-tax-levy-config-data/")) {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        data: [
                            {
                                id: 1,
                                state: "California",
                                deduction_basis: "Basis",
                                withholding_limit: 10,
                                withholding_limit_rule: "Rule",
                            },
                        ],
                    }),
                });
            }

            // Mock fetch for the single rule details
            if (url.includes("/User/state-tax-levy-config-data/California")) {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        data: {
                            id: 1,
                            state: "California",
                            deduction_basis: "Disposable Earning",
                            withholding_limit: 15,
                            withholding_limit_rule: "Updated Rule",
                        },
                    }),
                });
            }

            return Promise.reject(new Error("Unknown API endpoint"));
        });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it("should open the edit popup when handleEditClick is called", async () => {
        render(<Ruleslist />);

        // Wait for the mock data to load
        const ruleButton = await screen.findByText("California");
        expect(ruleButton).toBeInTheDocument();

        // Simulate clicking the rule button
        fireEvent.click(ruleButton);

        // Wait for the edit popup to appear
        await waitFor(() => {
            const editPopup = screen.getByRole('heading', { name: /Edit Rule/i });
            expect(editPopup).toBeInTheDocument();
        });

        // Verify that the popup contains the correct data
        const stateField = screen.getByDisplayValue("California");
        expect(stateField).toBeInTheDocument();

        const deductionBasisField = screen.getByDisplayValue("Disposable Earning");
        expect(deductionBasisField).toBeInTheDocument();

        const withholdingLimitField = screen.getByDisplayValue("15");
        expect(withholdingLimitField).toBeInTheDocument();
    });

    it("should display a loading spinner while fetching data", async () => {
        render(<Ruleslist />);

        // Check for the loading spinner
        const loadingSpinner = screen.getByRole("status");
        expect(loadingSpinner).toBeInTheDocument();

        // Wait for the data to load
        await waitFor(() => {
            expect(screen.queryByRole("status")).not.toBeInTheDocument();
        });
    });

    it("should display 'No rules found' when no data is available", async () => {
        // Mock fetch to return an empty data array
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: [] }),
            })
        );

        render(<Ruleslist />);

        // Wait for the data to load
        await waitFor(() => {
            const noRulesMessage = screen.getByText("No rules found.");
            expect(noRulesMessage).toBeInTheDocument();
        });
    });

    it("should open the state tax popup when the button is clicked", async () => {
        render(<Ruleslist />);

        // Find and click the "State Tax Rules Edit Request" button
        const stateTaxButton = screen.getByText("State Tax Rules Edit Request");
        fireEvent.click(stateTaxButton);

        // Wait for the state tax popup to appear
        await waitFor(() => {
            const stateTaxPopup = screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'h2' && content.includes("State Tax Rules Edit Request");
            });
            expect(stateTaxPopup).toBeInTheDocument();
        });
    });

    it("should paginate correctly when a page number is clicked", async () => {
        // Mock fetch to return more data for pagination
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    data: Array.from({ length: 20 }, (_, index) => ({
                        id: index + 1,
                        state: `State ${index + 1}`,
                        deduction_basis: "Basis",
                        withholding_limit: 10,
                        withholding_limit_rule: "Rule",
                    })),
                }),
            })
        );

        render(<Ruleslist />);

        // Wait for the data to load
        await waitFor(() => {
            const firstPageButton = screen.getByText("1");
            expect(firstPageButton).toBeInTheDocument();
        });

        // Click on the second page button
        const secondPageButton = screen.getByText("2");
        fireEvent.click(secondPageButton);

        // Verify that the second page data is displayed
        await waitFor(() => {
            const secondPageRule = screen.getByText("State 11");
            expect(secondPageRule).toBeInTheDocument();
        });
    });
});