import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authAPI } from '../../api/auth';

// Mock the auth API
jest.mock('../../api/auth');

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide auth context when used within AuthProvider', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('register');
    });
  });

  describe('AuthProvider initialization', () => {
    it('should initialize with null user and loading true', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(false); // After mount
      expect(result.current.user).toBe(null);
    });

    it('should load user from localStorage on mount', async () => {
      const mockUser = { id: 1, name: 'Test User', role: 'Student' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle invalid user data in localStorage', async () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', 'invalid-json');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBe(null);
        expect(result.current.loading).toBe(false);
      });

      consoleSpy.mockRestore();
    });
  });

  describe('login', () => {
    it('should handle successful login without 2FA', async () => {
      const mockUser = { id: 1, name: 'Test User', role: 'Student' };
      const mockResponse = {
        token: 'test-token',
        user: mockUser,
        two_factor_enabled: false,
      };

      authAPI.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password',
        });
      });

      expect(loginResult).toEqual({ success: true });
      expect(result.current.user).toEqual(mockUser);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    it('should handle login with 2FA enabled', async () => {
      const mockResponse = {
        two_factor_enabled: true,
        user_id: 123,
      };

      authAPI.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password',
        });
      });

      expect(loginResult).toEqual({ requires2FA: true, userId: 123 });
      expect(localStorage.setItem).toHaveBeenCalledWith('pending_2fa_user_id', 123);
      expect(localStorage.setItem).toHaveBeenCalledWith('pending_2fa_email', 'test@example.com');
      expect(localStorage.setItem).toHaveBeenCalledWith('pending_2fa_password', 'password');
      expect(result.current.user).toBe(null);
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      authAPI.login.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login({
            email: 'test@example.com',
            password: 'wrong',
          });
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBe(null);
    });
  });

  describe('register', () => {
    it('should handle successful registration', async () => {
      const mockResponse = { success: true, message: 'Registration successful' };
      authAPI.register.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
        });
      });

      expect(registerResult).toEqual({ success: true, message: 'Registration successful' });
    });

    it('should handle registration error', async () => {
      const error = new Error('Email already exists');
      authAPI.register.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.register({
            email: 'existing@example.com',
            password: 'password',
          });
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('should clear user data and redirect to login', () => {
      const mockUser = { id: 1, name: 'Test User' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      delete window.location;
      window.location = { href: '' };

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(window.location.href).toBe('/login');
    });
  });

  describe('role checks', () => {
    it('should correctly identify admin user', async () => {
      const mockUser = { id: 1, name: 'Admin User', role: 'Admin' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAdmin()).toBe(true);
        expect(result.current.isStudent()).toBe(false);
      });
    });

    it('should correctly identify student user', async () => {
      const mockUser = { id: 1, name: 'Student User', role: 'Student' };
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAdmin()).toBe(false);
        expect(result.current.isStudent()).toBe(true);
      });
    });

    it('should return false for role checks when user is null', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAdmin()).toBe(false);
      expect(result.current.isStudent()).toBe(false);
    });
  });
});
