import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, MoreVertical, Edit, Trash2, ShieldAlert, Activity, Eye, Pill } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'medicamentos' | 'lentes' | 'equipos'>('medicamentos');

  const inventoryData = [
    { id: 'INV-001', name: 'Lágrimas Artificiales (Hyabak)', category: 'medicamentos', stock: 150, minStock: 50, price: 1200, status: 'ok', type: 'pharmacy' },
    { id: 'INV-002', name: 'Vigamox (Moxifloxacino)', category: 'medicamentos', stock: 12, minStock: 20, price: 1800, status: 'low', type: 'pharmacy' },
    { id: 'INV-003', name: 'Lente Intraocular Alcon SN60WF (+22.00D)', category: 'lentes', stock: 5, minStock: 2, price: 45000, status: 'ok', type: 'high-value' },
    { id: 'INV-004', name: 'Lente Intraocular Tecnis ZCB00 (+21.50D)', category: 'lentes', stock: 1, minStock: 3, price: 42000, status: 'critical', type: 'high-value' },
    { id: 'INV-005', name: 'Viscoelástico (Provisc)', category: 'equipos', stock: 45, minStock: 30, price: 3500, status: 'ok', type: 'surgical' },
    { id: 'INV-006', name: 'Cuchillete 2.2mm', category: 'equipos', stock: 8, minStock: 50, price: 800, status: 'critical', type: 'surgical' },
    { id: 'INV-007', name: 'Montura Ray-Ban RX5154', category: 'lentes', stock: 2, minStock: 5, price: 8500, status: 'low', type: 'optical' },
    { id: 'INV-008', name: 'Lentes de Contacto Acuvue Oasys', category: 'medicamentos', stock: 40, minStock: 20, price: 2500, status: 'ok', type: 'optical' },
  ];

  const filteredInventory = inventoryData.filter(item => item.category === activeTab);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-blue-600" />
            Inventario & Cadena de Suministro
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Rastreo de insumos quirúrgicos de alto valor y alertas de reabastecimiento (Óptica/Farmacia).
          </p>
        </div>
        <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>
      
      {/* Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Productos</p>
            <h3 className="text-2xl font-bold text-slate-900">{inventoryData.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Package size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Insumos Alto Valor (LIO)</p>
            <h3 className="text-2xl font-bold text-indigo-600">{inventoryData.filter(i => i.type === 'high-value').length}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShieldAlert size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Alertas Óptica/Farmacia</p>
            <h3 className="text-2xl font-bold text-orange-600">{inventoryData.filter(i => (i.type === 'optical' || i.type === 'pharmacy') && (i.status === 'low' || i.status === 'critical')).length}</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Stock Crítico (Quirófano)</p>
            <h3 className="text-2xl font-bold text-red-600">{inventoryData.filter(i => i.type === 'surgical' && i.status === 'critical').length}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <Activity size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('medicamentos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'medicamentos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Pill size={16} /> Farmacia
            </button>
            <button 
              onClick={() => setActiveTab('lentes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'lentes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Eye size={16} /> Óptica & LIOs
            </button>
            <button 
              onClick={() => setActiveTab('equipos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'equipos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Activity size={16} /> Quirófano
            </button>
          </div>

          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, lote o código..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 sticky top-0 z-10">
                <th className="p-4 font-medium">ID / Lote</th>
                <th className="p-4 font-medium">Nombre del Producto</th>
                <th className="p-4 font-medium text-center">Stock Actual</th>
                <th className="p-4 font-medium text-center">Stock Mínimo</th>
                <th className="p-4 font-medium text-right">Costo Unitario</th>
                <th className="p-4 font-medium text-center">Estado</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-slate-500">{item.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item.type === 'high-value' && <ShieldAlert size={14} className="text-indigo-500" title="Alto Valor" />}
                      <span className="font-medium text-slate-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${item.status === 'critical' ? 'text-red-600' : item.status === 'low' ? 'text-orange-600' : 'text-slate-800'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-500">{item.minStock}</td>
                  <td className="p-4 text-right font-medium text-slate-800">RD$ {item.price.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {item.status === 'ok' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Óptimo</span>}
                    {item.status === 'low' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Reordenar</span>}
                    {item.status === 'critical' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Crítico</span>}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
