'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

type Habitacion = {
    id?: number;
    codigo: string;
    descripcion: string;
    cuartos: number;
    baños: number;
    capacidad: number;
    estado: string;
    precio_base: number;
};

export default function UsoMetodos() {
    const [habitacion, setHabitacion] = useState<Habitacion>({
        codigo: '',
        descripcion: '',
        cuartos: 1,
        baños: 1,
        capacidad: 1,
        estado: '',
        precio_base: 0,
    });

    const [buscarId, setBuscarId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const API_URL = 'http://127.0.0.1:8000/api/habitaciones';

    // Manejo de inputs
    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setHabitacion((prev) => ({
            ...prev,
            [name]: name === 'cuartos' || name === 'baños' || name === 'capacidad' || name === 'precio_base'
                ? Number(value)
                : value,
        }));
    }

    // Buscar habitación por id (GET)
    async function buscarHabitacion() {
        if (!buscarId.trim()) {
            alert('Introduce un ID válido para buscar');
            return;
        }
        setLoading(true);
        setError(null);
        setMensaje(null);
        try {
            const res = await fetch(`${API_URL}/${buscarId}`);
            if (res.status === 404) {
                setError('Habitación no encontrada');
                setHabitacion({
                    codigo: '',
                    descripcion: '',
                    cuartos: 1,
                    baños: 1,
                    capacidad: 1,
                    estado: '',
                    precio_base: 0,
                });
                return;
            }
            if (!res.ok) throw new Error('Error al buscar habitación');
            const data = await res.json();
            setHabitacion(data);
            setMensaje('Habitación cargada correctamente');
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    // Crear nueva habitación (POST)
    async function crearHabitacion(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMensaje(null);
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habitacion),
            });
            if (!res.ok) throw new Error('Error al crear habitación');
            const data = await res.json();
            setHabitacion(data);
            setMensaje('Habitación creada con éxito');
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    // Actualizar habitación (PUT)
    async function actualizarHabitacion(e: FormEvent) {
        e.preventDefault();
        if (!habitacion.id) {
            alert('No hay habitación cargada para actualizar');
            return;
        }
        setLoading(true);
        setError(null);
        setMensaje(null);
        try {
            const res = await fetch(`${API_URL}/${habitacion.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habitacion),
            });
            if (!res.ok) throw new Error('Error al actualizar habitación');
            const data = await res.json();
            setHabitacion(data);
            setMensaje('Habitación actualizada con éxito');
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    // Eliminar habitación (DELETE)
    async function eliminarHabitacion() {
        if (!habitacion.id) {
            alert('No hay habitación cargada para eliminar');
            return;
        }
        if (!confirm('¿Seguro que quieres eliminar esta habitación?')) return;
        setLoading(true);
        setError(null);
        setMensaje(null);
        try {
            const res = await fetch(`${API_URL}/${habitacion.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Error al eliminar habitación');
            setHabitacion({
                codigo: '',
                descripcion: '',
                cuartos: 1,
                baños: 1,
                capacidad: 1,
                estado: '',
                precio_base: 0,
            });
            setMensaje('Habitación eliminada con éxito');
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section style={{ maxWidth: 600, margin: 'auto' }}>
            <h2>Buscar Habitación por ID (GET)</h2>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="number"
                    placeholder="ID"
                    value={buscarId}
                    onChange={(e) => setBuscarId(e.target.value)}
                    style={{ marginRight: '1rem', width: '100px' }}
                    min={1}
                />
                <button onClick={buscarHabitacion} disabled={loading}>
                    Buscar
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

            <form onSubmit={habitacion.id ? actualizarHabitacion : crearHabitacion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label>
                    ID:
                    <input type="number" name="id" value={habitacion.id || ''} readOnly />
                </label>

                <label>
                    Código:
                    <input type="text" name="codigo" value={habitacion.codigo} onChange={handleChange} required />
                </label>

                <label>
                    Descripción:
                    <input type="text" name="descripcion" value={habitacion.descripcion} onChange={handleChange} required />
                </label>

                <label>
                    Cuartos:
                    <input type="number" name="cuartos" value={habitacion.cuartos} onChange={handleChange} min={1} required />
                </label>

                <label>
                    Baños:
                    <input type="number" name="baños" value={habitacion.baños} onChange={handleChange} min={1} required />
                </label>

                <label>
                    Capacidad:
                    <input type="number" name="capacidad" value={habitacion.capacidad} onChange={handleChange} min={1} required />
                </label>

                <label>
                    Estado:
                    <input type="text" name="estado" value={habitacion.estado} onChange={handleChange} required />
                </label>

                <label>
                    Precio Base:
                    <input type="number" name="precio_base" value={habitacion.precio_base} onChange={handleChange} min={0} step="0.01" required />
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" disabled={loading}>
                        {habitacion.id ? 'Actualizar (PUT)' : 'Crear (POST)'}
                    </button>
                    {habitacion.id && (
                        <button type="button" onClick={eliminarHabitacion} disabled={loading} style={{ backgroundColor: 'red', color: 'white' }}>
                            Eliminar (DELETE)
                        </button>
                    )}
                </div>
            </form>

            {loading && <p>Cargando...</p>}
        </section>
    );
}
