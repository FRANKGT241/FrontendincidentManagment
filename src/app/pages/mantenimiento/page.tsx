'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import { AlertCircle, Building, Calendar, User, FileText } from "lucide-react";

interface MaintenanceData {
  id_mantenimiento: number;
  id_edificio: number;
  descripcion_mantenimiento: string;
  fecha_mantenimiento: string;
  id_usuario: number;
  tipo_mantenimiento_id_mantenimiento: number;
  fotografias: string[];
  nombre_edificio?: string; // Almacenará el nombre del edificio
  nombre_usuario?: string;  // Almacenará el nombre completo del usuario
  nombre_tipo_mantenimiento?: string; // Almacenará el nombre del tipo de mantenimiento
}

interface EdificioData {
  id_edificio: number;
  nombre_edificio: string;
  descripcion: string;
  latitud: string;
  longitud: string;
}

interface UsuarioData {
  id_usuario: number;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
}

interface TipoMantenimientoData {
  id_tipo_mantenimiento: number;
  nombre_tipo_mantenimiento: string;
}

export default function Maintenance() {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/mantenimiento");
        if (!response.ok) {
          throw new Error("Error fetching maintenance data");
        }
        const data: MaintenanceData[] = await response.json();

        // Fetch para obtener el nombre y detalles de cada edificio
        const fetchEdificioDetails = async (id_edificio: number): Promise<EdificioData | null> => {
          const res = await fetch(`http://localhost:3000/api/edificios?id=${id_edificio}`);
          if (res.ok) {
            const edificioData = await res.json();
            if (Array.isArray(edificioData)) {
              return edificioData[0]; // Si es un array, tomamos el primer edificio
            }
            return edificioData; // Si es un objeto único, lo retornamos
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

        // Fetch para obtener el nombre del tipo de mantenimiento
        const fetchTipoMantenimientoDetails = async (id_tipo_mantenimiento: number): Promise<TipoMantenimientoData | null> => {
          const res = await fetch(`http://localhost:3000/api/tipos-mantenimiento/${id_tipo_mantenimiento}`);
          if (res.ok) {
            const tipoMantenimientoData = await res.json();
            return tipoMantenimientoData;
          }
          return null;
        };

        // Iterar sobre los mantenimientos y agregar el nombre del edificio, usuario y tipo de mantenimiento
        const dataWithDetails = await Promise.all(
          data.map(async (maintenance) => {
            const edificioDetails = await fetchEdificioDetails(maintenance.id_edificio);
            const usuarioDetails = await fetchUsuarioDetails(maintenance.id_usuario);
            const tipoMantenimientoDetails = await fetchTipoMantenimientoDetails(maintenance.tipo_mantenimiento_id_mantenimiento);

            return {
              ...maintenance,
              nombre_edificio: edificioDetails?.nombre_edificio ?? "Edificio desconocido",
              nombre_usuario: usuarioDetails ? `${usuarioDetails.nombre} ${usuarioDetails.apellido}` : "Usuario desconocido",
              nombre_tipo_mantenimiento: tipoMantenimientoDetails?.nombre_tipo_mantenimiento ?? "Tipo de mantenimiento desconocido",
            };
          })
        );

        setMaintenanceData(dataWithDetails);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se ha podido cargar los mantenimientos :/");
        }
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Maintenance Records</h1>
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
      <h1 className="text-2xl font-bold mb-4">Lista de mantenimientos</h1>
      {maintenanceData.length === 0 ? (
        <p>No maintenance records available.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {maintenanceData.map((maintenance) => (
            <Card key={maintenance.id_mantenimiento}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Mantenimiento #{maintenance.id_mantenimiento}</span>
                  <Badge variant="secondary">
                   Tipo de mantenimiento: {maintenance.nombre_tipo_mantenimiento}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="flex items-center text-sm text-gray-500">
                    <Building className="mr-2 h-4 w-4" />
                    Edificio: {maintenance.nombre_edificio ?? "Desconocido"}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(maintenance.fecha_mantenimiento).toLocaleDateString()}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <User className="mr-2 h-4 w-4" />
                    Responsable: {maintenance.nombre_usuario ?? "Desconocido"}
                  </p>
                  <p className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4" />
                    {maintenance.descripcion_mantenimiento}
                  </p>
                  {maintenance.fotografias.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2" >Fotografías</h3>
                      <ScrollArea className="h-40 w-full">
                        <div className="flex space-x-2">
                          {maintenance.fotografias.map((foto, index) => (
                            <div key={index} className="relative h-32 w-32 rounded-md overflow-hidden">
                              <Image
                                src={foto}
                                alt={`Mantenimiento ${maintenance.id_mantenimiento} photo ${index + 1}`}
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
