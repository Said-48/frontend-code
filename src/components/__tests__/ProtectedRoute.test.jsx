import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Mock the AuthContext
jest.mock('../../context/AuthContext');

// Mock Navigate component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => <div data-testid="navigate">{`Redirected to ${to}`}</div>,
}));

describe('ProtectedRoute', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state when loading is true', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirected to /login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Test User', role: 'Student' },
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('should redirect to dashboard when user is not admin but admin is required', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Test User', role: 'Student' },
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute requireAdmin={true}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirected to /dashboard');
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should render children when user is admin and admin is required', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Admin User', role: 'Admin' },
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute requireAdmin={true}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
