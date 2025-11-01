import { projectsAPI } from '../projects';
import { apiClient } from '../client';

jest.mock('../client');

describe('projectsAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call apiClient.get with correct endpoint', async () => {
      const mockResponse = [{ id: 1, name: 'Project 1' }];
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await projectsAPI.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/projects');
      expect(result).toEqual(mockResponse);
    });

    it('should include query parameters when provided', async () => {
      const params = { status: 'active', page: 1 };
      const mockResponse = [{ id: 1, name: 'Project 1' }];
      apiClient.get.mockResolvedValue(mockResponse);

      await projectsAPI.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/projects?status=active&page=1');
    });
  });

  describe('getById', () => {
    it('should call apiClient.get with project ID', async () => {
      const mockProject = { id: 1, name: 'Project 1' };
      apiClient.get.mockResolvedValue(mockProject);

      const result = await projectsAPI.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/projects/1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('create', () => {
    it('should call apiClient.post with project data', async () => {
      const projectData = { name: 'New Project', description: 'Test' };
      const mockResponse = { id: 1, ...projectData };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await projectsAPI.create(projectData);

      expect(apiClient.post).toHaveBeenCalledWith('/projects', projectData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call apiClient.put with project ID and data', async () => {
      const projectData = { name: 'Updated Project' };
      const mockResponse = { id: 1, ...projectData };
      apiClient.put.mockResolvedValue(mockResponse);

      const result = await projectsAPI.update(1, projectData);

      expect(apiClient.put).toHaveBeenCalledWith('/projects/1', projectData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should call apiClient.delete with project ID', async () => {
      const mockResponse = { success: true };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await projectsAPI.delete(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/projects/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateStatus', () => {
    it('should call apiClient.patch with project ID and status', async () => {
      const status = 'completed';
      const mockResponse = { success: true };
      apiClient.patch.mockResolvedValue(mockResponse);

      const result = await projectsAPI.updateStatus(1, status);

      expect(apiClient.patch).toHaveBeenCalledWith('/projects/1/status', { status });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('inviteMember', () => {
    it('should call apiClient.post with project ID and member data', async () => {
      const memberData = { email: 'member@example.com', role: 'collaborator' };
      const mockResponse = { success: true };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await projectsAPI.inviteMember(1, memberData);

      expect(apiClient.post).toHaveBeenCalledWith('/members/projects/1/invite', memberData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeMember', () => {
    it('should call apiClient.post with project ID and user ID', async () => {
      const mockResponse = { success: true };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await projectsAPI.removeMember(1, 123);

      expect(apiClient.post).toHaveBeenCalledWith('/members/projects/1/remove', { user_id: 123 });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('respondToInvitation', () => {
    it('should call apiClient.post with project ID and response', async () => {
      const response = { accept: true };
      const mockResponse = { success: true };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await projectsAPI.respondToInvitation(1, response);

      expect(apiClient.post).toHaveBeenCalledWith('/members/projects/1/respond', response);
      expect(result).toEqual(mockResponse);
    });
  });
});
