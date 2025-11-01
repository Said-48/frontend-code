import { authAPI } from '../auth';
import { apiClient } from '../client';

jest.mock('../client');

describe('authAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call apiClient.post with correct endpoint and data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const mockResponse = { success: true, message: 'Registration successful' };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authAPI.register(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should call apiClient.post with correct endpoint and credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = { token: 'test-token', user: { id: 1, email: 'test@example.com' } };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authAPI.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('verify2FA', () => {
    it('should call apiClient.post with correct endpoint and data', async () => {
      const userId = 123;
      const code = '123456';
      const mockResponse = { success: true, token: 'test-token' };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authAPI.verify2FA(userId, code);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/verify-2fa', {
        user_id: userId,
        code: code,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('enable2FA', () => {
    it('should call apiClient.post with correct endpoint and user ID', async () => {
      const userId = 123;
      const mockResponse = { success: true, qr_code: 'qr-code-data' };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authAPI.enable2FA(userId);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/enable-2fa', { user_id: userId });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('disable2FA', () => {
    it('should call apiClient.post with correct endpoint and user ID', async () => {
      const userId = 123;
      const mockResponse = { success: true, message: '2FA disabled' };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authAPI.disable2FA(userId);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/disable-2fa', { user_id: userId });
      expect(result).toEqual(mockResponse);
    });
  });
});
