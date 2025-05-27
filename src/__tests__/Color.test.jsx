/**
 * @jest-environment jsdom
 */
// Import React to ensure it is defined
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// filepath: /Users/sourabhkosti/Desktop/Client-version/Garnishment_FrontEnd/src/__tests__/Color.test.jsx
import ConditionalText from '../component/Color';

// Add this import to ensure Jest globals are available
import '@testing-library/jest-dom';

// Ensure Jest globals are available
import '@jest/globals';

describe('ConditionalText Component', () => {
    test('renders the checkbox and label', () => {
        render(<ConditionalText />);
        const checkbox = screen.getByRole('checkbox', { name: /show text/i });
        const label = screen.getByLabelText(/show text/i);

        expect(checkbox).toBeInTheDocument();
        expect(label).toBeInTheDocument();
    });

    test('does not display the text initially', () => {
        render(<ConditionalText />);
        const text = screen.queryByText(/this is the text that will be shown when the checkbox is checked/i);

        expect(text).not.toBeInTheDocument();
    });

    test('displays the text when the checkbox is checked', () => {
        render(<ConditionalText />);
        const checkbox = screen.getByRole('checkbox', { name: /show text/i });

        fireEvent.click(checkbox);

        const text = screen.getByText(/this is the text that will be shown when the checkbox is checked/i);
        expect(text).toBeInTheDocument();
    });

    test('hides the text when the checkbox is unchecked', () => {
        render(<ConditionalText />);
        const checkbox = screen.getByRole('checkbox', { name: /show text/i });

        fireEvent.click(checkbox); // Check the checkbox
        fireEvent.click(checkbox); // Uncheck the checkbox

        const text = screen.queryByText(/this is the text that will be shown when the checkbox is checked/i);
        expect(text).not.toBeInTheDocument();
    });
});