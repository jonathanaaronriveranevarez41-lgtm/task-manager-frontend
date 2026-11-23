import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1>Gestor de Tareas</h1>
      </div>
      <div className="app-header__user-menu">
        <span className="user-info">
          Hola, <strong>{user.name}</strong>{' '}
          {user.role === 'admin' && (
            <span className="badge-admin">Admin</span>
          )}
        </span>
        <button
          type="button"
          onClick={logout}
          className="button-secondary"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}