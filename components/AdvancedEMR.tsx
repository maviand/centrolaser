import React, { useState } from 'react';
import { Activity, BrainCircuit, Mic, Save, Edit3, MapPin, Eye, TrendingUp } from 'lucide-react';
import { Patient } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdvancedEMRProps {
  patient: Patient;
}

export const AdvancedEMR: React.FC<AdvancedEMRProps> = ({ patient }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  const handleDictation = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setAiSummary('Paciente refiere visión borrosa en OD de 3 días de evolución. No dolor. Antecedentes de glaucoma. PIO actual: OD 22mmHg, OI 16mmHg. Se observa leve hiperemia conjuntival.');
        setIsRecording(false);
      }, 3000);
    }
  };

  const iopData = [
    { date: 'Ene', OD: 18, OI: 16 },
    { date: 'Feb', OD: 19, OI: 17 },
    { date: 'Mar', OD: 22, OI: 16 },
    { date: 'Abr', OD: 24, OI: 18 },
    { date: 'May', OD: 21, OI: 16 },
    { date: 'Jun', OD: 22, OI: 16 },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">EMR Avanzado & Charting</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Save size={16} /> Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anatomical Charting */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Eye size={18} className="text-blue-600" />
              Charting Anatómico Interactivo
            </h4>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors" title="Dibujar">
                <Edit3 size={16} />
              </button>
              <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors" title="Añadir Pin">
                <MapPin size={16} />
              </button>
            </div>
          </div>
          <div className="h-64 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden">
            {/* Placeholder for 3D Eye Model */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center mix-blend-multiply"></div>
            <div className="relative z-10 text-center">
              <Eye size={48} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-500 font-medium">Modelo 3D Interactivo (Anterior/Posterior)</p>
              <p className="text-xs text-slate-400 mt-1">Toque para añadir hallazgos (ej. úlcera corneal)</p>
            </div>
            {/* Mock Pins */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full shadow-lg border-2 border-white animate-pulse" title="Desgarro Retinal"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-yellow-500 rounded-full shadow-lg border-2 border-white" title="Nevus"></div>
          </div>
        </div>

        {/* AI Clinical Assistant */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <BrainCircuit size={18} className="text-purple-600" />
              Asistente Clínico IA
            </h4>
            <button 
              onClick={handleDictation}
              className={`p-3 rounded-full transition-all shadow-sm ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
              title="Dictado Inteligente"
            >
              <Mic size={20} />
            </button>
          </div>
          
          <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-4 mb-4 min-h-[120px]">
            {isRecording ? (
              <div className="flex items-center gap-2 text-slate-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
                Escuchando...
              </div>
            ) : aiSummary ? (
              <p className="text-slate-700 text-sm leading-relaxed">{aiSummary}</p>
            ) : (
              <p className="text-slate-400 text-sm italic">Presione el micrófono para iniciar el dictado. La IA extraerá síntomas y resumirá la historia clínica.</p>
            )}
          </div>

          {aiSummary && (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
              <h5 className="text-xs font-bold text-purple-800 uppercase mb-2">Puntos Clave Extraídos</h5>
              <ul className="list-disc list-inside text-sm text-purple-900 space-y-1">
                <li>Visión borrosa OD (3 días)</li>
                <li>Sin dolor</li>
                <li>Antecedente: Glaucoma</li>
                <li>PIO Elevada OD (22mmHg)</li>
              </ul>
            </div>
          )}
        </div>

        {/* Longitudinal Tracking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              Seguimiento Longitudinal (Glaucoma & Visión)
            </h4>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>Presión Intraocular (PIO)</option>
              <option>Agudeza Visual</option>
              <option>Campo Visual (MD)</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={iopData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="OD" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Ojo Derecho (OD)" />
                <Line type="monotone" dataKey="OI" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Ojo Izquierdo (OI)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
