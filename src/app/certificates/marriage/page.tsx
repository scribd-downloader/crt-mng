"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CertificateEditor } from "@/components/certificates/shared/CertificateEditor";
import { MarriageCertificateForm } from "@/components/certificates/marriage/MarriageCertificateForm";
import { MarriageCertificateDocument } from "@/components/certificates/marriage/MarriageCertificateDocument";
import { createEmptyMarriageData } from "@/types/certificate";

export default function MarriageCertificatePage() {
  return (
    <DashboardLayout>
      <CertificateEditor
        type="marriage"
        title="Marriage Certificate"
        initialData={createEmptyMarriageData()}
        FormComponent={MarriageCertificateForm}
        DocumentComponent={MarriageCertificateDocument}
      />
    </DashboardLayout>
  );
}
