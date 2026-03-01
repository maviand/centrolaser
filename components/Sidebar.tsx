import React from 'react';
import { LayoutDashboard, Users, Activity, DollarSign, BookOpen, LogOut, Calendar, HeartPulse, FileText, HelpCircle, X, Video, Stethoscope, Package, Megaphone, CreditCard, UsersRound, ShieldCheck, Glasses, Pill, Inbox, MessageSquare } from 'lucide-react';
import { ViewState, UserRole } from '../types';
import { LOGO_URL } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  userRole: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, userRole, onLogout, isOpen, onClose }) => {

  const allNavItems = [
    // Admin / Doctor Items
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'callcenter', 'accounting'] },
    { id: 'appointments', label: 'Citas', icon: Calendar, roles: ['admin', 'doctor', 'callcenter'] },
    { id: 'crm', label: 'Pacientes (EMR)', icon: Users, roles: ['admin', 'doctor', 'callcenter'] },
    { id: 'triage-inbox', label: 'Bandeja de Triaje', icon: Inbox, roles: ['admin', 'doctor', 'callcenter'] },
    { id: 'colleague-consults', label: 'Consultas Médicas', icon: MessageSquare, roles: ['admin', 'doctor'] },
    { id: 'surgical-planner', label: 'Planificador Quirúrgico', icon: Stethoscope, roles: ['admin', 'doctor'] },
    { id: 'refractive-flow', label: 'Flujo & Triaje', icon: Activity, roles: ['admin', 'doctor'] },
    { id: 'telehealth', label: 'Telemedicina', icon: Video, roles: ['admin', 'doctor', 'patient', 'callcenter'] },
    { id: 'accounting', label: 'Contabilidad & ARS', icon: DollarSign, roles: ['admin', 'accounting'] },
    { id: 'inventory', label: 'Inventario', icon: Package, roles: ['admin'] },
    { id: 'marketing', label: 'Marketing & CRM', icon: Megaphone, roles: ['admin'] },
    { id: 'analytics', label: 'Analítica & BI', icon: Activity, roles: ['admin', 'accounting'] },
    { id: 'security', label: 'Seguridad & Accesos', icon: ShieldCheck, roles: ['admin'] },

    // Patient Items
    { id: 'my-health', label: 'Mi Historial', icon: HeartPulse, roles: ['patient'] },
    { id: 'appointments', label: 'Mis Citas', icon: Calendar, roles: ['patient'] },
    { id: 'patient-billing', label: 'Facturación y Pagos', icon: CreditCard, roles: ['patient'] },
    { id: 'family-management', label: 'Familia y Dependientes', icon: UsersRound, roles: ['patient'] },
    { id: 'ars-concierge', label: 'Autorizaciones ARS', icon: ShieldCheck, roles: ['patient'] },
    { id: 'optical-shop', label: 'Óptica Virtual', icon: Glasses, roles: ['patient'] },
    { id: 'medications', label: 'Mis Gotas & Recetas', icon: Pill, roles: ['patient'] },

    // Shared - Moved here to appear after Appointments for Patient view
    { id: 'services', label: 'Catálogo Servicios', icon: BookOpen, roles: ['admin', 'doctor', 'patient', 'callcenter', 'accounting'] },

    { id: 'education', label: 'Educación & Cuidados', icon: FileText, roles: ['patient'] },
    { id: 'faq', label: 'Preguntas Frecuentes', icon: HelpCircle, roles: ['patient'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col h-screen shadow-xl transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
              <img src={LOGO_URL} alt="Centro Laser Logo" className="object-contain w-full h-full" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg leading-tight truncate">Centro Laser</h1>
              <p className="text-xs text-slate-400">Sistema Integral</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};