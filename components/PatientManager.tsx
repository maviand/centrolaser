import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, Phone, Mail, ArrowLeft, Calendar, MessageCircle, Upload, X, ChevronUp, ChevronDown, CheckCircle, FileText, Microscope, Clipboard, Activity, BrainCircuit, ScanEye, User, CreditCard, Stethoscope, AlertCircle, Clock, History, FileSpreadsheet, Eye, Download, Loader2, MapPin } from 'lucide-react';
import { Patient, PatientStatus, Discipline, Appointment, CommunicationLog, MedicalRecord } from '../types';
import { DOCTORS } from '../constants';
import { generateOSDIPDF } from '../pdfGenerator';
import { PatientRegistration } from './PatientRegistration';
import { AdvancedEMR } from './AdvancedEMR';
import { DICOMViewer } from './DICOMViewer';
import { DigitalPrescription } from './DigitalPrescription';
import { ARSBilling } from './ARSBilling';

// Component to render a Clinical History Record (Consultation)
const ConsultationCard: React.FC<{ record: MedicalRecord }> = ({ record }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Stethoscope size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">Evento N. {record.eventNumber || record.id}</h4>
                    <p className="text-xs text-slate-500">{record.date} {record.time ? `- ${record.time}` : ''}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{record.doctor}</p>
                <p className="text-xs text-slate-500 uppercase">{record.type}</p>
            </div>
        </div>

        <div className="p-6 space-y-6">
            {/* Clinical Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Motivo Consulta</h5>
                    <p className="text-sm text-slate-800 font-medium">{record.reason || record.title}</p>
                </div>
                <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Enfermedad Actual</h5>
                    <p className="text-sm text-slate-800">{record.currentIllness || 'Ninguna'}</p>
                </div>
            </div>

            {/* Physical Exam Table */}
            {record.physicalExam && record.physicalExam.length > 0 && (
                <div>
                    <h5 className="text-xs font-bold text-blue-700 uppercase mb-3 bg-blue-50 inline-block px-2 py-1 rounded">Examen Físico</h5>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                                    <th className="py-2 pr-4 font-bold">Estructura</th>
                                    <th className="py-2 px-4 font-bold text-blue-600">OD (Derecho)</th>
                                    <th className="py-2 pl-4 font-bold text-blue-600">OI (Izquierdo)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {record.physicalExam.map((exam, idx) => (
                                    <tr key={idx}>
                                        <td className="py-2 pr-4 font-medium text-slate-700">{exam.name}</td>
                                        <td className="py-2 px-4 text-slate-600">{exam.od}</td>
                                        <td className="py-2 pl-4 text-slate-600">{exam.oi}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Diagnoses Table */}
            {record.diagnoses && record.diagnoses.length > 0 && (
                <div>
                    <h5 className="text-xs font-bold text-blue-700 uppercase mb-3 bg-blue-50 inline-block px-2 py-1 rounded">Impresión Diagnóstica</h5>
                    <div className="overflow-x-auto rounded-lg border border-slate-100">
                        <table className="w-full text-sm text-left bg-slate-50/50">
                            <thead>
                                <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3">CIE-10</th>
                                    <th className="p-3">Diagnóstico</th>
                                    <th className="p-3 text-right">Ojo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {record.diagnoses.map((dx, idx) => (
                                    <tr key={idx}>
                                        <td className="p-3 text-slate-500 font-mono text-xs">{dx.date}</td>
                                        <td className="p-3 font-bold text-slate-700">{dx.code}</td>
                                        <td className="p-3 text-slate-800">{dx.description}</td>
                                        <td className="p-3 text-right font-bold text-blue-600">{dx.eye}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Analysis & Plan */}
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                <h5 className="text-xs font-bold text-yellow-800 uppercase mb-2">Análisis y Plan</h5>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {record.analysisPlan || record.notes}
                </p>
            </div>
        </div>
    </div>
);

interface PatientManagerProps {
  patients: Patient[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onAddPatient: (patient: Patient) => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

type SortKey = 'lastName' | 'lastInteraction' | 'balance';
type SortDirection = 'asc' | 'desc';

export const PatientManager: React.FC<PatientManagerProps> = ({ patients, appointments, onAddAppointment, onAddPatient, onUpdatePatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const csvInputRef = useRef<HTMLInputElement>(null);

  // Feedback State
  const [patientSuccess, setPatientSuccess] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('All');
  const [filterId, setFilterId] = useState<string>('');
  const [filterMinBalance, setFilterMinBalance] = useState<string>('');
  const [filterMaxBalance, setFilterMaxBalance] = useState<string>('');
  const [filterLastCommFrom, setFilterLastCommFrom] = useState<string>('');
  const [filterLastCommTo, setFilterLastCommTo] = useState<string>('');

  // New Appointment Modal State
  const [showApptModal, setShowApptModal] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState<{show: boolean, details?: Appointment} | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'info'|'history'|'dry_eye'|'comms'|'labs'|'exams'|'procedures'|'ai'|'audit'>('info');
  const [newCommNote, setNewCommNote] = useState('');
  const [newCommType, setNewCommType] = useState<CommunicationLog['type']>('Call');

  // Helper to get raw date string for logic
  const getLastCommunicationRaw = (p: Patient): string | null => {
      if (!p.communicationLogs || p.communicationLogs.length === 0) return null;
      const sorted = [...p.communicationLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return sorted[0].date;
  };

  const getLastCommunicationDateDisplay = (p: Patient) => {
      const date = getLastCommunicationRaw(p);
      return date || 'N/A';
  };

  const getStatusColor = (status: PatientStatus) => {
      switch(status) {
          case PatientStatus.New: return 'bg-blue-100 text-blue-700 border-blue-200';
          case PatientStatus.InEvaluation: return 'bg-purple-100 text-purple-700 border-purple-200';
          case PatientStatus.PreOp: return 'bg-orange-100 text-orange-700 border-orange-200';
          case PatientStatus.Scheduled: return 'bg-green-100 text-green-700 border-green-200';
          case PatientStatus.PostOp: return 'bg-cyan-100 text-cyan-700 border-cyan-200';
          case PatientStatus.Discharged: return 'bg-slate-100 text-slate-600 border-slate-200';
          default: return 'bg-slate-100 text-slate-600 border-slate-200';
      }
  };

  // 1. Filtering Logic
  let processedPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const cleanTerm = term.replace(/\D/g, ''); // For phone matching (digits only)
    const patientPhoneClean = p.phone.replace(/\D/g, '');

    // Search: Name, ID, Cedula, DOB, Status, Phone, Email, Discipline
    const matchesSearch = 
        p.firstName.toLowerCase().includes(term) || 
        p.lastName.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        (p.cedula && p.cedula.includes(term)) || 
        p.dob.includes(term) || 
        p.status.toLowerCase().includes(term) ||
        p.discipline.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        (cleanTerm.length > 0 && patientPhoneClean.includes(cleanTerm)) || // Fuzzy phone match
        p.email.toLowerCase().includes(term);

    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesDiscipline = filterDiscipline === 'All' || p.discipline === filterDiscipline;
    const matchesId = filterId === '' || p.id.toLowerCase().includes(filterId.toLowerCase());
    const matchesMinBal = filterMinBalance === '' || p.balance >= Number(filterMinBalance);
    const matchesMaxBal = filterMaxBalance === '' || p.balance <= Number(filterMaxBalance);

    // Date Range Filter for Last Communication
    let matchesDateRange = true;
    if (filterLastCommFrom || filterLastCommTo) {
        const lastComm = getLastCommunicationRaw(p);
        if (!lastComm) {
            matchesDateRange = false; // If filtering by date and no comms, exclude
        } else {
            const commDate = new Date(lastComm).getTime();
            const fromDate = filterLastCommFrom ? new Date(filterLastCommFrom).getTime() : -Infinity;
            const toDate = filterLastCommTo ? new Date(filterLastCommTo).getTime() : Infinity;
            matchesDateRange = commDate >= fromDate && commDate <= toDate;
        }
    }

    return matchesSearch && matchesStatus && matchesDiscipline && matchesId && matchesMinBal && matchesMaxBal && matchesDateRange;
  });

  // 2. Sorting Logic
  if (sortConfig !== null) {
      processedPatients.sort((a, b) => {
          let aValue: any = '';
          let bValue: any = '';

          if (sortConfig.key === 'lastName') {
              aValue = a.lastName.toLowerCase();
              bValue = b.lastName.toLowerCase();
          } else if (sortConfig.key === 'balance') {
              aValue = a.balance;
              bValue = b.balance;
          } else if (sortConfig.key === 'lastInteraction') {
              aValue = getLastCommunicationRaw(a) || '';
              bValue = getLastCommunicationRaw(b) || '';
          }

          if (aValue < bValue) {
              return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
              return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
      });
  }

  const handleSort = (key: SortKey) => {
      let direction: SortDirection = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
      if (sortConfig?.key !== key) return <div className="w-4 h-4" />; // Placeholder
      return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const getWhatsAppLink = (phone: string) => {
      const cleanNumber = phone.replace(/\D/g, '');
      const fullNumber = cleanNumber.length === 10 ? `1${cleanNumber}` : cleanNumber;
      return `https://wa.me/${fullNumber}`;
  };

  const sendPushNotification = (doctorName: string, patientName: string, date: string, time: string) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(`Nueva Cita: ${doctorName}`, {
        body: `Paciente: ${patientName}\nFecha: ${date} a las ${time}`,
        icon: 'https://i.imgur.com/DE2gOJW.jpeg'
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            new Notification(`Nueva Cita: ${doctorName}`, {
                body: `Paciente: ${patientName}\nFecha: ${date} a las ${time}`,
                icon: 'https://i.imgur.com/DE2gOJW.jpeg'
              });
        }
      });
    }
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          // In a real app, parse the CSV here.
          // For now, we simulate success.
          setPatientSuccess("Pacientes importados correctamente desde CSV (Simulación).");
          setTimeout(() => setPatientSuccess(null), 4000);
          event.target.value = ''; // Reset input
      }
  };

  const handleUpdateStatus = (newStatus: PatientStatus) => {
      if(selectedPatient) {
          const updated = { 
              ...selectedPatient, 
              status: newStatus,
              auditLog: [
                  {
                      id: `LOG-${Date.now()}`,
                      date: new Date().toLocaleString(),
                      action: 'Cambio de Estado',
                      details: `Estado cambiado de ${selectedPatient.status} a ${newStatus}`,
                      user: 'Staff Actual'
                  },
                  ...(selectedPatient.auditLog || [])
              ]
           };
          onUpdatePatient(updated);
          setSelectedPatient(updated);
          setPatientSuccess("Paciente actualizado correctamente.");
          setTimeout(() => setPatientSuccess(null), 3000);
      }
  };

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!selectedPatient) return;

    const newAppt: Appointment = {
      id: `APT-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      reason: formData.get('reason') as string,
      doctor: formData.get('doctor') as string,
      status: 'Scheduled',
      discipline: selectedPatient.discipline
    };
    onAddAppointment(newAppt);
    setShowApptModal(false);
    
    // Notify Staff
    sendPushNotification(newAppt.doctor, newAppt.patientName, newAppt.date, newAppt.time);

    // Simulate Notification to Patient (Console/Alert in this demo context)
    // In a real app, this would trigger an email or SMS via backend
    console.log(`[SIMULACIÓN] Notificación enviada a paciente ${selectedPatient.email}: Su cita ha sido confirmada.`);

    setAppointmentSuccess({ show: true, details: newAppt });
    setTimeout(() => {
        setAppointmentSuccess(null);
    }, 6000);
  };

  const handleAddCommLog = () => {
    if (!selectedPatient || !newCommNote) return;
    const newLog: CommunicationLog = {
      id: `CL-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: newCommType,
      notes: newCommNote,
      staffName: 'Staff Actual' 
    };
    const updatedPatient = {
      ...selectedPatient,
      communicationLogs: [newLog, ...(selectedPatient.communicationLogs || [])]
    };
    onUpdatePatient(updatedPatient);
    setSelectedPatient(updatedPatient);
    setNewCommNote('');
  };

  const handleDownload = async (assessment: any) => {
      if(!selectedPatient) return;
      setIsGeneratingPdf(assessment.id);
      await generateOSDIPDF(assessment, selectedPatient);
      setIsGeneratingPdf(null);
  };

  if (selectedPatient) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        {/* Detail View Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row items-start md:items-center gap-4">
          <button 
            onClick={() => setSelectedPatient(null)}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-4 flex-1 w-full">
            <img 
                src={selectedPatient.avatarUrl || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white shadow-sm object-cover bg-slate-200" 
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 truncate">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-slate-500 mt-1">
                <span>{selectedPatient.id}</span>
                {selectedPatient.cedula && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono hidden sm:inline-block">{selectedPatient.cedula}</span>
                )}
                <span className="text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-full text-xs truncate max-w-[150px]">{selectedPatient.discipline}</span>
                
                {/* Editable Status in Header */}
                <select 
                    value={selectedPatient.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as PatientStatus)}
                    className={`text-xs font-bold px-2 py-1 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer ${
                         selectedPatient.status === PatientStatus.Scheduled ? 'bg-green-100 text-green-700' :
                         selectedPatient.status === PatientStatus.PreOp ? 'bg-orange-100 text-orange-700' :
                         selectedPatient.status === PatientStatus.PostOp ? 'bg-cyan-100 text-cyan-700' :
                         selectedPatient.status === PatientStatus.InEvaluation ? 'bg-purple-100 text-purple-700' :
                         'bg-slate-100 text-slate-700'
                    }`}
                >
                    {Object.values(PatientStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end">
            <button 
                onClick={() => setShowApptModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm flex-1 md:flex-initial justify-center"
            >
                <Calendar size={16} /> <span className="hidden sm:inline">Agendar Cita</span><span className="sm:hidden">Agendar</span>
            </button>
            <div className="text-right px-4 py-2 bg-white rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500 uppercase font-bold">Balance</div>
                <div className={`text-lg font-bold ${selectedPatient.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    RD$ {selectedPatient.balance.toLocaleString()}
                </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="hidden md:block w-80 border-r border-slate-100 p-6 overflow-y-auto space-y-6 bg-white">
                 <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Contacto Rápido</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-700 p-2 bg-slate-50 rounded-lg">
                            <Phone size={18} />
                            <span className="font-mono text-sm">{selectedPatient.phone}</span>
                            <a 
                                href={getWhatsAppLink(selectedPatient.phone)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-auto bg-green-600 hover:bg-green-700 text-white px-[6px] py-[3px] rounded-md shadow-sm transition-colors border border-green-600 flex items-center gap-1"
                                title="Abrir WhatsApp"
                            >
                                <MessageCircle size={14} />
                            </a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 p-2 bg-slate-50 rounded-lg">
                            <Mail size={18} />
                            <span className="text-sm truncate">{selectedPatient.email}</span>
                        </div>
                        {selectedPatient.address && (
                            <div className="flex items-start gap-3 text-slate-700 p-2 bg-slate-50 rounded-lg">
                                <MapPin size={18} className="mt-0.5 shrink-0" />
                                <span className="text-sm">{selectedPatient.address}</span>
                            </div>
                        )}
                    </div>
                </div>
                 <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Seguro Médico</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="font-bold text-blue-900 text-sm">{selectedPatient.insuranceProvider || 'Privado'}</p>
                        <p className="font-mono text-slate-600 text-xs mt-1">{selectedPatient.policyNumber || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-50">
                <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto">
                    {[
                        { id: 'info', label: 'Información General', icon: null },
                        { id: 'history', label: 'Historial Clínico', icon: FileText },
                        { id: 'advanced-emr', label: 'EMR Avanzado', icon: BrainCircuit },
                        { id: 'dicom', label: 'Visor DICOM', icon: ScanEye },
                        { id: 'prescription', label: 'Recetario', icon: FileSpreadsheet },
                        { id: 'billing', label: 'Facturación ARS', icon: CreditCard },
                        { id: 'dry_eye', label: 'Superficie Ocular', icon: Eye },
                        { id: 'ai', label: 'IA Screening', icon: BrainCircuit },
                        { id: 'labs', label: 'Laboratorios', icon: Microscope },
                        { id: 'exams', label: 'Exámenes', icon: Clipboard },
                        { id: 'procedures', label: 'Procedimientos', icon: Activity },
                        { id: 'comms', label: 'Bitácora', icon: MessageCircle },
                        { id: 'audit', label: 'Audit Log', icon: History }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                                activeTab === tab.id 
                                ? 'border-blue-600 text-blue-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.icon && <tab.icon size={16} />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div className="md:hidden space-y-4 mb-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-2 mb-2 font-bold text-slate-700"><Phone size={16}/> Contacto</div>
                                    <div className="flex justify-between items-center">
                                        <span>{selectedPatient.phone}</span>
                                        <a 
                                            href={getWhatsAppLink(selectedPatient.phone)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="bg-green-600 hover:bg-green-700 text-white px-[6px] py-[3px] rounded-md flex items-center gap-1 shadow-sm"
                                        >
                                            <MessageCircle size={14} /> WhatsApp
                                        </a>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-600">{selectedPatient.email}</div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4">Notas Administrativas</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{selectedPatient.notes || 'No hay notas registradas.'}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* ... Other tabs ... */}
                    {activeTab === 'advanced-emr' && <AdvancedEMR patient={selectedPatient} />}
                    {activeTab === 'dicom' && <DICOMViewer patient={selectedPatient} />}
                    {activeTab === 'prescription' && <DigitalPrescription patient={selectedPatient} />}
                    {activeTab === 'billing' && <ARSBilling patient={selectedPatient} />}
                    
                    {/* DRY EYE TAB (NEW) */}
                    {activeTab === 'dry_eye' && (
                         <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-800 text-lg">Historial de Evaluaciones OSDI</h3>
                                <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    Ocular Surface Disease Index
                                </div>
                            </div>
                            
                            {selectedPatient.dryEyeAssessments && selectedPatient.dryEyeAssessments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedPatient.dryEyeAssessments.map(assessment => (
                                        <div key={assessment.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                            {/* ... Assessment Content ... */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fecha</p>
                                                    <p className="font-mono text-slate-700">{assessment.date}</p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                                                    assessment.severity === 'Normal' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    assessment.severity === 'Leve' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    assessment.severity === 'Moderado' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                    {assessment.severity}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-end gap-2 mb-4">
                                                <span className="text-4xl font-bold text-slate-900">{assessment.osdiScore}</span>
                                                <span className="text-sm text-slate-500 mb-1">/ 100 Puntos</span>
                                            </div>

                                            <div className="border-t border-slate-100 pt-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold text-slate-500 uppercase">Síntomas Reportados</p>
                                                    <button 
                                                        onClick={() => handleDownload(assessment)}
                                                        disabled={isGeneratingPdf === assessment.id}
                                                        className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {isGeneratingPdf === assessment.id ? <Loader2 className="animate-spin" size={14}/> : <Download size={14} />} 
                                                        Descargar PDF
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {assessment.symptoms.map((sym, i) => (
                                                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                                            {sym}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                                    <Eye size={48} className="text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-slate-900 font-bold">Sin Datos</h3>
                                    <p className="text-slate-500 text-sm">El paciente no ha realizado el test OSDI aún.</p>
                                </div>
                            )}
                         </div>
                    )}
                    
                    {/* ... Other Tabs ... */}
                    
                    {/* AUDIT LOG TAB */}
                    {activeTab === 'audit' && (
                        <div className="space-y-4">
                            {selectedPatient.auditLog && selectedPatient.auditLog.length > 0 ? (
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Acción</th>
                                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Detalles</th>
                                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Usuario</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedPatient.auditLog.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{log.date}</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{log.action}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">{log.details}</td>
                                                    <td className="px-4 py-3 text-xs font-medium text-slate-500">{log.user}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                    No hay registros de auditoría.
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>

        {/* ... Modals (Schedule, etc) ... */}
        {showApptModal && (
            // ... modal content
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Agendar Cita</h3>
                        <button onClick={() => setShowApptModal(false)}><X size={20} className="text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
                       {/* ... form fields ... */}
                       <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label>
                                <input type="date" name="date" required className="w-full border border-slate-300 rounded p-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Hora</label>
                                <input type="time" name="time" required className="w-full border border-slate-300 rounded p-2 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Doctor</label>
                            <select name="doctor" className="w-full border border-slate-300 rounded p-2 text-sm">
                                {DOCTORS.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Motivo / Procedimiento</label>
                            <input type="text" name="reason" required placeholder="Ej: Consulta General" className="w-full border border-slate-300 rounded p-2 text-sm" />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm">Confirmar Cita</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* ... Appointment Success Toast ... */}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col relative">
      {/* ... List Header and Filters ... */}
      <div className="p-4 md:p-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Gestión de Pacientes (CRM)</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={csvInputRef}
                onChange={handleCSVImport}
            />
            <button 
                onClick={() => csvInputRef.current?.click()}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm w-full md:w-auto justify-center"
            >
                <FileSpreadsheet size={18} />
                Importar CSV
            </button>
            <button 
                onClick={() => setIsAddingPatient(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm w-full md:w-auto justify-center"
            >
                <Plus size={18} />
                Registrar Paciente
            </button>
          </div>
        </div>
        
        {/* ... Filters ... */}
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                    type="text" 
                    placeholder="Nombre, ID, Disciplina..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                >
                    <Filter size={18} />
                    Filtros
                </button>
            </div>
            {/* ... Filter Panel ... */}
            {showFilters && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">ID de Paciente</label>
                        <input 
                            type="text" 
                            placeholder="Ej: P-1001"
                            value={filterId}
                            onChange={(e) => setFilterId(e.target.value)}
                            className="w-full border border-slate-300 rounded p-2 text-sm"
                         />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                        >
                            <option value="All">Todos</option>
                            {Object.values(PatientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Especialidad</label>
                        <select 
                            value={filterDiscipline}
                            onChange={(e) => setFilterDiscipline(e.target.value)}
                            className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                        >
                            <option value="All">Todas</option>
                            {Object.values(Discipline).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Balance (Min - Max)</label>
                         <div className="flex gap-2">
                             <input 
                                type="number" 
                                placeholder="0"
                                value={filterMinBalance}
                                onChange={(e) => setFilterMinBalance(e.target.value)}
                                className="w-full border border-slate-300 rounded p-2 text-sm"
                             />
                             <input 
                                type="number" 
                                placeholder="Max"
                                value={filterMaxBalance}
                                onChange={(e) => setFilterMaxBalance(e.target.value)}
                                className="w-full border border-slate-300 rounded p-2 text-sm"
                             />
                         </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Última Comunicación</label>
                        <div className="flex gap-2">
                            <input 
                                type="date" 
                                value={filterLastCommFrom}
                                onChange={(e) => setFilterLastCommFrom(e.target.value)}
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                placeholder="Desde"
                            />
                            <input 
                                type="date" 
                                value={filterLastCommTo}
                                onChange={(e) => setFilterLastCommTo(e.target.value)}
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                placeholder="Hasta"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-auto">
        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 sticky top-0 z-10">
            {/* ... Table Headers ... */}
            <tr>
              <th 
                className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors group"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center gap-1">
                    Paciente {getSortIcon('lastName')}
                </div>
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Especialidad</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th 
                className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors group"
                onClick={() => handleSort('lastInteraction')}
              >
                 <div className="flex items-center gap-1">
                    Últ. Interacción {getSortIcon('lastInteraction')}
                 </div>
              </th>
              {/* ... other headers ... */}
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
              <th 
                className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors group"
                onClick={() => handleSort('balance')}
              >
                 <div className="flex items-center gap-1">
                    Balance {getSortIcon('balance')}
                 </div>
              </th>
              {/* ... other headers ... */}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedPatients.map((patient) => (
              <tr 
                key={patient.id} 
                onClick={() => setSelectedPatient(patient)}
                className="even:bg-slate-50 hover:bg-blue-50 transition-colors group cursor-pointer"
              >
                {/* ... Patient Data Cells ... */}
                <td className="px-6 py-4 whitespace-nowrap max-w-[250px]">
                  <div className="flex items-center gap-3">
                    <img src={patient.avatarUrl || 'https://via.placeholder.com/150'} alt="" className="w-10 h-10 rounded-full object-cover bg-slate-200 border border-slate-200" />
                    <div className="truncate">
                      <div className="font-medium text-slate-900 group-hover:text-blue-700 truncate" title={`${patient.firstName} ${patient.lastName}`}>
                          {patient.firstName} {patient.lastName}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500" title={patient.id}>{patient.id}</span>
                        {patient.cedula && (
                            <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1 rounded truncate max-w-[100px]" title={patient.cedula}>
                                {patient.cedula}
                            </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {patient.discipline}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {getLastCommunicationDateDisplay(patient)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3 text-slate-400" onClick={(e) => e.stopPropagation()}>
                    <button className="hover:text-blue-600 transition-colors" title={patient.phone}><Phone size={16} /></button>
                    <a 
                        href={getWhatsAppLink(patient.phone)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-[6px] py-[3px] rounded-md shadow-md transition-all flex items-center gap-1 text-xs font-bold"
                        title="Chat en WhatsApp"
                    >
                        <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${patient.balance > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    RD$ {patient.balance.toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
            {processedPatients.map((patient) => (
                <div 
                    key={patient.id} 
                    onClick={() => setSelectedPatient(patient)}
                    className="p-4 active:bg-blue-50 transition-colors"
                >
                    <div className="flex items-start gap-3 mb-3">
                        <img src={patient.avatarUrl || 'https://via.placeholder.com/150'} alt="" className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-900">{patient.firstName} {patient.lastName}</h3>
                                <div className={`text-sm font-bold ${patient.balance > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                    ${patient.balance.toLocaleString()}
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 mb-1">{patient.id} {patient.cedula ? `• ${patient.cedula}` : ''}</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{patient.discipline}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(patient.status)}`}>{patient.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">Última: {getLastCommunicationDateDisplay(patient)}</span>
                        <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                             <a href={`tel:${patient.phone}`} className="text-slate-400 hover:text-blue-600"><Phone size={18} /></a>
                             <a 
                                href={getWhatsAppLink(patient.phone)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-green-600 hover:bg-green-700 text-white px-[6px] py-[3px] rounded-md shadow-sm transition-all flex items-center gap-1 text-xs font-bold"
                             >
                                 <MessageCircle size={14} /> WhatsApp
                             </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

       {/* Add Patient Modal */}
       {isAddingPatient && (
          <PatientRegistration 
            onClose={() => setIsAddingPatient(false)}
            onRegister={(newPatient) => {
              onAddPatient(newPatient);
              setPatientSuccess(`Paciente ${newPatient.firstName} ${newPatient.lastName} registrado exitosamente.`);
              setTimeout(() => setPatientSuccess(null), 3000);
            }}
          />
       )}

      {/* Patient Registration Success Toast */}
      {patientSuccess && (
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
             <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500">
                 <CheckCircle size={20} className="text-white" />
                 <span className="font-bold text-sm">{patientSuccess}</span>
             </div>
         </div>
      )}
    </div>
  );
};