import React, { useState } from 'react';
import { Megaphone, Mail, Users, BarChart, Send, Plus, Edit, Trash2, MessageSquare, CalendarClock, PhoneCall, CheckCircle2 } from 'lucide-react';

export const Marketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'recall' | 'campanas' | 'encuestas'>('dispatch');

  const campaigns = [
    { id: 'C-001', name: 'Promoción Cirugía Refractiva Verano', status: 'Activa', sent: 1250, opened: 450, clicked: 120, date: '2024-06-01' },
    { id: 'C-002', name: 'Nuevo Tratamiento MIGS Glaucoma', status: 'Borrador', sent: 0, opened: 0, clicked: 0, date: '-' },
    { id: 'C-003', name: 'Recordatorio Chequeo Anual', status: 'Completada', sent: 3000, opened: 1200, clicked: 300, date: '2024-01-15' },
  ];

  const surveys = [
    { id: 'S-001', name: 'Satisfacción Post-Operatoria LASIK', responses: 45, avgScore: 4.8, status: 'Activa' },
    { id: 'S-002', name: 'Experiencia en Recepción', responses: 120, avgScore: 4.2, status: 'Activa' },
  ];

  const dispatchMessages = [
    { id: 'MSG-001', patient: 'Ana Lopez', channel: 'WhatsApp', message: 'Hola, quiero reagendar mi cita de mañana.', time: '10:30 AM', status: 'unread' },
    { id: 'MSG-002', patient: 'Carlos Ruiz', channel: 'Email', message: '¿Tienen disponibilidad para evaluación de cataratas?', time: '09:15 AM', status: 'read' },
    { id: 'MSG-003', patient: 'Maria Fernandez', channel: 'SMS', message: 'Confirmo mi asistencia a la cirugía.', time: 'Ayer', status: 'resolved' },
  ];

  const recallPatients = [
    { id: 'REC-001', patient: 'Juan Perez', condition: 'Glaucoma', lastVisit: '2023-05-10', nextDue: '2023-11-10', status: 'pending', phone: '809-555-0123' },
    { id: 'REC-002', patient: 'Rosa Martinez', condition: 'Retinopatía Diabética', lastVisit: '2023-08-15', nextDue: '2024-02-15', status: 'contacted', phone: '829-555-0456' },
    { id: 'REC-003', patient: 'Luis Gomez', condition: 'Chequeo Anual', lastVisit: '2022-12-01', nextDue: '2023-12-01', status: 'scheduled', phone: '849-555-0789' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="text-indigo-600" />
            Comunicaciones & CRM
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Bandeja de entrada centralizada, campañas de recall automático y marketing.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
          <Plus size={16} /> 
          <span>Nueva Acción</span>
        </button>
      </div>

      <div className="flex bg-slate-200 p-1 rounded-lg w-max overflow-x-auto">
        <button 
          onClick={() => setActiveTab('dispatch')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'dispatch' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <MessageSquare size={16} /> Dispatch Inbox
        </button>
        <button 
          onClick={() => setActiveTab('recall')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'recall' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <CalendarClock size={16} /> Recall Automático
        </button>
        <button 
          onClick={() => setActiveTab('campanas')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'campanas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Mail size={16} /> Campañas
        </button>
        <button 
          onClick={() => setActiveTab('encuestas')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'encuestas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Users size={16} /> Feedback
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        {activeTab === 'dispatch' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex h-full min-h-[500px]">
            <div className="w-1/3 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800">Mensajes Recientes</h3>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {dispatchMessages.map(msg => (
                  <div key={msg.id} className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${msg.status === 'unread' ? 'bg-indigo-50/50' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${msg.status === 'unread' ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{msg.patient}</h4>
                      <span className="text-xs text-slate-500">{msg.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">{msg.channel}</span>
                    </div>
                    <p className={`text-sm line-clamp-2 ${msg.status === 'unread' ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-2/3 flex flex-col bg-slate-50/50 items-center justify-center text-slate-400">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Selecciona un mensaje para responder</p>
            </div>
          </div>
        )}

        {activeTab === 'recall' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">Pacientes para Recall</h3>
                <p className="text-xs text-slate-500">Basado en diagnósticos y tiempo desde última visita</p>
              </div>
              <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
                Ejecutar Campaña Recall
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-medium">Paciente</th>
                  <th className="p-4 font-medium">Condición</th>
                  <th className="p-4 font-medium">Última Visita</th>
                  <th className="p-4 font-medium">Vencimiento</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recallPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{patient.patient}</p>
                      <p className="text-xs text-slate-500">{patient.phone}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {patient.condition}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{patient.lastVisit}</td>
                    <td className="p-4 text-sm font-medium text-red-600">{patient.nextDue}</td>
                    <td className="p-4">
                      {patient.status === 'pending' && <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><CalendarClock size={14}/> Pendiente</span>}
                      {patient.status === 'contacted' && <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600"><PhoneCall size={14}/> Contactado</span>}
                      {patient.status === 'scheduled' && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 size={14}/> Agendado</span>}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                        Contactar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'campanas' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-4 font-medium">Nombre de la Campaña</th>
                    <th className="p-4 font-medium">Estado</th>
                    <th className="p-4 font-medium text-center">Enviados</th>
                    <th className="p-4 font-medium text-center">Aperturas</th>
                    <th className="p-4 font-medium text-center">Clics</th>
                    <th className="p-4 font-medium">Fecha</th>
                    <th className="p-4 font-medium text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-bold text-slate-900">{campaign.name}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'Activa' ? 'bg-emerald-100 text-emerald-800' : 
                          campaign.status === 'Borrador' ? 'bg-slate-100 text-slate-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-center text-slate-600">{campaign.sent}</td>
                      <td className="p-4 text-sm text-center text-slate-600">{campaign.opened}</td>
                      <td className="p-4 text-sm text-center text-slate-600">{campaign.clicked}</td>
                      <td className="p-4 text-sm text-slate-500">{campaign.date}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-indigo-50" title="Editar">
                            <Edit size={16} />
                          </button>
                          {campaign.status === 'Borrador' && (
                            <button className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors rounded-md hover:bg-emerald-50" title="Enviar">
                              <Send size={16} />
                            </button>
                          )}
                          <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'encuestas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {surveys.map(survey => (
              <div key={survey.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">{survey.name}</h3>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {survey.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Respuestas</p>
                    <p className="text-2xl font-bold text-slate-900">{survey.responses}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Puntuación Media</p>
                    <p className="text-2xl font-bold text-indigo-600">{survey.avgScore} / 5.0</p>
                  </div>
                </div>
                <button className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <BarChart size={18} />
                  <span>Ver Resultados Detallados</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
