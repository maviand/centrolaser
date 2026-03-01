import React, { useState } from 'react';
import { ShieldCheck, Calculator, Clock, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';

export const ARSConcierge = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'calculator'>('tracker');

  const authorizations = [
    { id: 'AUTH-102', procedure: 'OCT Macular', ars: 'Humano', status: 'approved', date: '2026-03-01', copay: 1500 },
    { id: 'AUTH-103', procedure: 'Cirugía de Catarata', ars: 'Senasa', status: 'pending', date: '2026-03-10', copay: null }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Autorizaciones ARS y Copagos</h2>
          <p className="text-slate-500">Rastree sus autorizaciones y calcule diferencias de pago.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 px-2">
          <button 
            onClick={() => setActiveTab('tracker')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'tracker' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock size={18} />
            Rastreador de Autorizaciones
          </button>
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'calculator' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator size={18} />
            Calculadora de Diferencia (Copago)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'tracker' && (
            <div className="space-y-4">
              {authorizations.map(auth => (
                <div key={auth.id} className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${auth.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        {auth.status === 'approved' ? <CheckCircle size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{auth.procedure}</h3>
                        <p className="text-sm text-slate-500">ARS: {auth.ars} • Solicitud: {auth.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      auth.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {auth.status === 'approved' ? 'Aprobado' : 'En Proceso'}
                    </span>
                  </div>
                  {auth.status === 'approved' && (
                    <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
                      <div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Copago Estimado</p>
                        <p className="font-bold text-blue-900 text-lg">RD$ {auth.copay?.toLocaleString()}</p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                        Pagar Ahora
                      </button>
                    </div>
                  )}
                  {auth.status === 'pending' && (
                    <div className="bg-slate-100 p-4 rounded-lg flex items-center gap-3 text-sm text-slate-600">
                      <AlertCircle size={16} className="text-slate-400" />
                      <span>Estamos esperando respuesta de su ARS. Le notificaremos cuando esté lista.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="max-w-2xl mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calculator className="text-blue-600" size={20} />
                Calculadora de Copago
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seleccione el Procedimiento</label>
                  <select className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option>OCT Macular</option>
                    <option>Topografía Corneal</option>
                    <option>Cirugía LASIK</option>
                    <option>Consulta General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Su ARS Actual</label>
                  <div className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-slate-100 text-slate-500 flex items-center justify-between">
                    <span>Humano (Plan Básico)</span>
                    <ShieldCheck size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Basado en su perfil registrado.</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                    Calcular Diferencia
                    <ChevronRight size={18} />
                  </button>
                </div>
                
                {/* Mock Result */}
                <div className="mt-6 bg-white p-5 rounded-lg border border-emerald-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500">Costo Total:</span>
                    <span className="font-medium text-slate-900">RD$ 5,000</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-500">Cobertura ARS (80%):</span>
                    <span className="font-medium text-emerald-600">- RD$ 4,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="font-bold text-slate-900">Copago Estimado:</span>
                    <span className="text-2xl font-bold text-blue-600">RD$ 1,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
