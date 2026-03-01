import React, { useState } from 'react';
import { UsersRound, Plus, User, FileSignature, Bell, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export const FamilyManagement = () => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'consents'>('profiles');

  const dependents = [
    { id: 'D-001', name: 'Carlos Gómez', relation: 'Hijo', age: 12, nextAppt: '2026-03-15' },
    { id: 'D-002', name: 'María Pérez', relation: 'Madre', age: 75, nextAppt: '2026-04-02' }
  ];

  const consents = [
    { id: 'C-001', dependent: 'María Pérez', procedure: 'Cirugía de Catarata (OD)', status: 'pending', date: '2026-04-05' },
    { id: 'C-002', dependent: 'Carlos Gómez', procedure: 'Examen Pediátrico', status: 'signed', date: '2026-03-15' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Familia y Dependientes</h2>
          <p className="text-slate-500">Gestione perfiles, consentimientos y notificaciones de sus familiares.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus size={18} />
          <span>Añadir Familiar</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 px-2">
          <button 
            onClick={() => setActiveTab('profiles')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profiles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UsersRound size={18} />
            Perfiles Familiares
          </button>
          <button 
            onClick={() => setActiveTab('consents')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'consents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSignature size={18} />
            Consentimientos (Proxy)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profiles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dependents.map(dep => (
                <div key={dep.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{dep.name}</h3>
                        <p className="text-sm text-slate-500">{dep.relation} • {dep.age} años</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                      Cambiar Perfil
                    </button>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={16} className="text-slate-400" />
                      <span>Próxima cita: <span className="font-medium text-slate-900">{dep.nextAppt}</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      <Bell size={12} />
                      Notificaciones Activas
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'consents' && (
            <div className="space-y-4">
              {consents.map(consent => (
                <div key={consent.id} className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${consent.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {consent.status === 'pending' ? <ShieldAlert size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{consent.procedure}</h3>
                      <p className="text-sm text-slate-500">Paciente: {consent.dependent} • Fecha: {consent.date}</p>
                    </div>
                  </div>
                  <div>
                    {consent.status === 'pending' ? (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto">
                        Firmar Consentimiento
                      </button>
                    ) : (
                      <span className="flex items-center gap-2 text-emerald-600 font-medium px-4 py-2 bg-emerald-50 rounded-lg">
                        <CheckCircle size={18} />
                        Firmado Digitalmente
                      </span>
                    )}
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
