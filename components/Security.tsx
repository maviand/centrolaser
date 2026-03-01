import React, { useState } from 'react';
import { ShieldCheck, Users, Key, Activity, Search, Filter, MoreVertical, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'audit'>('roles');

  const roles = [
    { id: 1, name: 'Administrador', users: 3, permissions: 'Acceso Total', status: 'Activo' },
    { id: 2, name: 'Médico Especialista', users: 12, permissions: 'EMR, Citas, Recetas', status: 'Activo' },
    { id: 3, name: 'Recepcionista', users: 8, permissions: 'Citas, Triaje Básico', status: 'Activo' },
    { id: 4, name: 'Facturación', users: 4, permissions: 'ARS, Pagos, Reportes', status: 'Activo' },
    { id: 5, name: 'Técnico Oftálmico', users: 6, permissions: 'Estudios, Triaje', status: 'Activo' },
  ];

  const auditLogs = [
    { id: 'AL-1029', user: 'Dra. María Pérez', action: 'Modificó Historia Clínica', target: 'Paciente P-1001', time: 'Hace 5 min', status: 'success' },
    { id: 'AL-1028', user: 'Carlos (Recepción)', action: 'Eliminó Cita', target: 'Paciente P-1005', time: 'Hace 12 min', status: 'warning' },
    { id: 'AL-1027', user: 'Sistema', action: 'Backup Automático', target: 'Base de Datos', time: 'Hace 1 hora', status: 'success' },
    { id: 'AL-1026', user: 'Usuario Desconocido', action: 'Intento de Acceso Fallido', target: 'Portal Admin', time: 'Hace 2 horas', status: 'danger' },
    { id: 'AL-1025', user: 'Ana (Facturación)', action: 'Aprobó Reclamación ARS', target: 'Factura F-2039', time: 'Hace 3 horas', status: 'success' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" />
            Seguridad & Accesos
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gestión de roles (RBAC) y registro de auditoría empresarial.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Key size={16} /> Políticas de Contraseña
          </button>
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
            <Users size={16} /> Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Users size={16} />
          Roles & Permisos
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Activity size={16} />
          Registro de Auditoría (Logs)
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'roles' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Roles del Sistema</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar rol..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-medium">Nombre del Rol</th>
                  <th className="p-4 font-medium">Usuarios Asignados</th>
                  <th className="p-4 font-medium">Permisos Principales</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{role.name}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                        {role.users} usuarios
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{role.permissions}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle size={14} /> {role.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Logs de Actividad</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar evento..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <button className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Filter size={16} /> Filtros
                </button>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-medium">ID Evento</th>
                  <th className="p-4 font-medium">Usuario / Sistema</th>
                  <th className="p-4 font-medium">Acción Realizada</th>
                  <th className="p-4 font-medium">Objetivo</th>
                  <th className="p-4 font-medium">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-500">{log.id}</td>
                    <td className="p-4 font-medium text-slate-800">{log.user}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {log.status === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
                        {log.status === 'warning' && <AlertTriangle size={14} className="text-orange-500" />}
                        {log.status === 'danger' && <XCircle size={14} className="text-red-500" />}
                        <span className="text-sm text-slate-700">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{log.target}</td>
                    <td className="p-4 text-sm text-slate-500">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
