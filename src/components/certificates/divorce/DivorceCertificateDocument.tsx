"use client";

import type { DivorceCertificateData } from "@/types/certificate";
import { A4Document } from "../shared/A4Document";
import {
  CertSection,
  CertHeader,
  CertFieldLine,
  CertDateLine,
  CertAddressSection,
  CertOfficeUse,
} from "../shared/CertificateFields";

export function DivorceCertificateDocument({
  data,
  id = "certificate-document",
}: {
  data: DivorceCertificateData;
  id?: string;
}) {
  return (
    <A4Document id={id}>
      <CertHeader titleUr="درخواست فارم برائے طلاق رجسٹریشن" header={data.header} />

      <CertSection titleEn="Divorcer's Details" titleUr="طلاق دہندہ کے کوائف">
        <CertFieldLine labelEn="Name" labelUr="نام" bilingual={data.divorcerName} />
        <CertFieldLine labelEn="CNIC / Passport Number" labelUr="شناختی کارڈ یا پاسپورٹ نمبر" bilingual={data.divorcerCnic} />
        <CertFieldLine labelEn="Nationality" labelUr="قومیت" bilingual={data.divorcerNationality} />
        <CertFieldLine labelEn="Religion" labelUr="مذہب" bilingual={data.divorcerReligion} />
        <CertFieldLine labelEn="Father's Name" labelUr="والد کا نام" bilingual={data.divorcerFatherName} />
        <CertFieldLine labelEn="Father's CNIC/Passport Number" labelUr="والد کا شناختی کارڈ یا پاسپورٹ نمبر" bilingual={data.divorcerFatherCnic} />
      </CertSection>

      <CertSection titleEn="Divorcee's Details" titleUr="مطلقہ کے کوائف">
        <CertFieldLine labelEn="Name" labelUr="نام" bilingual={data.divorceeName} />
        <CertFieldLine labelEn="CNIC / Passport Number" labelUr="شناختی کارڈ یا پاسپورٹ نمبر" bilingual={data.divorceeCnic} />
        <CertFieldLine labelEn="Nationality" labelUr="قومیت" bilingual={data.divorceeNationality} />
        <CertFieldLine labelEn="Religion" labelUr="مذہب" bilingual={data.divorceeReligion} />
        <CertFieldLine labelEn="Father's Name" labelUr="والد کا نام" bilingual={data.divorceeFatherName} />
        <CertFieldLine labelEn="Father's CNIC/Passport Number" labelUr="والد کا شناختی کارڈ یا پاسپورٹ نمبر" bilingual={data.divorceeFatherCnic} />
      </CertSection>

      <CertSection titleEn="Divorce Detail Information" titleUr="طلاق کے متعلق معلومات">
        <CertFieldLine labelEn="Authority for granting Divorce" labelUr="مجاز برائے عطائے طلاق" bilingual={data.authorityForDivorce} />
        <CertFieldLine labelEn="Detail of Divorce and custody of children" labelUr="تفصیل نسبت طلاق و کفالت اولاد" bilingual={data.divorceDetail} />
        <CertFieldLine labelEn="Place of Marriage" labelUr="مقام نکاح" bilingual={data.placeOfMarriage} />
        <CertFieldLine labelEn="Details of Proceedings of Arbitration" labelUr="ثالثی کمیٹی کارروائی کی تفصیل" bilingual={data.arbitrationDetails} />
        <CertFieldLine labelEn="No of Children from Wedlock" labelUr="رشتہ ازدواج میں بچوں کی کل تعداد" valueEn={data.childrenFromWedlock} valueUr={data.childrenFromWedlock} />
        <CertFieldLine labelEn="No of previous Divorces of Husband" labelUr="شوہر کی گزشتہ طلاقوں کی تعداد" valueEn={data.previousDivorcesHusband} valueUr={data.previousDivorcesHusband} />
        <CertFieldLine labelEn="No of previous Divorces of Wife" labelUr="بیوی کی گزشتہ طلاقوں کی تعداد" valueEn={data.previousDivorcesWife} valueUr={data.previousDivorcesWife} />
        <CertDateLine labelEn="Conciliation Proceeding Failure Date" labelUr="تاریخ ناکامی ثالثی" date={data.conciliationFailureDate} />
        <CertDateLine labelEn="Date of Notice for Divorce" labelUr="تاریخ اعلان/نوٹس طلاق" date={data.noticeForDivorceDate} />
        <CertDateLine labelEn="Date of Registration" labelUr="تاریخ اندراج" date={data.registrationDate} />
        <CertDateLine labelEn="Date of Marriage" labelUr="تاریخ شادی" date={data.marriageDate} />
        <CertDateLine labelEn="Date of Decision of Divorce" labelUr="تاریخ موثر طلاق" date={data.divorceDecisionDate} />
      </CertSection>

      <CertAddressSection titleEn="Divorcer's Address" titleUr="طلاق دہندہ کا پتہ" address={data.divorcerAddress} />
      <CertAddressSection titleEn="Divorcee's Address" titleUr="مطلقہ کا پتہ" address={data.divorceeAddress} />

      <CertFieldLine labelEn="Verified By" labelUr="تصدیق کنندہ" bilingual={data.verifiedBy} className="px-1 mb-[4px]" />

      <CertOfficeUse prefix="V" officeUse={data.officeUse} />
    </A4Document>
  );
}
