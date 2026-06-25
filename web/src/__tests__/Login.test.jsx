import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

// Mock the API module
vi.mock('../services/api', () => ({
  authAPI: {
    loginCustomer: vi.fn(),
  },
}));

describe('Login Page', () => {
  it('renders the login form with all fields', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in to your account/i })).toBeInTheDocument();
  });

  it('shows validation error for empty fields', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </MemoryRouter>
      </HelmetProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /log in to your account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
