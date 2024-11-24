import { render, screen, fireEvent, act } from '@testing-library/react';
import AssoSignup from '../association/AssoSignup';

// Mock the DatePicker component
jest.mock('react-datepicker', () => {
  return function MockDatePicker({ selected = '', onChange }) {
    return (
      <input
        data-testid="datepicker"
        onChange={onChange}
        value={selected || ''}
      />
    );
  };
});

describe('AssoSignup', () => {

  
test('has the required text inputs', () => {
  render(<AssoSignup />);
  const associationNameInput = screen.getByPlaceholderText('שם העמותה');
  const associationRecruiterNameInput = screen.getByPlaceholderText('שם נציג העמותה');
  const phoneNumberInput = screen.getByPlaceholderText('טלפון נייד');
  const emailInput = screen.getByPlaceholderText('אימייל');
  const passwordInput = screen.getByPlaceholderText('בחר סיסמה');
  const passwordConfirmationInput = screen.getByPlaceholderText('הקלד שוב סיסמה');
  expect(associationNameInput).toBeDefined();
  expect(associationRecruiterNameInput).toBeDefined();
  expect(phoneNumberInput).toBeDefined();
  expect(emailInput).toBeDefined();
  expect(passwordInput).toBeDefined();
  expect(passwordConfirmationInput).toBeDefined();
  
});

test('submits the form successfully', async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Association registered successfully' }),
    });

    // Mock window.alert
    global.alert = jest.fn();

    // Create a mock function for onRegister
    const onRegisterMock = jest.fn();

    // Render the component with onRegister prop
    render(<AssoSignup onRegister={onRegisterMock} />);

    // Fill in the form fields
    fireEvent.input(screen.getByLabelText('שם עמותה:'), { target: { value: 'אלחיראכ אלשבאבי אלמשהדאוי (ע~ר)' } });
    fireEvent.input(screen.getByLabelText('נציג עמותה:'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('datepicker'), { target: { value: '23/08/2021' } });
    fireEvent.input(screen.getByLabelText('מספר פלאפון:'), { target: { value: '1234567890' } });
    fireEvent.input(screen.getByPlaceholderText('אימייל'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('סיסמא:'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('סיסמא חוזרת:'), { target: { value: 'password123' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'הרשמה' }));
    });

    // Verify the form submission
    expect(global.alert).toHaveBeenCalled();
});

test('displays alert when association name or registration date is invalid', async () => {
  // Mock the fetch function
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue([]),
  });

  // Mock window.alert
  global.alert = jest.fn();

  // Render the component
  render(<AssoSignup />);

  // Fill in the form fields
  fireEvent.input(screen.getByLabelText('שם עמותה:'), { target: { value: 'Invalid Association' } });
  fireEvent.change(screen.getByTestId('datepicker'), { target: { value: '23/08/2021' } });
  fireEvent.input(screen.getByLabelText('מספר פלאפון:'), { target: { value: '1234567890' } });
  fireEvent.input(screen.getByPlaceholderText('אימייל'), { target: { value: 'test@example.com' } });
  fireEvent.input(screen.getByLabelText('סיסמא:'), { target: { value: 'password123' } });
  fireEvent.input(screen.getByLabelText('סיסמא חוזרת:'), { target: { value: 'password123' } });

  // Submit the form
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'הרשמה' }));
  });

  // Verify the alert message
  expect(global.alert).toHaveBeenCalledWith('!הרישום נכשל, שם העמותה או תאריך הרישום אינם תקפים.');
});



test('displays alert when association registration fails', async () => {
  // Mock the fetch function
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: jest.fn().mockResolvedValue({ message: 'Association registration failed' }),
  });

  // Mock window.alert
  global.alert = jest.fn();

  // Render the component
  render(<AssoSignup />);

  // Fill in the form fields
  fireEvent.input(screen.getByLabelText('שם עמותה:'), { target: { value: 'Valid Association' } });
  fireEvent.change(screen.getByTestId('datepicker'), { target: { value: '23/08/2021' } });
  fireEvent.input(screen.getByLabelText('מספר פלאפון:'), { target: { value: '1234567890' } });
  fireEvent.input(screen.getByPlaceholderText('אימייל'), { target: { value: 'test@example.com' } });
  fireEvent.input(screen.getByLabelText('סיסמא:'), { target: { value: 'password123' } });
  fireEvent.input(screen.getByLabelText('סיסמא חוזרת:'), { target: { value: 'password123' } });

  // Submit the form
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'הרשמה' }));
  });

  // Verify the alert message
  expect(global.alert).toHaveBeenCalledWith("!הרישום נכשל, שם העמותה או תאריך הרישום אינם תקפים.");
});




});