"use client";

import { BilingualField } from "@/components/bilingual/BilingualField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormSection,
  HeaderFields,
  AddressFieldsForm,
  OfficeUseFields,
  DateFieldInput,
  RadioGroupField,
  ReligionSelectField,
} from "@/components/forms/FormFields";
import type { DeathCertificateData } from "@/types/certificate";

export function DeathCertificateForm({
  data,
  onChange,
  activeLanguage,
}: {
  data: DeathCertificateData;
  onChange: (data: DeathCertificateData) => void;
  activeLanguage: "en" | "ur";
}) {
  const set = <K extends keyof DeathCertificateData>(key: K, value: DeathCertificateData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <HeaderFields header={data.header} onChange={(h) => set("header", h)} activeLanguage={activeLanguage} />

      <FormSection titleEn="Deceased Person's Details" titleUr="مرحوم کے کوائف">
        <BilingualField labelEn="Deceased Name" labelUr="مرحوم کا نام" value={data.deceasedName} onChange={(v) => set("deceasedName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Deceased CNIC/Passport" labelUr="مرحوم کا شناختی کارڈ" value={data.deceasedCnic} onChange={(v) => set("deceasedCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Nationality" labelUr="قومیت" value={data.nationality} onChange={(v) => set("nationality", v)} activeLanguage={activeLanguage} />
        <ReligionSelectField value={data.religion} onChange={(v) => set("religion", v)} />
        <BilingualField labelEn="Marital Status" labelUr="ازدواجی حیثیت" value={data.maritalStatus} onChange={(v) => set("maritalStatus", v)} activeLanguage={activeLanguage} />
        <RadioGroupField labelEn="Gender" labelUr="جنس" options={[{ value: "male", labelEn: "Male", labelUr: "مرد" }, { value: "female", labelEn: "Female", labelUr: "عورت" }]} value={data.gender} onChange={(v) => set("gender", v as DeathCertificateData["gender"])} />
        <RadioGroupField labelEn="Nature of Death" labelUr="وفات کی نوعیت" options={[{ value: "normal", labelEn: "Normal", labelUr: "فطری" }, { value: "deadBodyFound", labelEn: "Dead Body Found", labelUr: "لاش برآمد" }]} value={data.natureOfDeath} onChange={(v) => set("natureOfDeath", v as DeathCertificateData["natureOfDeath"])} />
        <BilingualField labelEn="Reason of Death" labelUr="وفات کی وجہ" value={data.reasonOfDeath} onChange={(v) => set("reasonOfDeath", v)} activeLanguage={activeLanguage} />
        <DateFieldInput labelEn="Date of Birth" labelUr="تاریخ پیدائش" value={data.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} />
        <DateFieldInput labelEn="Date of Death" labelUr="تاریخ وفات" value={data.dateOfDeath} onChange={(v) => set("dateOfDeath", v)} />
      </FormSection>

      <FormSection titleEn="Applicant's Details" titleUr="درخواست دہندہ کے کوائف">
        <BilingualField labelEn="Applicant's Name" labelUr="درخواست دہندہ کا نام" value={data.applicantName} onChange={(v) => set("applicantName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Applicant's CNIC/Passport" labelUr="درخواست دہندہ کا شناختی کارڈ" value={data.applicantCnic} onChange={(v) => set("applicantCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Relation with Deceased" labelUr="مرحوم سے تعلق" value={data.relationWithDeceased} onChange={(v) => set("relationWithDeceased", v)} activeLanguage={activeLanguage} />
      </FormSection>

      <FormSection titleEn="Husband's Information" titleUr="شوہر کی معلومات">
        <BilingualField labelEn="Husband's Name" labelUr="شوہر کا نام" value={data.husbandName} onChange={(v) => set("husbandName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Husband's CNIC/Passport" labelUr="شوہر کا شناختی کارڈ" value={data.husbandCnic} onChange={(v) => set("husbandCnic", v)} activeLanguage={activeLanguage} type="cnic" />
      </FormSection>

      <FormSection titleEn="Parental Information" titleUr="والدین کی معلومات">
        <BilingualField labelEn="Father's Name" labelUr="والد کا نام" value={data.fatherName} onChange={(v) => set("fatherName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Father's CNIC/Passport" labelUr="والد کا شناختی کارڈ" value={data.fatherCnic} onChange={(v) => set("fatherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Mother's Name" labelUr="والدہ کا نام" value={data.motherName} onChange={(v) => set("motherName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Mother's CNIC/Passport" labelUr="والدہ کا شناختی کارڈ" value={data.motherCnic} onChange={(v) => set("motherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
      </FormSection>

      <FormSection titleEn="Buried By" titleUr="تدفین کنندہ">
        <BilingualField labelEn="Buried By Name" labelUr="تدفین کنندہ کا نام" value={data.buriedByName} onChange={(v) => set("buriedByName", v)} activeLanguage={activeLanguage} />
        <DateFieldInput labelEn="Date of Burial" labelUr="تدفین کی تاریخ" value={data.dateOfBurial} onChange={(v) => set("dateOfBurial", v)} />
        <BilingualField labelEn="Relation with Deceased" labelUr="مرحوم سے تعلق" value={data.buriedByRelation} onChange={(v) => set("buriedByRelation", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Buried By CNIC/Passport" labelUr="تدفین کنندہ کا شناختی کارڈ" value={data.buriedByCnic} onChange={(v) => set("buriedByCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Place of Death" labelUr="جائے وفات" value={data.placeOfDeath} onChange={(v) => set("placeOfDeath", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Old Registration Number" labelUr="پرانا رجسٹریشن نمبر" value={data.oldRegistrationNumber} onChange={(v) => set("oldRegistrationNumber", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Additional Information" labelUr="اضافی معلومات" value={data.additionalInfo} onChange={(v) => set("additionalInfo", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Doctor's Name" labelUr="ڈاکٹر کا نام" value={data.doctorName} onChange={(v) => set("doctorName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Place of Burial" labelUr="جائے تدفین" value={data.placeOfBurial} onChange={(v) => set("placeOfBurial", v)} activeLanguage={activeLanguage} />
        <div className="grid grid-cols-3 gap-2">
          <div><Label>Days</Label><Input value={data.sicknessPeriodDays} onChange={(e) => set("sicknessPeriodDays", e.target.value)} /></div>
          <div><Label>Months</Label><Input value={data.sicknessPeriodMonths} onChange={(e) => set("sicknessPeriodMonths", e.target.value)} /></div>
          <div><Label>Years</Label><Input value={data.sicknessPeriodYears} onChange={(e) => set("sicknessPeriodYears", e.target.value)} /></div>
        </div>
      </FormSection>

      <AddressFieldsForm address={data.address} onChange={(a) => set("address", a)} activeLanguage={activeLanguage} />
      <FormSection titleEn="Verification" titleUr="تصدیق">
        <BilingualField labelEn="Verified By" labelUr="تصدیق کنندہ" value={data.verifiedBy} onChange={(v) => set("verifiedBy", v)} activeLanguage={activeLanguage} />
      </FormSection>
      <OfficeUseFields officeUse={data.officeUse} onChange={(o) => set("officeUse", o)} activeLanguage={activeLanguage} />
    </div>
  );
}
