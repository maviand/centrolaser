import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Patient, DryEyeAssessment } from './types';
import { LOGO_URL } from './constants';

// Helper to calculate age
const calculateAge = (dobString: string) => {
    const dob = new Date(dobString);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
};

// Helper to load image securely
const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg'));
            } else {
                resolve('');
            }
        };
        img.onerror = () => {
            console.warn("Could not load logo for PDF due to CORS or network error.");
            resolve(''); // Fail gracefully without logo
        };
    });
};

export const generateOSDIPDF = async (assessment: DryEyeAssessment, patient: Patient) => {
    // 1. Initialize Document (Letter Size, Millimeters)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
    });

    const primaryColor: [number, number, number] = [30, 64, 175]; // Blue 800
    const secondaryColor: [number, number, number] = [100, 116, 139]; // Slate 500
    const lightBg: [number, number, number] = [241, 245, 249]; // Slate 100

    // 2. Load Logo
    const logoData = await loadImage(LOGO_URL);

    // --- HEADER ---
    // Logo
    if (logoData) {
        doc.addImage(logoData, 'JPEG', 20, 15, 25, 25);
    } else {
        // Fallback text logo
        doc.setFillColor(30, 64, 175);
        doc.rect(20, 15, 25, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("CL", 28, 30);
    }

    // Clinic Info
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CENTRO LASER", 55, 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...secondaryColor);
    doc.text("Calle Fantino Falco #3, Naco", 55, 28);
    doc.text("Santo Domingo, República Dominicana", 55, 33);
    doc.text("Tel: (809) 555-0199 | www.centrolaser.com.do", 55, 38);

    // Report Title Box
    doc.setFillColor(...primaryColor);
    doc.rect(140, 15, 56, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("REPORTE OSDI", 168, 22, { align: "center" });
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    doc.text(`FECHA: ${assessment.date}`, 168, 32, { align: "center" });
    doc.text(`REF: ${assessment.id}`, 168, 36, { align: "center" });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 196, 45);

    // --- PATIENT INFO ---
    doc.setFillColor(...lightBg);
    doc.roundedRect(20, 50, 176, 28, 3, 3, 'F');

    doc.setFontSize(9);
    doc.setTextColor(...secondaryColor);
    doc.text("PACIENTE", 25, 58);
    doc.text("IDENTIFICACIÓN", 110, 58);
    doc.text("EDAD / GÉNERO", 155, 58);

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.setFont("helvetica", "bold");
    doc.text(`${patient.firstName} ${patient.lastName}`, 25, 65);
    doc.text(patient.cedula || patient.id, 110, 65);
    
    const age = calculateAge(patient.dob);
    doc.text(`${age} Años`, 155, 65);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(patient.email, 25, 72);
    doc.text(patient.phone, 110, 72);

    // --- RESULTS SECTION ---
    const startY = 85;
    
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("DICTAMEN CLÍNICO DE SUPERFICIE OCULAR", 20, 90);

    // Score Circle
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1.5);
    doc.circle(45, 115, 18, 'S');
    
    // Score Number inside circle (Perfectly Centered)
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    // align: 'center' and baseline: 'middle' ensures both vertical and horizontal centering
    doc.text(assessment.osdiScore.toString(), 45, 115, { align: "center", baseline: "middle" }); 
    
    // Label OUTSIDE circle to prevent overlap
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("PUNTUACIÓN TOTAL", 45, 140, { align: "center" });

    // Severity Scale Visualization
    const barX = 80;
    const barY = 105;
    const barW = 110;
    const barH = 6;

    // Background Bar Segments
    // 0-12 Normal (12%)
    doc.setFillColor(22, 163, 74); // Green
    doc.rect(barX, barY, (12/100)*barW, barH, 'F');
    // 13-22 Mild (10%)
    doc.setFillColor(234, 179, 8); // Yellow
    doc.rect(barX + (12/100)*barW, barY, (10/100)*barW, barH, 'F');
    // 23-32 Moderate (10%)
    doc.setFillColor(249, 115, 22); // Orange
    doc.rect(barX + (22/100)*barW, barY, (10/100)*barW, barH, 'F');
    // 33-100 Severe (68%)
    doc.setFillColor(220, 38, 38); // Red
    doc.rect(barX + (32/100)*barW, barY, (68/100)*barW, barH, 'F');

    // Current Value Marker (Triangle)
    const markerPos = Math.min(assessment.osdiScore, 100); // Cap at 100 for graph
    const markerX = barX + (markerPos / 100) * barW;
    
    doc.setFillColor(30, 41, 59);
    doc.triangle(markerX, barY - 1, markerX - 2.5, barY - 4, markerX + 2.5, barY - 4, 'F');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(assessment.osdiScore.toString(), markerX, barY - 5, { align: "center" });

    // Scale Labels - Legend Box (To prevent overlapping)
    const legendY = barY + 12;
    doc.setFontSize(7);
    doc.setTextColor(...secondaryColor);
    
    // Row 1
    doc.setFillColor(22, 163, 74); // Green
    doc.rect(barX, legendY, 3, 3, 'F');
    doc.text("Normal (0-12)", barX + 5, legendY + 2.5);

    doc.setFillColor(234, 179, 8); // Yellow
    doc.rect(barX + 40, legendY, 3, 3, 'F');
    doc.text("Leve (13-22)", barX + 45, legendY + 2.5);

    // Row 2
    doc.setFillColor(249, 115, 22); // Orange
    doc.rect(barX, legendY + 5, 3, 3, 'F');
    doc.text("Moderado (23-32)", barX + 5, legendY + 7.5);

    doc.setFillColor(220, 38, 38); // Red
    doc.rect(barX + 40, legendY + 5, 3, 3, 'F');
    doc.text("Severo (33-100)", barX + 45, legendY + 7.5);


    // Diagnosis Text
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("Interpretación Diagnóstica:", 80, 135);
    
    let diagColor = [30, 41, 59];
    if(assessment.severity === 'Normal') diagColor = [22, 163, 74];
    else if(assessment.severity === 'Leve') diagColor = [234, 179, 8];
    else if(assessment.severity === 'Moderado') diagColor = [249, 115, 22];
    else diagColor = [220, 38, 38];

    doc.setTextColor(diagColor[0], diagColor[1], diagColor[2]);
    doc.setFontSize(12);
    doc.text(assessment.severity.toUpperCase(), 130, 135);

    // --- SYMPTOMS SECTION ---
    const symStartY = 160;
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("MANIFESTACIONES SINTOMATOLÓGICAS REFERIDAS", 20, symStartY);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, symStartY + 3, 196, symStartY + 3);

    let yPos = symStartY + 12;
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "normal");

    if (assessment.symptoms.length > 0) {
        assessment.symptoms.forEach((sym) => {
            // Bullet point
            doc.setFillColor(30, 64, 175);
            doc.circle(25, yPos - 1, 1, 'F');
            doc.text(sym, 30, yPos);
            yPos += 7;
        });
    } else {
        doc.setFont("helvetica", "italic");
        doc.text("No se evidencian síntomas de frecuencia significativa en el periodo evaluado.", 25, yPos);
        yPos += 10;
    }

    // --- FOOTER / SIGNATURE ---
    const footerY = 240;
    
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);
    doc.line(120, footerY, 190, footerY); // Signature line
    
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("FIRMA DEL OFTALMÓLOGO TRATANTE", 155, footerY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Dr./Dra. ___________________________", 155, footerY + 10, { align: "center" });

    // Legal Footer
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("El presente documento constituye un reporte auxiliar diagnóstico y no sustituye el criterio médico profesional.", 108, 270, { align: "center" });
    doc.text(`Certificado generado el ${new Date().toLocaleString()} por sistema Centro Laser OS.`, 108, 274, { align: "center" });

    // Save
    doc.save(`CentroLaser_OSDI_${patient.firstName}_${patient.lastName}_${assessment.date}.pdf`);
};