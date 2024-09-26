// app/maintenance/page.tsx
"use client";

import React, { useEffect, useState } from "react";

interface Incidencia {
    id_incidencia: number;
    id_edificio: number;
    descripcion_incidencia: string;
    fecha_incidencia: string; // ISO string
    id_usuario: number;
    tipo_incidencia_id_incidencia: number;
    fotografias: string[]; // Array de URLs de las fotografías
}

const Maintenance: React.FC = () => {
    const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIncidencias = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/incidencias');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data: Incidencia[] = await response.json();
                setIncidencias(data);
                setLoading(false);
            } catch (err: any) {
                console.error('Error al obtener las incidencias:', err);
                setError(err.message || 'Error al obtener las incidencias.');
                setLoading(false);
            }
        };

        fetchIncidencias();
    }, []);

    if (loading) {
        return <div>Cargando incidencias...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Lista de Incidencias</h1>
            {incidencias.length === 0 ? (
                <p>No hay incidencias disponibles.</p>
            ) : (
                <div>
                    {incidencias.map(incidencia => (
                        <div key={incidencia.id_incidencia} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '15px', marginBottom: '20px' }}>
                            <h2>Incidencia #{incidencia.id_incidencia}</h2>
                            <p><strong>Edificio ID:</strong> {incidencia.id_edificio}</p>
                            <p><strong>Descripción:</strong> {incidencia.descripcion_incidencia}</p>
                            <p><strong>Fecha:</strong> {new Date(incidencia.fecha_incidencia).toLocaleString()}</p>
                            <p><strong>Usuario ID:</strong> {incidencia.id_usuario}</p>
                            <p><strong>Tipo de Incidencia ID:</strong> {incidencia.tipo_incidencia_id_incidencia}</p>
                            <div>
                                <strong>Fotografías:</strong>
                                {incidencia.fotografias.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                                        {incidencia.fotografias.map((urlFoto, index) => (
                                            <img
                                                key={index}
                                                src={urlFoto}
                                                alt={`Fotografía ${index + 1} de Incidencia ${incidencia.id_incidencia}`}
                                                style={{ width: '200px', height: 'auto', objectFit: 'cover', marginRight: '10px', marginBottom: '10px', borderRadius: '5px' }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay fotografías asociadas.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Maintenance;
