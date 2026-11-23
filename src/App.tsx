import {
  Navigate,
  Route,
  Routes,
} from 'react-router';
import { AdminRoute } from './routes/AdminRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      {/* Rutas públicas de autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Redirección por defecto desde la raíz */}
      <Route
        path="/"
        element={<Navigate to="/tasks" replace />}
      />

      {/* Rutas protegidas que requieren sesión activa */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route
          path="/tasks/:taskId"
          element={<TaskDetailPage />}
        />

        {/* Ruta exclusiva para administradores */}
        <Route element={<AdminRoute />}>
          {/* Aquí puedes agregar futuras vistas de administración, por ejemplo: <Route path="/admin" element={<AdminPage />} /> */}
        </Route>
      </Route>

      {/* Ruta comodín para páginas no encontradas */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;