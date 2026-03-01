import React, { useState } from 'react';
import { ScanEye, ZoomIn, ZoomOut, Maximize, Contrast, Download, Share2, Layers, Image as ImageIcon } from 'lucide-react';
import { Patient } from '../types';

interface DICOMViewerProps {
  patient: Patient;
}

export const DICOMViewer: React.FC<DICOMViewerProps> = ({ patient }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [contrast, setContrast] = useState(100);

  const images = [
    { id: 1, type: 'OCT Macular', date: '2023-10-25', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800', notes: 'Edema macular leve OD.' },
    { id: 2, type: 'Topografía Corneal', date: '2023-05-12', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800&sat=-100', notes: 'Queratocono frustro OI.' },
    { id: 3, type: 'Angiografía Fluoresceínica', date: '2022-11-05', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800&hue=90', notes: 'Microaneurismas dispersos.' }
  ];

  return (
    <div className="space-y-6 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ScanEye size={24} className="text-blue-600" />
            Visor Nativo DICOM/PACS
          </h3>
          <p className="text-slate-500 text-sm">Integración directa con equipos de diagnóstico.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Share2 size={16} /> Compartir
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Download size={16} /> Descargar Serie
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Thumbnail Sidebar */}
        <div className="w-full lg:w-64 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto shrink-0 flex flex-row lg:flex-col gap-4">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-2 hidden lg:block">Estudios Previos</h4>
          {images.map((img, idx) => (
            <div 
              key={img.id}
              onClick={() => { setActiveImage(idx); setZoom(1); setContrast(100); }}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all shrink-0 w-32 lg:w-full ${activeImage === idx ? 'border-blue-600 shadow-md' : 'border-transparent hover:border-slate-300'}`}
            >
              <div className="h-20 bg-slate-200 relative">
                <img src={img.url} alt={img.type} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <ImageIcon size={24} className="text-white" />
                </div>
              </div>
              <div className="p-2 bg-white">
                <p className="text-xs font-bold text-slate-900 truncate">{img.type}</p>
                <p className="text-[10px] text-slate-500">{img.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Viewer Area */}
        <div className="flex-1 bg-black rounded-xl overflow-hidden relative flex flex-col border border-slate-800 shadow-2xl">
          {/* Toolbar */}
          <div className="bg-slate-900 p-3 flex justify-center gap-4 shrink-0 border-b border-slate-800">
            <div className="flex items-center bg-slate-800 rounded-lg p-1">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Alejar">
                <ZoomOut size={18} />
              </button>
              <span className="text-slate-300 text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Acercar">
                <ZoomIn size={18} />
              </button>
            </div>
            
            <div className="flex items-center bg-slate-800 rounded-lg p-1 px-3 gap-3">
              <Contrast size={18} className="text-slate-400" />
              <input 
                type="range" 
                min="50" max="150" 
                value={contrast} 
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-24 accent-blue-500"
                title="Contraste"
              />
            </div>

            <button className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Pantalla Completa">
              <Maximize size={18} />
            </button>
            <button className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Capas">
              <Layers size={18} />
            </button>
          </div>

          {/* Image Canvas */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
            <div 
              className="transition-transform duration-200 ease-out origin-center"
              style={{ transform: `scale(${zoom})`, filter: `contrast(${contrast}%)` }}
            >
              <img 
                src={images[activeImage].url} 
                alt="DICOM Scan" 
                className="max-w-full max-h-full object-contain mix-blend-screen"
                draggable={false}
              />
            </div>
            
            {/* Overlays */}
            <div className="absolute top-4 left-4 text-green-500 font-mono text-xs drop-shadow-md">
              <p>{patient.firstName} {patient.lastName}</p>
              <p>ID: {patient.id}</p>
              <p>DOB: {patient.dob}</p>
            </div>
            <div className="absolute top-4 right-4 text-green-500 font-mono text-xs text-right drop-shadow-md">
              <p>{images[activeImage].type}</p>
              <p>{images[activeImage].date}</p>
              <p>Inst: Centro Láser</p>
            </div>
            <div className="absolute bottom-4 left-4 text-green-500 font-mono text-xs drop-shadow-md max-w-md">
              <p className="bg-black/50 p-2 rounded border border-green-500/30">
                <span className="font-bold">Notas:</span> {images[activeImage].notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
