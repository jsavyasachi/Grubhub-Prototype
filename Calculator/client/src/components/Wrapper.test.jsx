import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Wrapper from './wrapper';
import axios from 'axios';

vi.mock('axios');

describe('Wrapper Component', () => {
  it('updates display when buttons are clicked', async () => {
    render(<Wrapper />);
    const button1 = screen.getByRole('button', { name: '1' });
    const button2 = screen.getByRole('button', { name: '2' });
    
    fireEvent.click(button1);
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    
    fireEvent.click(button2);
    expect(screen.getByDisplayValue('12')).toBeInTheDocument();
  });

  it('calls mock API and updates display with result when "=" is clicked', async () => {
    axios.post.mockResolvedValue({ status: 200, data: 3 });
    render(<Wrapper />);
    
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/calculate', { expr: '1+2' });
    });

    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  it('resets display when "C" is clicked', () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });
});
