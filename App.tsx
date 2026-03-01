import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientManager } from './components/PatientManager';
import { RefractiveFlow } from './components/RefractiveFlow';
import { Accounting } from './components/Accounting';
import { ServiceCatalog } from './components/ServiceCatalog';
import { AuthScreen } from './components/AuthScreen';
import { Appointments } from './components/Appointments';
import { MyHealth } from './components/MyHealth';
import { PatientEducation } from './components/PatientEducation';
import { FAQ } from './components/FAQ';
import { Telehealth } from './components/Telehealth';
import { SurgicalPlanner } from './components/SurgicalPlanner';
import { Inventory } from './components/Inventory';
import { Marketing } from './components/Marketing';
import { Analytics } from './components/Analytics';
import { PatientBilling } from './components/PatientBilling';
import { ViewState, UserRole, Patient, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, SERVICES } from './constants';
import { Bell, Search, MessageCircle, Menu, User, BookOpen, X, Camera, Save, Shield, CreditCard, Phone, Mail, FileText, CheckCircle, AlertTriangle, Eye, Type } from 'lucide-react';

import { FamilyManagement } from './components/FamilyManagement';
import { ARSConcierge } from './components/ARSConcierge';
import { OpticalShop } from './components/OpticalShop';
import { MedicationAdherence } from './components/MedicationAdherence';
import { EmergencyTriage } from './components/EmergencyTriage';
import { TriageInbox } from './components/TriageInbox';
import { ColleagueConsults } from './components/ColleagueConsults';
import { Security } from './components/Security';

// --- Profile Edit Modal Component ---
interface EditProfileModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ patient, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Patient>>(patient);
  const [avatarPreview, setAvatarPreview] = useState(patient.avatarUrl);
  const [errors, setErrors] = useState<{email?: string, cedula?: string}>({});

  useEffect(() => {
    setFormData(patient);
    setAvatarPreview(patient.avatarUrl);
  }, [patient, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validateCedula = (cedula: string) => {
      // Basic format check
      return /^\d{3}-\d{7}-\d{1}$/.test(cedula);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors on change
    if (name === 'email') setErrors(prev => ({...prev, email: ''}));
    if (name === 'cedula') setErrors(prev => ({...prev, cedula: ''}));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    
    if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = "Formato de correo inválido";
    }
    if (formData.cedula && !validateCedula(formData.cedula)) {
        newErrors.cedula = "Formato requerido: 000-0000000-0";
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    onSave({ ...patient, ...formData } as Patient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Editar Perfil</h3>
            <p className="text-sm text-slate-500">Actualice su información personal y clínica.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center">
                <div className="relative group">
                    <img 
                        src={avatarPreview || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                        <Camera size={16} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                </div>
                <p className="text-xs text-slate-400 mt-2">Haga clic en el icono de cámara para cambiar la foto.</p>
            </div>

            {/* Section: Personal Info */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2">
                    <User size={18} className="text-blue-600"/>
                    <h4>Datos Personales</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label>
                        <input 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Apellido</label>
                        <input 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Cédula</label>
                        <input 
                            name="cedula" 
                            value={formData.cedula} 
                            onChange={handleInputChange} 
                            placeholder="000-0000000-0"
                            className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${errors.cedula ? 'border-red-500' : 'border-slate-300'}`} 
                        />
                        {errors.cedula && <p className="text-xs text-red-500 mt-1">{errors.cedula}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Fecha Nacimiento</label>
                        <input 
                            type="date"
                            name="dob" 
                            value={formData.dob} 
                            onChange={handleInputChange} 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                </div>
            </div>

            {/* Section: Contact */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2">
                    <Phone size={18} className="text-blue-600"/>
                    <h4>Contacto</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Teléfono Móvil</label>
                        <input 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Correo Electrónico</label>
                        <input 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleInputChange} 
                            className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-slate-300'}`} 
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Dirección Física</label>
                        <input 
                            name="address" 
                            type="text"
                            value={formData.address || ''} 
                            onChange={handleInputChange} 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Calle, Sector, Ciudad"
                        />
                    </div>
                </div>
            </div>

            {/* Section: Insurance */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2">
                    <Shield size={18} className="text-blue-600"/>
                    <h4>Seguro Médico (ARS)</h4>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-blue-800 mb-1">Aseguradora</label>
                        <input 
                            name="insuranceProvider" 
                            value={formData.insuranceProvider || ''} 
                            onChange={handleInputChange} 
                            placeholder="Ej: Humano, Senasa..."
                            className="w-full border border-blue-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-blue-800 mb-1">Número de Póliza / Afiliado</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                            <input 
                                name="policyNumber" 
                                value={formData.policyNumber || ''} 
                                onChange={handleInputChange} 
                                placeholder="00000000"
                                className="w-full border border-blue-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
                Cancelar
            </button>
            <button 
                onClick={() => document.getElementById('profile-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
                <Save size={18} />
                Guardar Cambios
            </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('doctor');
  const [currentPatientId, setCurrentPatientId] = useState<string>('P-1001'); // Mock logged-in patient
  
  // Data State (Lifted for persistence between views)
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  // View State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileSuccessToast, setProfileSuccessToast] = useState(false);
  
  // Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    // Redirect based on role
    if (role === 'patient') {
        setCurrentView('my-health');
        // In a real app, we'd fetch the patient ID from auth. 
        // For demo, we default to P-1001 (Rosa)
        setCurrentPatientId('P-1001'); 
    }
    else setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('doctor'); 
    setCurrentView('dashboard');
    setIsSidebarOpen(false);
  };

  const handleAddAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [...prev, newAppt]);
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    
    // If updating currently logged in user, trigger success toast
    if (updatedPatient.id === currentPatientId) {
        setProfileSuccessToast(true);
        setTimeout(() => setProfileSuccessToast(false), 3000);
    }
  };

  // Global Search Logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const matchedPatients = patients.filter(p => 
      p.firstName.toLowerCase().includes(lowerQuery) || 
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.id.toLowerCase().includes(lowerQuery)
    ).map(p => ({ ...p, type: 'patient' }));

    const matchedServices = SERVICES.filter(s => 
      s.name.toLowerCase().includes(lowerQuery)
    ).map(s => ({ ...s, type: 'service' }));

    setSearchResults([...matchedPatients, ...matchedServices]);
  };

  const handleSelectSearchResult = (result: any) => {
      setSearchQuery('');
      setSearchResults([]);
      if (result.type === 'patient') {
          setCurrentView('crm');
          // ideally we would also pass the selected patient ID to the CRM view to auto-open it
      } else if (result.type === 'service') {
          setCurrentView('services');
      }
  };

  // Get current patient data for MyHealth view and Profile Modal
  const currentPatient = patients.find(p => p.id === currentPatientId) || patients[0];

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <Appointments 
                  appointments={appointments} 
                  patients={patients} 
                  userRole={userRole} 
                  currentUserId={currentPatientId} 
                  onAddAppointment={handleAddAppointment}
               />;
      case 'crm':
        return <PatientManager 
                  patients={patients} 
                  appointments={appointments}
                  onAddAppointment={handleAddAppointment}
                  onAddPatient={handleAddPatient}
                  onUpdatePatient={handleUpdatePatient}
               />;
      case 'services':
        return <ServiceCatalog userRole={userRole} />;
      case 'refractive-flow':
        return <RefractiveFlow patients={patients} onAddPatient={handleAddPatient} />;
      case 'accounting':
        return <Accounting />;
      case 'telehealth':
        return <Telehealth />;
      case 'surgical-planner':
        return <SurgicalPlanner />;
      case 'inventory':
        return <Inventory />;
      case 'marketing':
        return <Marketing />;
      case 'analytics':
        return <Analytics />;
      case 'patient-billing':
        return <PatientBilling currentPatientId={currentPatientId} />;
      // Patient Portal Views
      case 'my-health':
        return <MyHealth patient={currentPatient} />;
      case 'education':
        return <PatientEducation />;
      case 'faq':
        return <FAQ />;
      case 'family-management':
        return <FamilyManagement />;
      case 'ars-concierge':
        return <ARSConcierge />;
      case 'optical-shop':
        return <OpticalShop />;
      case 'medications':
        return <MedicationAdherence />;
      case 'triage-inbox':
        return <TriageInbox />;
      case 'colleague-consults':
        return <ColleagueConsults />;
      case 'security':
        return <Security />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-slate-50 font-sans ${highContrast ? 'contrast-125 saturate-150' : ''} ${largeText ? 'text-lg' : ''}`}>
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => { setCurrentView(view); setIsSidebarOpen(false); }} 
        userRole={userRole}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          
          <div className="flex items-center gap-3">
             <button 
                className="md:hidden text-slate-500 hover:text-blue-600 p-1"
                onClick={() => setIsSidebarOpen(true)}
             >
                 <Menu size={24} />
             </button>
             
              {/* Global Search */}
              <div className="w-64 lg:w-96 relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={userRole === 'patient' ? "Buscar en mi historial..." : "Búsqueda global..."}
                  className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                
                {/* Search Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl border border-slate-200 mt-2 max-h-80 overflow-y-auto z-50">
                        {searchResults.map((result, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleSelectSearchResult(result)}
                                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 flex items-center gap-3"
                            >
                                <div className={`p-2 rounded-full ${result.type === 'patient' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {result.type === 'patient' ? <User size={16} /> : <BookOpen size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{result.name || `${result.firstName} ${result.lastName}`}</p>
                                    <p className="text-xs text-slate-500">{result.type === 'patient' ? `ID: ${result.id}` : 'Servicio'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
             {/* Accessibility Toggles */}
             {userRole === 'patient' && (
                <div className="hidden sm:flex items-center gap-2 mr-2">
                  <button 
                    onClick={() => setHighContrast(!highContrast)}
                    className={`p-2 rounded-full transition-colors ${highContrast ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    title="Modo Alto Contraste"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => setLargeText(!largeText)}
                    className={`p-2 rounded-full transition-colors ${largeText ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    title="Texto Grande"
                  >
                    <Type size={18} />
                  </button>
                </div>
             )}

             {/* Emergency Button */}
             {userRole === 'patient' && (
                <button 
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-red-200"
                >
                  <AlertTriangle size={16} />
                  <span className="hidden sm:inline">Urgencia</span>
                </button>
             )}

             {/* Global WhatsApp Button */}
             <a 
                href="https://wa.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm"
             >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">WhatsApp</span>
             </a>

            <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-px h-8 bg-slate-200 mx-1 md:mx-2"></div>
            
            {/* User Profile Trigger */}
            <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 pr-2 rounded-lg transition-all group"
                onClick={() => {
                    if (userRole === 'patient') {
                        setIsProfileModalOpen(true);
                    }
                }}
                title={userRole === 'patient' ? "Editar Perfil" : "Perfil de Usuario"}
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {userRole === 'patient' ? `${currentPatient.firstName} ${currentPatient.lastName}` : (userRole === 'admin' ? 'Dr. Juan Batlle Logroño' : 'Dr. Especialista')}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{userRole}</p>
                </div>
                <div className={`relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold border overflow-hidden ${
                    userRole === 'admin' 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : userRole === 'doctor'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}>
                    {userRole === 'patient' ? (
                        <img src={currentPatient.avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs md:text-sm">{userRole === 'admin' ? 'JB' : 'DE'}</span>
                    )}
                    {userRole === 'patient' && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            {/* Hover effect overlay */}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal 
            isOpen={isProfileModalOpen} 
            onClose={() => setIsProfileModalOpen(false)} 
            patient={currentPatient}
            onSave={handleUpdatePatient}
        />

        {/* Success Toast */}
        {profileSuccessToast && (
            <div className="absolute bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500">
                    <CheckCircle size={20} className="text-white" />
                    <span className="font-bold text-sm">Perfil actualizado correctamente.</span>
                </div>
            </div>
        )}

        {/* Emergency Triage Modal */}
        {isEmergencyModalOpen && (
            <EmergencyTriage onClose={() => setIsEmergencyModalOpen(false)} />
        )}
      </main>
    </div>
  );
}