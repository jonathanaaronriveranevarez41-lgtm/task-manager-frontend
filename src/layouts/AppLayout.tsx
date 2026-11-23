import { Outlet } from 'react-router';
import { AppNavigation } from '../components/AppNavigation';

export function AppLayout() {
  return (
    <div className="app-shell">
      {/* La barra de navegación contiene el menú y el resumen de sesión con el botón de cerrar sesión */}
      <AppNavigation />
      
      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="app-footer__content">
          <p>Administrador de tareas - Frontend EC3</p>
        </div>
      </footer>
    </div>
  );
}