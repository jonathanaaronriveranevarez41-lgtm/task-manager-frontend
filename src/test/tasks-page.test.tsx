import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import type { Task } from '../models/task.interface';
import { TasksPage } from '../pages/TasksPage';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useTaskList: vi.fn(),
  updateTask: vi.fn(),
  reload: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}));

vi.mock('../hooks/useTaskList', () => ({
  useTaskList: mocks.useTaskList,
}));

vi.mock('../services/task.api.service', () => ({
  createTask: vi.fn(),
  deleteTask: vi.fn(),
  updateTask: mocks.updateTask,
}));

const task: Task = {
  id: 'task-01',
  title: 'Preparar entrega',
  status: 'pending',
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

describe('cambio de estado de tareas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({
      status: 'authenticated',
      user: {
        id: 'user-01',
        name: 'Ana Torres',
        email: 'ana@example.com',
        role: 'user',
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
      accessToken: 'access-token',
      sessionMessage: '',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      retrySession: vi.fn(),
      clearSessionMessage: vi.fn(),
    });
  });

  it.each([
    ['pending', 'Completar', 'completed'],
    ['completed', 'Reabrir', 'pending'],
  ] as const)(
    'envía %s a %s al presionar %s',
    async (currentStatus, buttonLabel, nextStatus) => {
      const currentTask = {
        ...task,
        status: currentStatus,
      };
      mocks.useTaskList.mockReturnValue({
        tasks: [currentTask],
        meta: {
          page: 1,
          limit: 5,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        status: 'success',
        errorMessage: '',
        reload: mocks.reload,
      });
      mocks.updateTask.mockResolvedValue({
        data: { ...currentTask, status: nextStatus },
      });

      render(
        <MemoryRouter>
          <TasksPage />
        </MemoryRouter>,
      );

      fireEvent.click(screen.getByRole('button', { name: buttonLabel }));

      await waitFor(() => {
        expect(mocks.updateTask).toHaveBeenCalledWith(
          'task-01',
          { status: nextStatus },
          'access-token',
        );
      });
    },
  );
});
