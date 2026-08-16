"use client";

import type { BirthCertificateData } from "@/types/certificate";
import { A4Document } from "../shared/A4Document";
import {
  CertSection,
  CertHeader,
  CertFieldLine,
  CertCheckboxLine,
  CertDateLine,
  CertAddressSection,
  CertOfficeUse,
} from "../shared/CertificateFields";
import { PrintableCheckboxGroup } from "../shared/PrintableCheckbox";

interface BirthCertificateDocumentProps {
  data: BirthCertificateData;
  id?: string;
}

export function BirthCertificateDocument({
  data,
  id = "certificate-document",
}: BirthCertificateDocumentProps) {
  return (
    <A4Document id={id}>
      <CertHeader
        titleUr="درخواست فارم برائے پیدائش رجسٹریشن"
        header={data.header}
      />

      <CertSection titleEn="Applicant's Details" titleUr="درخواست دہندہ کے کوائف">
        <CertFieldLine
          labelEn="Applicant Name"
          labelUr="درخواست دہندہ کا نام"
          bilingual={data.applicantName}
        />
        <CertFieldLine
          labelEn="Applicant CNIC Number"
          labelUr="درخواست دہندہ کا شناختی کارڈ نمبر"
          bilingual={data.applicantCnic}
        />
      </CertSection>

      <CertSection titleEn="Child's Details" titleUr="بچے کے کوائف">
        <CertFieldLine labelEn="Child Name" labelUr="بچے کا نام" bilingual={data.childName} />
        <CertFieldLine labelEn="Relation of Child" labelUr="بچے کا رشتہ" bilingual={data.relationOfChild} />
        <CertFieldLine labelEn="Religion" labelUr="مذہب" bilingual={data.religion} />
        <CertFieldLine labelEn="Disability" labelUr="معذوری" bilingual={data.disability} />
        <CertCheckboxLine
          labelEn="Vaccinated"
          labelUr="ویکسین ہو چکی ہے"
          options={[
            { value: "yes", labelEn: "Yes", labelUr: "ہاں" },
            { value: "no", labelEn: "No", labelUr: "نہیں" },
          ]}
          selected={data.vaccinated}
        />

        <CertCheckboxLine
          labelEn="Place of Birth"
          labelUr="جائے پیدائش"
          options={[
            { value: "hospital", labelEn: "Hospital", labelUr: "ہسپتال" },
            { value: "home", labelEn: "Home", labelUr: "گھر" },
            { value: "healthCenter", labelEn: "Health Center", labelUr: "ہیلتھ سنٹر" },
            { value: "other", labelEn: "Other", labelUr: "دیگر" },
          ]}
          selected={data.placeOfBirth}
        />

        <CertFieldLine labelEn="District of Birth" labelUr="پیدائش کا ضلع" bilingual={data.districtOfBirth} />
        <CertDateLine labelEn="Date of Birth" labelUr="تاریخ پیدائش" date={data.dateOfBirth} />

        <CertCheckboxLine
          labelEn="Are They Twins"
          labelUr="کیا جڑواں بہن بھائی ہیں"
          options={[
            { value: "yes", labelEn: "Yes", labelUr: "ہاں" },
            { value: "no", labelEn: "No", labelUr: "نہیں" },
          ]}
          selected={data.areTwins}
        />

        <CertCheckboxLine
          labelEn="Gender"
          labelUr="جنس"
          options={[
            { value: "male", labelEn: "Male", labelUr: "مرد" },
            { value: "female", labelEn: "Female", labelUr: "عورت" },
          ]}
          selected={data.gender}
        />
      </CertSection>

      <CertSection titleEn="Parental Information" titleUr="والدین کی معلومات">
        <CertFieldLine labelEn="Father's Name" labelUr="والد کا نام" bilingual={data.fatherName} />
        <CertFieldLine labelEn="Father's CNIC/Passport Number" labelUr="والد کا شناختی کارڈ یا پاسپورٹ نمبر" bilingual={data.fatherCnic} />
        <CertFieldLine labelEn="Father's Nationality" labelUr="والد کی قومیت" bilingual={data.fatherNationality} />
        <CertFieldLine labelEn="Mother's Name" labelUr="والدہ کا نام" bilingual={data.motherName} />
        <CertFieldLine labelEn="Mother's CNIC/Passport Number" labelUr="والدہ کا شناختی کارڈ یا پاسپورٹ نمبر" bilingual={data.motherCnic} />
        <CertFieldLine labelEn="Mother's Nationality" labelUr="والدہ کی قومیت" bilingual={data.motherNationality} />
        <CertFieldLine labelEn="Grand Father's Name" labelUr="دادا کا نام" bilingual={data.grandFatherName} />
        <CertFieldLine labelEn="Grand Father's CNIC Number" labelUr="دادا کا شناختی کارڈ نمبر" bilingual={data.grandFatherCnic} />
        <CertFieldLine labelEn="Doctor/Mid Wife's Name" labelUr="ڈاکٹر/دائی کا نام" bilingual={data.doctorMidwifeName} />
        <CertFieldLine labelEn="Old Registration Number" labelUr="پرانا رجسٹریشن نمبر" bilingual={data.oldRegistrationNumber} />
        <CertDateLine labelEn="Registration Date" labelUr="رجسٹریشن کی تاریخ" date={data.registrationDate} />
      </CertSection>

      <CertAddressSection titleEn="Address" titleUr="پتہ" address={data.address} />

      <CertFieldLine
        labelEn="Verified By"
        labelUr="تصدیق کنندہ"
        bilingual={data.verifiedBy}
        className="px-1 mb-[4px]"
      />

      <CertOfficeUse prefix="B" officeUse={data.officeUse} />
    </A4Document>
  );
}
