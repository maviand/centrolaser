import React, { useState } from 'react';
import { REFRACTIVE_STEPS } from '../constants';
import { Patient, Discipline, PatientStatus } from '../types';
import { Eye, ChevronRight, MoreHorizontal, Clock, Plus, X, User, Phone, Mail, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

interface RefractiveFlowProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
}

export const RefractiveFlow: React.FC<RefractiveFlowProps> = ({ patients, onAddPatient }) => {
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);

  // Filter only Refractive patients for this view
  const refractivePatients = patients.filter(p => p.discipline === Discipline.Refractive);

  // In a real app, 'status' would map to these steps. 
  // For this demo, we'll randomly assign them to columns if they don't match exactly.
  const getPatientsForStep = (stepId: string) => {
    // Determine pseudo-logic for distribution since our mock data has limited statuses
    // This simulates the organigram flow
    return refractivePatients.filter(p => {
        // Simple hashing for demo distribution
        const hash = p.id.charCodeAt(p.id.length - 1) % REFRACTIVE_STEPS.length;
        return REFRACTIVE_STEPS[hash].id === stepId;
    });
  };

  const handleSaveCandidate = (e: React.FormEvent<HTMLFormElement>, isUrgent: boolean = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPatient: Patient = {
        id: `P-${Math.floor(Math.random() * 10000)}`,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        cedula: '', // Can be added later
        dob: new Date().toISOString().split('T')[0], // Default to today or add field
        discipline: Discipline.Refractive,
        status: PatientStatus.New,
        lastVisit: new Date().toISOString().split('T')[0],
        balance: 0,
        avatarUrl: `https://ui-avatars.com/api/?name=${formData.get('firstName')}+${formData.get('lastName')}&background=${isUrgent ? 'ef4444' : '0D8ABC'}&color=fff`,
        medicalHistory: [],
        communicationLogs: [],
        labResults: [],
        examinations: [],
        procedures: [],
        auditLog: [{
            id: `LOG-${Date.now()}`,
            date: new Date().toLocaleString(),
            action: isUrgent ? 'Triaje Urgencia (Walk-In)' : 'Creación (Refractiva)',
            details: isUrgent ? 'Paciente ingresado por urgencia sin cita.' : 'Candidato rápido registrado desde flujo refractivo.',
            user: 'Staff Actual'
        }]
    };

    onAddPatient(newPatient);
    setIsAddingCandidate(false);
    setIsAddingWalkIn(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Flujo de Pacientes & Triaje (Command Center)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gestión en tiempo real de colas y enrutamiento dinámico de urgencias (Walk-Ins).
          </p>
        </div>
        <div className="flex gap-2">
          <button 
              onClick={() => setIsAddingWalkIn(true)}
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 border border-orange-200"
          >
            <AlertTriangle size={16} /> Triaje Urgencia (Walk-In)
          </button>
          <button 
              onClick={() => setIsAddingCandidate(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Nuevo Candidato
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {REFRACTIVE_STEPS.map((step, index) => {
            const stepPatients = getPatientsForStep(step.id);
            const isBottleneck = stepPatients.length > 3;
            
            return (
              <div key={step.id} className="w-80 flex flex-col h-full">
                {/* Column Header */}
                <div className={`flex items-center gap-2 mb-3 rounded-t-lg p-3 border-b-4 ${isBottleneck ? 'bg-red-50 border-red-500' : 'bg-slate-200 border-blue-900'}`}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${isBottleneck ? 'bg-red-500' : 'bg-slate-900'}`}>
                        {index + 1}
                    </div>
                  <h3 className={`font-semibold text-sm uppercase tracking-wide ${isBottleneck ? 'text-red-700' : 'text-slate-700'}`}>
                    {step.label}
                  </h3>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${isBottleneck ? 'bg-red-500 text-white' : 'bg-white text-slate-500'}`}>
                    {stepPatients.length}
                  </span>
                </div>

                {/* Drop Zone / List */}
                <div className={`rounded-b-lg p-2 flex-1 overflow-y-auto space-y-3 min-h-[500px] ${isBottleneck ? 'bg-red-50/50 border border-red-100' : 'bg-slate-100'}`}>
                  {stepPatients.length === 0 ? (
                    <div className="h-24 flex items-center justify-center text-slate-400 text-xs italic border-2 border-dashed border-slate-300 rounded-lg">
                      Sin pacientes
                    </div>
                  ) : (
                    stepPatients.map(patient => {
                      // Simulate urgent patients
                      const isUrgent = patient.id.endsWith('1') || patient.id.endsWith('7');
                      
                      return (
                      <div 
                        key={patient.id} 
                        draggable 
                        className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md cursor-grab active:cursor-grabbing transition-all group ${isUrgent ? 'border-orange-300 border-l-4 border-l-orange-500' : 'border-slate-200'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono text-slate-400">{patient.id}</span>
                          {isUrgent && <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase">Walk-In</span>}
                          <button className="text-slate-300 hover:text-slate-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                            <img src={patient.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">{patient.firstName} {patient.lastName}</h4>
                                <span className="text-xs text-slate-500 block">{patient.phone}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${isUrgent ? 'text-red-600 bg-red-50 font-bold' : 'text-orange-500 bg-orange-50'}`}>
                                <Clock size={12} />
                                <span>{isUrgent ? '45 min (Retraso)' : '15 min'}</span>
                            </div>
                            <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                      </div>
                    )})
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Candidate / Walk-In Modal */}
      {(isAddingCandidate || isAddingWalkIn) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className={`p-4 border-b flex justify-between items-center ${isAddingWalkIn ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'}`}>
              <h3 className={`font-bold flex items-center gap-2 ${isAddingWalkIn ? 'text-orange-800' : 'text-slate-800'}`}>
                {isAddingWalkIn ? <AlertTriangle size={18} className="text-orange-600" /> : <User size={18} className="text-blue-600" />}
                {isAddingWalkIn ? 'Registrar Walk-In (Urgencia)' : 'Nuevo Candidato Rápido'}
              </h3>
              <button 
                onClick={() => { setIsAddingCandidate(false); setIsAddingWalkIn(false); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => handleSaveCandidate(e, isAddingWalkIn)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                  <input required name="firstName" type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Juan" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellido</label>
                  <input required name="lastName" type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Pérez" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required name="phone" type="tel" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(809) 000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required name="email" type="email" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="correo@ejemplo.com" />
                </div>
              </div>
              
              {isAddingWalkIn && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo de Urgencia</label>
                  <textarea required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none h-20" placeholder="Describa los síntomas..."></textarea>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => { setIsAddingCandidate(false); setIsAddingWalkIn(false); }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm flex items-center gap-2 ${isAddingWalkIn ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <CheckCircle size={16} />
                  {isAddingWalkIn ? 'Ingresar a Triaje' : 'Guardar Candidato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};