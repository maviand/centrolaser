import React, { useState } from 'react';
import { Activity, BrainCircuit, Calendar, Clock, TrendingUp, Users, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

type Tab = 'overview' | 'equipment' | 'ai-insights';

const MOCK_UTILIZATION = [
  { time: '08:00', quirófano1: 80, quirófano2: 40, laser: 90 },
  { time: '10:00', quirófano1: 100, quirófano2: 60, laser: 100 },
  { time: '12:00', quirófano1: 60, quirófano2: 20, laser: 50 },
  { time: '14:00', quirófano1: 90, quirófano2: 80, laser: 80 },
  { time: '16:00', quirófano1: 70, quirófano2: 90, laser: 60 },
  { time: '18:00', quirófano1: 30, quirófano2: 40, laser: 20 },
];

const MOCK_EQUIPMENT = [
  { name: 'Excimer Laser', status: 'active', usage: 85, nextMaintenance: '2026-04-15' },
  { name: 'Femtosegundo', status: 'active', usage: 60, nextMaintenance: '2026-05-01' },
  { name: 'Facoemulsificador 1', status: 'maintenance', usage: 0, nextMaintenance: '2026-03-05' },
  { name: 'Facoemulsificador 2', status: 'active', usage: 95, nextMaintenance: '2026-06-10' },
  { name: 'OCT Macular', status: 'active', usage: 75, nextMaintenance: '2026-04-20' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analítica Avanzada & BI</h2>
          <p className="text-slate-500">Optimización de recursos impulsada por IA y utilización de equipos.</p>
        </div>
        
        <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Resumen
            </button>
            <button 
                onClick={() => setActiveTab('equipment')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'equipment' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Equipos
            </button>
             <button 
                onClick={() => setActiveTab('ai-insights')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'ai-insights' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                <span className="flex items-center gap-2">
                    <BrainCircuit size={16} />
                    IA Insights
                </span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-6">
        {activeTab === 'overview' && (
            <>
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
                            <h3 className="text-sm font-bold text-slate-700">Flujo de Pacientes</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">142 <span className="text-sm font-normal text-emerald-600">+12%</span></p>
                        <p className="text-xs text-slate-500 mt-1">Pacientes atendidos hoy</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Clock size={20} /></div>
                            <h3 className="text-sm font-bold text-slate-700">Tiempo de Espera</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">18m <span className="text-sm font-normal text-emerald-600">-4m</span></p>
                        <p className="text-xs text-slate-500 mt-1">Promedio en sala</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Activity size={20} /></div>
                            <h3 className="text-sm font-bold text-slate-700">Uso Quirófano</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">76% <span className="text-sm font-normal text-emerald-600">+5%</span></p>
                        <p className="text-xs text-slate-500 mt-1">Ocupación diaria</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><TrendingUp size={20} /></div>
                            <h3 className="text-sm font-bold text-slate-700">Eficiencia</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">92% <span className="text-sm font-normal text-slate-400">-</span></p>
                        <p className="text-xs text-slate-500 mt-1">Índice de puntualidad</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Utilización de Quirófanos y Láser (Hoy)</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_UTILIZATION} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorQ1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorLaser" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="quirófano1" name="Quirófano 1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorQ1)" />
                                    <Area type="monotone" dataKey="laser" name="Excimer Láser" stroke="#10b981" fillOpacity={1} fill="url(#colorLaser)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Distribución de Consultas por Especialidad</h3>
                        <div className="h-72 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Oftalmología General', value: 400 },
                                            { name: 'Retina', value: 300 },
                                            { name: 'Córnea & Refractiva', value: 300 },
                                            { name: 'Glaucoma', value: 200 },
                                            { name: 'Oculoplastia', value: 100 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {COLORS.map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </>
        )}

        {activeTab === 'equipment' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Estado de Equipos Médicos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Equipo</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Utilización (Semana)</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Próx. Mantenimiento</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_EQUIPMENT.map((eq, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{eq.name}</td>
                                    <td className="px-6 py-4">
                                        {eq.status === 'active' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <CheckCircle size={12} /> Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <AlertTriangle size={12} /> Mantenimiento
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                                                <div 
                                                    className={`h-2 rounded-full ${eq.usage > 80 ? 'bg-red-500' : eq.usage > 50 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${eq.usage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-slate-600 font-medium">{eq.usage}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{eq.nextMaintenance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'ai-insights' && (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-md">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <BrainCircuit size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Motor de Optimización IA</h3>
                            <p className="text-blue-100 text-sm max-w-3xl leading-relaxed">
                                El sistema analiza patrones históricos de citas, tiempos de cirugía y uso de equipos para predecir cuellos de botella y sugerir reasignaciones óptimas en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Insight 1 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <AlertTriangle size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900">Alerta de Sobrecarga (Quirófano 1)</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Se detecta una probabilidad del 85% de retrasos en cascada a partir de las 14:00 debido a una cirugía de cataratas compleja programada.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Sugerencia de IA</p>
                            <p className="text-sm text-slate-800 font-medium mb-3">
                                Mover las 2 cirugías refractivas de las 15:00 al Quirófano 2, que tiene disponibilidad proyectada.
                            </p>
                            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                Aplicar Reasignación
                            </button>
                        </div>
                    </div>

                    {/* Insight 2 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <Zap size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900">Optimización de Agendas</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            El Dr. Gómez tiene un 30% de cancelaciones los viernes por la tarde. El sistema sugiere habilitar "Overbooking Inteligente" para esa franja.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Sugerencia de IA</p>
                            <p className="text-sm text-slate-800 font-medium mb-3">
                                Permitir 2 citas adicionales (Walk-ins o lista de espera) entre las 15:00 y 17:00 los viernes.
                            </p>
                            <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                                Configurar Regla
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
