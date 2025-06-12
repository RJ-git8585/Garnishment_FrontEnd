/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RoutesPath from '../component/RoutesPath';
import { AuthProvider } from '../context/AuthContext';

// Mock components that are rendered by the routes
jest.mock('../pages/Form', () => () => <div>Login Page</div>);
jest.mock('../pages/signup', () => () => <div>Signup Page</div>);
jest.mock('../pages/forgot', () => () => <div>Forgot Password Page</div>);
jest.mock('../pages/PasswordResetConfirm', () => () => <div>Reset Password Page</div>);
jest.mock('../pages/dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../pages/Notfound', () => () => <div>404 Not Found</div>);

// Mock the context provider
const MockAuthProvider = ({ children, isAuthenticated = false }) => {
  return (
    <AuthProvider value={{ isAuthenticated }}>
      {children}
    </AuthProvider>
  );
};

describe('RoutesPath Component', () => {
  // Test public routes
  describe('Public Routes', () => {
    it('should render login page for root route', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockAuthProvider isAuthenticated={false}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should render signup page for /signup route', () => {
      render(
        <MemoryRouter initialEntries={['/signup']}>
          <MockAuthProvider isAuthenticated={false}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Signup Page')).toBeInTheDocument();
    });

    it('should render forgot password page for /forgot route', () => {
      render(
        <MemoryRouter initialEntries={['/forgot']}>
          <MockAuthProvider isAuthenticated={false}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Forgot Password Page')).toBeInTheDocument();
    });

    it('should render reset password page for /reset-password/:token route', () => {
      render(
        <MemoryRouter initialEntries={['/reset-password/test-token']}>
          <MockAuthProvider isAuthenticated={false}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Reset Password Page')).toBeInTheDocument();
    });
  });

  // Test private routes
  describe('Private Routes', () => {
    // Helper function to render a private route
    const renderPrivateRoute = (path) => {
      return render(
        <MemoryRouter initialEntries={[path]}>
          <MockAuthProvider isAuthenticated={true}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
    };

    it('should render dashboard for /dashboard route when authenticated', () => {
      renderPrivateRoute('/dashboard');
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    it('should render 404 page for unknown routes', () => {
      render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <MockAuthProvider isAuthenticated={false}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    });
  });

  // Test route protection
  describe('Route Protection', () => {
    it('should redirect to login when accessing private route while not authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <MockAuthProvider isAuthenticated={false}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
      // Should be redirected to login page
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should redirect to dashboard when accessing login while authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockAuthProvider isAuthenticated={true}>
            <RoutesPath />
          </MockAuthProvider>
        </MemoryRouter>
      );
      // Should be redirected to dashboard when authenticated
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  // Test route configuration
  describe('Route Configuration', () => {
    it('should have all the defined public routes', () => {
      const publicRoutes = [
        { path: '/', element: 'Login Page' },
        { path: '/signup', element: 'Signup Page' },
        { path: '/forgot', element: 'Forgot Password Page' },
        { path: '/reset-password/test-token', element: 'Reset Password Page' },
      ];

      publicRoutes.forEach(({ path, element }) => {
        render(
          <MemoryRouter initialEntries={[path]}>
            <MockAuthProvider isAuthenticated={false}>
              <RoutesPath />
            </MockAuthProvider>
          </MemoryRouter>
        );
        expect(screen.getByText(element)).toBeInTheDocument();
      });
    });
  });
});
