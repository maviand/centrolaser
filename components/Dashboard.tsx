import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, DollarSign, Activity, Calendar } from 'lucide-react';
import { MOCK_PATIENTS, MOCK_TRANSACTIONS } from '../constants';
import { Discipline } from '../types';

const KPICard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; trend: string }> = ({ 
  title, value, icon: Icon, color, trend 
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-500 font-medium">{trend}</span>
      <span className="text-slate-400 ml-2">vs mes anterior</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  // Mock calculations
  const totalPatients = MOCK_PATIENTS.length;
  const totalRevenue = MOCK_TRANSACTIONS
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const disciplineData = Object.values(Discipline).map(d => ({
    name: d,
    value: Math.floor(Math.random() * 50) + 10 // Mock data generation
  })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

  const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  const incomeVsExpenseData = [
    { name: 'Ingresos', value: totalRevenue },
    { name: 'Gastos', value: 207000 }, // Mock expense total
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Panel de Control</h2>
        <div className="text-sm text-slate-500">Última actualización: Hoy, 10:30 AM</div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Pacientes Activos" 
          value={totalPatients.toString()} 
          icon={Users} 
          color="bg-blue-600"
          trend="+12%"
        />
        <KPICard 
          title="Ingresos del Mes" 
          value={`RD$ ${(totalRevenue).toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-green-600"
          trend="+8.5%"
        />
        <KPICard 
          title="Cirugías Pendientes" 
          value="18" 
          icon={Activity} 
          color="bg-purple-600"
          trend="-2%"
        />
        <KPICard 
          title="Citas Hoy" 
          value="42" 
          icon={Calendar} 
          color="bg-orange-500"
          trend="+5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patients by Discipline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Pacientes por Especialidad (Top 5)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disciplineData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#1e40af" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Balance Financiero</h3>
          <div className="h-80 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeVsExpenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeVsExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `RD$ ${value.toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};