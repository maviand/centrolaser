import { Discipline, Patient, PatientStatus, Transaction, Service, Appointment, DoctorProfile } from './types';

export const LOGO_URL = "https://i.imgur.com/DE2gOJW.jpeg";

export const DOCTORS = [
  "Dr. Juan Batlle Pichardo",
  "Dr. Juan Batlle Logroño",
  "Dra. María Teresa Salazar",
  "Dr. Gernot Winkler",
  "Dr. Juan Ubiera",
  "Dra. Adalgisa Corona",
  "Dra. Rachel Alburquerque",
  "Dr. Carlos Gómez",
  "Dra. Antonina Paniagua",
  "Dra. Maritza Mínguez",
  "Dra. Elupina De León"
];

export const DOCTOR_PROFILES: DoctorProfile[] = [
  {
    id: "doc-1",
    name: "Dr. Juan Batlle Pichardo",
    specialties: ["Director Médico", "Cataratas", "Defectos Refractivos", "Neuro-oftalmología"],
    bio: "El Dr. Juan Batlle Pichardo es Director Médico en Centro Láser, especialista en cataratas, defectos refractivos y neuro-oftalmología.",
    url: "https://centrolaser.com.do/oftalmologos/dr-juan-batlle-pichardo/",
    email: "jbatllep@centrolaser.com.do"
  },
  {
    id: "doc-2",
    name: "Dr. Juan Batlle Logroño",
    specialties: ["Córnea", "Defectos Refractivos", "Cataratas"],
    bio: "El Dr. Juan Batlle Logroño es especialista en córneas, defectos refractivos y cataratas, entre otras subespecialidades oftalmológicas.",
    url: "https://centrolaser.com.do/oftalmologos/dr-juan-batlle-logrono/",
    email: "jbatllel@centrolaser.com.do"
  },
  {
    id: "doc-3",
    name: "Dra. María Teresa Salazar",
    specialties: ["Segmento Anterior", "Córnea", "Defectos Refractivos", "Cataratas"],
    bio: "La oftalmóloga Dra. María Teresa Salazar es especialista en segmento anterior, córnea, defectos refractivos y cataratas, entre otras sub especialidades.",
    url: "https://centrolaser.com.do/oftalmologos/dra-maria-teresa-salazar/",
    email: "msalazar@centrolaser.com.do"
  },
  {
    id: "doc-4",
    name: "Dr. Gernot Winkler",
    specialties: ["Oftalmología Pediátrica", "Estrabismo", "Alergias Oculares"],
    bio: "El Dr. Gernot Winkler destaca como oftalmólogo pediátrico, entre otras áreas se especializa en estrabismo, examen de niños prematuros, y alergias oculares.",
    url: "https://centrolaser.com.do/oftalmologos/dr-gernot-winkler/",
    email: "gwinkler@centrolaser.com.do"
  },
  {
    id: "doc-5",
    name: "Dr. Juan Ubiera",
    specialties: ["Retina y Vítreo", "Retinopatía Diabética", "Cirugía de Cataratas"],
    bio: "El Dr. Juan Ubiera destaca por su trabajo en retina y vítreo, retinopatía diabética, desprendimiento de retina, y cirugía de cataratas.",
    url: "https://centrolaser.com.do/oftalmologos/dr-juan-l-ubiera/",
    email: "jubiera@centrolaser.com.do"
  },
  {
    id: "doc-6",
    name: "Dra. Adalgisa Corona",
    specialties: ["Neuro-oftalmología", "Trastornos del Nervio Óptico"],
    bio: "La Dra. Adalgisa Corona destaca por su especialización en neuro-oftalmología, y atención a trastornos del nervio óptico y esclerosis múltiple, entre otras.",
    url: "https://centrolaser.com.do/oftalmologos/dra-adalgisa-corona/",
    email: "acorona@centrolaser.com.do"
  },
  {
    id: "doc-7",
    name: "Dra. Rachel Alburquerque",
    specialties: ["Glaucoma"],
    bio: "La oftalmóloga, Dra. Rachel Alburquerque, es reconocida por su trabajo de investigación y tratamiento en el área del glaucoma.",
    url: "https://centrolaser.com.do/oftalmologos/dra-rachel-alburquerque/",
    email: "ralburquerque@centrolaser.com.do"
  },
  {
    id: "doc-8",
    name: "Dr. Carlos Gómez",
    specialties: ["Cataratas", "Corrección de Defectos Refractivos"],
    bio: "El oftalmólogo, Dr. Carlos Gómez, es reconocido por su trabajo de investigación y tratamiento en el área de cataratas, y corrección de defectos refractivos.",
    url: "https://centrolaser.com.do/oftalmologos/dr-carlos-gomez/",
    email: "cgomez@centrolaser.com.do"
  },
  {
    id: "doc-9",
    name: "Dra. Antonina Paniagua",
    specialties: ["Oculoplastia", "Blefaroplastia"],
    bio: "La Dra. Antonina Paniagua destaca en el área de la oculoplastia y el tratamiento de arrugas con uso de botox, ptosis palpebral y blefaroplastia.",
    url: "https://centrolaser.com.do/oftalmologos/dra-antonina-paniagua/",
    email: "apaniagua@centrolaser.com.do"
  },
  {
    id: "doc-10",
    name: "Dra. Maritza Mínguez",
    specialties: ["Baja Visión", "Oftalmología General", "Refracciones"],
    bio: "La Dra. Maritza Mínguez se especializa en el campo de la baja visión, que comprende la oftalmología general y refracciones especializadas, entre otras.",
    url: "https://centrolaser.com.do/oftalmologos/dra-maritza-minguez/",
    email: "mminguez@centrolaser.com.do"
  },
  {
    id: "doc-11",
    name: "Dra. Elupina De León",
    specialties: ["Oftalmología Pediátrica", "Lentes de Contacto", "Ecografía Ocular"],
    bio: "La Dra. Elupina de León se especializa en oftalmología pediátrica, lentes de contacto, ecografía ocular y ultrabiomicroscopía (UBM), entre otras áreas.",
    url: "https://centrolaser.com.do/oftalmologos/dra-elupina-de-leon/",
    email: "edeleon@centrolaser.com.do"
  }
];

export const SERVICES: Service[] = [
  { id: 'S-REF-001', name: 'LASIK Personalizado', discipline: Discipline.Refractive, description: 'Corrección de miopía, hipermetropía y astigmatismo con láser excímer.', durationMinutes: 30, cost: 45000 },
  { id: 'S-REF-002', name: 'PRK (Photorefractive Keratectomy)', discipline: Discipline.Refractive, description: 'Cirugía refractiva de superficie para córneas delgadas.', durationMinutes: 45, cost: 40000 },
  { id: 'S-CAT-001', name: 'Facoemulsificación + LIO Monofocal', discipline: Discipline.Cataract, description: 'Extracción de catarata e implante de lente intraocular estándar (Grupo 7 PDSS).', durationMinutes: 60, cost: 65000 },
  { id: 'S-CAT-002', name: 'Facoemulsificación + LIO Premium (Trifocal)', discipline: Discipline.Cataract, description: 'Corrección de presbicia y astigmatismo. Lente de alta tecnología.', durationMinutes: 60, cost: 165000 },
  { id: 'S-COR-001', name: 'Crosslinking Corneal', discipline: Discipline.Cornea, description: 'Tratamiento para detener el queratocono.', durationMinutes: 90, cost: 35000 },
  { id: 'S-COR-002', name: 'Trasplante de Córnea (Penetrante)', discipline: Discipline.Cornea, description: 'Reemplazo total del tejido corneal.', durationMinutes: 120, cost: 150000 },
  { id: 'S-PED-001', name: 'Consulta Oftalmología Pediátrica', discipline: Discipline.Pediatric, description: 'Evaluación visual completa para niños.', durationMinutes: 45, cost: 4000 },
  { id: 'S-PED-002', name: 'Cirugía de Estrabismo', discipline: Discipline.Pediatric, description: 'Corrección de alineación ocular.', durationMinutes: 90, cost: 75000 },
  { id: 'S-GEN-001', name: 'Consulta General', discipline: Discipline.General, description: 'Chequeo rutinario de salud visual.', durationMinutes: 20, cost: 2500 },
  { id: 'S-DRY-001', name: 'Tratamiento IPL Ojo Seco', discipline: Discipline.DryEye, description: 'Luz pulsada intensa para disfunción de glándulas de Meibomio.', durationMinutes: 30, cost: 5000 },
  { id: 'S-OCU-001', name: 'Blefaroplastia Superior', discipline: Discipline.Oculoplasty, description: 'Cirugía funcional y estética de párpados superiores.', durationMinutes: 90, cost: 55000 },
  { id: 'S-NEU-001', name: 'Campo Visual Computarizado', discipline: Discipline.Neuro, description: 'Evaluación de la sensibilidad del campo visual.', durationMinutes: 30, cost: 3500 },
  { id: 'S-LOW-001', name: 'Rehabilitación Visual', discipline: Discipline.LowVision, description: 'Sesión de entrenamiento con ayudas ópticas.', durationMinutes: 60, cost: 3000 },
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P-1000',
    cedula: '402-2212434-5',
    firstName: 'Ricardo De Jesus',
    lastName: 'Contreras Mejia',
    email: 'ricardo.c@example.com',
    phone: '809-563-1324',
    dob: '1993-01-26',
    discipline: Discipline.General,
    status: PatientStatus.InEvaluation,
    lastVisit: '2026-02-05',
    balance: 0,
    avatarUrl: 'https://i.pravatar.cc/150?u=ricardo',
    insuranceProvider: 'Humano',
    policyNumber: '77382910',
    notes: 'Paciente masculino de 33 años. Chequeo de rutina.',
    medicalHistory: [
      {
        id: 'EV-132313',
        date: '2026-02-05',
        time: '15:10:00',
        eventNumber: '132313',
        type: 'Seguimiento',
        title: 'Chequeo de Rutina',
        doctor: 'Dr. Gernot Winkler',
        reason: 'Seguimiento - CHEQUEO DE RUTINA',
        currentIllness: 'Ninguna',
        analysisPlan: 'ISHIHARA 100% BIEN PRUEBA DE TITMUS 9/9 NO NECESITA LENTES EN ESTE MOMENTO RTC 1 AÑO',
        physicalExam: [
          { name: 'Externo', od: 'Normal', oi: 'Normal' },
          { name: 'P/P/L', od: 'Normal', oi: 'Normal' },
          { name: 'Conjuntiva/Esclera', od: 'Normal', oi: 'Normal' },
          { name: 'Córnea', od: 'Cornea clara', oi: 'Cornea clara' },
          { name: 'Cámara anterior', od: 'Formada', oi: 'Formada' },
          { name: 'Iris', od: 'Normal', oi: 'Normal' },
          { name: 'Cristalino', od: 'Transparente', oi: 'Transparente' },
          { name: 'Retina/Vítreo', od: 'Normal', oi: 'Normal' },
          { name: 'Nervio óptico', od: 'Normal', oi: 'Normal' },
        ],
        diagnoses: [
          { date: '18/11/2025', code: 'H162', description: 'Ojo Seco', eye: 'OU' },
          { date: '22/01/2025', code: 'H521', description: 'Emetrope', eye: 'OU' },
          { date: '05/02/2026', code: 'H522', description: 'Astigmatismo', eye: 'OU' }
        ]
      }
    ],
    communicationLogs: [],
    labResults: [],
    examinations: [],
    procedures: [],
    auditLog: []
  },
  {
    id: 'P-1001',
    cedula: '001-1234567-8',
    firstName: 'Rosa',
    lastName: 'Martinez',
    email: 'rosa.m@example.com',
    phone: '(809) 555-0101',
    dob: '1985-04-12',
    discipline: Discipline.Refractive,
    status: PatientStatus.InEvaluation,
    lastVisit: '2024-05-20',
    balance: 15000,
    avatarUrl: 'https://picsum.photos/seed/rosa/200/200',
    insuranceProvider: 'Humano Seguros',
    policyNumber: 'HUM-8839201',
    notes: 'Paciente interesada en LASIK. Usuario de lentes de contacto blandos.',
    medicalHistory: [
      {
        id: 'H-1',
        date: '2024-05-20',
        type: 'Consulta',
        title: 'Evaluación Inicial Refractiva',
        doctor: 'Dr. Juan Batlle Logroño',
        reason: 'Interés en cirugía refractiva',
        currentIllness: 'Miopía progresiva desde la adolescencia. Intolerancia reciente a lentes de contacto.',
        analysisPlan: 'Paciente candidata para LASIK. Se programa topografía corneal.',
        notes: 'Miopía -3.00 OD, -3.25 OI. Córnea apta para cirugía.'
      }
    ],
    communicationLogs: [
      { id: 'C-1', date: '2024-05-19', type: 'Call', notes: 'Confirmación de cita inicial.', staffName: 'Recepción' }
    ],
    labResults: [
      { id: 'L-1', date: '2024-05-15', testName: 'Hemograma Completo', result: 'Normal', referenceRange: 'N/A', status: 'Normal' },
      { id: 'L-2', date: '2024-05-15', testName: 'Glicemia', result: '95 mg/dL', referenceRange: '70-100 mg/dL', status: 'Normal' }
    ],
    examinations: [
      { id: 'E-1', date: '2024-05-20', examType: 'Pentacam', summary: 'Córnea regular, espesor central 540 micras.', performedBy: 'Tec. Ana Gómez' },
      { id: 'E-2', date: '2024-05-20', examType: 'Test de Schirmer', summary: '15mm en 5 min (Normal).', performedBy: 'Tec. Ana Gómez' }
    ],
    procedures: [],
    prescriptions: [
      {
        id: 'RX-1',
        date: '2024-05-20',
        doctor: 'Dr. Juan Batlle Logroño',
        medications: [
          { name: 'Hyabak (Lágrimas Artificiales)', dosage: '1 gota', frequency: 'Cada 4 horas', duration: 'Continuo' },
          { name: 'Vigamox', dosage: '1 gota', frequency: 'Cada 6 horas', duration: '7 días pre-op' }
        ],
        notes: 'Suspender uso de lentes de contacto 7 días antes de la cirugía.'
      }
    ],
    visualAcuityHistory: [
      {
        id: 'VA-1',
        date: '2024-05-20',
        od: { uncorrected: '20/200', corrected: '20/20', spherical: '-3.50', cylindrical: '-1.00', axis: '180' },
        os: { uncorrected: '20/200', corrected: '20/20', spherical: '-3.25', cylindrical: '-0.75', axis: '175' }
      }
    ],
    dryEyeAssessments: [
      { id: 'DE-1', date: '2024-05-20', osdiScore: 12, symptoms: ['Fatiga visual leve'], severity: 'Normal' }
    ],
    auditLog: []
  },
  {
    id: 'P-1002',
    cedula: '001-8765432-1',
    firstName: 'Juan',
    lastName: 'Perez',
    email: 'juan.p@example.com',
    phone: '(809) 555-0102',
    dob: '1978-11-05',
    discipline: Discipline.Cataract,
    status: PatientStatus.Scheduled,
    lastVisit: '2024-05-18',
    balance: 0,
    avatarUrl: 'https://picsum.photos/seed/juan/200/200',
    insuranceProvider: 'Mapfre Salud',
    policyNumber: 'MAP-992811',
    notes: 'Programado para cirugía de catarata ojo derecho. Diabético tipo 2.',
    medicalHistory: [
      {
        id: 'H-2',
        date: '2024-05-18',
        type: 'Consulta',
        title: 'Biometría Ocular',
        doctor: 'Dr. Juan Batlle Logroño',
        reason: 'Cálculo de lente intraocular',
        analysisPlan: 'Se selecciona LIO Monofocal +21.0D. Se explica pronóstico visual.',
        notes: 'Cálculo de LIO realizado.'
      }
    ],
    communicationLogs: [],
    labResults: [],
    examinations: [
      { id: 'E-3', date: '2024-05-18', examType: 'Biometría Óptica', summary: 'LIO Poder +21.0 D.', performedBy: 'Dr. José Rodríguez' }
    ],
    procedures: [],
    aiScreenings: [
      {
        id: 'AI-1',
        date: '2024-05-18',
        modality: 'Retinografía',
        riskLevel: 'Moderado',
        confidenceScore: 89,
        aiFindings: ['Microaneurismas en cuadrante superior', 'Exudados duros aislados'],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Diabetic_Retinopathy.jpg',
        status: 'Verified'
      }
    ],
    auditLog: []
  },
  {
    id: 'P-1003',
    cedula: '402-1234567-9',
    firstName: 'Elena',
    lastName: 'Gomez',
    email: 'elena.g@example.com',
    phone: '(809) 555-0103',
    dob: '1992-02-28',
    discipline: Discipline.Refractive,
    status: PatientStatus.PreOp,
    lastVisit: '2024-05-22',
    balance: 45000,
    avatarUrl: 'https://picsum.photos/seed/elena/200/200',
    insuranceProvider: 'ARS Universal',
    policyNumber: 'UNI-773829',
    medicalHistory: [],
    communicationLogs: [],
    labResults: [],
    examinations: [
      { id: 'E-4', date: '2024-05-22', examType: 'Topografía Corneal', summary: 'Astigmatismo regular a favor de la regla.', performedBy: 'Tec. Luis Diaz' }
    ],
    procedures: [],
    auditLog: []
  },
  {
    id: 'P-1004',
    firstName: 'Miguel',
    lastName: 'Rodriguez',
    email: 'miguel.r@example.com',
    phone: '(809) 555-0104',
    dob: '2015-06-15',
    discipline: Discipline.Pediatric,
    status: PatientStatus.New,
    lastVisit: '2024-05-23',
    balance: 2500,
    avatarUrl: 'https://picsum.photos/seed/miguel/200/200',
    medicalHistory: [],
    communicationLogs: [],
    labResults: [],
    examinations: [],
    procedures: [],
    auditLog: []
  },
  {
    id: 'P-1005',
    cedula: '031-0019283-4',
    firstName: 'Sofia',
    lastName: 'Hernandez',
    email: 'sofia.h@example.com',
    phone: '(809) 555-0105',
    dob: '1960-09-30',
    discipline: Discipline.Cornea,
    status: PatientStatus.PostOp,
    lastVisit: '2024-05-15',
    balance: 500,
    avatarUrl: 'https://picsum.photos/seed/sofia/200/200',
    insuranceProvider: 'Senasa',
    policyNumber: 'SEN-112938',
    medicalHistory: [],
    communicationLogs: [],
    labResults: [],
    examinations: [],
    procedures: [
      { id: 'PR-1', date: '2024-05-01', procedureName: 'Trasplante de Córnea', doctor: 'Dra. María Pérez', outcome: 'Exitoso', notes: 'Sin complicaciones intraoperatorias.' }
    ],
    auditLog: []
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'APT-001', patientId: 'P-1002', patientName: 'Juan Perez', date: '2024-06-10', time: '09:00', reason: 'Cirugía Catarata OD', doctor: 'Dr. Juan Batlle Logroño', status: 'Scheduled', discipline: Discipline.Cataract },
  { id: 'APT-002', patientId: 'P-1001', patientName: 'Rosa Martinez', date: '2024-06-12', time: '14:30', reason: 'Chequeo Pre-Quirúrgico', doctor: 'Dr. Juan Batlle Logroño', status: 'Scheduled', discipline: Discipline.Refractive },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T-001', date: '2024-05-20', description: 'Consulta Inicial - Rosa Martinez', amount: 3500, type: 'income', category: 'Consultas', discipline: Discipline.Refractive, patientId: 'P-1001' },
  { id: 'T-002', date: '2024-05-20', description: 'Compra Insumos Quirúrgicos', amount: 150000, type: 'expense', category: 'Insumos' },
  { id: 'T-003', date: '2024-05-21', description: 'Cirugía Catarata - Juan Perez', amount: 85000, type: 'income', category: 'Cirugía', discipline: Discipline.Cataract, patientId: 'P-1002' },
  { id: 'T-004', date: '2024-05-21', description: 'Pago Servicios (Luz/Internet)', amount: 12000, type: 'expense', category: 'Servicios' },
  { id: 'T-005', date: '2024-05-22', description: 'Lentes Intraoculares', amount: 45000, type: 'expense', category: 'Inventario' },
  { id: 'T-006', date: '2024-05-23', description: 'Evaluación Pediátrica', amount: 4000, type: 'income', category: 'Consultas', discipline: Discipline.Pediatric, patientId: 'P-1004' },
];

export const REFRACTIVE_STEPS = [
  { id: 'reception', label: 'Recepción & Admisión' },
  { id: 'optometry', label: 'Optometría & Refracción' },
  { id: 'topography', label: 'Topografía & Pentacam' },
  { id: 'evaluation', label: 'Evaluación Oftalmólogo' },
  { id: 'counseling', label: 'Consejería Quirúrgica' },
  { id: 'surgery', label: 'Quirófano' },
  { id: 'postop', label: 'Recuperación' }
];