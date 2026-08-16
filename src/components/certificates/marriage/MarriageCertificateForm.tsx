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
import type { MarriageCertificateData, PersonDetails } from "@/types/certificate";

function PersonForm({
  titleEn,
  titleUr,
  person,
  onChange,
  activeLanguage,
  groom,
}: {
  titleEn: string;
  titleUr: string;
  person: PersonDetails;
  onChange: (p: PersonDetails) => void;
  activeLanguage: "en" | "ur";
  groom: boolean;
}) {
  const set = <K extends keyof PersonDetails>(key: K, value: PersonDetails[K]) =>
    onChange({ ...person, [key]: value });

  const maritalOptions = groom
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
    <FormSection titleEn={titleEn} titleUr={titleUr}>
      <BilingualField labelEn="Name" labelUr="نام" value={person.name} onChange={(v) => set("name", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="CNIC / Passport" labelUr="شناختی کارڈ" value={person.cnic} onChange={(v) => set("cnic", v)} activeLanguage={activeLanguage} type="cnic" />
      <BilingualField labelEn="Nationality" labelUr="قومیت" value={person.nationality} onChange={(v) => set("nationality", v)} activeLanguage={activeLanguage} />
      <div className="grid grid-cols-3 gap-2">
        <div><Label>Days</Label><Input value={person.ageDays} onChange={(e) => set("ageDays", e.target.value)} /></div>
        <div><Label>Months</Label><Input value={person.ageMonths} onChange={(e) => set("ageMonths", e.target.value)} /></div>
        <div><Label>Years</Label><Input value={person.ageYears} onChange={(e) => set("ageYears", e.target.value)} /></div>
      </div>
      <ReligionSelectField value={person.religion} onChange={(v) => set("religion", v)} />
      <RadioGroupField
        labelEn="Marital Status"
        labelUr="ازدواجی حیثیت"
        options={maritalOptions}
        value={person.maritalStatus || "single"}
        onChange={(v) => set("maritalStatus", v as PersonDetails["maritalStatus"])}
        name={`maritalStatus-${groom ? "groom" : "bride"}`}
      />
      <BilingualField labelEn="Father's Name" labelUr="والد کا نام" value={person.fatherName} onChange={(v) => set("fatherName", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Father's CNIC/Passport" labelUr="والد کا شناختی کارڈ" value={person.fatherCnic} onChange={(v) => set("fatherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
    </FormSection>
  );
}

export function MarriageCertificateForm({
  data,
  onChange,
  activeLanguage,
}: {
  data: MarriageCertificateData;
  onChange: (data: MarriageCertificateData) => void;
  activeLanguage: "en" | "ur";
}) {
  const set = <K extends keyof MarriageCertificateData>(key: K, value: MarriageCertificateData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <HeaderFields header={data.header} onChange={(h) => set("header", h)} activeLanguage={activeLanguage} />
      <PersonForm titleEn="Particulars of Groom" titleUr="دولہا کے کوائف" person={data.groom} onChange={(p) => set("groom", p)} activeLanguage={activeLanguage} groom />
      <PersonForm titleEn="Particulars of Bride" titleUr="دولہن کے کوائف" person={data.bride} onChange={(p) => set("bride", p)} activeLanguage={activeLanguage} groom={false} />
      <FormSection titleEn="Marriage Details" titleUr="نکاح کی تفصیلات">
        <DateFieldInput labelEn="Date of Marriage" labelUr="نکاح کی تاریخ" value={data.dateOfMarriage} onChange={(v) => set("dateOfMarriage", v)} />
        <DateFieldInput labelEn="Registration Date" labelUr="رجسٹریشن کی تاریخ" value={data.registrationDate} onChange={(v) => set("registrationDate", v)} />
        <BilingualField labelEn="Old Registration Number" labelUr="پرانا رجسٹریشن نمبر" value={data.oldRegistrationNumber} onChange={(v) => set("oldRegistrationNumber", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Marriage Solemnized By Name" labelUr="نکاح پڑھانے والے کا نام" value={data.solemnizedByName} onChange={(v) => set("solemnizedByName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Marriage Solemnized By CNIC" labelUr="نکاح پڑھانے والے کا شناختی کارڈ" value={data.solemnizedByCnic} onChange={(v) => set("solemnizedByCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Amount of Dower with Detail" labelUr="حق مہر کی تفصیل" value={data.dowerAmount} onChange={(v) => set("dowerAmount", v)} activeLanguage={activeLanguage} />
      </FormSection>
      <div className="space-y-1">
        <h3 className="font-semibold px-1">Address of Groom / دولہا کا پتہ</h3>
        <AddressFieldsForm address={data.groomAddress} onChange={(a) => set("groomAddress", a)} activeLanguage={activeLanguage} />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold px-1">Address of Bride / دولہن کا پتہ</h3>
        <AddressFieldsForm address={data.brideAddress} onChange={(a) => set("brideAddress", a)} activeLanguage={activeLanguage} />
      </div>
      <FormSection titleEn="Verification" titleUr="تصدیق">
        <BilingualField labelEn="Verified By" labelUr="تصدیق کنندہ" value={data.verifiedBy} onChange={(v) => set("verifiedBy", v)} activeLanguage={activeLanguage} />
      </FormSection>
      <OfficeUseFields officeUse={data.officeUse} onChange={(o) => set("officeUse", o)} activeLanguage={activeLanguage} />
    </div>
  );
}
