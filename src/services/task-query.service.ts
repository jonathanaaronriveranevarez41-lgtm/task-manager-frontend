import type { Task } from '../models/task.interface';
import type { TaskSort, TaskViewOptions } from '../models/task-view.types';

const titleCollator = new Intl.Collator('es-MX', {
  sensitivity: 'base',
});

function compareTasks(
  firstTask: Task,
  secondTask: Task,
  sortBy: TaskSort,
): number {
  switch (sortBy) {
    case 'updated-asc':
      return (
        Date.parse(firstTask.updatedAt) - Date.parse(secondTask.updatedAt)
      );
    case 'title-asc':
      return titleCollator.compare(firstTask.title, secondTask.title);
    case 'title-desc':
      return titleCollator.compare(secondTask.title, firstTask.title);
    case 'updated-desc':
    default:
      return (
        Date.parse(secondTask.updatedAt) - Date.parse(firstTask.updatedAt)
      );
  }
}

export function getVisibleTasks(
  tasks: Task[],
  options: TaskViewOptions,
): Task[] {
  const normalizedQuery = options.query.trim().toLocaleLowerCase('es-MX');

  const filteredTasks = tasks.filter((task) => {
    const matchesQuery = task.title
      .toLocaleLowerCase('es-MX')
      .includes(normalizedQuery);
    const matchesFilter =
      options.filter === 'all' || task.status === options.filter;
    return matchesQuery && matchesFilter;
  });

  return [...filteredTasks].sort((firstTask, secondTask) =>
    compareTasks(firstTask, secondTask, options.sortBy),
  );
}