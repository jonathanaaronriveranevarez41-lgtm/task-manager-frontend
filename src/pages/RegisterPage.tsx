import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { registerUser } from '../services/auth.api.service';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      // Envía exactamente los campos requeridos por el backend: name, email, password
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Si el registro es exitoso, redirigimos al login
      navigate('/login');
    } catch (err: any) {
      // Si el backend devuelve un error estructurado con issues de validación
      if (err?.issues && Array.isArray(err.issues)) {
        const newFieldErrors: Record<string, string> = {};
        err.issues.forEach((issue: { field: string; message: string }) => {
          newFieldErrors[issue.field] = issue.message;
        });
        setFieldErrors(newFieldErrors);
        setError('Por favor, corrige los campos marcados.');
      } else {
        setError(err?.message || 'Ocurrió un error al registrar la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="panel auth-panel">
        <h2>Crear cuenta</h2>
        <p className="helper-text">Regístrate para comenzar a gestionar tus tareas.</p>

        {error && (
          <div className="error-banner" style={{ color: '#b91c1c', background: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fecaca', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tu nombre completo (2 a 80 caracteres)"
            />
            {fieldErrors.name && <span className="field-error" style={{ color: '#b91c1c', fontSize: '0.8rem' }}>{fieldErrors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
            {fieldErrors.email && <span className="field-error" style={{ color: '#b91c1c', fontSize: '0.8rem' }}>{fieldErrors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo de caracteres requerido"
            />
            {fieldErrors.password && <span className="field-error" style={{ color: '#b91c1c', fontSize: '0.8rem' }}>{fieldErrors.password}</span>}
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;