import React from 'react';
import { LOGO_URL } from '../constants';
import { Transaction } from '../types';
import { MOCK_PATIENTS } from '../constants';

interface InvoicePrintViewProps {
    transaction: Transaction;
}

export const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({ transaction }) => {
    const patient = MOCK_PATIENTS.find(p => p.id === transaction.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Paciente General';

    return (
        <div id={`invoice-${transaction.id}`} className="bg-white p-6 md:p-8 w-[700px] max-w-[7.5in] h-fit text-slate-800 mx-auto font-sans relative" style={{ minHeight: '1000px' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-6">
                <div className="flex items-center gap-4">
                    <img src={LOGO_URL} alt="Centro Laser" className="h-16 w-auto object-contain" />
                    <div>
                        <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Centro Laser</h1>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Oftalmología Especializada</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <h2 className="text-3xl font-black text-slate-200 uppercase tracking-widest mb-1.5">Factura</h2>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                        No. {transaction.id.replace('T-', 'INV-')}
                    </div>
                </div>
            </div>

            {/* Info Sections */}
            <div className="flex justify-between mb-8">
                {/* Us */}
                <div className="w-1/2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Emitido por</h3>
                    <p className="font-bold text-base text-slate-800">Centro Laser S.R.L.</p>
                    <p className="text-sm text-slate-600 mt-0.5">RNC: 1-01-12345-6</p>
                    <p className="text-sm text-slate-600">Av. 27 de Febrero esq. Tiradentes</p>
                    <p className="text-sm text-slate-600">Santo Domingo, República Dominicana</p>
                    <p className="text-sm text-slate-600 mt-1 font-medium">+1 (809) 566-2020</p>
                </div>

                {/* Them */}
                <div className="w-1/2 text-right">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Facturado a</h3>
                    <p className="font-bold text-lg text-slate-800">{patientName}</p>
                    {patient && (
                        <>
                            <p className="text-sm text-slate-600 mt-0.5">Cédula/ID: {patient.id}</p>
                            <p className="text-sm text-slate-600">Tel: {patient.phone}</p>
                        </>
                    )}
                    <div className="mt-3 inline-block bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Fecha de Emisión</p>
                        <p className="text-sm font-bold text-slate-800">{new Date(transaction.date).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mb-8 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                            <th className="p-3 font-bold border-b border-slate-200 w-2/3">Descripción del Servicio</th>
                            <th className="p-3 font-bold border-b border-slate-200 text-center w-1/6">Cantidad</th>
                            <th className="p-3 font-bold border-b border-slate-200 text-right w-1/6">Importe</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-4">
                                <p className="font-bold text-slate-800 text-base">{transaction.description}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{transaction.discipline || 'Procedimiento Médico'}</p>
                            </td>
                            <td className="p-4 text-center text-sm font-medium text-slate-600">1</td>
                            <td className="p-4 text-right font-bold text-slate-800 text-base">
                                RD$ {transaction.amount.toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/3 space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium">RD$ {transaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>ITBIS (0%)</span>
                        <span className="font-medium">RD$ 0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-slate-800 text-lg">
                        <span className="font-bold text-slate-800">Total</span>
                        <span className="font-black text-blue-700">RD$ {transaction.amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Notes */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-slate-500 text-xs flex justify-between">
                <div>
                    <p className="font-bold text-slate-700 mb-0.5">Términos y Condiciones</p>
                    <p>Factura válida como comprobante de pago.</p>
                    <p>Las reclamaciones a ARS están sujetas a la cobertura del plan del afiliado.</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-slate-700 mb-0.5">¡Gracias por su confianza!</p>
                    <p>centro.laser@claser.com.do</p>
                </div>
            </div>

            {/* Absolute watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <img src={LOGO_URL} alt="" className="w-1/2 grayscale" />
            </div>
        </div>
    );
};
