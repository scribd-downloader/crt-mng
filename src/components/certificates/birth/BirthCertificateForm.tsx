"use client";

import { BilingualField } from "@/components/bilingual/BilingualField";
import {
  FormSection,
  HeaderFields,
  AddressFieldsForm,
  OfficeUseFields,
  DateFieldInput,
  RadioGroupField,
  ReligionSelectField,
} from "@/components/forms/FormFields";
import type { BirthCertificateData } from "@/types/certificate";

interface BirthCertificateFormProps {
  data: BirthCertificateData;
  onChange: (data: BirthCertificateData) => void;
  activeLanguage: "en" | "ur";
}

export function BirthCertificateForm({
  data,
  onChange,
  activeLanguage,
}: BirthCertificateFormProps) {
  const set = <K extends keyof BirthCertificateData>(
    key: K,
    value: BirthCertificateData[K]
  ) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <HeaderFields
        header={data.header}
        onChange={(h) => set("header", h)}
        activeLanguage={activeLanguage}
      />

      <FormSection titleEn="Applicant's Details" titleUr="درخواست دہندہ کے کوائف">
        <BilingualField labelEn="Applicant Name" labelUr="درخواست دہندہ کا نام" value={data.applicantName} onChange={(v) => set("applicantName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Applicant CNIC Number" labelUr="درخواست دہندہ کا شناختی کارڈ نمبر" value={data.applicantCnic} onChange={(v) => set("applicantCnic", v)} activeLanguage={activeLanguage} type="cnic" />
      </FormSection>

      <FormSection titleEn="Child's Details" titleUr="بچے کے کوائف">
        <BilingualField labelEn="Child Name" labelUr="بچے کا نام" value={data.childName} onChange={(v) => set("childName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Relation of Child" labelUr="بچے کا رشتہ" value={data.relationOfChild} onChange={(v) => set("relationOfChild", v)} activeLanguage={activeLanguage} />
        <ReligionSelectField value={data.religion} onChange={(v) => set("religion", v)} />
        <BilingualField labelEn="Disability" labelUr="معذوری" value={data.disability} onChange={(v) => set("disability", v)} activeLanguage={activeLanguage} />
        <RadioGroupField labelEn="Vaccinated" labelUr="ویکسین" options={[{ value: "yes", labelEn: "Yes", labelUr: "ہاں" }, { value: "no", labelEn: "No", labelUr: "نہیں" }]} value={data.vaccinated} onChange={(v) => set("vaccinated", v as BirthCertificateData["vaccinated"])} />
        <RadioGroupField labelEn="Place of Birth" labelUr="جائے پیدائش" options={[{ value: "hospital", labelEn: "Hospital", labelUr: "ہسپتال" }, { value: "home", labelEn: "Home", labelUr: "گھر" }, { value: "healthCenter", labelEn: "Health Center", labelUr: "ہیلتھ سنٹر" }, { value: "other", labelEn: "Other", labelUr: "دیگر" }]} value={data.placeOfBirth} onChange={(v) => set("placeOfBirth", v as BirthCertificateData["placeOfBirth"])} />
        <BilingualField labelEn="District of Birth" labelUr="پیدائش کا ضلع" value={data.districtOfBirth} onChange={(v) => set("districtOfBirth", v)} activeLanguage={activeLanguage} />
        <DateFieldInput labelEn="Date of Birth" labelUr="تاریخ پیدائش" value={data.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} />
        <RadioGroupField labelEn="Are They Twins" labelUr="کیا جڑواں" options={[{ value: "yes", labelEn: "Yes", labelUr: "ہاں" }, { value: "no", labelEn: "No", labelUr: "نہیں" }]} value={data.areTwins} onChange={(v) => set("areTwins", v as BirthCertificateData["areTwins"])} />
        <RadioGroupField labelEn="Gender" labelUr="جنس" options={[{ value: "male", labelEn: "Male", labelUr: "مرد" }, { value: "female", labelEn: "Female", labelUr: "عورت" }]} value={data.gender} onChange={(v) => set("gender", v as BirthCertificateData["gender"])} />
      </FormSection>

      <FormSection titleEn="Parental Information" titleUr="والدین کی معلومات">
        <BilingualField labelEn="Father's Name" labelUr="والد کا نام" value={data.fatherName} onChange={(v) => set("fatherName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Father's CNIC/Passport" labelUr="والد کا شناختی کارڈ" value={data.fatherCnic} onChange={(v) => set("fatherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Father's Nationality" labelUr="والد کی قومیت" value={data.fatherNationality} onChange={(v) => set("fatherNationality", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Mother's Name" labelUr="والدہ کا نام" value={data.motherName} onChange={(v) => set("motherName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Mother's CNIC/Passport" labelUr="والدہ کا شناختی کارڈ" value={data.motherCnic} onChange={(v) => set("motherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Mother's Nationality" labelUr="والدہ کی قومیت" value={data.motherNationality} onChange={(v) => set("motherNationality", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Grand Father's Name" labelUr="دادا کا نام" value={data.grandFatherName} onChange={(v) => set("grandFatherName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Grand Father's CNIC" labelUr="دادا کا شناختی کارڈ" value={data.grandFatherCnic} onChange={(v) => set("grandFatherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Doctor/Midwife Name" labelUr="ڈاکٹر/دائی کا نام" value={data.doctorMidwifeName} onChange={(v) => set("doctorMidwifeName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Old Registration Number" labelUr="پرانا رجسٹریشن نمبر" value={data.oldRegistrationNumber} onChange={(v) => set("oldRegistrationNumber", v)} activeLanguage={activeLanguage} />
        <DateFieldInput labelEn="Registration Date" labelUr="رجسٹریشن کی تاریخ" value={data.registrationDate} onChange={(v) => set("registrationDate", v)} />
      </FormSection>

      <AddressFieldsForm address={data.address} onChange={(a) => set("address", a)} activeLanguage={activeLanguage} />

      <FormSection titleEn="Verification" titleUr="تصدیق">
        <BilingualField labelEn="Verified By" labelUr="تصدیق کنندہ" value={data.verifiedBy} onChange={(v) => set("verifiedBy", v)} activeLanguage={activeLanguage} />
      </FormSection>

      <OfficeUseFields officeUse={data.officeUse} onChange={(o) => set("officeUse", o)} activeLanguage={activeLanguage} />
    </div>
  );
}
