import React from 'react';
import { BookOpen, CheckCircle, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export const PatientEducation: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pr-2">
       <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Educación & Cuidados</h2>
            <p className="text-slate-500 text-sm">Información vital para su tratamiento y recuperación.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Section 1: Pre-Surgery */}
           <div className="space-y-6">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                       <Info size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900">Antes de la Cirugía</h3>
               </div>
               
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="p-4 bg-blue-50 border-b border-blue-100">
                       <h4 className="font-bold text-blue-900 text-sm uppercase">Prerrequisitos Generales</h4>
                   </div>
                   <ul className="p-5 space-y-3">
                       {[
                           "Suspender uso de lentes de contacto blandos 1 semana antes.",
                           "Suspender lentes de contacto rígidos 3 semanas antes.",
                           "No usar maquillaje, cremas o perfumes el día de la cirugía.",
                           "Venir acompañado de un adulto responsable.",
                           "Desayunar ligero, evitar cafeína."
                       ].map((item, i) => (
                           <li key={i} className="flex gap-3 text-sm text-slate-700">
                               <CheckCircle size={18} className="text-green-500 shrink-0" />
                               {item}
                           </li>
                       ))}
                   </ul>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="p-4 bg-orange-50 border-b border-orange-100">
                       <h4 className="font-bold text-orange-900 text-sm uppercase">¿Qué debo preguntar?</h4>
                   </div>
                   <div className="p-5 space-y-4 text-sm text-slate-600">
                       <p className="italic">"¿Cuánto tiempo dura la recuperación?"</p>
                       <p className="italic">"¿Cuándo puedo volver a conducir o trabajar?"</p>
                       <p className="italic">"¿Qué medicamentos debo comprar antes?"</p>
                   </div>
               </div>
           </div>

           {/* Section 2: Post-Surgery */}
           <div className="space-y-6">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                       <ShieldCheck size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900">Cuidados Post-Operatorios</h3>
               </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                       <h4 className="font-bold text-emerald-900 text-sm uppercase">Seguimiento Obligatorio</h4>
                   </div>
                   <div className="p-5 relative border-l-2 border-emerald-200 ml-5 my-2">
                        {[
                            { time: "Día 1", text: "Revisión post-quirúrgica (24h)." },
                            { time: "Día 7", text: "Control de cicatrización y visión." },
                            { time: "Mes 1", text: "Alta refractiva preliminar." },
                            { time: "Mes 3", text: "Alta definitiva." }
                        ].map((step, i) => (
                            <div key={i} className="mb-6 last:mb-0 relative pl-6">
                                <span className="absolute -left-[21px] top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                                <h5 className="font-bold text-slate-900 text-sm">{step.time}</h5>
                                <p className="text-sm text-slate-600">{step.text}</p>
                            </div>
                        ))}
                   </div>
               </div>

               <div className="bg-red-50 rounded-xl border border-red-100 p-5">
                   <div className="flex gap-3 mb-3 text-red-800 font-bold">
                       <AlertTriangle size={20} />
                       <h4>Señales de Alarma</h4>
                   </div>
                   <p className="text-sm text-slate-700 mb-2">Contacte a emergencias si presenta:</p>
                   <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                       <li>Dolor intenso que no cede con analgésicos.</li>
                       <li>Pérdida súbita de la visión.</li>
                       <li>Secreción purulenta (pus) o ojo muy rojo.</li>
                   </ul>
                   <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-sm shadow-sm transition-colors">
                       Llamar a Emergencias
                   </button>
               </div>
           </div>
       </div>
    </div>
  );
};