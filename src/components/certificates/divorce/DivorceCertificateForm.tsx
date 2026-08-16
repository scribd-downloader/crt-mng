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
  ReligionSelectField,
} from "@/components/forms/FormFields";
import type { DivorceCertificateData } from "@/types/certificate";

export function DivorceCertificateForm({
  data,
  onChange,
  activeLanguage,
}: {
  data: DivorceCertificateData;
  onChange: (data: DivorceCertificateData) => void;
  activeLanguage: "en" | "ur";
}) {
  const set = <K extends keyof DivorceCertificateData>(
    key: K,
    value: DivorceCertificateData[K]
  ) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <HeaderFields header={data.header} onChange={(h) => set("header", h)} activeLanguage={activeLanguage} />

      <FormSection titleEn="Divorcer's Details" titleUr="طلاق دہندہ کے کوائف">
        <BilingualField labelEn="Name" labelUr="نام" value={data.divorcerName} onChange={(v) => set("divorcerName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="CNIC / Passport" labelUr="شناختی کارڈ" value={data.divorcerCnic} onChange={(v) => set("divorcerCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Nationality" labelUr="قومیت" value={data.divorcerNationality} onChange={(v) => set("divorcerNationality", v)} activeLanguage={activeLanguage} />
        <ReligionSelectField value={data.divorcerReligion} onChange={(v) => set("divorcerReligion", v)} />
        <BilingualField labelEn="Father's Name" labelUr="والد کا نام" value={data.divorcerFatherName} onChange={(v) => set("divorcerFatherName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Father's CNIC/Passport" labelUr="والد کا شناختی کارڈ" value={data.divorcerFatherCnic} onChange={(v) => set("divorcerFatherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
      </FormSection>

      <FormSection titleEn="Divorcee's Details" titleUr="مطلقہ کے کوائف">
        <BilingualField labelEn="Name" labelUr="نام" value={data.divorceeName} onChange={(v) => set("divorceeName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="CNIC / Passport" labelUr="شناختی کارڈ" value={data.divorceeCnic} onChange={(v) => set("divorceeCnic", v)} activeLanguage={activeLanguage} type="cnic" />
        <BilingualField labelEn="Nationality" labelUr="قومیت" value={data.divorceeNationality} onChange={(v) => set("divorceeNationality", v)} activeLanguage={activeLanguage} />
        <ReligionSelectField value={data.divorceeReligion} onChange={(v) => set("divorceeReligion", v)} />
        <BilingualField labelEn="Father's Name" labelUr="والد کا نام" value={data.divorceeFatherName} onChange={(v) => set("divorceeFatherName", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Father's CNIC/Passport" labelUr="والد کا شناختی کارڈ" value={data.divorceeFatherCnic} onChange={(v) => set("divorceeFatherCnic", v)} activeLanguage={activeLanguage} type="cnic" />
      </FormSection>

      <FormSection titleEn="Divorce Detail Information" titleUr="طلاق کے متعلق معلومات">
        <BilingualField labelEn="Authority for Divorce" labelUr="طلاق دینے والا اختیار" value={data.authorityForDivorce} onChange={(v) => set("authorityForDivorce", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Detail of Divorce and custody" labelUr="طلاق اور بچوں کی تفصیل" value={data.divorceDetail} onChange={(v) => set("divorceDetail", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Place of Marriage" labelUr="جائے نکاح" value={data.placeOfMarriage} onChange={(v) => set("placeOfMarriage", v)} activeLanguage={activeLanguage} />
        <BilingualField labelEn="Arbitration Details" labelUr="مصالحت کی تفصیل" value={data.arbitrationDetails} onChange={(v) => set("arbitrationDetails", v)} activeLanguage={activeLanguage} />
        <div className="space-y-2">
          <Label>No of Children from Wedlock</Label>
          <Input value={data.childrenFromWedlock} onChange={(e) => set("childrenFromWedlock", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Previous Divorces of Husband</Label>
          <Input value={data.previousDivorcesHusband} onChange={(e) => set("previousDivorcesHusband", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Previous Divorces of Wife</Label>
          <Input value={data.previousDivorcesWife} onChange={(e) => set("previousDivorcesWife", e.target.value)} />
        </div>
        <DateFieldInput labelEn="Conciliation Failure Date" labelUr="مصالحت ناکام ہونے کی تاریخ" value={data.conciliationFailureDate} onChange={(v) => set("conciliationFailureDate", v)} />
        <DateFieldInput labelEn="Date of Notice for Divorce" labelUr="طلاق نوٹس کی تاریخ" value={data.noticeForDivorceDate} onChange={(v) => set("noticeForDivorceDate", v)} />
        <DateFieldInput labelEn="Date of Registration" labelUr="رجسٹریشن کی تاریخ" value={data.registrationDate} onChange={(v) => set("registrationDate", v)} />
        <DateFieldInput labelEn="Date of Marriage" labelUr="نکاح کی تاریخ" value={data.marriageDate} onChange={(v) => set("marriageDate", v)} />
        <DateFieldInput labelEn="Date of Decision of Divorce" labelUr="طلاق فیصلے کی تاریخ" value={data.divorceDecisionDate} onChange={(v) => set("divorceDecisionDate", v)} />
      </FormSection>

      <div className="space-y-1">
        <h3 className="font-semibold px-1">Divorcer&apos;s Address / طلاق دہندہ کا پتہ</h3>
        <AddressFieldsForm address={data.divorcerAddress} onChange={(a) => set("divorcerAddress", a)} activeLanguage={activeLanguage} />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold px-1">Divorcee&apos;s Address / مطلقہ کا پتہ</h3>
        <AddressFieldsForm address={data.divorceeAddress} onChange={(a) => set("divorceeAddress", a)} activeLanguage={activeLanguage} />
      </div>

      <FormSection titleEn="Verification" titleUr="تصدیق">
        <BilingualField labelEn="Verified By" labelUr="تصدیق کنندہ" value={data.verifiedBy} onChange={(v) => set("verifiedBy", v)} activeLanguage={activeLanguage} />
      </FormSection>

      <OfficeUseFields officeUse={data.officeUse} onChange={(o) => set("officeUse", o)} activeLanguage={activeLanguage} />
    </div>
  );
}
