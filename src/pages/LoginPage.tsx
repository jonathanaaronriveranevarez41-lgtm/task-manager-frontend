import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router';
import { useAuth } from '../hooks/useAuth';
import {
  getHttpErrorMessage,
  isHttpError,
} from '../services/http.service';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/tasks';

  const handleSubmit = async (
    e: FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      if (isHttpError(err)) {
        setError(getHttpErrorMessage(err));
      } else {
        setError(
          'Ocurrió un error inesperado al iniciar sesión.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      <section className="panel auth-panel">
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">
          Administra tus tareas de forma segura.
        </p>

        {error && (
          <div
            className="message error"
            role="alert"
          >
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <div className="field">
            <label htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="tu@correo.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Iniciando sesión...'
              : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta?{' '}
          <Link to="/register">Regístrate</Link>
        </p>
      </section>
    </main>
  );
}