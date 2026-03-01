import React, { useState } from 'react';
import { Glasses, Camera, CreditCard, RefreshCw, FileText, CheckCircle, Smartphone } from 'lucide-react';

export const OpticalShop = () => {
  const [activeTab, setActiveTab] = useState<'glasses' | 'contacts' | 'prescription'>('glasses');

  const frames = [
    { id: 'F-001', brand: 'Ray-Ban', model: 'Clubmaster', price: 8500, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400' },
    { id: 'F-002', brand: 'Oakley', model: 'Holbrook', price: 7200, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=400' },
    { id: 'F-003', brand: 'Tom Ford', model: 'FT5401', price: 15000, image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=400' }
  ];

  const contactSubscription = {
    brand: 'Acuvue Oasys',
    type: 'Mensual',
    nextDelivery: '2026-03-20',
    status: 'Active',
    price: 3500
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Óptica Virtual</h2>
          <p className="text-slate-500">Pruébese monturas, gestione sus lentes de contacto y acceda a su receta.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 px-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('glasses')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'glasses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Glasses size={18} />
            Monturas (Prueba Virtual)
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'contacts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <RefreshCw size={18} />
            Suscripción Lentes de Contacto
          </button>
          <button 
            onClick={() => setActiveTab('prescription')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'prescription' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={18} />
            Mi Receta (Wallet)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'glasses' && (
            <div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-blue-600 text-white rounded-full">
                    <Smartphone size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Prueba Virtual con Realidad Aumentada</h3>
                    <p className="text-blue-700 text-sm max-w-md">Use la cámara de su dispositivo para ver cómo le quedan nuestras monturas en tiempo real antes de comprarlas.</p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 whitespace-nowrap shadow-md">
                  <Camera size={20} />
                  Activar Cámara
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {frames.map(frame => (
                  <div key={frame.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                      <img src={frame.image} alt={frame.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                        RD$ {frame.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-slate-900 text-lg">{frame.brand}</h4>
                      <p className="text-slate-500 mb-4">{frame.model}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors">
                          Ver Detalles
                        </button>
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <Camera size={16} />
                          Probar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <RefreshCw size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Suscripción Activa</h3>
                      <p className="text-slate-500">Reciba sus lentes automáticamente antes de que se agoten.</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold flex items-center gap-2">
                    <CheckCircle size={16} />
                    Activa
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Marca y Tipo</p>
                    <p className="font-bold text-slate-900 text-lg">{contactSubscription.brand}</p>
                    <p className="text-sm text-slate-600">{contactSubscription.type}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Próxima Entrega</p>
                    <p className="font-bold text-slate-900 text-lg">{contactSubscription.nextDelivery}</p>
                    <p className="text-sm text-slate-600">RD$ {contactSubscription.price.toLocaleString()} / mes</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-md">
                    Modificar Suscripción
                  </button>
                  <button className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 py-3 rounded-xl font-bold transition-colors">
                    Pausar Entregas
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescription' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Receta Óptica Digital</h3>
                    <p className="text-slate-400">Válida hasta: 15 Oct 2026</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Glasses size={24} className="text-blue-300" />
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="col-span-1"></div>
                    <div className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Esfera (SPH)</div>
                    <div className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Cilindro (CYL)</div>
                    <div className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Eje (AXIS)</div>
                    
                    <div className="col-span-1 text-sm font-bold text-blue-300 flex items-center justify-end pr-4">OD (Derecho)</div>
                    <div className="col-span-1 bg-white/10 rounded-lg py-3 font-mono text-lg">-2.50</div>
                    <div className="col-span-1 bg-white/10 rounded-lg py-3 font-mono text-lg">-1.00</div>
                    <div className="col-span-1 bg-white/10 rounded-lg py-3 font-mono text-lg">180°</div>

                    <div className="col-span-1 text-sm font-bold text-blue-300 flex items-center justify-end pr-4">OI (Izquierdo)</div>
                    <div className="col-span-1 bg-white/10 rounded-lg py-3 font-mono text-lg">-2.75</div>
                    <div className="col-span-1 bg-white/10 rounded-lg py-3 font-mono text-lg">-0.75</div>
                    <div className="col-span-1 bg-white/10 rounded-lg py-3 font-mono text-lg">175°</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Distancia Pupilar (PD)</p>
                      <p className="font-mono text-xl">62 mm</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Adición (ADD)</p>
                      <p className="font-mono text-xl">+1.50</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end relative z-10">
                  <button className="bg-white text-slate-900 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2">
                    <FileText size={18} />
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
