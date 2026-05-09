import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('should render Login as User and Login as Vendor links with correct paths', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const userLink = screen.getByText(/Login as User/i).closest('a');
    const vendorLink = screen.getByText(/Login as Vendor/i).closest('a');

    expect(userLink).toBeInTheDocument();
    expect(userLink).toHaveAttribute('href', '/login-user');

    expect(vendorLink).toBeInTheDocument();
    expect(vendorLink).toHaveAttribute('href', '/login-vendor');
  });
});
