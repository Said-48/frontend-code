import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProjectModal from '../CreateProjectModal';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../api/projects';
import { classesAPI } from '../../api/classes';
import { cohortsAPI } from '../../api/cohorts';

// Mock dependencies
jest.mock('../../context/AuthContext');
jest.mock('../../api/projects');
jest.mock('../../api/classes');
jest.mock('../../api/cohorts');
jest.mock('../../api/members');

describe('CreateProjectModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });

    // Mock API responses
    classesAPI.getAll.mockResolvedValue([
      { id: 1, name: 'Web Development', track: 'Frontend' },
      { id: 2, name: 'Data Science', track: 'Backend' },
    ]);

    cohortsAPI.getAll.mockResolvedValue({
      items: [
        { id: 1, name: 'Cohort 2024' },
        { id: 2, name: 'Cohort 2025' },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render create project modal', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    await waitFor(() => {
      expect(screen.getByText('Create new Project')).toBeInTheDocument();
    });
  });

  it('should render edit project modal when project is provided', async () => {
    const project = {
      id: 1,
      name: 'Existing Project',
      description: 'Test description',
      github_link: 'https://github.com/test/repo',
      class_id: 1,
      cohort_id: 1,
    };

    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} project={project} />);

    await waitFor(() => {
      expect(screen.getByText('Edit Project')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Project')).toBeInTheDocument();
    });
  });

  it('should load classes and cohorts on mount', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    await waitFor(() => {
      expect(classesAPI.getAll).toHaveBeenCalled();
      expect(cohortsAPI.getAll).toHaveBeenCalled();
    });

    expect(screen.getByText('Web Development - Frontend')).toBeInTheDocument();
    expect(screen.getByText('Cohort 2024')).toBeInTheDocument();
  });

  it('should update form data when inputs change', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const nameInput = await screen.findByPlaceholderText('Enter project name');
    const descriptionInput = screen.getByPlaceholderText('Describe your project');

    fireEvent.change(nameInput, { target: { value: 'New Project' } });
    fireEvent.change(descriptionInput, { target: { value: 'Project description' } });

    expect(nameInput.value).toBe('New Project');
    expect(descriptionInput.value).toBe('Project description');
  });

  it('should add member with valid email', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const emailInput = await screen.findByPlaceholderText('Enter member email address');

    fireEvent.change(emailInput, { target: { value: 'member@example.com' } });
    fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('member@example.com')).toBeInTheDocument();
    });
  });

  it('should show error for invalid email', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const emailInput = await screen.findByPlaceholderText('Enter member email address');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it.skip('should remove member from list', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const emailInput = await screen.findByPlaceholderText('Enter member email address');

    fireEvent.change(emailInput, { target: { value: 'member@example.com' } });
    fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('member@example.com')).toBeInTheDocument();
    });

    // Click the delete button
    const deleteButtons = screen.getAllByRole('button');
    const trashButton = deleteButtons.find(btn => btn.innerHTML.includes('svg'));
    if (trashButton) {
      fireEvent.click(trashButton);
    }

    await waitFor(() => {
      expect(screen.queryByText('member@example.com')).not.toBeInTheDocument();
    });
  });

  it('should validate required fields on submit', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const submitButton = await screen.findByText('Create Project');

    // Fill in name but not class and cohort
    const nameInput = screen.getByPlaceholderText('Enter project name');
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a class')).toBeInTheDocument();
    });
  });

  it('should create project successfully', async () => {
    const mockProject = { id: 1, name: 'Test Project' };
    projectsAPI.create.mockResolvedValue(mockProject);

    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    // Wait for classes to load
    await waitFor(() => {
      expect(screen.getByText('Web Development - Frontend')).toBeInTheDocument();
    });

    // Fill in form
    const nameInput = screen.getByPlaceholderText('Enter project name');
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });

    const classSelect = screen.getByDisplayValue('Select a class');
    fireEvent.change(classSelect, { target: { value: '1' } });

    const cohortSelect = screen.getByDisplayValue('Select a cohort');
    fireEvent.change(cohortSelect, { target: { value: '1' } });

    const submitButton = screen.getByText('Create Project');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(projectsAPI.create).toHaveBeenCalledWith({
        name: 'Test Project',
        description: '',
        github_link: '',
        class_id: 1,
        cohort_id: 1,
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it.skip('should call onClose when cancel button is clicked', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const cancelButton = await screen.findByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it.skip('should call onClose when X button is clicked', async () => {
    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons[0]; // First button is the X button
    fireEvent.click(xButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display error message on API failure', async () => {
    projectsAPI.create.mockRejectedValue(new Error('Failed to create project'));

    render(<CreateProjectModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    await waitFor(() => {
      expect(screen.getByText('Web Development - Frontend')).toBeInTheDocument();
    });

    // Fill in form
    const nameInput = screen.getByPlaceholderText('Enter project name');
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });

    const classSelect = screen.getByDisplayValue('Select a class');
    fireEvent.change(classSelect, { target: { value: '1' } });

    const cohortSelect = screen.getByDisplayValue('Select a cohort');
    fireEvent.change(cohortSelect, { target: { value: '1' } });

    const submitButton = screen.getByText('Create Project');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create project')).toBeInTheDocument();
    });
  });
});
