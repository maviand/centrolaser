import React, { useState } from 'react';
import { Video, Phone, MessageSquare, Calendar, Search, User, Clock, MoreVertical, Send } from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from '../constants';

export const Telehealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultas' | 'mensajes'>('consultas');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const virtualAppointments = MOCK_APPOINTMENTS.filter(apt => apt.isTelemedicine || apt.reason.toLowerCase().includes('virtual'));

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold text-slate-900">Portal de Telemedicina</h2>
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('consultas')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'consultas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Videoconsultas
          </button>
          <button 
            onClick={() => setActiveTab('mensajes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'mensajes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mensajes
          </button>
        </div>
      </div>

      {activeTab === 'consultas' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Upcoming Virtual Appointments */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-900">Próximas Consultas</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {virtualAppointments.length > 0 ? virtualAppointments.map(apt => (
                <div key={apt.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{apt.patientName}</h4>
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Hoy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Clock size={14} />
                    <span>{apt.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-1">{apt.reason}</p>
                  <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Video size={18} />
                    <span>Unirse a la llamada</span>
                  </button>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No hay consultas virtuales programadas para hoy.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Call Area (Placeholder) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-sm border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
            <Video className="w-24 h-24 text-slate-700 mb-4 z-0" />
            <p className="text-slate-400 z-20">Seleccione una consulta para iniciar la videollamada</p>
            
            {/* Call Controls Placeholder */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 opacity-50">
               <button className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors">
                 <Video size={20} />
               </button>
               <button className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors">
                 <Phone size={20} />
               </button>
               <button className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                 <Phone size={24} className="rotate-[135deg]" />
               </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 flex overflow-hidden min-h-0">
          {/* Chat List */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar paciente..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {MOCK_PATIENTS.slice(0, 5).map(patient => (
                <div 
                  key={patient.id} 
                  onClick={() => setSelectedChat(patient.id)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-colors flex items-center gap-3 ${selectedChat === patient.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <img src={patient.avatarUrl} alt={patient.firstName} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{patient.firstName} {patient.lastName}</h4>
                    <p className="text-xs text-slate-500 truncate">Último mensaje de prueba...</p>
                  </div>
                  <div className="text-[10px] text-slate-400">10:42 AM</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <img src={MOCK_PATIENTS.find(p => p.id === selectedChat)?.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-slate-900">{MOCK_PATIENTS.find(p => p.id === selectedChat)?.firstName} {MOCK_PATIENTS.find(p => p.id === selectedChat)?.lastName}</h3>
                      <p className="text-xs text-emerald-500 font-medium">En línea</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                   <div className="flex justify-start">
                     <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[70%] shadow-sm">
                       <p className="text-sm text-slate-700">Buenos días doctor, tengo una duda sobre las gotas que me recetó ayer.</p>
                       <span className="text-[10px] text-slate-400 mt-1 block">10:40 AM</span>
                     </div>
                   </div>
                   <div className="flex justify-end">
                     <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[70%] shadow-sm">
                       <p className="text-sm">Hola. Claro, dígame, ¿cuál es su duda?</p>
                       <span className="text-[10px] text-blue-200 mt-1 block text-right">10:42 AM</span>
                     </div>
                   </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Escriba un mensaje..." 
                      className="flex-1 border border-slate-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shrink-0">
                      <Send size={18} className="ml-1" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-16 h-16 mb-4 text-slate-300" />
                <p>Seleccione una conversación para comenzar a chatear</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
