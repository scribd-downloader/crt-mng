"use client";

import type { DeathCertificateData } from "@/types/certificate";
import { A4Document } from "../shared/A4Document";
import {
  CertSection,
  CertHeader,
  CertFieldLine,
  CertCheckboxLine,
  CertDateLine,
  CertAgeLine,
  CertAddressSection,
  CertOfficeUse,
} from "../shared/CertificateFields";

interface DeathCertificateDocumentProps {
  data: DeathCertificateData;
  id?: string;
}

export function DeathCertificateDocument({
  data,
  id = "certificate-document",
}: DeathCertificateDocumentProps) {
  return (
    <A4Document id={id}>
      <CertHeader
        titleUr="درخواست فارم برائے وفات رجسٹریشن"
        header={data.header}
      />

      <CertSection titleEn="Deceased Person's Details" titleUr="مرحوم کے کوائف">
        <CertFieldLine labelEn="Deceased Name" labelUr="مرحوم کا نام" bilingual={data.deceasedName} />
        <CertFieldLine labelEn="Deceased CNIC/Passport Number" labelUr="مرحوم کا شناختی کارڈ نمبر" bilingual={data.deceasedCnic} />
        <CertFieldLine labelEn="Nationality" labelUr="قومیت" bilingual={data.nationality} />
        <CertFieldLine labelEn="Religion" labelUr="مذہب" bilingual={data.religion} />
        <CertFieldLine labelEn="Marital Status" labelUr="ازدواجی حیثیت" bilingual={data.maritalStatus} />
        <CertCheckboxLine
          labelEn="Gender"
          labelUr="جنس"
          options={[
            { value: "male", labelEn: "Male", labelUr: "مرد" },
            { value: "female", labelEn: "Female", labelUr: "عورت" },
          ]}
          selected={data.gender}
        />
        <CertCheckboxLine
          labelEn="Nature of Death"
          labelUr="کیفیت وفات"
          options={[
            { value: "normal", labelEn: "Normal", labelUr: "فطری" },
            { value: "deadBodyFound", labelEn: "Dead Body Found", labelUr: "لاش ملی" },
          ]}
          selected={data.natureOfDeath}
        />
        <CertFieldLine labelEn="Reason of Death" labelUr="وجہ وفات" bilingual={data.reasonOfDeath} />
        <CertDateLine labelEn="Date of Birth" labelUr="تاریخ پیدائش" date={data.dateOfBirth} />
        <CertDateLine labelEn="Date of Death" labelUr="تاریخ وفات" date={data.dateOfDeath} />
      </CertSection>

      <CertSection titleEn="Applicant's Details" titleUr="درخواست دہندہ کے کوائف">
        <CertFieldLine labelEn="Applicant's Name" labelUr="درخواست دہندہ کا نام" bilingual={data.applicantName} />
        <CertFieldLine labelEn="Applicant's CNIC/Passport" labelUr="درخواست دہندہ کا شناختی کارڈ" bilingual={data.applicantCnic} />
        <CertFieldLine labelEn="Relation with Deceased" labelUr="مرحوم سے تعلق" bilingual={data.relationWithDeceased} />
      </CertSection>

      <CertSection titleEn="Husband's Information" titleUr="شوہر کی معلومات">
        <CertFieldLine labelEn="Husband's Name" labelUr="شوہر کا نام" bilingual={data.husbandName} />
        <CertFieldLine labelEn="Husband's CNIC/Passport" labelUr="شوہر کا شناختی کارڈ" bilingual={data.husbandCnic} />
      </CertSection>

      <CertSection titleEn="Parental Information" titleUr="والدین کی معلومات">
        <CertFieldLine labelEn="Father's Name" labelUr="والد کا نام" bilingual={data.fatherName} />
        <CertFieldLine labelEn="Father's CNIC/Passport" labelUr="والد کا شناختی کارڈ" bilingual={data.fatherCnic} />
        <CertFieldLine labelEn="Mother's Name" labelUr="والدہ کا نام" bilingual={data.motherName} />
        <CertFieldLine labelEn="Mother's CNIC/Passport" labelUr="والدہ کا شناختی کارڈ" bilingual={data.motherCnic} />
      </CertSection>

      <CertSection titleEn="Buried By" titleUr="تدفین کنندہ">
        <CertFieldLine labelEn="Buried By Name" labelUr="تدفین کنندہ کا نام" bilingual={data.buriedByName} />
        <CertDateLine labelEn="Date of Burial" labelUr="تاریخ تدفین" date={data.dateOfBurial} />
        <CertFieldLine labelEn="Relation with Deceased" labelUr="متوفی سے رشتہ" bilingual={data.buriedByRelation} />
        <CertFieldLine labelEn="Buried By CNIC/Passport" labelUr="تدفین کنندہ کا شناختی کارڈ نمبر" bilingual={data.buriedByCnic} />
        <CertFieldLine labelEn="Place of Death" labelUr="جائے وفات" bilingual={data.placeOfDeath} />
        <CertFieldLine labelEn="Old Registration Number" labelUr="پرانا رجسٹریشن نمبر" bilingual={data.oldRegistrationNumber} />
        <CertFieldLine labelEn="Additional Info" labelUr="اضافی معلومات" bilingual={data.additionalInfo} />
        <CertFieldLine labelEn="Doctor's Name" labelUr="ڈاکٹر کا نام" bilingual={data.doctorName} />
        <CertFieldLine labelEn="Place of Burial" labelUr="جگہ تدفین" bilingual={data.placeOfBurial} />
        <CertAgeLine labelEn="Sickness Period" labelUr="مدت علالت" days={data.sicknessPeriodDays} months={data.sicknessPeriodMonths} years={data.sicknessPeriodYears} />
      </CertSection>

      <CertAddressSection titleEn="Address" titleUr="پتہ" address={data.address} />

      <CertFieldLine labelEn="Verified By" labelUr="تصدیق کنندہ" bilingual={data.verifiedBy} className="px-1 mb-[4px]" />

      <CertOfficeUse prefix="D" officeUse={data.officeUse} />
    </A4Document>
  );
}
