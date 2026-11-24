import { useState } from 'react';
import { AppNavigation } from '../components/AppNavigation';
import { AsyncStatus } from '../components/AsyncStatus';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { TaskPagination } from '../components/TaskPagination';
import { TaskSummary } from '../components/TaskSummary';
import { useAuth } from '../hooks/useAuth';
import { useTaskList } from '../hooks/useTaskList';
import type {
  TaskListQuery,
  TaskSortField,
  SortOrder,
} from '../models/api.types';
import type { TaskStatus } from '../models/task.interface';
import type {
  TaskFilter,
  TaskSort,
} from '../models/task-view.types';
import { getHttpErrorMessage } from '../services/http.service';
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  updateTask as updateTaskRequest,
} from '../services/task.api.service';

const PAGE_SIZE = 5;

function mapSort(sort: TaskSort): {
  sortBy: TaskSortField;
  order: SortOrder;
} {
  switch (sort) {
    case 'updated-asc':
      return { sortBy: 'updatedAt', order: 'asc' };
    case 'title-asc':
      return { sortBy: 'title', order: 'asc' };
    case 'title-desc':
      return { sortBy: 'title', order: 'desc' };
    default:
      return { sortBy: 'updatedAt', order: 'desc' };
  }
}

export function TasksPage() {
  const { accessToken } = useAuth();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('updated-desc');
  const [page, setPage] = useState(1);
  const [isMutating, setIsMutating] = useState(false);
  const [operationMessage, setOperationMessage] = useState('');
  const [operationFailed, setOperationFailed] = useState(false);

  const mappedSort = mapSort(sort);

  const taskListQuery: TaskListQuery = {
    page,
    limit: PAGE_SIZE,
    search: query.trim() || undefined,
    status: filter === 'all' ? undefined : filter,
    sortBy: mappedSort.sortBy,
    order: mappedSort.order,
  };

  const {
    tasks,
    meta,
    status,
    errorMessage,
    reload,
  } = useTaskList(taskListQuery, accessToken);

  async function runMutation(
    operation: () => Promise<unknown>,
    successMessage: string,
  ): Promise<boolean> {
    setIsMutating(true);
    setOperationMessage('');
    setOperationFailed(false);
    try {
      await operation();
      setOperationMessage(successMessage);
      return true;
    } catch (error) {
      setOperationFailed(true);
      setOperationMessage(getHttpErrorMessage(error));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  function refreshAfterMutation(): void {
    if (page === 1) {
      reload();
      return;
    }
    setPage(1);
  }

  async function handleAddTask(title: string): Promise<boolean> {
    if (!accessToken) return false;
    const succeeded = await runMutation(
      () => createTaskRequest({ title }, accessToken),
      'La tarea fue creada.',
    );
    if (succeeded) {
      refreshAfterMutation();
    }
    return succeeded;
  }

  async function handleToggleStatus(
    id: string,
    nextStatus: TaskStatus,
  ): Promise<void> {
    if (!accessToken) return;
    const succeeded = await runMutation(
      () => updateTaskRequest(id, { status: nextStatus }, accessToken),
      'El estado fue actualizado.',
    );
    if (succeeded) {
      reload();
    }
  }

  async function handleEditTask(id: string, title: string): Promise<void> {
    if (!accessToken) return;
    const succeeded = await runMutation(
      () => updateTaskRequest(id, { title }, accessToken),
      'El título fue actualizado.',
    );
    if (succeeded) {
      reload();
    }
  }

  function handleDeleteTask(id: string): void {
    if (!accessToken) return;
    const shouldDelete = window.confirm('¿Estás seguro de eliminar esta tarea?');
    if (!shouldDelete) {
      return;
    }
    void runMutation(
      () => deleteTaskRequest(id, accessToken),
      'La tarea fue eliminada.',
    ).then((succeeded) => {
      if (succeeded) {
        if (tasks.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          reload();
        }
      }
    });
  }

  function handleQueryChange(value: string): void {
    setQuery(value);
    setPage(1);
  }

  function handleFilterChange(value: TaskFilter): void {
    setFilter(value);
    setPage(1);
  }

  function handleSortChange(value: TaskSort): void {
    setSort(value);
    setPage(1);
  }

  function handleClear(): void {
    setQuery('');
    setFilter('all');
    setSort('updated-desc');
    setPage(1);
    setOperationMessage('');
  }

  return (
    <div className="page-stack">
      {/* Barra de navegación superior con el botón de cerrar sesión */}
      <AppNavigation />

      <section className="page-introduction" aria-labelledby="tasks-page-title">
        <p className="section-heading__eyebrow">Gestión remota</p>
        <h2 id="tasks-page-title">Mis tareas</h2>
        <p>Los cambios se guardan mediante la API REST.</p>
      </section>

      <TaskForm onAddTask={handleAddTask} />

      {operationMessage && (
        <p
          className={
            operationFailed
              ? 'operation-message operation-message--error'
              : 'operation-message'
          }
          role={operationFailed ? 'alert' : 'status'}
        >
          {operationMessage}
        </p>
      )}

      <TaskFilters
        query={query}
        filter={filter}
        sortBy={sort}
        resultCount={meta.total}
        onQueryChange={handleQueryChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClear={handleClear}
      />

      <AsyncStatus
        status={status}
        errorMessage={errorMessage}
        onRetry={reload}
      />

      {status !== 'error' && (
        <>
          <TaskSummary tasks={tasks} />

          <TaskList
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />

          <TaskPagination
            meta={meta}
            disabled={status === 'loading' || isMutating}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}