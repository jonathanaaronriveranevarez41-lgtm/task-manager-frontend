import type { Task, TaskStatus } from '../models/task.interface';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => boolean | void;
  onEditTask: (id: string, title: string) => void;
}

export function TaskList({
  tasks,
  onToggleStatus,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <ul className="task-list" aria-label="Lista de tareas">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={() =>
            onToggleStatus(
              task.id,
              task.status === 'completed' ? 'pending' : 'completed'
            )
          }
          onDeleteTask={(id) => {
            onDeleteTask(id);
            return true;
          }}
          onEditTask={(id, title) => onEditTask(id, title)}
        />
      ))}
    </ul>
  );
}