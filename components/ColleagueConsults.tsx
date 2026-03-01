import React, { useState } from 'react';
import { MessageSquare, Search, User, Paperclip, Send, CheckCircle, Clock, FileText } from 'lucide-react';

export const ColleagueConsults = () => {
  const [activeChat, setActiveChat] = useState<string | null>('C-001');

  const chats = [
    { id: 'C-001', doctor: 'Dra. María Fernández', specialty: 'Retina', lastMessage: 'El OCT muestra edema macular leve...', time: '10:30 AM', unread: 2 },
    { id: 'C-002', doctor: 'Dr. Carlos Gómez', specialty: 'Córnea', lastMessage: '¿Qué opinas de esta topografía?', time: 'Ayer', unread: 0 }
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Consultas Médicas (Red Centro Láser)</h2>
          <p className="text-slate-500">Chat interno encriptado para segundas opiniones y derivaciones.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar colega o especialidad..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${activeChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900">{chat.doctor}</h4>
                  <span className="text-xs text-slate-400">{chat.time}</span>
                </div>
                <p className="text-xs text-blue-600 font-medium mb-1">{chat.specialty}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 truncate pr-4">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{chat.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Dra. María Fernández</h3>
                    <p className="text-xs text-slate-500">Especialista en Retina • En línea</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-100">
                  <Search size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex justify-center">
                  <span className="bg-slate-200 text-slate-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hoy</span>
                </div>
                
                <div className="flex gap-4 max-w-2xl">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                      <p className="text-slate-700 text-sm">Hola, ¿puedes revisar este caso? Paciente masculino, 65 años, diabético tipo 2. Adjunto el OCT macular reciente.</p>
                      <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">OCT_Macular_Paciente_Anon.dcm</p>
                          <p className="text-xs text-slate-500">12 MB • DICOM Viewer</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 ml-1">10:15 AM</span>
                  </div>
                </div>

                <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <User size={16} />
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm">
                      <p className="text-sm">Revisando el OCT ahora mismo. Dame un minuto.</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 mr-1">
                      <span className="text-xs text-slate-400">10:20 AM</span>
                      <CheckCircle size={12} className="text-blue-500" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 max-w-2xl">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                      <p className="text-slate-700 text-sm">El OCT muestra edema macular leve. Sugiero iniciar tratamiento anti-VEGF y control en 4 semanas. ¿Quieres que lo vea en mi consulta?</p>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 ml-1">10:30 AM</span>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-200">
                    <Paperclip size={20} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare size={48} className="mb-4 text-slate-300" />
              <p className="font-medium text-slate-600">Seleccione un chat para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
