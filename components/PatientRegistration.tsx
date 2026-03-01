import React, { useState } from 'react';
import { Patient, PatientStatus, Discipline } from '../types';
import { X, User, Calendar, Phone, Mail, MapPin, Shield, CheckCircle } from 'lucide-react';

interface PatientRegistrationProps {
  onClose: () => void;
  onRegister: (patient: Patient) => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    insuranceProvider: '',
    policyNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'El apellido es requerido';
    if (!formData.cedula) newErrors.cedula = 'La cédula es requerida';
    if (!formData.dob) newErrors.dob = 'La fecha de nacimiento es requerida';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newPatient: Patient = {
        id: `P-${Math.floor(Math.random() * 10000)}`,
        ...formData,
        discipline: Discipline.General,
        status: PatientStatus.InEvaluation,
        lastVisit: new Date().toISOString().split('T')[0],
        balance: 0,
        avatarUrl: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
        medicalHistory: [],
        communicationLogs: [],
        labResults: [],
        examinations: [],
        procedures: [],
        prescriptions: [],
        visualAcuityHistory: [],
        auditLog: []
      };

      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onRegister(newPatient);
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Registro Exitoso!</h2>
          <p className="text-slate-500">El paciente ha sido registrado correctamente en el sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registro de Nuevo Paciente</h2>
            <p className="text-sm text-slate-500">Complete los datos personales y de contacto.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Datos Personales */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16} className="text-blue-600" /> Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombres *</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full border ${errors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg px-4 py-2 text-sm focus:ring-2 outline-none transition-shadow`}
                  placeholder="Ej. Juan Carlos"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos *</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full border ${errors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg px-4 py-2 text-sm focus:ring-2 outline-none transition-shadow`}
                  placeholder="Ej. Pérez Gómez"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cédula / Pasaporte *</label>
                <input 
                  type="text" 
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className={`w-full border ${errors.cedula ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg px-4 py-2 text-sm focus:ring-2 outline-none transition-shadow`}
                  placeholder="000-0000000-0"
                />
                {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full border ${errors.dob ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 outline-none transition-shadow`}
                  />
                </div>
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone size={16} className="text-blue-600" /> Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono Móvil *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full border ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 outline-none transition-shadow`}
                    placeholder="(809) 000-0000"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección Física</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    placeholder="Calle, Sector, Ciudad"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seguro Médico */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield size={16} className="text-blue-600" /> Seguro Médico (ARS)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor (ARS)</label>
                <select 
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e: any) => handleChange(e)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-white"
                >
                  <option value="">Seleccione ARS (Opcional)</option>
                  <option value="Humano">Primera ARS de Humano</option>
                  <option value="Palic">Mapfre Salud ARS</option>
                  <option value="Universal">ARS Universal</option>
                  <option value="Senasa">SeNaSa</option>
                  <option value="Monumental">ARS Monumental</option>
                  <option value="Privado">Privado / Sin Seguro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Afiliado (NSS)</label>
                <input 
                  type="text" 
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  placeholder="Número de póliza o NSS"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? 'Registrando...' : 'Completar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
