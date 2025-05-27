/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom'; // Ensure Jest DOM matchers are available
// filepath: /Users/sourabhkosti/Desktop/Client-version/Garnishment_FrontEnd/src/__tests__/Ruleslist.test.jsx
import Ruleslist from '../pages/Ruleslist';

describe("Ruleslist Component", () => {
    beforeEach(() => {
        // Mock fetch to prevent actual API calls
        global.fetch = jest.fn(() =>
            Promise.resolve({
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
            })
        );
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

        // Check if the edit popup is displayed
        const editPopup = screen.getByText("Edit Rule");
        expect(editPopup).toBeInTheDocument();
    });
});