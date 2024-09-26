'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import { AlertCircle, Building, Calendar, User, FileText } from "lucide-react";

interface Incidencia {
  id_incidencia: number;
  id_edificio: number;
  descripcion_incidencia: string;
  fecha_incidencia: string;
  id_usuario: number;
  tipo_incidencia_id_incidencia: number;
  fotografias: string[];
  nombre_edificio?: string; // Almacena el nombre del edificio
  nombre_usuario?: string;  // Almacena el nombre completo del usuario
  nombre_tipo_incidencia?: string; // Almacena el nombre del tipo de incidencia
}

interface EdificioData {
  id_edificio: number;
  nombre_edificio: string;
  descripcion: string;
}

interface UsuarioData {
  id_usuario: number;
  nombre: string;
  apellido: string;
}

interface TipoIncidenciaData {
  id_incidencia: number;
  nombre_incidencia: string;
}

export default function Incidence() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/incidencias");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data: Incidencia[] = await response.json();

        // Fetch para obtener el nombre y detalles de cada edificio
        const fetchEdificioDetails = async (id_edificio: number): Promise<EdificioData | null> => {
          const res = await fetch(`http://localhost:3000/api/edificios?id=${id_edificio}`);
          if (res.ok) {
            const edificioData = await res.json();
            return Array.isArray(edificioData) ? edificioData[0] : edificioData;
          }
          return null;
        };

        // Fetch para obtener el nombre completo de cada usuario
        const fetchUsuarioDetails = async (id_usuario: number): Promise<UsuarioData | null> => {
          const res = await fetch(`http://localhost:3000/api/usuarios/${id_usuario}`);
          if (res.ok) {
            const usuarioData = await res.json();
            return usuarioData;
          }
          return null;
        };

        // Fetch para obtener el nombre del tipo de incidencia
        const fetchTipoIncidenciaDetails = async (id_incidencia: number): Promise<TipoIncidenciaData | null> => {
          const res = await fetch(`http://localhost:3000/api/tipos-incidencia/${id_incidencia}`);
          if (res.ok) {
            const tipoIncidenciaData = await res.json();
            return tipoIncidenciaData;
          }
          return null;
        };

        // Iterar sobre las incidencias y agregar el nombre del edificio, usuario y tipo de incidencia
        const dataWithDetails = await Promise.all(
          data.map(async (incidencia) => {
            const edificioDetails = await fetchEdificioDetails(incidencia.id_edificio);
            const usuarioDetails = await fetchUsuarioDetails(incidencia.id_usuario);
            const tipoIncidenciaDetails = await fetchTipoIncidenciaDetails(incidencia.tipo_incidencia_id_incidencia);

            return {
              ...incidencia,
              nombre_edificio: edificioDetails?.nombre_edificio ?? "Edificio desconocido",
              nombre_usuario: usuarioDetails ? `${usuarioDetails.nombre} ${usuarioDetails.apellido}` : "Usuario desconocido",
              nombre_tipo_incidencia: tipoIncidenciaDetails?.nombre_incidencia ?? "Tipo de incidencia desconocido",
            };
          })
        );

        setIncidencias(dataWithDetails);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se ha podido cargar las incidencias :/");
        }
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Lista de Incidencias</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))} 
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <AlertCircle className="mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Incidencias</h1>
      {incidencias.length === 0 ? (
        <p>No hay incidencias disponibles.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incidencias.map(incidencia => (
            <Card key={incidencia.id_incidencia}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Incidencia #{incidencia.id_incidencia}</span>
                  <Badge variant="secondary">
                    Tipo de incidencia: {incidencia.nombre_tipo_incidencia}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="flex items-center text-sm text-gray-500">
                    <Building className="mr-2 h-4 w-4" />
                    Edificio: {incidencia.nombre_edificio ?? "Desconocido"}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(incidencia.fecha_incidencia).toLocaleString()}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <User className="mr-2 h-4 w-4" />
                    Responsable: {incidencia.nombre_usuario ?? "Desconocido"}
                  </p>
                  <p className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4" />
                    {incidencia.descripcion_incidencia}
                  </p>
                  {incidencia.fotografias.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Fotografías:</h3>
                      <ScrollArea className="h-40 w-full">
                        <div className="flex space-x-2">
                          {incidencia.fotografias.map((urlFoto, index) => (
                            <div key={index} className="relative h-32 w-32 rounded-md overflow-hidden">
                              <Image
                                src={urlFoto}
                                alt={`Fotografía ${index + 1} de Incidencia ${incidencia.id_incidencia}`}
                                width={300}  // Establece el ancho en 300px
                                height={300} // Establece la altura en 300px
                                objectFit="cover"
                              />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
