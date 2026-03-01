import React, { useState } from 'react';
import { AlertTriangle, Camera, Send, X, PhoneCall, CheckCircle, Upload } from 'lucide-react';

interface EmergencyTriageProps {
  onClose: () => void;
}

export const EmergencyTriage: React.FC<EmergencyTriageProps> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setStep(3);
    setTimeout(() => {
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50 shrink-0">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Triaje de Emergencia</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-slate-600">Si experimenta alguno de los siguientes síntomas, por favor contacte inmediatamente a emergencias o acuda a la clínica:</p>
              <ul className="list-disc pl-5 text-slate-700 space-y-2 font-medium">
                <li>Pérdida súbita de visión</li>
                <li>Dolor ocular intenso</li>
                <li>Traumatismo o golpe fuerte en el ojo</li>
                <li>Exposición a químicos</li>
              </ul>
              
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-bold text-orange-800 mb-2">¿Su situación es urgente pero no crítica?</h4>
                <p className="text-sm text-orange-700 mb-4">Envíenos una foto clara de su ojo para que un especialista de triaje evalúe si necesita una cita prioritaria.</p>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Camera size={20} />
                  Enviar Foto para Evaluación
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-3">Línea Directa de Emergencias (24/7)</p>
                <a href="tel:8095551234" className="inline-flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  <PhoneCall size={24} />
                  (809) 555-1234
                </a>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-slate-600 font-medium text-center">Por favor, tome una foto clara y bien iluminada del área afectada.</p>
              
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 relative group cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                
                {photo ? (
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <img src={photo} alt="Ojo afectado" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold flex items-center gap-2"><Upload size={18} /> Cambiar Foto</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <Camera size={48} className="mb-4 text-slate-300" />
                    <p className="font-medium text-slate-600">Toque para abrir la cámara</p>
                    <p className="text-sm mt-1">Asegúrese de tener buena iluminación</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Describa brevemente sus síntomas</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  placeholder="Ej: Ojo muy rojo desde esta mañana, sensación de arenilla..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
                >
                  Atrás
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!photo}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md ${
                    photo ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                  Enviar a Triaje
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Información Enviada</h3>
              <p className="text-slate-600 max-w-sm mx-auto">Nuestro equipo de triaje está evaluando su caso. Le contactaremos en los próximos 15 minutos con instrucciones.</p>
              <p className="text-sm text-slate-400 mt-8">Cerrando automáticamente...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
