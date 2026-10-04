import { useState } from 'react';

export function TaskForm() {
  const [title, setTitle] = useState('');

  return (
    <section className="panel" aria-labelledby="task-form-title">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Registro</p>
          <h2 id="task-form-title">Nueva tarea</h2>
        </div>
      </div>
      <form className="task-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="task-title">Título de la tarea</label>
        <div className="task-form__row">
          <input
            id="task-title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ejemplo: revisar documentación"
            maxLength={120}
          />
          <button type="submit" disabled={!title.trim()}>
            Agregar tarea
          </button>
        </div>
        <p className="helper-text">
          El formulario se activará en una actividad posterior.
        </p>
      </form>
    </section>
  );
}