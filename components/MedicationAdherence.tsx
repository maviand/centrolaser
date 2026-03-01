import React, { useState } from 'react';
import { Pill, Clock, CheckCircle, AlertCircle, PlayCircle, Calendar, Droplet } from 'lucide-react';

export const MedicationAdherence = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'videos'>('schedule');

  const medications = [
    { id: 'M-001', name: 'Vigamox (Moxifloxacino)', type: 'Gota', eye: 'OD', frequency: 'Cada 4 horas', nextDose: '14:00', status: 'pending', color: 'bg-red-100 text-red-600' },
    { id: 'M-002', name: 'Pred Forte (Prednisolona)', type: 'Gota', eye: 'OD', frequency: 'Cada 6 horas', nextDose: '16:00', status: 'pending', color: 'bg-blue-100 text-blue-600' },
    { id: 'M-003', name: 'Systane Ultra', type: 'Gota Lubricante', eye: 'Ambos', frequency: 'Según necesidad', nextDose: 'N/A', status: 'taken', color: 'bg-emerald-100 text-emerald-600' }
  ];

  const videos = [
    { id: 'V-001', title: 'Cómo aplicar gotas oftálmicas correctamente', duration: '2:15', thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
    { id: 'V-002', title: 'Limpieza del ojo post-cirugía', duration: '3:40', thumbnail: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mis Gotas y Recetas</h2>
          <p className="text-slate-500">Gestione su horario de medicación y aprenda a aplicarla correctamente.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 px-2">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'schedule' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock size={18} />
            Horario de Gotas
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'videos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PlayCircle size={18} />
            Videos Instructivos
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Gamified Progress */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">¡Excelente progreso!</h3>
                  <p className="text-blue-100">Ha tomado el 85% de sus dosis a tiempo esta semana.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-400 border-t-white flex items-center justify-center">
                    <span className="text-2xl font-bold">85%</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-200 uppercase tracking-wider font-bold">Racha Actual</p>
                    <p className="text-3xl font-bold">5 Días</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  Dosis de Hoy
                </h4>
                {medications.map(med => (
                  <div key={med.id} className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${med.color}`}>
                        <Droplet size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{med.name}</h3>
                        <p className="text-sm text-slate-500">Ojo: <span className="font-medium text-slate-700">{med.eye}</span> • {med.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Próxima Dosis</p>
                        <p className="font-bold text-slate-900 text-xl">{med.nextDose}</p>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                        med.status === 'taken' 
                          ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      }`}>
                        {med.status === 'taken' ? (
                          <>
                            <CheckCircle size={18} />
                            Aplicada
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Marcar Aplicada
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map(video => (
                <div key={video.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">{video.title}</h4>
                    <p className="text-sm text-slate-500">Aprenda paso a paso con nuestros especialistas.</p>
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
