import React, { useState } from 'react';
import { FileSpreadsheet, Send, Printer, Plus, Trash2, Search, CheckCircle } from 'lucide-react';
import { Patient } from '../types';

interface DigitalPrescriptionProps {
  patient: Patient;
}

export const DigitalPrescription: React.FC<DigitalPrescriptionProps> = ({ patient }) => {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Timolol 0.5%', type: 'Gotas', dosage: '1 gota cada 12 horas', duration: 'Continuo', eye: 'Ambos (OU)' }
  ]);
  const [optical, setOptical] = useState({
    od: { sph: '-1.50', cyl: '-0.75', axis: '180', add: '+2.00' },
    os: { sph: '-1.25', cyl: '-0.50', axis: '175', add: '+2.00' }
  });
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet size={24} className="text-blue-600" />
            Recetario Digital (E-Prescribing)
          </h3>
          <p className="text-slate-500 text-sm">Generador rápido de recetas para farmacia y óptica.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Printer size={16} /> Imprimir
          </button>
          <button 
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Send size={16} /> Enviar a Paciente/Farmacia
          </button>
        </div>
      </div>

      {isSent && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={20} className="text-emerald-600" />
          <div>
            <p className="font-bold text-sm">Receta enviada exitosamente</p>
            <p className="text-xs text-emerald-600">El paciente ha recibido la notificación en su app.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmacología */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Farmacología</h4>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              <Plus size={16} /> Añadir Medicamento
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar medicamento (ej. Latanoprost, Tobramicina)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex-1 space-y-3">
            {medications.map(med => (
              <div key={med.id} className="border border-slate-200 rounded-lg p-4 relative group hover:border-blue-300 transition-colors">
                <button className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase">{med.type}</span>
                  <h5 className="font-bold text-slate-900">{med.name}</h5>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold">Dosis</p>
                    <p className="text-slate-800 font-medium">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold">Ojo</p>
                    <p className="text-slate-800 font-medium">{med.eye}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 text-xs uppercase font-bold">Duración</p>
                    <p className="text-slate-800 font-medium">{med.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receta Óptica */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Receta Óptica (Lentes)</h4>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                    <th className="py-2 px-3 font-bold text-left">Ojo</th>
                    <th className="py-2 px-3 font-bold">Esfera (SPH)</th>
                    <th className="py-2 px-3 font-bold">Cilindro (CYL)</th>
                    <th className="py-2 px-3 font-bold">Eje (AXIS)</th>
                    <th className="py-2 px-3 font-bold">Adición (ADD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-700 text-left bg-blue-50/50">OD (Derecho)</td>
                    <td className="py-3 px-3"><input type="text" value={optical.od.sph} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                    <td className="py-3 px-3"><input type="text" value={optical.od.cyl} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                    <td className="py-3 px-3"><input type="text" value={optical.od.axis} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                    <td className="py-3 px-3"><input type="text" value={optical.od.add} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-emerald-700 text-left bg-emerald-50/50">OI (Izquierdo)</td>
                    <td className="py-3 px-3"><input type="text" value={optical.os.sph} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                    <td className="py-3 px-3"><input type="text" value={optical.os.cyl} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                    <td className="py-3 px-3"><input type="text" value={optical.os.axis} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                    <td className="py-3 px-3"><input type="text" value={optical.os.add} className="w-16 text-center border border-slate-200 rounded p-1" readOnly /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Distancia Pupilar (DP)</label>
                <input type="text" defaultValue="62 mm" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Recomendaciones Especiales</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm h-20 resize-none"
                  defaultValue="Lentes progresivos. Filtro azul y antirreflejo recomendado."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
