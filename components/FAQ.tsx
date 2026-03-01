import React from 'react';
import { HelpCircle, ChevronDown, MapPin, Phone, CreditCard } from 'lucide-react';

export const FAQ: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pr-2">
       <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Preguntas Frecuentes</h2>
            <p className="text-slate-500 text-sm">Resuelva sus dudas rápidamente.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 space-y-4">
                {[
                    { q: "¿Aceptan seguros médicos internacionales?", a: "Sí, trabajamos con la mayoría de seguros internacionales. Debe solicitar una carta de garantía previamente." },
                    { q: "¿Cuánto tiempo dura el efecto de las gotas de dilatación?", a: "El efecto de visión borrosa y sensibilidad a la luz suele durar entre 4 a 6 horas." },
                    { q: "¿Tienen estacionamiento disponible?", a: "Sí, contamos con valet parking gratuito para pacientes en la entrada principal." },
                    { q: "¿Puedo pagar con tarjeta de crédito?", a: "Aceptamos todas las tarjetas de crédito, débito, transferencias y efectivo." },
                    { q: "¿Hacen cirugías los fines de semana?", a: "Las cirugías electivas son de lunes a viernes. Sábados solo consultas y emergencias." }
                ].map((faq, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <details className="group">
                            <summary className="flex justify-between items-center p-4 cursor-pointer list-none bg-slate-50 group-hover:bg-blue-50 transition-colors">
                                <span className="font-bold text-slate-800">{faq.q}</span>
                                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="p-4 text-sm text-slate-600 border-t border-slate-100 bg-white">
                                {faq.a}
                            </div>
                        </details>
                    </div>
                ))}
           </div>

           <div className="space-y-6">
                <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <HelpCircle size={20} /> Contacto
                    </h3>
                    <div className="space-y-4 text-sm text-blue-100">
                        <div className="flex gap-3">
                            <MapPin size={18} className="shrink-0" />
                            <p>Calle Fantino Falco #3, Naco, Santo Domingo, Rep. Dom.</p>
                        </div>
                        <div className="flex gap-3">
                            <Phone size={18} className="shrink-0" />
                            <p>(809) 555-0199</p>
                        </div>
                        <div className="flex gap-3">
                            <CreditCard size={18} className="shrink-0" />
                            <p>Seguros: Humano, Palic, Universal, Senasa, Mapfre, BMI.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center">
                    <h4 className="font-bold text-slate-900 mb-2">¿No encuentra su respuesta?</h4>
                    <p className="text-xs text-slate-500 mb-4">Nuestro equipo de atención al cliente está disponible.</p>
                    <a 
                        href="https://wa.me/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-sm"
                    >
                        Chat en WhatsApp
                    </a>
                </div>
           </div>
       </div>
    </div>
  );
};