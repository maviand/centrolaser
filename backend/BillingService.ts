import {
    Encounter,
    ServiceCatalog,
    ArsAuthorization,
    InvoiceEcf,
    PayerType,
    InvoiceEcfStatus,
    PatientPolicy,
    UUID
} from './schema';
import { db } from './firebaseConfig';
import { doc, getDoc, collection, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export class BillingService {
    /**
     * Defines Business Logic / Trigger: "The Copago Splitter"
     * Reads from Firestore and uses Batched Writes for Atomic Commits
     */
    public async processCompletedEncounter(
        encounterId: UUID,
        serviceId: UUID,
        patientId: UUID,
        patientCedula: string,
        arsId?: UUID,
        arsRnc?: string
    ): Promise<InvoiceEcf[]> {
        const generatedInvoices: InvoiceEcf[] = [];

        // Using Firestore Batched Writes for Atomicity
        const batch = writeBatch(db);
        const invoicesRef = collection(db, 'invoices_ecf');

        // Step A: Query the "services_catalog" for the total base_price_rd
        const serviceDocRef = doc(db, 'services_catalog', serviceId);
        const serviceSnap = await getDoc(serviceDocRef);
        if (!serviceSnap.exists()) throw new Error("Service not found in catalog");

        const service = serviceSnap.data() as ServiceCatalog;
        const basePriceRd = service.base_price_rd;

        // Optional Steps B-E: If there's an ARS involved
        if (arsId && arsRnc) {
            // Step B: Query "ars_authorizations" for the total_covered_amount linked to this encounter
            const authQuery = query(collection(db, 'ars_authorizations'), where('encounter_id', '==', encounterId));
            const authSnap = await getDocs(authQuery);

            let authorization: ArsAuthorization | undefined;
            if (!authSnap.empty) {
                authorization = authSnap.docs[0].data() as ArsAuthorization;
            }

            if (authorization && authorization.total_covered_amount > 0) {
                // Step C: Create Row 1 in "invoices_ecf" where payer_type is 'ARS'
                const arsInvoiceId = uuidv4();
                const arsInvoice: InvoiceEcf = {
                    id: arsInvoiceId,
                    encounter_id: encounterId,
                    payer_type: PayerType.ARS,
                    payer_id: arsId,
                    payer_rnc_cedula: arsRnc,
                    e_ncf: '', // To be generated/assigned later
                    total_amount: authorization.total_covered_amount,
                    status: InvoiceEcfStatus.Draft
                };

                batch.set(doc(invoicesRef, arsInvoiceId), arsInvoice);
                generatedInvoices.push(arsInvoice);

                // Step D: Calculate the difference (base_price_rd minus total_covered_amount)
                const copago = basePriceRd - authorization.total_covered_amount;

                // Step E: Create Row 2 in "invoices_ecf" where payer_type is 'PATIENT'
                if (copago > 0) {
                    const patientInvoiceId = uuidv4();
                    const patientInvoice: InvoiceEcf = {
                        id: patientInvoiceId,
                        encounter_id: encounterId,
                        payer_type: PayerType.PATIENT,
                        payer_id: patientId,
                        payer_rnc_cedula: patientCedula,
                        e_ncf: '',
                        total_amount: copago,
                        status: InvoiceEcfStatus.Draft
                    };

                    batch.set(doc(invoicesRef, patientInvoiceId), patientInvoice);
                    generatedInvoices.push(patientInvoice);
                }

                await batch.commit();
                return generatedInvoices;
            }
        }

        // Default Fallback: No ARS or no authorization found, Bill Patient 100%
        const patientInvoiceId = uuidv4();
        const patientInvoice: InvoiceEcf = {
            id: patientInvoiceId,
            encounter_id: encounterId,
            payer_type: PayerType.PATIENT,
            payer_id: patientId,
            payer_rnc_cedula: patientCedula,
            e_ncf: '',
            total_amount: basePriceRd,
            status: InvoiceEcfStatus.Draft
        };

        batch.set(doc(invoicesRef, patientInvoiceId), patientInvoice);
        generatedInvoices.push(patientInvoice);

        await batch.commit();
        return generatedInvoices;
    }
}
