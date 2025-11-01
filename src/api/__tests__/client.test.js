import { apiClient } from '../client';

describe('APIClient', () => {
  let mockFetch;
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();

    // Mock window.location
    delete window.location;
    window.location = { href: '', assign: jest.fn(), replace: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.location = originalLocation;
  });

  describe('getAuthHeaders', () => {
    it('should return headers with authorization when token exists', () => {
      Storage.prototype.getItem.mockReturnValue('test-token');

      const headers = apiClient.getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      });
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('should return headers without authorization when token does not exist', () => {
      Storage.prototype.getItem.mockReturnValue(null);

      const headers = apiClient.getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });

  describe('request', () => {
    it('should make a successful request', async () => {
      const mockData = { success: true, data: 'test' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiClient.request('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle 401 unauthorized and redirect to login', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(apiClient.request('/test')).rejects.toThrow('Unauthorized');

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(window.location.href).toBe('/login');
    });

    it('should throw error when response is not ok', async () => {
      const errorMessage = 'Something went wrong';
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: errorMessage }),
      });

      await expect(apiClient.request('/test')).rejects.toThrow(errorMessage);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(apiClient.request('/test')).rejects.toThrow('Network error');
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });
    });

    it('should make GET request', async () => {
      await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should make POST request with body', async () => {
      const body = { name: 'test' };
      await apiClient.post('/test', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        })
      );
    });

    it('should make PUT request with body', async () => {
      const body = { name: 'test' };
      await apiClient.put('/test', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        })
      );
    });

    it('should make PATCH request with body', async () => {
      const body = { name: 'test' };
      await apiClient.patch('/test', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      );
    });

    it('should make DELETE request', async () => {
      await apiClient.delete('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
