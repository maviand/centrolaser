import React, { useState } from 'react';
import { CreditCard, FileText, Download, DollarSign, CheckCircle, Clock, ShieldCheck, Calendar } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../constants';

interface PatientBillingProps {
  currentPatientId: string;
}

export const PatientBilling: React.FC<PatientBillingProps> = ({ currentPatientId }) => {
  const [activeTab, setActiveTab] = useState<'invoices'|'plans'>('invoices');
  
  const patientTransactions = MOCK_TRANSACTIONS.filter(t => t.patientId === currentPatientId && t.type === 'income');
  
  const totalPaid = patientTransactions.filter(t => t.status !== 'pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = patientTransactions.filter(t => t.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  // Mock Payment Plans
  const paymentPlans = [
    {
      id: 'PP-001',
      procedure: 'Cirugía LASIK Bilateral',
      totalAmount: 90000,
      paidAmount: 45000,
      installments: 6,
      paidInstallments: 3,
      nextPaymentDate: '2026-03-15',
      nextPaymentAmount: 15000,
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Facturación y Pagos</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Pagado</p>
              <h3 className="text-2xl font-bold text-slate-900">RD$ {totalPaid.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Balance Pendiente</p>
              <h3 className="text-2xl font-bold text-slate-900">RD$ {totalPending.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
             <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <CreditCard size={20} />
                <span>Realizar Pago / Copago</span>
              </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 px-2">
            <button 
                onClick={() => setActiveTab('invoices')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'invoices' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <FileText size={18} />
                Historial de Facturas & Copagos
            </button>
            <button 
                onClick={() => setActiveTab('plans')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'plans' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Calendar size={18} />
                Planes de Pago
            </button>
        </div>
        
        {activeTab === 'invoices' && (
          patientTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                    <th className="p-4 font-medium">Fecha</th>
                    <th className="p-4 font-medium">Descripción</th>
                    <th className="p-4 font-medium">Categoría</th>
                    <th className="p-4 font-medium">ARS / Seguro</th>
                    <th className="p-4 font-medium">Estado</th>
                    <th className="p-4 font-medium text-right">Monto (Copago)</th>
                    <th className="p-4 font-medium text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {patientTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-900">{transaction.date}</td>
                      <td className="p-4 text-sm font-medium text-slate-900">{transaction.description}</td>
                      <td className="p-4 text-sm text-slate-500">{transaction.category}</td>
                      <td className="p-4 text-sm text-slate-500">
                        {transaction.category === 'Consulta' ? (
                          <span className="flex items-center gap-1 text-blue-600"><ShieldCheck size={14} /> Cubierto (Copago)</span>
                        ) : 'Privado'}
                      </td>
                      <td className="p-4">
                        {transaction.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Clock size={12} /> Pendiente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle size={12} /> Pagado
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 text-right">RD$ {transaction.amount.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Descargar Factura">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">No hay facturas</h4>
              <p className="text-slate-500">Aún no tiene transacciones registradas en su historial.</p>
            </div>
          )
        )}

        {activeTab === 'plans' && (
          <div className="p-6">
            {paymentPlans.map(plan => (
              <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 last:mb-0">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{plan.procedure}</h3>
                    <p className="text-sm text-slate-500">Plan de Financiamiento #{plan.id}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <CheckCircle size={16} /> Al día
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Monto Total</p>
                    <p className="font-bold text-slate-900">RD$ {plan.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Monto Pagado</p>
                    <p className="font-bold text-emerald-600">RD$ {plan.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Cuotas Pagadas</p>
                    <p className="font-bold text-slate-900">{plan.paidInstallments} de {plan.installments}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Próximo Pago</p>
                    <p className="font-bold text-blue-900 text-lg">RD$ {plan.nextPaymentAmount.toLocaleString()}</p>
                    <p className="text-xs text-blue-700 mt-1 flex items-center gap-1">
                      <Calendar size={12} /> Vence: {plan.nextPaymentDate}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(plan.paidAmount / plan.totalAmount) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>0%</span>
                  <span>{Math.round((plan.paidAmount / plan.totalAmount) * 100)}% Completado</span>
                  <span>100%</span>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-colors">
                    Pagar Cuota
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
