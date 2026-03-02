export type UUID = string;

export enum RequiredENcfType {
    E31 = 'E31',
    E45 = 'E45'
}

export enum PatientPolicyStatus {
    Active = 'Active',
    Suspended = 'Suspended'
}

export enum EncounterStatus {
    Scheduled = 'Scheduled',
    InProgress = 'In_Progress',
    Completed = 'Completed'
}

export enum ArsAuthorizationStatus {
    Approved = 'Approved',
    Rejected = 'Rejected',
    PendingGlosa = 'Pending_Glosa'
}

export enum PayerType {
    ARS = 'ARS',
    PATIENT = 'PATIENT'
}

export enum InvoiceEcfStatus {
    Draft = 'Draft',
    DGIIAccepted = 'DGII_Accepted',
    DGIIRejected = 'DGII_Rejected',
    Paid = 'Paid'
}

export interface ArsProvider {
    id: UUID;
    name: string;
    rnc: string; // Varchar(9)
    required_e_ncf_type: RequiredENcfType;
    billing_cycle_days: number;
}

export interface PatientPolicy {
    id: UUID;
    patient_id: UUID;
    ars_provider_id: UUID;
    nss: string;
    plan_type: string;
    status: PatientPolicyStatus;
}

export interface ServiceCatalog {
    id: UUID;
    simon_code: string;
    description: string;
    base_price_rd: number;
    is_itbis_exempt: boolean;
}

export interface Encounter {
    id: UUID;
    patient_id: UUID;
    doctor_id: UUID;
    date_time: Date;
    status: EncounterStatus;
}

export interface ArsAuthorization {
    id: UUID;
    encounter_id: UUID;
    ars_provider_id: UUID;
    authorization_number: string;
    total_covered_amount: number;
    authorization_date: Date;
    status: ArsAuthorizationStatus;
}

export interface InvoiceEcf {
    id: UUID;
    encounter_id: UUID;
    payer_type: PayerType;
    payer_id: UUID; // Polymorphic: refers to either ArsProvider.id or Patient.id
    payer_rnc_cedula: string;
    e_ncf: string; // Varchar(13)
    total_amount: number;
    dgii_track_id?: string;
    status: InvoiceEcfStatus;
}

export interface InvoiceLineItem {
    id: UUID;
    invoice_ecf_id: UUID;
    service_id: UUID;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

/**
 * e-CF Final DGII JSON Schema definition Interfaces
 */
export interface EcfHeaderNode {
    IdDoc: {
        TipoeCF: string;
        eNCF: string;
        FechaVencimientoSecuencia: string;
        IndicadorMontoGravado: string;
        TipoIngresos: string;
    };
    Emisor: {
        RNCEmisor: string;
        RazonSocialEmisor: string;
        NombreComercial: string;
        Sucursal: string;
        DireccionEmisor: string;
        Municipio: string;
        Provincia: string;
        FechaEmision: string;
        IndicadorAgenteRetencion: string;
    };
    Comprador: {
        RNCComprador: string;
        RazonSocialComprador?: string;
    };
    Totales: {
        MontoTotal: number;
        MontoTotalGravado: number;
        MontoTotalExento: number;
        TotalITBIS: number;
        TotalITBISRetenido: number;
        TotalImpuestosAdicionales: number;
    };
}

export interface EcfDetailNode {
    Item: {
        NumeroLinea: number;
        CodigoItem: string;
        IndicadorFacturacion: string;
        NombreItem: string;
        CantidadItem: number;
        PrecioUnitarioItem: number;
        DescuentoMonto: number;
        SubTotalItem: number;
        MontoItem: number;
    };
}

export interface DGIIEcfPayload {
    eCF: {
        Encabezado: EcfHeaderNode;
        Detalles: EcfDetailNode[];
    };
}
