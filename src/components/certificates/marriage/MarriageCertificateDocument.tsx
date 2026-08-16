"use client";

import type { MarriageCertificateData, PersonDetails } from "@/types/certificate";
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

function PersonSection({
  titleEn,
  titleUr,
  person,
  groomOptions,
}: {
  titleEn: string;
  titleUr: string;
  person: PersonDetails;
  groomOptions: boolean;
}) {
  const maritalOptions = groomOptions
    ? [
        { value: "married", labelEn: "Married", labelUr: "شادی شدہ" },
        { value: "single", labelEn: "Unmarried", labelUr: "کنوارہ" },
        { value: "divorced", labelEn: "Divorcee", labelUr: "طلاق شدہ" },
        { value: "widower", labelEn: "Widower", labelUr: "رنڈوا" },
      ]
    : [
        { value: "married", labelEn: "Married", labelUr: "شادی شدہ" },
        { value: "single", labelEn: "Unmarried", labelUr: "کنواری" },
        { value: "divorced", labelEn: "Divorcee", labelUr: "مطلقہ" },
        { value: "widow", labelEn: "Widow", labelUr: "بیوہ" },
      ];

  return (
    <CertSection titleEn={titleEn} titleUr={titleUr}>
      <CertFieldLine labelEn="Name" labelUr="نام" bilingual={person.name} />
      <CertFieldLine labelEn="CNIC / Passport Number" labelUr="شناختی کارڈ یا پاسپورٹ نمبر" bilingual={person.cnic} />
      <CertFieldLine labelEn="Nationality" labelUr="قومیت" bilingual={person.nationality} />
      <CertAgeLine days={person.ageDays} months={person.ageMonths} years={person.ageYears} />
      <CertFieldLine labelEn="Religion" labelUr="مذہب" bilingual={person.religion} />
      <CertCheckboxLine
        labelEn="Marital Status"
        labelUr="ازدواجی حیثیت"
        options={maritalOptions}
        selected={person.maritalStatus || "single"}
      />
      <CertFieldLine labelEn="Father's Name" labelUr="والد کا نام" bilingual={person.fatherName} />
      <CertFieldLine labelEn="Father's CNIC/Passport Number" labelUr="والد کا شناختی کارڈ یا پاسپورٹ نمبر" bilingual={person.fatherCnic} />
    </CertSection>
  );
}

export function MarriageCertificateDocument({
  data,
  id = "certificate-document",
}: {
  data: MarriageCertificateData;
  id?: string;
}) {
  return (
    <A4Document id={id}>
      <CertHeader titleUr="درخواست فارم برائے نکاح رجسٹریشن" header={data.header} />

      <PersonSection titleEn="Particulars of Groom" titleUr="دولہا کے کوائف" person={data.groom} groomOptions />

      <PersonSection titleEn="Particulars of Bride" titleUr="دولہن کے کوائف" person={data.bride} groomOptions={false} />

      <CertSection titleEn="Dower/Solemnized" titleUr="حق مہر اور نکاح رجسٹرار">
        <CertDateLine labelEn="Date of Marriage" labelUr="شادی کی تاریخ" date={data.dateOfMarriage} />
        <CertDateLine labelEn="Registration Date" labelUr="رجسٹریشن کی تاریخ" date={data.registrationDate} />
        <CertFieldLine labelEn="Old Registration Number" labelUr="پرانا رجسٹریشن نمبر" bilingual={data.oldRegistrationNumber} />
        <CertFieldLine labelEn="Marriage Solemnized By Name" labelUr="نکاح رجسٹرار/خواں کا نام" bilingual={data.solemnizedByName} />
        <CertFieldLine labelEn="Marriage Solemnized By CNIC" labelUr="نکاح رجسٹرار کا شناختی کارڈ نمبر" bilingual={data.solemnizedByCnic} />
        <CertFieldLine labelEn="Amount of Dower with Detail" labelUr="رقم حق مہر مع تفصیل" bilingual={data.dowerAmount} />
      </CertSection>

      <CertAddressSection titleEn="Address of Groom" titleUr="دولہے کا پتہ" address={data.groomAddress} />
      <CertAddressSection titleEn="Address of Bride" titleUr="دولہن کا پتہ" address={data.brideAddress} />

      <CertFieldLine labelEn="Verified By" labelUr="تصدیق کنندہ" bilingual={data.verifiedBy} className="px-1 mb-[4px]" />

      <CertOfficeUse prefix="M" officeUse={data.officeUse} />
    </A4Document>
  );
}
