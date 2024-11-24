import { render } from "@testing-library/react";
import { useContext } from 'react';
import Navbar from '../home/Navbar';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should alert if volunteer role and empty profile', () => {
    useContext.mockReturnValue({
      currentUser: {
        role: 'volunteer',
        profile: [],
      },
    });

    render(<Navbar />);
    expect(window.alert).toHaveBeenCalledWith('שים לב! יש להיכנס לדף הפרופיל על מנת למלא את הפרטים האישיים');
  });

  it('should alert if association role and empty profile', () => {
    useContext.mockReturnValue({
      currentUser: {
        role: 'association',
        profile: [],
      },
    });

    render(<Navbar />);
    expect(window.alert).toHaveBeenCalledWith('שים לב! יש להיכנס לדף העמותה על מנת למלא את פרטי העמותה');
  });


  it('should not alert if volunteer role and profile is not empty', () => {
    useContext.mockReturnValue({
      currentUser: {
        role: 'volunteer',
        profile: ['non-empty'],
      },
    });
  
    render(<Navbar />);
    expect(window.alert).not.toHaveBeenCalled();
  });
  
  it('should not alert if admin role and profile is not empty', () => {
    useContext.mockReturnValue({
      currentUser: {
        role: 'admin',
        profile: ['non-empty'],
      },
    });
  
    render(<Navbar />);
    expect(window.alert).not.toHaveBeenCalled();
  });
  
  it('should not alert if association role and profile is not empty', () => {
    useContext.mockReturnValue({
      currentUser: {
        role: 'association',
        profile: ['non-empty'],
      },
    });
  
    render(<Navbar />);
    expect(window.alert).not.toHaveBeenCalled();
  });
});
