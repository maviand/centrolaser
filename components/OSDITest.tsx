import React, { useState } from 'react';
import { DryEyeAssessment } from '../types';
import { AlertCircle, CheckCircle, ChevronLeft, Save, HelpCircle, Calculator } from 'lucide-react';

interface OSDITestProps {
  onComplete: (assessment: DryEyeAssessment) => void;
  onCancel: () => void;
}

// Structure based on the provided PDF
const SECTIONS = [
    {
        title: "¿Has experimentado alguna de las siguientes alteraciones durante la última semana?",
        questions: [
            { id: 1, text: "Sensibilidad a la luz" },
            { id: 2, text: "Sensación de arenilla en los ojos" },
            { id: 3, text: "Dolor de ojos" },
            { id: 4, text: "Visión borrosa" },
            { id: 5, text: "Mala visión" },
        ]
    },
    {
        title: "¿Has tenido problemas en los ojos que te han limitado o impedido realizar alguna de las siguientes acciones durante la última semana?",
        questions: [
            { id: 6, text: "Leer" },
            { id: 7, text: "Conducir de noche" },
            { id: 8, text: "Trabajar con un ordenador o cajero automático" },
            { id: 9, text: "Ver la televisión" },
        ]
    },
    {
        title: "¿Has sentido incomodidad en los ojos en alguna de las siguientes situaciones durante la última semana?",
        questions: [
            { id: 10, text: "Viento" },
            { id: 11, text: "Lugares con baja humedad (muy secos)" },
            { id: 12, text: "Zonas con aire acondicionado" },
        ]
    }
];

const OPTIONS = [
  { value: 4, label: "En todo momento", mobileLabel: "Siempre (4)" },
  { value: 3, label: "Casi en todo momento", mobileLabel: "Casi siempre (3)" },
  { value: 2, label: "El 50% del tiempo", mobileLabel: "Mitad tiempo (2)" },
  { value: 1, label: "Casi en ningún momento", mobileLabel: "A veces (1)" },
  { value: 0, label: "En ningún momento", mobileLabel: "Nunca (0)" },
];

export const OSDITest: React.FC<OSDITestProps> = ({ onComplete, onCancel }) => {
  // Store answers. null represents "N/A" (No Contesta/No Sé)
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  const handleOptionSelect = (questionId: number, value: number | null) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    // Filter out questions that have a numeric answer (exclude null/N/A)
    const validAnswers = Object.values(answers).filter((val): val is number => val !== null);
    const questionsAnswered = validAnswers.length;

    if (questionsAnswered === 0) return 0;

    const sumScores = validAnswers.reduce((acc, curr) => acc + curr, 0);
    
    // OSDI Formula: (Sum of scores x 25) / Number of questions answered
    const score = (sumScores * 25) / questionsAnswered;
    return Math.round(score * 10) / 10; // Round to 1 decimal
  };

  const getSeverity = (score: number) => {
    // PDF ranges: 
    // Normal: 0-12 (Hasta 13 in PDF text likely typo, usually 0-12)
    // Mild/Mod: 13-22
    // Mod/Severe: 23-100
    if (score <= 12) return 'Normal';
    if (score <= 22) return 'Leve';
    if (score <= 32) return 'Moderado';
    return 'Severo';
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const severity = getSeverity(score);
    
    // Flatten questions to find symptoms
    const allQuestions = SECTIONS.flatMap(s => s.questions);
    
    // Extract prominent symptoms (score >= 3)
    const symptoms = allQuestions
        .filter(q => (answers[q.id] || 0) >= 3)
        .map(q => q.text);

    const assessment: DryEyeAssessment = {
      id: `OSDI-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      osdiScore: score,
      severity: severity as any,
      symptoms: symptoms.length > 0 ? symptoms : ['Sin síntomas severos reportados']
    };

    onComplete(assessment);
  };

  const totalQuestions = 12;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-4xl mx-auto flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 md:p-6 text-white flex justify-between items-center shrink-0">
        <div>
           <div className="flex items-center gap-2">
                <Calculator className="text-blue-200" size={24} />
                <h3 className="text-xl font-bold">Test de OSDI</h3>
           </div>
           <p className="text-blue-100 text-sm mt-1">Evaluación del tipo y grado de ojo seco.</p>
        </div>
        <button 
            onClick={onCancel} 
            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
        >
            <ChevronLeft size={24} />
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 border-b border-blue-100 flex gap-3 text-sm text-blue-900 shrink-0">
          <AlertCircle size={20} className="shrink-0 text-blue-600" />
          <p>
            Conteste las siguientes preguntas seleccionando la casilla que mejor defina la frecuencia de sus síntomas 
            <strong> durante la última semana</strong>. Si una pregunta no aplica a su caso, seleccione <strong>"N/C"</strong>.
          </p>
      </div>

      {/* Questionnaire Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm md:text-base border-b border-slate-200 pb-2 mb-4 leading-relaxed">
                    {section.title}
                </h4>
                
                <div className="space-y-6">
                    {section.questions.map((q) => (
                        <div key={q.id} className="bg-white rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                <p className="font-medium text-slate-700 text-sm md:text-base">
                                    <span className="text-slate-400 font-bold mr-2">{q.id}.</span>
                                    {q.text}
                                </p>
                            </div>
                            
                            {/* Options Grid */}
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleOptionSelect(q.id, opt.value)}
                                        className={`px-2 py-3 rounded-lg text-xs font-medium border transition-all flex flex-col items-center justify-center gap-1 h-full ${
                                            answers[q.id] === opt.value 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        <span className="md:hidden">{opt.mobileLabel}</span>
                                        <span className="hidden md:block text-center">{opt.label}</span>
                                        <span className="hidden md:block text-[10px] opacity-70">({opt.value})</span>
                                    </button>
                                ))}
                                {/* N/A Option */}
                                <button
                                    onClick={() => handleOptionSelect(q.id, null)}
                                    className={`px-2 py-3 rounded-lg text-xs font-bold border transition-all flex flex-col items-center justify-center h-full ${
                                        answers[q.id] === null 
                                        ? 'bg-slate-600 text-white border-slate-600 shadow-md' 
                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>N/C</span>
                                    <span className="text-[9px] font-normal opacity-80 text-center leading-tight mt-0.5">No sé / No aplica</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      {/* Footer / Actions */}
      <div className="p-4 md:p-6 border-t border-slate-200 bg-slate-50 shrink-0 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
             <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                 ></div>
             </div>
             <span>{answeredCount} de {totalQuestions} respondidas</span>
        </div>

        <button 
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
                w-full md:w-auto px-8 py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-all
                ${isComplete 
                    ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }
            `}
        >
            <Save size={18} />
            Calcular Resultados
        </button>
      </div>
    </div>
  );
};