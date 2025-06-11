import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreditorRule from "../pages/CreditorRule";
import Swal from "sweetalert2";

// Mocking fetch API and Swal
// We mock sweetalert2 to prevent actual popups during tests and to assert that it's called correctly.
jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

describe("CreditorRule Component", () => {
    // Before each test, reset the fetch mock to ensure tests are isolated.
    // mockReset clears all mock history and resets any custom implementation.
    beforeEach(() => {
        global.fetch.mockReset();
        Swal.fire.mockClear();
    });

    // Mock the global fetch function before all tests
    beforeAll(() => {
        global.fetch = jest.fn();
    });

    it("renders the component and displays loading spinner initially", () => {
        // Mock the fetch call with a promise that never resolves.
        // This ensures the component remains in the loading state for the duration of the test,
        // preventing a race condition where the fetch completes before the assertion is checked.
        fetch.mockImplementation(() => new Promise(() => {}));
        render(<CreditorRule />);
        expect(screen.getByText("Creditor Debt Rules")).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("fetches and displays creditor rules data", async () => {
        // Mock a successful API response with sample data.
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [
                    { state: "california", deduction_basis: "basis1", withholding_limit: "10", rule: "rule1" },
                    { state: "new york", deduction_basis: "basis2", withholding_limit: "20", rule: "rule2" },
                ],
            }),
        });

        render(<CreditorRule />);

        // Wait for the data to be rendered in the document.
        // findBy* queries are useful for waiting for elements to appear asynchronously.
        expect(await screen.findByText("california")).toBeInTheDocument();
        expect(await screen.findByText("new york")).toBeInTheDocument();
        // Ensure the loading spinner is gone.
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("handles API fetch failure gracefully", async () => {
        // Mock a failed API response.
        fetch.mockResolvedValueOnce({
            ok: false,
            statusText: "Internal Server Error",
        });

        render(<CreditorRule />);

        // The component's error handling calls Swal.fire. We wait for this call to happen
        // and assert that it was called with the expected error message.
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch creditor debt rules'
            });
        });
    });

    it("opens the Rule Change Request popup when button is clicked", async () => {
        // Mock a successful API response for the initial data fetch.
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [] }),
        });

        render(<CreditorRule />);

        // Wait for the initial loading to complete and the "Rule Change Request" button to appear.
        const button = await screen.findByText("Rule Change Request");
        fireEvent.click(button);

        // After clicking the button, wait for the popup dialog to appear and check for its title.
        // The title "Creditor Rule Edit Request" is defined in the CreditorRulePopup component.
        expect(await screen.findByText("Creditor Rule Edit Request")).toBeInTheDocument();
    });

    it("paginates the data correctly", async () => {
        // Create a mock dataset larger than one page.
        const mockData = Array.from({ length: 15 }, (_, i) => ({
            state: `state${i + 1}`,
            deduction_basis: `basis${i + 1}`,
            withholding_limit: `${i + 1}`,
            rule: `rule${i + 1}`,
        }));

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: mockData }),
        });

        render(<CreditorRule />);

        // Wait for the first page of data to render.
        expect(await screen.findByText("state1")).toBeInTheDocument();
        expect(await screen.findByText("state10")).toBeInTheDocument();
        // Ensure data from the second page is not yet visible.
        await waitFor(() => {
            expect(screen.queryByText("state11")).not.toBeInTheDocument();
        });

        // Find and click the "next page" button.
        const nextPageButton = screen.getByTestId("page-button-2");
        fireEvent.click(nextPageButton);

        // Wait for the second page of data to render and first page data to disappear.
        await waitFor(() => {
            expect(screen.getByText("state11")).toBeInTheDocument();
            expect(screen.queryByText("state1")).not.toBeInTheDocument();
        });
    });

    it("formats withholding cap values correctly", async () => {
        // Mock data with different withholding_limit values to test formatting.
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [
                    { state: "california", deduction_basis: "basis1", withholding_limit: "10", rule: "rule1" },
                    { state: "new york", deduction_basis: "basis2", withholding_limit: null, rule: "rule2" },
                ],
            }),
        });

        render(<CreditorRule />);

        // Wait for the formatted values to appear.
        // The component should add a '%' to numeric values and display 'N/A' for null values.
        expect(await screen.findByText("10%")).toBeInTheDocument();
        expect(await screen.findByText("N/A")).toBeInTheDocument();
    });
});