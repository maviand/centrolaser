import React, { useState, useRef } from 'react';
import { SERVICES } from '../constants';
import { Discipline, Service, UserRole } from '../types';
import { Search, Clock, Tag, Stethoscope, Plus, Edit, Trash2, Calculator, Upload, AlertTriangle, X, Check, Save, Gem } from 'lucide-react';

interface ServiceCatalogProps {
  userRole: UserRole;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({ userRole }) => {
  // State
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [filterMinCost, setFilterMinCost] = useState<number>(0);
  const [filterMaxCost, setFilterMaxCost] = useState<number>(200000);
  
  // Modals & Dialogs
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState<{show: boolean, service: Service | null}>({ show: false, service: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filtering Logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === 'All' || service.discipline === selectedDiscipline;
    const matchesCost = service.cost >= filterMinCost && service.cost <= filterMaxCost;
    return matchesSearch && matchesDiscipline && matchesCost;
  });

  const disciplines = ['All', ...Object.values(Discipline)];

  // Actions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Mock CSV Parser: Assuming Name,Discipline,Cost,Duration
        const rows = text.split('\n').slice(1); // Skip header
        const newServices: Service[] = [];
        rows.forEach((row, index) => {
            const cols = row.split(',');
            if(cols.length >= 4) {
                newServices.push({
                    id: `IMP-${Date.now()}-${index}`,
                    name: cols[0].trim(),
                    discipline: cols[1].trim() as Discipline || Discipline.General,
                    cost: parseFloat(cols[2]) || 0,
                    durationMinutes: parseInt(cols[3]) || 15,
                    description: 'Importado vía CSV'
                });
            }
        });
        if(newServices.length > 0) {
            setServices(prev => [...prev, ...newServices]);
            alert(`Se importaron ${newServices.length} servicios exitosamente.`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setDeleteConfirmation(null);
  };

  const handleSaveService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newService: Service = {
        id: editingService ? editingService.id : `S-${Date.now()}`,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        discipline: formData.get('discipline') as Discipline,
        cost: Number(formData.get('cost')),
        durationMinutes: Number(formData.get('durationMinutes')),
    };

    if (editingService) {
        setServices(prev => prev.map(s => s.id === editingService.id ? newService : s));
    } else {
        setServices(prev => [newService, ...prev]);
    }
    setShowAddModal(false);
    setEditingService(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Catálogo de Servicios</h2>
            <p className="text-slate-500 text-sm">Gestión de procedimientos, costos y duraciones.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
           {userRole === 'admin' && (
              <>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors"
                >
                    <Upload size={16} />
                    Importar CSV
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
                >
                    <Plus size={16} />
                    Nuevo Servicio
                </button>
              </>
           )}
          
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar servicio..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
         <div className="flex-1 w-full overflow-hidden">
             <label className="text-xs font-bold text-slate-500 mb-2 block">Filtrar por Especialidad</label>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {disciplines.map(d => (
                    <button
                        key={d}
                        onClick={() => setSelectedDiscipline(d)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            selectedDiscipline === d 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {d === 'All' ? 'Todos' : d}
                    </button>
                ))}
            </div>
         </div>
         <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                <span>Precio: RD$ {filterMinCost.toLocaleString()}</span>
                <span>RD$ {filterMaxCost.toLocaleString()}</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max="200000" 
                step="1000"
                value={filterMaxCost} 
                onChange={(e) => setFilterMaxCost(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-4">
        {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col relative group">
                {userRole === 'admin' && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => { setEditingService(service); setShowAddModal(true); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                            <Edit size={16} />
                        </button>
                        <button 
                            onClick={() => setDeleteConfirmation(service.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Stethoscope size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 mt-1">{service.id}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 leading-tight pr-6">{service.name}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-3">{service.description}</p>
                
                <div className="space-y-2 border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Clock size={16} />
                            <span>{service.durationMinutes} min</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Tag size={16} className="text-green-600"/>
                            <span>RD$ {service.cost.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                         <div className="inline-block bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600 truncate max-w-[120px]">
                            {service.discipline}
                        </div>
                        <button 
                            onClick={() => setShowCalculator({ show: true, service })}
                            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors flex items-center gap-2 text-xs font-bold px-3" title="Calculadora de Co-pago"
                        >
                            <Calculator size={16} /> Cotizar
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingService) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">
                        {editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
                    </h3>
                    <button 
                        onClick={() => { setShowAddModal(false); setEditingService(null); }} 
                        className="text-slate-400 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSaveService} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Nombre del Servicio</label>
                            <input name="name" required defaultValue={editingService?.name} className="w-full border border-slate-300 rounded p-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Descripción</label>
                            <textarea name="description" required defaultValue={editingService?.description} className="w-full border border-slate-300 rounded p-2 text-sm h-20" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Costo (RD$)</label>
                                <input name="cost" type="number" required defaultValue={editingService?.cost} className="w-full border border-slate-300 rounded p-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Duración (min)</label>
                                <input name="durationMinutes" type="number" required defaultValue={editingService?.durationMinutes} className="w-full border border-slate-300 rounded p-2 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Especialidad</label>
                            <select name="discipline" defaultValue={editingService?.discipline || Discipline.General} className="w-full border border-slate-300 rounded p-2 text-sm">
                                {Object.values(Discipline).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                         <button type="button" onClick={() => { setShowAddModal(false); setEditingService(null); }} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                         <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                            <Save size={16} />
                            Guardar
                         </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmation && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">¿Confirmar Eliminación?</h3>
                    <p className="text-sm text-slate-500">
                        Esta acción no se puede deshacer. El servicio será removido permanentemente del catálogo.
                    </p>
                    <div className="flex gap-3 w-full mt-2">
                        <button 
                            onClick={() => setDeleteConfirmation(null)}
                            className="flex-1 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => handleDelete(deleteConfirmation)}
                            className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
          </div>
      )}

      {/* Co-pay Calculator */}
      {showCalculator.show && showCalculator.service && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                         <h3 className="text-lg font-bold text-slate-900">Calculadora de Co-pago</h3>
                         <p className="text-sm text-slate-500">{showCalculator.service.name}</p>
                    </div>
                    <button onClick={() => setShowCalculator({show: false, service: null})} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <CalculatorBody baseCost={showCalculator.service.cost} discipline={showCalculator.service.discipline} />
             </div>
           </div>
      )}
    </div>
  );
};

const CalculatorBody: React.FC<{baseCost: number, discipline: Discipline}> = ({ baseCost, discipline }) => {
    const [insuranceType, setInsuranceType] = useState('pdss_basic');
    const [isPremiumIOL, setIsPremiumIOL] = useState(false);

    // Mock logic based on Sectoral Analysis PDF
    // PDSS covers Group 7 at 90% (Catacarat), but Group 9 (High Cost) has caps.
    // Consultations have a fixed RD$500 limit, leaving huge diferencias.
    
    let coveragePercent = 0;
    let copayFlat = 0;
    
    switch(insuranceType) {
        case 'pdss_basic': coveragePercent = 80; break;
        case 'pdss_subsidized': coveragePercent = 100; break;
        case 'private_silver': coveragePercent = 85; break;
        case 'private_gold': coveragePercent = 90; break;
        case 'none': coveragePercent = 0; break;
    }

    // Special logic for Cataracts per the PDF
    if (discipline === Discipline.Cataract && isPremiumIOL) {
        // PDSS only covers monofocal. Premium IOL cost is 100% out of pocket difference.
        // Assuming base surgery is covered at plan rate, but lens difference is added.
        // Simplified: reduce effective coverage percentage drastically
        coveragePercent = Math.min(coveragePercent, 40); // Penalty for premium lens not covered
    }

    const coverageAmount = baseCost * (coveragePercent / 100);
    const patientPay = baseCost - coverageAmount;

    return (
        <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Costo Total</span>
                    <span className="font-bold text-slate-900">RD$ {baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-emerald-600">Cobertura Estimada ({coveragePercent}%)</span>
                    <span className="font-bold text-emerald-600">- RD$ {coverageAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 my-2 pt-2 flex justify-between">
                    <span className="font-bold text-slate-900">Diferencia a Pagar</span>
                    <span className="font-bold text-blue-700 text-lg">RD$ {patientPay.toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Tipo de Seguro (ARS)</label>
                    <select 
                        className="w-full border border-slate-300 rounded p-2 text-sm"
                        value={insuranceType}
                        onChange={(e) => setInsuranceType(e.target.value)}
                    >
                        <option value="none">Sin Seguro (Privado)</option>
                        <option value="pdss_basic">Plan Básico de Salud (PDSS)</option>
                        <option value="pdss_subsidized">Senasa Subsidiado</option>
                        <option value="private_silver">Plan Complementario (Silver)</option>
                        <option value="private_gold">Plan Premium / Internacional (Gold)</option>
                    </select>
                </div>

                {discipline === Discipline.Cataract && (
                     <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="p-2 bg-white rounded-full text-amber-600 shadow-sm">
                            <Gem size={16} />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={isPremiumIOL} 
                                    onChange={(e) => setIsPremiumIOL(e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                Lente Premium (Trifocal/Tórico)
                            </label>
                            <p className="text-xs text-slate-500 leading-tight mt-1">
                                Las ARS no cubren la diferencia de lentes premium (&gt;RD$100k).
                            </p>
                        </div>
                     </div>
                )}
            </div>
            
            <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg flex gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <p>
                    Nota: La "diferencia" real puede variar según el honorario médico y los insumos específicos no cubiertos por el catálogo PDSS.
                </p>
            </div>
        </div>
    );
};