// LoginForm.test.js
import { render, fireEvent, screen , waitFor } from "@testing-library/react";
import LoginForm from "../home/LoginForm";
import UserContext from "../UserContext";
import '@testing-library/jest-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


jest.mock('firebase/auth', () => {
  
  const originalModule = jest.requireActual('firebase/auth');
  
  return {
    ...originalModule,
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  };
});


// Mock the context values for testing
const mockContext = {
  setCurrentUser: jest.fn()
}

describe("LoginForm", () => {

  it('shows error message when login fails', async () => {
    getAuth.mockReturnValue({});
    signInWithEmailAndPassword.mockResolvedValue({
      user: {
        getIdToken: jest.fn().mockResolvedValue('fakeToken'),
      },
    });
  });


  it("renders and handles input changes correctly", () => {
    render(
      <UserContext.Provider value={mockContext}>
        <LoginForm />
      </UserContext.Provider>
    );
  
    const emailInput = screen.getByPlaceholderText("אימייל");
    const passwordInput = screen.getByPlaceholderText("סיסמה");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "test123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("test123");
  });

  it('fails to log in with invalid data', async () => {
    global.console.log = jest.fn();
    getAuth.mockImplementation(() => ({}));
    signInWithEmailAndPassword.mockImplementation(() => {
      throw new Error('Invalid data'); // Simulate the error case
    });

    // Mock context
    const mockSetCurrentUser = jest.fn();
    const contextValue = { setCurrentUser: mockSetCurrentUser };

    render(
      <UserContext.Provider value={contextValue}>
        <LoginForm />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("אימייל"), { target: { value: 'invalidEmail' } });
    fireEvent.change(screen.getByPlaceholderText("סיסמה"), { target: { value: 'invalidPassword' } });
    fireEvent.click(screen.getByRole('button', {name: /התחברות/i}));

    await waitFor(() => {
        console.log(document.body.textContent);
    });
   
    expect(mockSetCurrentUser).not.toHaveBeenCalled();
  });


  
  it('shows error when login fails', async () => {
    const setCurrentUser = jest.fn();
  
    getAuth.mockImplementation(() => ({}));
    signInWithEmailAndPassword.mockImplementation(() => {
      throw new Error('auth/wrong-password');
    });
  
    render(
      <UserContext.Provider value={{ setCurrentUser }}>
        <LoginForm onHide={jest.fn()} onLoggedIn={jest.fn()} onSignupLinkClick={jest.fn()} />
      </UserContext.Provider>
    );
  
    
  });

  test('renders LoginForm component', () => {
    const mockSetCurrentUser = jest.fn();

    render(
        <UserContext.Provider value={{ setCurrentUser: mockSetCurrentUser }}>
            <LoginForm />
        </UserContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText('אימייל');
    const passwordInput = screen.getByPlaceholderText('סיסמה');
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});

  

















});