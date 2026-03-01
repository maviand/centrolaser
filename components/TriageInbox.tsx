import React, { useState } from 'react';
import { Inbox, AlertTriangle, CheckCircle, MessageCircle, Clock, Calendar, FileText } from 'lucide-react';

export const TriageInbox = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');

  const triageCases = [
    {
      id: 'TR-001',
      patientName: 'Roberto Gómez',
      time: 'Hace 10 min',
      symptoms: 'Ojo muy rojo desde esta mañana, sensación de arenilla y dolor leve.',
      photoUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'TR-002',
      patientName: 'Ana Martínez',
      time: 'Hace 45 min',
      symptoms: 'Veo moscas volantes nuevas desde ayer, sin dolor.',
      photoUrl: null,
      status: 'pending',
      priority: 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bandeja de Triaje Asíncrono</h2>
          <p className="text-slate-500">Gestione las urgencias y consultas enviadas por los pacientes.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 px-2">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <AlertTriangle size={18} />
            Pendientes ({triageCases.filter(c => c.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('resolved')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'resolved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CheckCircle size={18} />
            Resueltos
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {triageCases.map(tCase => (
                <div key={tCase.id} className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:border-blue-300 transition-colors">
                  {tCase.photoUrl ? (
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <img src={tCase.photoUrl} alt="Ojo afectado" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full md:w-48 h-32 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                      <FileText size={32} />
                      <span className="text-sm ml-2">Sin foto</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{tCase.patientName}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock size={14} />
                          <span>{tCase.time}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        tCase.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {tCase.priority === 'high' ? 'Alta Prioridad' : 'Media Prioridad'}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">"{tCase.symptoms}"</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-red-200">
                        <AlertTriangle size={16} />
                        Cita de Emergencia
                      </button>
                      <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-blue-200">
                        <Calendar size={16} />
                        Agendar Consulta
                      </button>
                      <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-emerald-200">
                        <FileText size={16} />
                        Enviar Receta (E-Prescribing)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
