import React, { useState } from 'react';
import { UserRole } from '../types';
import { LOGO_URL, DOCTOR_PROFILES } from '../constants';
import { Shield, Stethoscope, User, CheckCircle, Mail, Lock, AlertCircle } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (role: UserRole, doctorId?: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    setError('');

    if (selectedRole === 'patient') {
      onLogin(selectedRole);
      return;
    }

    if (selectedRole === 'admin') {
      if (email === 'admin@centrolaser.com.do' && password === 'admin') {
        onLogin(selectedRole);
      } else {
        setError('Credenciales de administrador incorrectas');
      }
      return;
    }

    if (selectedRole === 'doctor') {
      const doctor = DOCTOR_PROFILES.find(d => d.email.toLowerCase() === email.toLowerCase());
      if (doctor && password === '123456') {
        onLogin(selectedRole, doctor.id);
      } else {
        setError('Credenciales de doctor incorrectas');
      }
      return;
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto">

        {/* Left Side: Brand */}
        <div className="md:w-1/2 p-6 md:p-12 flex flex-col items-center justify-center bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
          <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-2xl shadow-lg p-2 mb-4 md:mb-8 flex items-center justify-center shrink-0">
            <img src={LOGO_URL} alt="Centro Laser" className="object-contain w-full h-full" />
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-2 text-center">Centro Laser</h1>
          <p className="text-slate-500 text-center text-xs md:text-sm">Sistema Integral de Gestión Oftalmológica</p>
          <div className="mt-4 md:mt-8 grid grid-cols-3 gap-2 w-full max-w-xs">
            <div className="h-1 bg-blue-500 rounded-full"></div>
            <div className="h-1 bg-emerald-500 rounded-full"></div>
            <div className="h-1 bg-indigo-500 rounded-full"></div>
          </div>
        </div>

        {/* Right Side: Role Selection */}
        <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 text-center md:text-left">Seleccione su perfil</h2>

          <div className="space-y-3 md:space-y-4 flex-1">
            <button
              onClick={() => handleRoleChange('patient')}
              className={`w-full group relative flex items-center p-3 md:p-4 border rounded-xl transition-all text-left ${selectedRole === 'patient' ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500' : 'border-slate-200 hover:border-indigo-300'}`}
            >
              <div className={`p-2 md:p-3 rounded-lg mr-3 md:mr-4 transition-colors shrink-0 ${selectedRole === 'patient' ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
                <User className={selectedRole === 'patient' ? 'text-indigo-600' : 'text-slate-500'} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm md:text-base truncate ${selectedRole === 'patient' ? 'text-indigo-800' : 'text-slate-900'}`}>Soy Paciente</h3>
                <p className="text-xs text-slate-500 truncate">Acceso a citas y servicios.</p>
              </div>
              {selectedRole === 'patient' && <CheckCircle className="text-indigo-600 ml-2 shrink-0" size={18} />}
            </button>

            <button
              onClick={() => handleRoleChange('doctor')}
              className={`w-full group relative flex items-center p-3 md:p-4 border rounded-xl transition-all text-left ${selectedRole === 'doctor' ? 'border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 hover:border-emerald-300'}`}
            >
              <div className={`p-2 md:p-3 rounded-lg mr-3 md:mr-4 transition-colors shrink-0 ${selectedRole === 'doctor' ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-emerald-50'}`}>
                <Stethoscope className={selectedRole === 'doctor' ? 'text-emerald-600' : 'text-slate-500'} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm md:text-base truncate ${selectedRole === 'doctor' ? 'text-emerald-800' : 'text-slate-900'}`}>Soy Doctor</h3>
                <p className="text-xs text-slate-500 truncate">Gestión clínica y agenda.</p>
              </div>
              {selectedRole === 'doctor' && <CheckCircle className="text-emerald-600 ml-2 shrink-0" size={18} />}
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className={`w-full group relative flex items-center p-3 md:p-4 border rounded-xl transition-all text-left ${selectedRole === 'admin' ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'}`}
            >
              <div className={`p-2 md:p-3 rounded-lg mr-3 md:mr-4 transition-colors shrink-0 ${selectedRole === 'admin' ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
                <Shield className={selectedRole === 'admin' ? 'text-blue-600' : 'text-slate-500'} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm md:text-base truncate ${selectedRole === 'admin' ? 'text-blue-800' : 'text-slate-900'}`}>Administración</h3>
                <p className="text-xs text-slate-500 truncate">Control total del sistema.</p>
              </div>
              {selectedRole === 'admin' && <CheckCircle className="text-blue-600 ml-2 shrink-0" size={18} />}
            </button>
          </div>

          {(selectedRole === 'doctor' || selectedRole === 'admin') && (
            <div className="mt-6 flex flex-col space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-200">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleLoginClick()}
                />
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-8 pt-2 md:pt-0 shrink-0">
            <button
              onClick={handleLoginClick}
              className={`w-full text-white font-bold py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 transform duration-100 ${selectedRole === 'admin' ? 'bg-blue-600 hover:bg-blue-700' :
                selectedRole === 'doctor' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              Entrar al Sistema
            </button>
            <p className="text-[10px] md:text-xs text-slate-400 text-center mt-4 pb-2 md:pb-0">
              © 2024 Centro Laser. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};