import React, { useState } from 'react';
import { Appointment, Patient, UserRole, Discipline } from '../types';
import { Clock, MessageCircle, AlertCircle, Calendar, User, Search, ExternalLink, Plus, Video, X, Send } from 'lucide-react';
import { DOCTORS } from '../constants';

interface AppointmentsProps {
  appointments: Appointment[];
  patients: Patient[];
  userRole: UserRole;
  currentUserId?: string;
  onAddAppointment?: (apt: Appointment) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({ appointments, patients, userRole, currentUserId, onAddAppointment }) => {
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterBranch, setFilterBranch] = useState<string>('All');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChatApt, setActiveChatApt] = useState<Appointment | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string, time: string}[]>([
      { sender: 'doctor', text: 'Hola, por favor asegúrese de tener buena conexión para nuestra videollamada.', time: '09:00 AM' }
  ]);
  
  // New Appointment Form State
  const [newApt, setNewApt] = useState<Partial<Appointment>>({
    date: '',
    time: '',
    reason: '',
    doctor: DOCTORS[0],
    discipline: Discipline.General,
    branch: 'Naco',
    isTelemedicine: false
  });
  
  // Filter Logic: If Patient, only show their appointments.
  const relevantAppointments = userRole === 'patient' 
    ? appointments.filter(apt => apt.patientId === currentUserId)
    : appointments;

  const filteredAppointments = relevantAppointments.filter(apt => {
      let dateMatch = true;
      let branchMatch = true;
      let disciplineMatch = true;
      if (filterDate) dateMatch = apt.date === filterDate;
      if (filterBranch !== 'All') branchMatch = apt.branch === filterBranch;
      if (filterDiscipline !== 'All') disciplineMatch = apt.discipline === filterDiscipline;
      return dateMatch && branchMatch && disciplineMatch;
  }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  // Demo tomorrow date
  const demoTomorrowStr = '2024-06-10'; 
  const upcomingReminders = relevantAppointments.filter(apt => apt.date === demoTomorrowStr && apt.status === 'Scheduled');

  const getPatientPhone = (id: string) => {
      return patients.find(p => p.id === id)?.phone || '';
  };

  const sendReminder = (apt: Appointment) => {
    const phone = getPatientPhone(apt.patientId);
    if (!phone) {
        alert("No se encontró número de teléfono para este paciente.");
        return;
    }
    const cleanNumber = phone.replace(/\D/g, '');
    const fullNumber = cleanNumber.length === 10 ? `1${cleanNumber}` : cleanNumber;
    
    const message = apt.isTelemedicine 
      ? `Hola ${apt.patientName}, le recordamos su cita VIRTUAL mañana ${apt.date} a las ${apt.time} con el ${apt.doctor}. Enlace: ${apt.meetingLink}`
      : `Hola ${apt.patientName}, le recordamos su cita en Centro Laser mañana ${apt.date} a las ${apt.time} con el ${apt.doctor}.`;
    window.open(`https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const addToGoogleCalendar = (apt: Appointment) => {
    // Format: YYYYMMDDTHHmmSS
    const startDateTime = new Date(`${apt.date}T${apt.time}`).toISOString().replace(/-|:|\.\d+/g, '');
    const endDateTime = new Date(new Date(`${apt.date}T${apt.time}`).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ''); // Assume 1 hour

    const title = encodeURIComponent(`Cita Centro Laser: ${apt.reason}`);
    const details = encodeURIComponent(`Doctor: ${apt.doctor}\nPaciente: ${apt.patientName}\nMotivo: ${apt.reason}${apt.isTelemedicine ? '\nEnlace: ' + apt.meetingLink : ''}`);
    const location = encodeURIComponent(apt.isTelemedicine ? "Telemedicina (Virtual)" : "Centro Laser, Calle Fantino Falco #3, Naco, Santo Domingo");
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApt.date || !newApt.time || !newApt.reason || !newApt.doctor) {
        alert("Por favor complete todos los campos requeridos.");
        return;
    }

    const patient = userRole === 'patient' 
        ? patients.find(p => p.id === currentUserId)
        : patients[0]; // For demo, if staff creates without selecting patient, use first. In real app, add patient selector.

    if (!patient) return;

    const appointment: Appointment = {
        id: `APT-${Math.floor(Math.random() * 10000)}`,
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        date: newApt.date!,
        time: newApt.time!,
        reason: newApt.reason!,
        doctor: newApt.doctor!,
        status: 'Scheduled',
        discipline: newApt.discipline as Discipline,
        isTelemedicine: newApt.isTelemedicine,
        meetingLink: newApt.isTelemedicine ? `https://meet.google.com/abc-defg-hij` : undefined
    };

    if (onAddAppointment) {
        onAddAppointment(appointment);
    }
    setIsModalOpen(false);
    setNewApt({
        date: '',
        time: '',
        reason: '',
        doctor: DOCTORS[0],
        discipline: Discipline.General,
        isTelemedicine: false
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatMessage.trim()) return;
      
      const newMessage = {
          sender: userRole === 'patient' ? 'patient' : 'doctor',
          text: chatMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage('');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">
                {userRole === 'patient' ? 'Mis Citas' : 'Agenda Médica'}
            </h2>
            <p className="text-slate-500 text-sm">
                {userRole === 'patient' ? 'Próximas consultas y cirugías programadas.' : 'Gestión de consultas y cirugías del centro.'}
            </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
                <select 
                    className="border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    value={filterDiscipline}
                    onChange={(e) => setFilterDiscipline(e.target.value)}
                >
                    <option value="All">Todas las Especialidades</option>
                    {Object.values(Discipline).map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>
            <div className="relative">
                <select 
                    className="border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                >
                    <option value="All">Todas las Sucursales</option>
                    <option value="Naco">Naco</option>
                    <option value="Megacentro">Megacentro</option>
                </select>
            </div>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="date" 
                    className="border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
                <Plus size={16} />
                Nueva Cita
            </button>
        </div>
      </div>

      {/* Automated Reminders Section (Only visible to staff) */}
      {userRole !== 'patient' && upcomingReminders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                      <AlertCircle size={20} />
                      <h3>Recordatorios Pendientes (Próximas 24h)</h3>
                  </div>
                  <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full font-bold">
                      {upcomingReminders.length} Citas
                  </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {upcomingReminders.map(apt => (
                      <div key={apt.id} className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm flex justify-between items-center">
                          <div>
                              <p className="text-sm font-bold text-slate-800">{apt.patientName}</p>
                              <p className="text-xs text-slate-500">{apt.time} - {apt.doctor}</p>
                          </div>
                          <button 
                            onClick={() => sendReminder(apt)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors shadow-sm"
                            title="Enviar WhatsApp"
                          >
                              <MessageCircle size={16} />
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Appointment List */}
      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
          <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha & Hora</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {userRole === 'patient' ? 'Doctor' : 'Paciente'}
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Especialidad</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Motivo</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-slate-900 font-bold">
                                  <Clock size={16} className="text-blue-500" />
                                  {apt.time}
                              </div>
                              <div className="text-xs text-slate-500 ml-6">{apt.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              {userRole === 'patient' ? (
                                  <div className="text-sm font-medium text-slate-900">{apt.doctor}</div>
                              ) : (
                                  <div>
                                    <div className="text-sm font-medium text-slate-900">{apt.patientName}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <User size={10} /> {apt.patientId}
                                    </div>
                                  </div>
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  {apt.discipline}
                               </span>
                               {apt.branch && (
                                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                       {apt.branch}
                                   </span>
                               )}
                               {apt.isTelemedicine && (
                                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                       <Video size={12} className="mr-1" /> Telemedicina
                                   </span>
                               )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {apt.reason}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                  {apt.isTelemedicine && apt.meetingLink && (
                                      <>
                                          <a 
                                            href={apt.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors border border-purple-200"
                                          >
                                              <Video size={14} /> Unirse
                                          </a>
                                          <button
                                              onClick={() => setActiveChatApt(apt)}
                                              className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors border border-blue-200"
                                          >
                                              <MessageCircle size={14} /> Mensajes
                                          </button>
                                      </>
                                  )}
                                  {userRole === 'patient' ? (
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${apt.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {apt.status === 'Scheduled' ? 'Confirmada' : apt.status}
                                    </span>
                                  ) : (
                                    <button 
                                        onClick={() => sendReminder(apt)}
                                        className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors border border-green-200"
                                    >
                                        <MessageCircle size={14} /> Recordar
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => addToGoogleCalendar(apt)}
                                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors"
                                    title="Añadir a Google Calendar"
                                  >
                                      <ExternalLink size={16} />
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
                  {filteredAppointments.length === 0 && (
                      <tr>
                          <td colSpan={5} className="p-12 text-center text-slate-400">
                              <div className="flex flex-col items-center gap-2">
                                  <Calendar size={32} className="opacity-20" />
                                  <p>No hay citas programadas.</p>
                              </div>
                          </td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Agendar Nueva Cita</h3>
                <p className="text-sm text-slate-500">Complete los detalles para programar la consulta.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
                <form id="new-apt-form" onSubmit={handleCreateAppointment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label>
                            <input 
                                type="date"
                                required
                                value={newApt.date}
                                onChange={e => setNewApt({...newApt, date: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Hora</label>
                            <input 
                                type="time"
                                required
                                value={newApt.time}
                                onChange={e => setNewApt({...newApt, time: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Doctor</label>
                        <select 
                            value={newApt.doctor}
                            onChange={e => setNewApt({...newApt, doctor: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {DOCTORS.map(doc => (
                                <option key={doc} value={doc}>{doc}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Sucursal</label>
                        <select 
                            value={newApt.branch}
                            onChange={e => setNewApt({...newApt, branch: e.target.value as 'Naco' | 'Megacentro'})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Naco">Naco</option>
                            <option value="Megacentro">Megacentro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Especialidad</label>
                        <select 
                            value={newApt.discipline}
                            onChange={e => setNewApt({...newApt, discipline: e.target.value as Discipline})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {Object.values(Discipline).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Motivo de Consulta</label>
                        <input 
                            type="text"
                            required
                            placeholder="Ej: Chequeo de rutina, Dolor ocular..."
                            value={newApt.reason}
                            onChange={e => setNewApt({...newApt, reason: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 mt-4">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <Video size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-purple-900">Telemedicina</h4>
                            <p className="text-xs text-purple-700">Consulta virtual por videollamada</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={newApt.isTelemedicine}
                                onChange={e => setNewApt({...newApt, isTelemedicine: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={() => document.getElementById('new-apt-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
                >
                    Confirmar Cita
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {activeChatApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200 flex flex-col h-[600px] max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {userRole === 'patient' ? 'DR' : 'PA'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {userRole === 'patient' ? activeChatApt.doctor : activeChatApt.patientName}
                  </h3>
                  <p className="text-xs text-slate-500">Consulta Virtual - {activeChatApt.date}</p>
                </div>
              </div>
              <button onClick={() => setActiveChatApt(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {chatHistory.map((msg, idx) => {
                    const isMe = (userRole === 'patient' && msg.sender === 'patient') || (userRole !== 'patient' && msg.sender === 'doctor');
                    return (
                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input 
                        type="text"
                        value={chatMessage}
                        onChange={e => setChatMessage(e.target.value)}
                        placeholder="Escriba un mensaje..."
                        className="flex-1 border border-slate-300 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        type="submit"
                        disabled={!chatMessage.trim()}
                        className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white flex items-center justify-center transition-colors shrink-0"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
