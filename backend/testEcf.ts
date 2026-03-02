import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { BillingService } from './BillingService';
import { EcfGeneratorService } from './EcfGeneratorService';
import { ArsAuthorizationStatus, PatientPolicyStatus } from './schema';
import { v4 as uuidv4 } from 'uuid';

async function runTest() {
    try {
        console.log('--- Connecting to Firestore & Seeding Demo Constants ---');
        const arsId = uuidv4();
        const patientId = uuidv4();
        const encounterId = uuidv4();
        const serviceId = uuidv4();

        // 1. Seed Service Catalog
        await setDoc(doc(db, 'services_catalog', serviceId), {
            id: serviceId,
            simon_code: 'SIMON-12345',
            description: 'Consulta Oftalmologica',
            base_price_rd: 800.00,
            is_itbis_exempt: true
        });

        // 2. Seed Patient Policy
        await setDoc(doc(db, 'patient_policies', uuidv4()), {
            patient_id: patientId,
            ars_provider_id: arsId,
            nss: '123456789',
            plan_type: 'Platino',
            status: PatientPolicyStatus.Active
        });

        // 3. Seed ARS Authorization
        await setDoc(doc(db, 'ars_authorizations', uuidv4()), {
            encounter_id: encounterId,
            ars_provider_id: arsId,
            authorization_number: 'AUTH-9876',
            total_covered_amount: 600.00,
            authorization_date: new Date().toISOString(),
            status: ArsAuthorizationStatus.Approved
        });

        console.log('--- Database Seeding Complete ---');

        console.log('--- Running Copago Splitter via Batched Write ---');
        const billingService = new BillingService();
        const generatedInvoices = await billingService.processCompletedEncounter(
            encounterId,
            serviceId,
            patientId,
            "001-1234567-8", // Patient Cedula
            arsId,
            "130000000" // ARS RNC
        );

        console.log(`Generated ${generatedInvoices.length} invoices stored in Firestore.`);

        const arsInvoice = generatedInvoices.find(inv => inv.payer_type === 'ARS');
        if (arsInvoice) {
            console.log('\n--- Fetching & Generating e-CF Payload ---');
            const ecfService = new EcfGeneratorService();
            const payload = await ecfService.generateEcfPayload(arsInvoice.id, [
                {
                    id: uuidv4(),
                    invoice_ecf_id: arsInvoice.id,
                    service_id: serviceId,
                    quantity: 1,
                    unit_price: 800.00,
                    subtotal: 800.00
                }
            ]);

            console.log('e-CF Payload (TipoeCF 31 - ARS):');
            console.log(JSON.stringify(payload, null, 2));
        }
        process.exit(0);
    } catch (error) {
        console.error("Test execution failed:", error);
        process.exit(1);
    }
}

runTest();
