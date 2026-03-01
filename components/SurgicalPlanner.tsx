import React, { useState } from 'react';
import { Stethoscope, Calendar, Activity, CheckCircle, Clock, Users, FileText, Plus } from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';

export const SurgicalPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'calculos' | 'command-center'>('agenda');

  const upcomingSurgeries = [
    { id: 'S-1', patient: 'Juan Perez', procedure: 'Facoemulsificación + LIO', time: '08:00 AM', room: 'Quirófano 1', doctor: 'Dr. Juan Batlle Logroño', status: 'Preparación' },
    { id: 'S-2', patient: 'Rosa Martinez', procedure: 'LASIK Personalizado', time: '10:30 AM', room: 'Quirófano 2', doctor: 'Dr. Juan Batlle Logroño', status: 'Programada' },
    { id: 'S-3', patient: 'Sofia Hernandez', procedure: 'Trasplante de Córnea', time: '01:00 PM', room: 'Quirófano 1', doctor: 'Dra. María Pérez', status: 'Programada' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Planificador Quirúrgico</h2>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <FileText size={18} />
            <span>Reporte Diario</span>
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Plus size={18} />
            <span>Programar Cirugía</span>
          </button>
        </div>
      </div>

      <div className="flex bg-slate-200 p-1 rounded-lg w-max">
        <button 
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'agenda' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Agenda de Quirófanos
        </button>
        <button 
          onClick={() => setActiveTab('calculos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'calculos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Cálculos Preoperatorios (LIO)
        </button>
        <button 
          onClick={() => setActiveTab('command-center')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'command-center' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Command Center (Pre/Post-Op)
        </button>
      </div>

      {activeTab === 'agenda' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline / Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Programación de Hoy</h3>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-500"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Quirófano 1</span>
                <span className="flex items-center gap-1 text-slate-500"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Quirófano 2</span>
              </div>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                    <th className="p-4 font-medium w-24">Hora</th>
                    <th className="p-4 font-medium">Paciente</th>
                    <th className="p-4 font-medium">Procedimiento</th>
                    <th className="p-4 font-medium">Doctor</th>
                    <th className="p-4 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingSurgeries.map((surgery) => (
                    <tr key={surgery.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-slate-900">{surgery.time}</td>
                      <td className="p-4 text-sm font-bold text-slate-900">{surgery.patient}</td>
                      <td className="p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${surgery.room === 'Quirófano 1' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                          {surgery.procedure}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">{surgery.doctor}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          surgery.status === 'Preparación' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {surgery.status === 'Preparación' ? <Clock size={12} /> : <Calendar size={12} />}
                          {surgery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats & Alerts */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Resumen del Día</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Cirugías</span>
                  <span className="font-bold text-slate-900 text-lg">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Completadas</span>
                  <span className="font-bold text-emerald-600 text-lg">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Pendientes</span>
                  <span className="font-bold text-orange-600 text-lg">6</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-100">
              <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <Activity size={18} />
                Alertas
              </h3>
              <p className="text-sm text-orange-800">
                El paciente de las 10:30 AM (Rosa Martinez) aún no ha completado el pago del deducible.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculos' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Cálculo de Lente Intraocular (LIO)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-700 border-b pb-2">Parámetros Biométricos</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Longitud Axial (AL) mm</label>
                  <input type="number" defaultValue="23.50" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Profundidad CA (ACD) mm</label>
                  <input type="number" defaultValue="3.20" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">K1 (D)</label>
                  <input type="number" defaultValue="43.25" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">K2 (D)</label>
                  <input type="number" defaultValue="44.00" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <h4 className="font-medium text-slate-700 border-b pb-2 mt-6">Selección de Lente</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Modelo de LIO</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                    <option>Alcon AcrySof IQ SN60WF</option>
                    <option>Tecnis Monofocal ZCB00</option>
                    <option>Alcon PanOptix Trifocal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Fórmula</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                    <option>Barrett Universal II</option>
                    <option>SRK/T</option>
                    <option>Holladay 1</option>
                    <option>Haigis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Target Refractivo</label>
                  <input type="number" defaultValue="-0.25" step="0.25" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4">
                Calcular Poder
              </button>
            </div>

            {/* Results */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
              <h4 className="font-medium text-slate-700 border-b pb-2 mb-4">Resultados (Barrett Universal II)</h4>
              
              <div className="flex-1">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200">
                      <th className="pb-2 font-medium">Poder LIO (D)</th>
                      <th className="pb-2 font-medium text-right">Refracción Esperada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2">21.50</td>
                      <td className="py-2 text-right text-slate-500">+0.12</td>
                    </tr>
                    <tr className="bg-emerald-100 border-b border-emerald-200">
                      <td className="py-2 px-2 font-bold text-emerald-900">22.00</td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-900">-0.21</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2">22.50</td>
                      <td className="py-2 text-right text-slate-500">-0.54</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2">23.00</td>
                      <td className="py-2 text-right text-slate-500">-0.88</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Lente Recomendado:</p>
                <p className="text-xl font-bold text-slate-900">Alcon AcrySof IQ SN60WF</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">+22.00 D</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'command-center' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Command Center (Pre/Post-Op)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pre-Op Checklist */}
            <div className="border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                Checklist Pre-Quirúrgico
              </h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm font-medium text-slate-700">Evaluación Cardiovascular</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm font-medium text-slate-700">Analíticas de Laboratorio (Hemograma, Glicemia)</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm font-medium text-slate-700">Consentimiento Informado Firmado (Digital)</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Autorización ARS Aprobada</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Bloque de Quirófano Confirmado</span>
                </label>
              </div>
            </div>

            {/* Post-Op Tracking */}
            <div className="border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600" />
                Seguimiento Post-Operatorio
              </h4>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-emerald-900 text-sm">Adherencia a Gotas (Paciente)</span>
                    <span className="font-bold text-emerald-700">85%</span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-500 uppercase">Próximas Citas de Seguimiento</h5>
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-white">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Control 24 Horas</p>
                      <p className="text-xs text-slate-500">Mañana, 09:00 AM</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Agendada</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-white">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Control 1 Semana</p>
                      <p className="text-xs text-slate-500">Pendiente de agendar</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold">Agendar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
