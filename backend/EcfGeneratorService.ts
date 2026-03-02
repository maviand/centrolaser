import { InvoiceEcf, InvoiceLineItem, PayerType, UUID, ServiceCatalog, DGIIEcfPayload, EcfDetailNode } from './schema';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export class EcfGeneratorService {
    /**
     * Constructs the payload for the Dominican Republic DGII e-CF API.
     * Pulls data explicitly from Firestore.
     */
    public async generateEcfPayload(
        invoiceId: UUID,
        lineItems: InvoiceLineItem[]
    ): Promise<DGIIEcfPayload> {
        // 1. Fetch the invoice record from Firestore
        const invoiceSnap = await getDoc(doc(db, 'invoices_ecf', invoiceId));
        if (!invoiceSnap.exists()) throw new Error(`Invoice with ID ${invoiceId} not found`);
        const invoice = invoiceSnap.data() as InvoiceEcf;

        // 2 & 3. Determine TipoeCF and Buyer identifier based on Payer Type
        let tipoeCF = '';
        let compradorName = '';

        if (invoice.payer_type === PayerType.ARS) {
            tipoeCF = '31';
            compradorName = "ARS Provider SA";
        } else if (invoice.payer_type === PayerType.PATIENT) {
            tipoeCF = '32';
            compradorName = "Consumidor Final";
        } else {
            throw new Error(`Invalid Payer Type: ${invoice.payer_type}`);
        }

        // 4. Iterate through related "invoice_line_items".
        const detalles: EcfDetailNode[] = [];
        for (let index = 0; index < lineItems.length; index++) {
            const item = lineItems[index];
            const serviceSnap = await getDoc(doc(db, 'services_catalog', item.service_id));
            if (!serviceSnap.exists()) throw new Error(`Service Catalog invalid for item ${item.service_id}`);
            const service = serviceSnap.data() as ServiceCatalog;

            const indicadorFacturacion = service.is_itbis_exempt ? "2" : "1";

            detalles.push({
                Item: {
                    NumeroLinea: index + 1,
                    CodigoItem: service.simon_code,
                    IndicadorFacturacion: indicadorFacturacion, // 2 = ITBIS Exempt
                    NombreItem: service.description,
                    CantidadItem: item.quantity,
                    PrecioUnitarioItem: item.unit_price,
                    DescuentoMonto: 0.00,
                    SubTotalItem: item.subtotal,
                    MontoItem: item.subtotal
                }
            });
        }

        const totalsAggr = {
            MontoTotal: invoice.total_amount,
            MontoTotalGravado: 0.00,
            MontoTotalExento: invoice.total_amount,
            TotalITBIS: 0.00,
            TotalITBISRetenido: 0.00,
            TotalImpuestosAdicionales: 0.00
        };

        const payload: DGIIEcfPayload = {
            eCF: {
                Encabezado: {
                    IdDoc: {
                        TipoeCF: tipoeCF,
                        eNCF: invoice.e_ncf || `E${tipoeCF}0000000001`,
                        FechaVencimientoSecuencia: "2026-12-31",
                        IndicadorMontoGravado: "0",
                        TipoIngresos: "01"
                    },
                    Emisor: {
                        RNCEmisor: "130000000",
                        RazonSocialEmisor: "Centro Laser SRL",
                        NombreComercial: "Centro Laser",
                        Sucursal: "Principal",
                        DireccionEmisor: "Calle Ejemplo 123, Sector Naco",
                        Municipio: "01",
                        Provincia: "01",
                        FechaEmision: new Date().toISOString().split('T')[0],
                        IndicadorAgenteRetencion: "0"
                    },
                    Comprador: {
                        RNCComprador: invoice.payer_rnc_cedula,
                        RazonSocialComprador: compradorName
                    },
                    Totales: totalsAggr
                },
                Detalles: detalles
            }
        };

        return payload;
    }
}
