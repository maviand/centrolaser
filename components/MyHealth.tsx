import React, { useState } from 'react';
import { Patient, LabResult, Examination, ProcedureLog, DryEyeAssessment } from '../types';
import { FileText, Microscope, Clipboard, Activity, Download, ChevronRight, Eye, MonitorSmartphone, Loader2, Pill, Glasses } from 'lucide-react';
import { OSDITest } from './OSDITest';
import { generateOSDIPDF } from '../pdfGenerator';

interface MyHealthProps {
  patient: Patient;
}

export const MyHealth: React.FC<MyHealthProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<'records'|'prescriptions'|'imaging'|'labs'|'history'|'visual-health'>('records');
  const [showOSDITest, setShowOSDITest] = useState(false);
  const [localAssessments, setLocalAssessments] = useState<DryEyeAssessment[]>(patient.dryEyeAssessments || []);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  const handleOSDIComplete = (result: DryEyeAssessment) => {
      setLocalAssessments([result, ...localAssessments]);
      setShowOSDITest(false);
  };

  const handleDownload = async (assessment: DryEyeAssessment) => {
      setIsGeneratingPdf(assessment.id);
      await generateOSDIPDF(assessment, patient);
      setIsGeneratingPdf(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {!showOSDITest && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mi Historial Médico</h2>
            <p className="text-slate-500 text-sm">Acceda a sus resultados y registros clínicos.</p>
          </div>
      )}

      {!showOSDITest && (
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-2 overflow-x-auto">
            {[
                { id: 'records', label: 'Historial & Agudeza', icon: FileText },
                { id: 'prescriptions', label: 'Recetas', icon: Pill },
                { id: 'imaging', label: 'Imágenes', icon: Clipboard },
                { id: 'labs', label: 'Laboratorios', icon: Microscope },
                { id: 'history', label: 'Cirugías', icon: Activity },
                { id: 'visual-health', label: 'Salud Visual Digital', icon: Eye }
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-200 p-6">
        
        {/* RECORDS & VISUAL ACUITY */}
        {!showOSDITest && activeTab === 'records' && (
             <div className="space-y-8">
                {/* Visual Acuity History */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Glasses className="text-blue-600" /> Historial de Agudeza Visual
                  </h3>
                  {patient.visualAcuityHistory && patient.visualAcuityHistory.length > 0 ? (
                    <div className="space-y-4">
                      {patient.visualAcuityHistory.map(va => (
                        <div key={va.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="text-sm font-bold text-slate-700 mb-3">{va.date}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-slate-100">
                              <h4 className="font-bold text-blue-900 mb-2 border-b pb-1">Ojo Derecho (OD)</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-slate-500">Sin Corrección:</span> <span className="font-medium">{va.od.uncorrected}</span></div>
                                <div><span className="text-slate-500">Corregida:</span> <span className="font-medium">{va.od.corrected}</span></div>
                                <div><span className="text-slate-500">Esfera:</span> <span className="font-medium">{va.od.spherical}</span></div>
                                <div><span className="text-slate-500">Cilindro:</span> <span className="font-medium">{va.od.cylindrical}</span></div>
                                <div><span className="text-slate-500">Eje:</span> <span className="font-medium">{va.od.axis}°</span></div>
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-100">
                              <h4 className="font-bold text-blue-900 mb-2 border-b pb-1">Ojo Izquierdo (OS)</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-slate-500">Sin Corrección:</span> <span className="font-medium">{va.os.uncorrected}</span></div>
                                <div><span className="text-slate-500">Corregida:</span> <span className="font-medium">{va.os.corrected}</span></div>
                                <div><span className="text-slate-500">Esfera:</span> <span className="font-medium">{va.os.spherical}</span></div>
                                <div><span className="text-slate-500">Cilindro:</span> <span className="font-medium">{va.os.cylindrical}</span></div>
                                <div><span className="text-slate-500">Eje:</span> <span className="font-medium">{va.os.axis}°</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="Sin registros" description="No hay historial de agudeza visual." />
                  )}
                </div>

                {/* General Medical History */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Notas Clínicas
                  </h3>
                  <div className="space-y-4">
                      {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                          patient.medicalHistory.map(record => (
                              <div key={record.id} className="bg-white p-5 rounded-xl border border-slate-200">
                                  <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-slate-900">{record.title}</h4>
                                      <span className="text-xs font-mono text-slate-500">{record.date}</span>
                                  </div>
                                  <div className="text-sm text-slate-600 mb-2"><span className="font-medium">Doctor:</span> {record.doctor}</div>
                                  {record.reason && <div className="text-sm text-slate-600 mb-2"><span className="font-medium">Motivo:</span> {record.reason}</div>}
                                  {record.diagnoses && record.diagnoses.length > 0 && (
                                      <div className="mt-3">
                                          <span className="text-sm font-medium text-slate-700">Diagnósticos:</span>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                              {record.diagnoses.map((d, i) => (
                                                  <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
                                                      {d.code} - {d.description} ({d.eye})
                                                  </span>
                                              ))}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          ))
                      ) : (
                          <EmptyState title="Sin notas" description="No hay notas clínicas registradas." />
                      )}
                  </div>
                </div>
             </div>
        )}

        {/* PRESCRIPTIONS */}
        {!showOSDITest && activeTab === 'prescriptions' && (
             <div className="space-y-4">
                {patient.prescriptions && patient.prescriptions.length > 0 ? (
                    patient.prescriptions.map(rx => (
                        <div key={rx.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Pill className="text-emerald-600" /> Receta Médica
                                  </h4>
                                  <p className="text-sm text-slate-500 mt-1">Dr. {rx.doctor}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{rx.date}</span>
                                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                                    <Download size={14} /> Descargar PDF
                                  </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {rx.medications.map((med, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div>
                                      <p className="font-bold text-slate-800">{med.name}</p>
                                      <p className="text-sm text-slate-600">{med.dosage} • {med.frequency}</p>
                                    </div>
                                    <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                                      {med.duration}
                                    </span>
                                  </div>
                                ))}
                            </div>
                            {rx.notes && (
                              <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
                                <span className="font-bold">Indicaciones:</span> {rx.notes}
                              </div>
                            )}
                        </div>
                    ))
                ) : (
                    <EmptyState title="No hay recetas" description="Aún no tiene recetas médicas registradas." />
                )}
             </div>
        )}

        {/* LABS */}
        {!showOSDITest && activeTab === 'labs' && (
             <div className="space-y-4">
                {patient.labResults && patient.labResults.length > 0 ? (
                    patient.labResults.map(lab => (
                        <div key={lab.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4 w-full">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                                    <Microscope size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">{lab.testName}</h4>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{lab.date}</span>
                                        <span>Rango: {lab.referenceRange}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-700">Resultado: </span>
                                        <span className={`px-2 py-0.5 rounded text-sm font-bold ${lab.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {lab.result}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-200 bg-slate-50 hover:bg-white transition-all w-full md:w-auto justify-center">
                                <Download size={18} />
                                Descargar PDF
                            </button>
                        </div>
                    ))
                ) : (
                    <EmptyState title="No hay laboratorios" description="Aún no tiene resultados registrados." />
                )}
             </div>
        )}

        {/* IMAGING */}
        {!showOSDITest && activeTab === 'imaging' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patient.examinations && patient.examinations.length > 0 ? (
                    patient.examinations.map(exam => (
                        <div key={exam.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <Clipboard size={18} className="text-purple-600" />
                                    <h4 className="font-bold text-slate-900">{exam.examType}</h4>
                                </div>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">{exam.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{exam.summary}</p>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
                                <span>Dr/Tec: {exam.performedBy}</span>
                                <span className="flex items-center gap-1 text-blue-600 font-medium group-hover:underline">
                                    Ver Imagen <ChevronRight size={14} />
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2">
                        <EmptyState title="No hay exámenes" description="No se encontraron registros de imágenes o diagnósticos." />
                    </div>
                )}
            </div>
        )}

        {/* HISTORY */}
        {!showOSDITest && activeTab === 'history' && (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-8 py-2">
                {patient.procedures && patient.procedures.length > 0 ? (
                    patient.procedures.map(proc => (
                        <div key={proc.id} className="relative">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm ring-1 ring-slate-100"></span>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-blue-900 text-lg">{proc.procedureName}</h4>
                                    <span className="text-xs font-mono text-slate-500">{proc.date}</span>
                                </div>
                                <div className="text-sm text-slate-700 mb-2">
                                    <span className="font-bold">Cirujano:</span> {proc.doctor}
                                </div>
                                <div className="text-sm text-slate-700 mb-3">
                                    <span className="font-bold">Resultado:</span> {proc.outcome}
                                </div>
                                <p className="text-sm text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100">
                                    "{proc.notes}"
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState title="Historial Quirúrgico Vacío" description="No hay procedimientos quirúrgicos en su expediente." />
                )}
            </div>
        )}

        {/* VISUAL HEALTH (New Tab) */}
        {activeTab === 'visual-health' && (
            <div className="space-y-6">
                {!showOSDITest ? (
                    <>
                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                    <MonitorSmartphone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-orange-900 text-lg">Fatiga Visual Digital & Ojo Seco</h3>
                                    <p className="text-orange-800 text-sm mt-1 max-w-2xl">
                                        Debido al aumento del uso de pantallas, el 75% de los pacientes reportan síntomas de ojo seco. 
                                        Realice este autodiagnóstico rápido para evaluar su salud visual.
                                    </p>
                                    <button 
                                        onClick={() => setShowOSDITest(true)}
                                        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-sm transition-colors"
                                    >
                                        Realizar Test OSDI
                                    </button>
                                </div>
                            </div>
                        </div>

                        {localAssessments.length > 0 ? (
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900">Historial de Evaluaciones</h4>
                                {localAssessments.map(assessment => (
                                    <div key={assessment.id} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-slate-500 font-mono mb-1">{assessment.date}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-700">Puntuación OSDI:</span>
                                                <span className="font-bold text-lg">{assessment.osdiScore}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {assessment.symptoms.map((s, i) => (
                                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${
                                                assessment.severity === 'Normal' ? 'bg-green-50 text-green-700 border-green-200' :
                                                assessment.severity === 'Leve' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                                {assessment.severity}
                                            </div>
                                            <button 
                                                onClick={() => handleDownload(assessment)}
                                                disabled={isGeneratingPdf === assessment.id}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
                                                title="Descargar PDF"
                                            >
                                                {isGeneratingPdf === assessment.id ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <EmptyState title="Sin Evaluaciones" description="No ha realizado tests de ojo seco recientemente." />
                        )}
                    </>
                ) : (
                    <OSDITest onComplete={handleOSDIComplete} onCancel={() => setShowOSDITest(false)} />
                )}
            </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ title, description }: { title: string, description: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FileText size={32} className="text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-bold text-lg mb-1">{title}</h3>
        <p className="text-slate-500 text-sm max-w-xs">{description}</p>
    </div>
);