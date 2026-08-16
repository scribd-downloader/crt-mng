"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CertificateEditor } from "@/components/certificates/shared/CertificateEditor";
import { DivorceCertificateForm } from "@/components/certificates/divorce/DivorceCertificateForm";
import { DivorceCertificateDocument } from "@/components/certificates/divorce/DivorceCertificateDocument";
import { createEmptyDivorceData } from "@/types/certificate";

export default function DivorceCertificatePage() {
  return (
    <DashboardLayout>
      <CertificateEditor
        type="divorce"
        title="Divorce Certificate"
        initialData={createEmptyDivorceData()}
        FormComponent={DivorceCertificateForm}
        DocumentComponent={DivorceCertificateDocument}
      />
    </DashboardLayout>
  );
}
