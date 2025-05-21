import { describe, it, beforeEach, expect, vi } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from '../src/pages/dashboard';
import { API_URLS } from '../src/configration/apis';

// Mock fetch
globalThis.fetch = vi.fn();

describe('Dashboard Component', () => {
    let container;

    beforeEach(() => {
        fetch.mockClear();
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('renders the ProfileHeader component', () => {
        const root = createRoot(container);
        root.render(<Dashboard />);
        expect(container.innerHTML).toContain('ProfileHeader');
    });

    it('displays loading spinner while fetching data', () => {
        const root = createRoot(container);
        root.render(<Dashboard />);
        expect(container.querySelector('img[alt="Loading..."]')).not.toBeNull();
    });

    it('fetches and displays dashboard data', async () => {
        const mockDashboardData = {
            data: {
                Total_IWO: 100,
                Employees_with_Single_IWO: 50,
                Employees_with_Multiple_IWO: 30,
                Active_employees: 20,
            },
        };
        const mockActivityLogs = {
            data: [
                { id: 1, details: 'Log 1' },
                { id: 2, details: 'Log 2' },
            ],
        };

        fetch.mockImplementation((url) => {
            if (url === API_URLS.DASHBOARD_USERS_DATA) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockDashboardData),
                });
            }
            if (url === API_URLS.DASHBOARD_LOGDATA) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockActivityLogs),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        const root = createRoot(container);
        root.render(<Dashboard />);

        // Wait for the data to load
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(container.innerHTML).toContain('Total IWO');
        expect(container.innerHTML).toContain('100');
        expect(container.innerHTML).toContain('Log 1');
        expect(container.innerHTML).toContain('Log 2');
    });

    it('displays "No data available" when no activity logs are present', async () => {
        const mockDashboardData = {
            data: {
                Total_IWO: 100,
                Employees_with_Single_IWO: 50,
                Employees_with_Multiple_IWO: 30,
                Active_employees: 20,
            },
        };
        const mockActivityLogs = { data: [] };

        fetch.mockImplementation((url) => {
            if (url === API_URLS.DASHBOARD_USERS_DATA) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockDashboardData),
                });
            }
            if (url === API_URLS.DASHBOARD_LOGDATA) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockActivityLogs),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        const root = createRoot(container);
        root.render(<Dashboard />);

        // Wait for the data to load
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(container.innerHTML).toContain('No data available');
    });

    it('handles fetch errors gracefully', async () => {
        fetch.mockRejectedValue(new Error('Failed to fetch'));

        const root = createRoot(container);
        root.render(<Dashboard />);

        // Wait for the error to propagate
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(container.innerHTML).toContain('No data available');
    });
});
