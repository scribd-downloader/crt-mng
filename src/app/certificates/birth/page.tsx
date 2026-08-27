"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CertificateEditor } from "@/components/certificates/shared/CertificateEditor";
import { BirthCertificateForm } from "@/components/certificates/birth/BirthCertificateForm";
import { BirthCertificateDocument } from "@/components/certificates/birth/BirthCertificateDocument";
import { createEmptyBirthData } from "@/types/certificate";

export default function BirthCertificatePage() {
  return (
    <DashboardLayout>
      <CertificateEditor
        type="birth"
        title="Birth Certificate"
        initialData={createEmptyBirthData()}
        FormComponent={BirthCertificateForm}
        DocumentComponent={BirthCertificateDocument}
      />
    </DashboardLayout>
  );
}
