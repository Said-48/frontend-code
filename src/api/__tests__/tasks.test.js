import { tasksAPI } from '../tasks';
import { apiClient } from '../client';

jest.mock('../client');

describe('tasksAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call apiClient.get with correct endpoint', async () => {
      const mockResponse = [{ id: 1, title: 'Task 1' }];
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await tasksAPI.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/tasks/');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call apiClient.get with task ID', async () => {
      const mockTask = { id: 1, title: 'Task 1' };
      apiClient.get.mockResolvedValue(mockTask);

      const result = await tasksAPI.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockTask);
    });
  });

  describe('getByProject', () => {
    it('should call apiClient.get with project ID', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1', project_id: 5 }];
      apiClient.get.mockResolvedValue(mockTasks);

      const result = await tasksAPI.getByProject(5);

      expect(apiClient.get).toHaveBeenCalledWith('/tasks/project/5');
      expect(result).toEqual(mockTasks);
    });
  });

  describe('create', () => {
    it('should call apiClient.post with task data', async () => {
      const taskData = { title: 'New Task', description: 'Test', project_id: 1 };
      const mockResponse = { id: 1, ...taskData };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await tasksAPI.create(taskData);

      expect(apiClient.post).toHaveBeenCalledWith('/tasks/', taskData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call apiClient.put with task ID and data', async () => {
      const taskData = { title: 'Updated Task' };
      const mockResponse = { id: 1, ...taskData };
      apiClient.put.mockResolvedValue(mockResponse);

      const result = await tasksAPI.update(1, taskData);

      expect(apiClient.put).toHaveBeenCalledWith('/tasks/1', taskData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should call apiClient.delete with task ID', async () => {
      const mockResponse = { success: true };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await tasksAPI.delete(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockResponse);
    });
  });
});
