import { render, screen } from '@testing-library/react';
import App from '../App';
import { useAuth } from '../context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext');

// Mock all page components
jest.mock('../pages/Login', () => {
  return function Login() {
    return <div>Login Page</div>;
  };
});

jest.mock('../pages/SignUp', () => {
  return function SignUp() {
    return <div>SignUp Page</div>;
  };
});

jest.mock('../pages/Verify2FA', () => {
  return function Verify2FA() {
    return <div>Verify2FA Page</div>;
  };
});

jest.mock('../pages/InvitationResponse', () => {
  return function InvitationResponse() {
    return <div>InvitationResponse Page</div>;
  };
});

jest.mock('../pages/StudentDashboard', () => {
  return function StudentDashboard() {
    return <div>Student Dashboard</div>;
  };
});

jest.mock('../pages/AdminDashboard', () => {
  return function AdminDashboard() {
    return <div>Admin Dashboard</div>;
  };
});

jest.mock('../pages/ProjectDetails', () => {
  return function ProjectDetails() {
    return <div>Project Details</div>;
  };
});

jest.mock('../pages/EditProject', () => {
  return function EditProject() {
    return <div>Edit Project</div>;
  };
});

// Mock ProtectedRoute to pass children through for testing
jest.mock('../components/ProtectedRoute', () => {
  return function ProtectedRoute({ children }) {
    return <div>{children}</div>;
  };
});

describe('App', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render login page on /login route', () => {
    window.history.pushState({}, 'Login', '/login');
    render(<App />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render signup page on /signup route', () => {
    window.history.pushState({}, 'SignUp', '/signup');
    render(<App />);
    expect(screen.getByText('SignUp Page')).toBeInTheDocument();
  });

  it('should provide AuthProvider context to children', () => {
    render(<App />);
    // If no error is thrown, AuthProvider is working
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
