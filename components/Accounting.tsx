import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, SERVICES, MOCK_PATIENTS } from '../constants';
import { TrendingUp, TrendingDown, Download, FileText, PlusCircle, CreditCard, Wallet, Calendar, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Discipline, Transaction } from '../types';

type Tab = 'overview' | 'expenses' | 'reports' | 'ars-scrubbing' | 'payment-plans';

export const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  
  // Modal States
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  
  // Invoice Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');

  // Expense Form State
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const outstandingInvoices = transactions.filter(t => t.type === 'income' && t.status === 'pending').reduce((acc, t) => acc + t.amount, 0);

  // Aggregate data by discipline for the chart
  const disciplineFinancials = Object.values(Discipline).map(d => {
      const income = transactions.filter(t => t.type === 'income' && t.discipline === d).reduce((acc, t) => acc + t.amount, 0);
      return {
          name: d.split(' ')[0], // Short name
          fullName: d,
          Ingresos: income
      };
  }).filter(d => d.Ingresos > 0);

  // Helper: Group by Month
  const getMonthlyReport = () => {
      const report: Record<string, { income: number, expense: number }> = {};
      
      transactions.forEach(t => {
          const month = t.date.substring(0, 7); // YYYY-MM
          if (!report[month]) report[month] = { income: 0, expense: 0 };
          if (t.type === 'income') report[month].income += t.amount;
          else report[month].expense += t.amount;
      });

      return Object.entries(report).map(([month, data]) => ({
          month,
          income: data.income,
          expense: data.expense,
          net: data.income - data.expense
      })).sort((a, b) => b.month.localeCompare(a.month));
  };

  const handleCreateInvoice = () => {
      if(!selectedPatientId || !selectedServiceId) return;
      const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);
      const service = SERVICES.find(s => s.id === selectedServiceId);
      if(patient && service) {
          const newTx: Transaction = {
              id: `T-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              description: service.name,
              amount: service.cost,
              type: 'income',
              category: 'Servicios Médicos',
              discipline: service.discipline,
              patientId: patient.id,
              status: 'pending'
          };
          setTransactions([newTx, ...transactions]);
          setShowInvoiceModal(false);
          setSelectedPatientId('');
          setSelectedServiceId('');
      }
  };

  const handleCreateExpense = () => {
      if(!expenseDescription || !expenseAmount || !expenseCategory) return;
      const newTx: Transaction = {
          id: `EXP-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: expenseDescription,
          amount: parseFloat(expenseAmount),
          type: 'expense',
          category: expenseCategory
      };
      setTransactions([newTx, ...transactions]);
      setShowExpenseModal(false);
      setExpenseDescription('');
      setExpenseAmount('');
      setExpenseCategory('');
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Contabilidad & Finanzas</h2>
            <p className="text-slate-500 text-sm">Gestión de facturación, gastos y reportes.</p>
        </div>
        
        <div className="bg-slate-100 p-1 rounded-lg flex gap-1 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Resumen
            </button>
            <button 
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'expenses' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Gastos
            </button>
            <button 
                onClick={() => setActiveTab('ars-scrubbing')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'ars-scrubbing' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Scrubbing ARS
            </button>
            <button 
                onClick={() => setActiveTab('payment-plans')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'payment-plans' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Planes de Pago
            </button>
             <button 
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'reports' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Reportes
            </button>
        </div>
      </div>

      {/* --- TAB: OVERVIEW --- */}
      {activeTab === 'overview' && (
          <div className="space-y-6 overflow-y-auto pr-2 pb-4">
               {/* Actions */}
               <div className="flex justify-end gap-3">
                   <button 
                        onClick={() => setShowExpenseModal(true)}
                        className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium px-4 py-2 border border-slate-200 rounded-lg bg-white shadow-sm transition-all text-sm"
                    >
                        <Wallet size={16} />
                        Registrar Gasto
                    </button>
                    <button 
                        onClick={() => setShowInvoiceModal(true)}
                        className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg shadow-sm transition-all text-sm"
                    >
                        <PlusCircle size={16} />
                        Nueva Factura
                    </button>
               </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Ingresos Totales</p>
                        <h3 className="text-2xl font-bold text-emerald-600">RD$ {totalIncome.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                        <TrendingUp size={24} />
                    </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Facturas Pendientes</p>
                        <h3 className="text-2xl font-bold text-amber-600">RD$ {outstandingInvoices.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                        <FileText size={24} />
                    </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Gastos Operativos</p>
                        <h3 className="text-2xl font-bold text-red-600">RD$ {totalExpense.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <TrendingDown size={24} />
                    </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Beneficio Neto</p>
                        <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-red-600'}`}>
                        RD$ {netProfit.toLocaleString()}
                        </h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-900">
                        <CreditCard size={24} />
                    </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Ingresos por Disciplina</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={disciplineFinancials} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => `RD$ ${value.toLocaleString()}`}
                                />
                                <Bar dataKey="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Historial Reciente</h3>
                            <button className="text-blue-600 text-xs font-medium hover:underline">Ver todo</button>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[300px]">
                            {transactions.slice(0, 10).map((t) => (
                                <div key={t.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 truncate max-w-[140px]" title={t.description}>{t.description}</p>
                                            <p className="text-xs text-slate-500">{t.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                            {t.type === 'income' ? '+' : '-'} RD$ {t.amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-400">{t.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
          </div>
      )}

      {/* --- TAB: EXPENSES --- */}
      {activeTab === 'expenses' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Gestión de Gastos</h3>
                  <button 
                        onClick={() => setShowExpenseModal(true)}
                        className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 font-medium px-4 py-2 rounded-lg shadow-sm transition-all text-sm"
                    >
                        <PlusCircle size={16} />
                        Nuevo Gasto
                    </button>
              </div>
              <div className="flex-1 overflow-auto">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-slate-50 sticky top-0">
                         <tr>
                             <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                             <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Descripción</th>
                             <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Categoría</th>
                             <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Monto</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {transactions.filter(t => t.type === 'expense').map(t => (
                             <tr key={t.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 text-sm text-slate-600">{t.date}</td>
                                 <td className="px-6 py-4 text-sm text-slate-900 font-medium">{t.description}</td>
                                 <td className="px-6 py-4 text-sm text-slate-500">
                                     <span className="bg-slate-100 px-2 py-1 rounded-full text-xs text-slate-600 border border-slate-200">{t.category}</span>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-red-600 font-bold text-right">- RD$ {t.amount.toLocaleString()}</td>
                             </tr>
                         ))}
                         {transactions.filter(t => t.type === 'expense').length === 0 && (
                             <tr>
                                 <td colSpan={4} className="p-8 text-center text-slate-400 italic">No hay gastos registrados.</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
              </div>
          </div>
      )}

      {/* --- TAB: REPORTS --- */}
      {activeTab === 'reports' && (
          <div className="space-y-6 overflow-y-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Monthly Summary Table */}
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden col-span-2">
                     <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                         <h3 className="font-bold text-slate-900 flex items-center gap-2">
                             <Calendar size={18} className="text-blue-600" />
                             Resumen Mensual
                         </h3>
                         <button className="text-slate-500 hover:text-blue-600">
                             <Download size={18} />
                         </button>
                     </div>
                     <table className="w-full text-left">
                         <thead>
                             <tr className="border-b border-slate-100">
                                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Mes</th>
                                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Ingresos</th>
                                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Gastos</th>
                                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Neto</th>
                             </tr>
                         </thead>
                         <tbody>
                             {getMonthlyReport().map((report) => (
                                 <tr key={report.month} className="border-b border-slate-50 hover:bg-slate-50">
                                     <td className="px-6 py-4 text-sm font-bold text-slate-900">{report.month}</td>
                                     <td className="px-6 py-4 text-sm text-emerald-600 text-right">RD$ {report.income.toLocaleString()}</td>
                                     <td className="px-6 py-4 text-sm text-red-600 text-right">RD$ {report.expense.toLocaleString()}</td>
                                     <td className={`px-6 py-4 text-sm font-bold text-right ${report.net >= 0 ? 'text-blue-900' : 'text-red-700'}`}>
                                         RD$ {report.net.toLocaleString()}
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
              </div>
          </div>
      )}

      {/* --- MODALS --- */}

      {/* New Invoice Modal */}
      {showInvoiceModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Nueva Factura</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Paciente</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                        >
                            <option value="">Seleccionar Paciente...</option>
                            {MOCK_PATIENTS.map(p => (
                                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Servicio</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                        >
                            <option value="">Seleccionar Servicio...</option>
                            {SERVICES.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - RD$ {s.cost.toLocaleString()}</option>
                            ))}
                        </select>
                    </div>

                    {selectedServiceId && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right">
                            <span className="text-xs text-slate-500">Total a Pagar</span>
                            <div className="text-xl font-bold text-slate-900">
                                RD$ {SERVICES.find(s => s.id === selectedServiceId)?.cost.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={() => setShowInvoiceModal(false)}
                        className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleCreateInvoice}
                        disabled={!selectedPatientId || !selectedServiceId}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold shadow-sm"
                    >
                        Generar Factura
                    </button>
                </div>
             </div>
          </div>
      )}

      {/* --- TAB: ARS SCRUBBING --- */}
      {activeTab === 'ars-scrubbing' && (
        <div className="space-y-6 overflow-y-auto pr-2 pb-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Automated Claim Scrubbing (ARS)</h3>
            <p className="text-sm text-slate-500 mb-6">Valida las reclamaciones contra las reglas de cobertura de las ARS locales antes de su envío para reducir rechazos.</p>
            
            <div className="space-y-4">
              {[
                { id: 'CLM-001', patient: 'Juan Perez', ars: 'Humano', amount: 4500, status: 'ready', issues: 0 },
                { id: 'CLM-002', patient: 'Rosa Martinez', ars: 'Senasa', amount: 12000, status: 'error', issues: 2 },
                { id: 'CLM-003', patient: 'Carlos Gomez', ars: 'Universal', amount: 3500, status: 'warning', issues: 1 },
              ].map(claim => (
                <div key={claim.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${claim.status === 'ready' ? 'bg-emerald-500' : claim.status === 'error' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <div>
                      <h4 className="font-bold text-slate-800">{claim.patient}</h4>
                      <p className="text-xs text-slate-500">Reclamación: {claim.id} • ARS: {claim.ars}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">RD$ {claim.amount.toLocaleString()}</p>
                    <p className={`text-xs font-medium ${claim.status === 'ready' ? 'text-emerald-600' : claim.status === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                      {claim.status === 'ready' ? 'Lista para enviar' : `${claim.issues} Errores detectados`}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                    {claim.status === 'ready' ? 'Enviar a ARS' : 'Revisar Errores'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: PAYMENT PLANS --- */}
      {activeTab === 'payment-plans' && (
        <div className="space-y-6 overflow-y-auto pr-2 pb-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Planes de Pago Especializados</h3>
                <p className="text-sm text-slate-500">Gestión de cuotas para procedimientos electivos (LASIK, LIO Premium).</p>
              </div>
              <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                <PlusCircle size={16} /> Nuevo Plan
              </button>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-medium">Paciente</th>
                  <th className="p-4 font-medium">Procedimiento</th>
                  <th className="p-4 font-medium">Monto Total</th>
                  <th className="p-4 font-medium">Balance Pendiente</th>
                  <th className="p-4 font-medium">Próxima Cuota</th>
                  <th className="p-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { patient: 'Elena Gomez', procedure: 'LASIK Personalizado', total: 45000, balance: 15000, nextDate: '2024-06-15', nextAmount: 5000, status: 'Al día' },
                  { patient: 'Marcos Ruiz', procedure: 'LIO Trifocal', total: 165000, balance: 82500, nextDate: '2024-06-01', nextAmount: 16500, status: 'Atrasado' },
                ].map((plan, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{plan.patient}</td>
                    <td className="p-4 text-sm text-slate-600">{plan.procedure}</td>
                    <td className="p-4 text-sm text-slate-800">RD$ {plan.total.toLocaleString()}</td>
                    <td className="p-4 font-bold text-slate-800">RD$ {plan.balance.toLocaleString()}</td>
                    <td className="p-4 text-sm">
                      <span className="block text-slate-800">RD$ {plan.nextAmount.toLocaleString()}</span>
                      <span className="text-xs text-slate-500">{plan.nextDate}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${plan.status === 'Al día' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {plan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Expense Modal */}
      {showExpenseModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-red-600">Registrar Gasto</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Descripción</label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                            placeholder="Ej: Pago de electricidad"
                            value={expenseDescription}
                            onChange={(e) => setExpenseDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Monto (RD$)</label>
                            <input 
                                type="number" 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                                placeholder="0.00"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Categoría</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                                value={expenseCategory}
                                onChange={(e) => setExpenseCategory(e.target.value)}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Insumos">Insumos</option>
                                <option value="Servicios">Servicios (Luz/Agua)</option>
                                <option value="Nómina">Nómina</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={() => setShowExpenseModal(false)}
                        className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleCreateExpense}
                        disabled={!expenseDescription || !expenseAmount || !expenseCategory}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold shadow-sm"
                    >
                        Guardar Gasto
                    </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};