export enum Discipline {
  Refractive = "Cirugía Refractiva",
  Cornea = "Transplante de Córnea",
  Pediatric = "Pediátrica",
  General = "Oftalmología General",
  LowVision = "Baja Visión",
  Oculoplasty = "Oculoplastia",
  Cataract = "Catarata",
  Neuro = "Neuroftalmología",
  DryEye = "Ojo Seco"
}

export enum PatientStatus {
  New = "Nuevo",
  InEvaluation = "En Evaluación",
  PreOp = "Pre-Operatorio",
  Scheduled = "Agendado",
  PostOp = "Post-Operatorio",
  Discharged = "De Alta"
}

export interface DoctorProfile {
  id: string;
  name: string;
  specialties: string[];
  bio: string;
  imageUrl?: string;
  url: string;
  email: string;
}

export interface Diagnosis {
  date: string;
  code: string; // CIE-10
  description: string;
  eye: 'OD' | 'OI' | 'OU';
}

export interface PhysicalExamField {
  name: string;
  od: string;
  oi: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  time?: string;
  eventNumber?: string;
  type: 'Consulta' | 'Cirugía' | 'Seguimiento';
  title: string;
  doctor: string;

  // Clinical Data
  reason?: string; // Motivo consulta
  currentIllness?: string; // Enfermedad actual
  analysisPlan?: string; // Análisis y plan

  // Structured Exam
  physicalExam?: PhysicalExamField[];

  // Diagnoses
  diagnoses?: Diagnosis[];

  // Legacy notes field
  notes?: string;
}

export interface LabResult {
  id: string;
  date: string;
  testName: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  fileUrl?: string;
}

export interface Examination {
  id: string;
  date: string;
  examType: string; // e.g., "Pentacam", "OCT", "Topography"
  summary: string;
  performedBy: string;
  imageUrl?: string;
}

export interface ProcedureLog {
  id: string;
  date: string;
  procedureName: string;
  doctor: string;
  outcome: string;
  notes: string;
}

export interface CommunicationLog {
  id: string;
  date: string;
  type: 'Call' | 'Email' | 'WhatsApp' | 'In-Person';
  notes: string;
  staffName: string;
}

// New Interface for AI Screening (Diabetic Retinopathy)
export interface AIScreening {
  id: string;
  date: string;
  modality: 'Retinografía' | 'OCT';
  riskLevel: 'No Referable' | 'Moderado' | 'Severo' | 'Proliferativo';
  confidenceScore: number; // 0-100
  aiFindings: string[]; // e.g., "Microaneurismas detectados", "Exudados duros"
  imageUrl: string;
  status: 'Pending' | 'Verified' | 'Rejected';
}

// New Interface for Dry Eye Assessment
export interface DryEyeAssessment {
  id: string;
  date: string;
  osdiScore: number; // Ocular Surface Disease Index (0-100)
  symptoms: string[];
  severity: 'Normal' | 'Leve' | 'Moderado' | 'Severo';
}

export interface AuditLogEntry {
  id: string;
  date: string;
  action: string;
  details: string;
  user: string;
}

export interface Prescription {
  id: string;
  date: string;
  doctor: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  notes?: string;
}

export interface VisualAcuity {
  id: string;
  date: string;
  od: { uncorrected: string; corrected: string; spherical: string; cylindrical: string; axis: string };
  os: { uncorrected: string; corrected: string; spherical: string; cylindrical: string; axis: string };
}

export interface Patient {
  id: string;
  cedula?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string; // Added for Contact Management
  dob: string;
  discipline: Discipline;
  status: PatientStatus;
  lastVisit: string;
  balance: number;
  avatarUrl: string;
  insuranceProvider?: string;
  policyNumber?: string;
  medicalHistory: MedicalRecord[];
  communicationLogs: CommunicationLog[];
  labResults: LabResult[];
  examinations: Examination[];
  procedures: ProcedureLog[];
  prescriptions?: Prescription[];
  visualAcuityHistory?: VisualAcuity[];
  aiScreenings?: AIScreening[];
  dryEyeAssessments?: DryEyeAssessment[];
  auditLog: AuditLogEntry[]; // New field for tracking changes
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  doctor: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  discipline: Discipline;
  branch?: 'Naco' | 'Megacentro'; // Added for branch filtering
  isTelemedicine?: boolean;
  meetingLink?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  discipline: Discipline;
  durationMinutes: number;
  cost: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  discipline?: Discipline;
  patientId?: string;
  doctorId?: string; // Newly added to filter income per doctor
  status?: 'paid' | 'pending';
}

export interface KPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export type UserRole = 'admin' | 'doctor' | 'patient';

export type ViewState = 'dashboard' | 'crm' | 'appointments' | 'refractive-flow' | 'accounting' | 'services' | 'settings' | 'my-health' | 'education' | 'faq' | 'telehealth' | 'surgical-planner' | 'inventory' | 'marketing' | 'patient-billing' | 'family-management' | 'ars-concierge' | 'optical-shop' | 'medications' | 'triage-inbox' | 'colleague-consults' | 'security' | 'analytics';