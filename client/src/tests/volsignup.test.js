import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import VolSignup from '../volunteer/VolSignup';

global.fetch = jest.fn(() => Promise.resolve({ 
  ok: true, 
  json: () => Promise.resolve({ message: 'Success' }) 
}));


describe('VolSignup', () => {

  test('renders the form properly', () => {
    render(<VolSignup />);
  });


  test('updates input fields', async () => {
    render(<VolSignup />);
    fireEvent.change(screen.getByPlaceholderText('שם פרטי'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('שם משפחה'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('טלפון נייד'), { target: { value: '555-555-5555' } });
    fireEvent.change(screen.getByPlaceholderText('אימייל'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('בחר סיסמה'), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('הקלד שוב סיסמה'), { target: { value: 'password' } });

    expect(screen.getByPlaceholderText('שם פרטי').value).toBe('John');
    expect(screen.getByPlaceholderText('שם משפחה').value).toBe('Doe');
    expect(screen.getByPlaceholderText('טלפון נייד').value).toBe('555-555-5555');
    expect(screen.getByPlaceholderText('אימייל').value).toBe('john.doe@example.com');
    expect(screen.getByPlaceholderText('בחר סיסמה').value).toBe('password');
    expect(screen.getByPlaceholderText('הקלד שוב סיסמה').value).toBe('password');
  });


  test('submits the form successfully', async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Volunteer registered successfully' }),
    });

    // Mock window.alert
    global.alert = jest.fn();

    // Create a mock function for onRegister
    const onRegisterMock = jest.fn();

    // Render the component with onRegister prop
    render(<VolSignup onRegister={onRegisterMock} />);

    // Fill in the form fields
    fireEvent.input(screen.getByLabelText('שם פרטי:'), { target: { value: 'John' } });
    fireEvent.input(screen.getByLabelText('שם משפחה:'), { target: { value: 'Doe' } });

    fireEvent.input(screen.getByPlaceholderText('אימייל'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('סיסמא:'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('סיסמא חוזרת:'), { target: { value: 'password123' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'הרשמה' }));
    });

    // Verify the form submission
    expect(global.alert).toHaveBeenCalledWith('Volunteer registered successfully');
  });
  


  
  test('cheking', async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Volunteer registered successfully' }),
    });

    // Mock window.alert
    global.alert = jest.fn();

    // Create a mock function for onRegister
    const onRegisterMock = jest.fn();

    // Render the component with onRegister prop
    render(<VolSignup onRegister={onRegisterMock} />);

    // Fill in the form fields
    fireEvent.input(screen.getByLabelText('שם פרטי:'), { target: { value: 'John' } });
    fireEvent.input(screen.getByLabelText('שם משפחה:'), { target: { value: 'Doe' } });

    fireEvent.input(screen.getByPlaceholderText('אימייל'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('סיסמא:'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('סיסמא חוזרת:'), { target: { value: 'werqwr3' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'הרשמה' }));
    });

    // Verify the form submission
    expect(global.alert).toHaveBeenCalledWith('Passwords do not match.');
  });
















  
});