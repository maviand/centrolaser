import React, { useState } from 'react';
import { CreditCard, Search, FileText, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Patient } from '../types';

interface ARSBillingProps {
  patient: Patient;
}

export const ARSBilling: React.FC<ARSBillingProps> = ({ patient }) => {
  const [selectedCodes, setSelectedCodes] = useState<any[]>([]);

  const commonCodes = [
    { id: 'CIE-H40.1', desc: 'Glaucoma primario de ángulo abierto', type: 'Diagnóstico', price: 0 },
    { id: 'CIE-H25.1', desc: 'Catarata senil nuclear', type: 'Diagnóstico', price: 0 },
    { id: 'PROC-92004', desc: 'Consulta Oftalmológica Integral', type: 'Procedimiento', price: 2500 },
    { id: 'PROC-92134', desc: 'OCT Macular', type: 'Procedimiento', price: 4500 },
    { id: 'PROC-92083', desc: 'Campo Visual Computarizado', type: 'Procedimiento', price: 3000 }
  ];

  const handleAddCode = (code: any) => {
    if (!selectedCodes.find(c => c.id === code.id)) {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const handleRemoveCode = (id: string) => {
    setSelectedCodes(selectedCodes.filter(c => c.id !== id));
  };

  const total = selectedCodes.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard size={24} className="text-blue-600" />
            Facturación Automatizada (ARS)
          </h3>
          <p className="text-slate-500 text-sm">Selección rápida de códigos CIE-10 y procedimientos para envío a facturación.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Send size={16} /> Enviar a Caja/Facturación
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar código CIE-10 o procedimiento..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-3">Códigos Frecuentes</h4>
          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            {commonCodes.map(code => (
              <div 
                key={code.id}
                onClick={() => handleAddCode(code)}
                className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${code.type === 'Diagnóstico' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {code.type}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-700">{code.id}</span>
                  </div>
                  <p className="text-sm text-slate-600">{code.desc}</p>
                </div>
                {code.price > 0 && (
                  <span className="text-sm font-bold text-slate-900">RD$ {code.price.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Codes & Summary */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
          <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            Resumen de Encuentro
          </h4>
          
          <div className="flex-1 space-y-3 overflow-y-auto mb-6">
            {selectedCodes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <AlertCircle size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No hay códigos seleccionados.</p>
              </div>
            ) : (
              selectedCodes.map(code => (
                <div key={code.id} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-mono text-xs font-bold text-slate-500 mb-0.5">{code.id}</p>
                    <p className="text-sm font-bold text-slate-800">{code.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {code.price > 0 && <span className="text-sm font-bold text-slate-900">RD$ {code.price.toLocaleString()}</span>}
                    <button 
                      onClick={() => handleRemoveCode(code.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-500 uppercase">Subtotal Estimado</span>
              <span className="text-lg font-bold text-slate-900">RD$ {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-slate-500 uppercase">Cobertura ARS ({patient.insuranceProvider || 'N/A'})</span>
              <span className="text-sm font-bold text-emerald-600">- RD$ {(total * 0.8).toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800 uppercase">Diferencia Paciente (Copago)</span>
              <span className="text-xl font-bold text-blue-700">RD$ {(total * 0.2).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
