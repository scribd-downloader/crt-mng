"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CertificateEditor } from "@/components/certificates/shared/CertificateEditor";
import { DeathCertificateForm } from "@/components/certificates/death/DeathCertificateForm";
import { DeathCertificateDocument } from "@/components/certificates/death/DeathCertificateDocument";
import { createEmptyDeathData } from "@/types/certificate";

export default function DeathCertificatePage() {
  return (
    <DashboardLayout>
      <CertificateEditor
        type="death"
        title="Death Certificate"
        initialData={createEmptyDeathData()}
        FormComponent={DeathCertificateForm}
        DocumentComponent={DeathCertificateDocument}
      />
    </DashboardLayout>
  );
}
