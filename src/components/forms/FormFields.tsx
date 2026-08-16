"use client";

import { BilingualField } from "@/components/bilingual/BilingualField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RELIGION_OPTIONS } from "@/types/certificate";
import type {
  AddressData,
  BilingualValue,
  DateValue,
  HeaderData,
  OfficeUseData,
} from "@/types/certificate";

export function ReligionSelectField({
  value,
  onChange,
  labelEn = "Religion",
  labelUr = "مذہب",
}: {
  value: BilingualValue;
  onChange: (v: BilingualValue) => void;
  labelEn?: string;
  labelUr?: string;
}) {
  const currentVal = value?.en || "Islam";

  const handleSelect = (selectedEn: string) => {
    const found = RELIGION_OPTIONS.find((r) => r.en.toLowerCase() === selectedEn.toLowerCase());
    if (found) {
      onChange(found);
    } else {
      onChange({ en: selectedEn, ur: selectedEn });
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Label>{labelEn}</Label>
        <Label className="font-urdu" dir="rtl">{labelUr}</Label>
      </div>
      <select
        value={currentVal}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full h-10 px-3 py-2 text-base font-semibold text-slate-900 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {RELIGION_OPTIONS.map((rel) => (
          <option key={rel.en} value={rel.en} className="font-semibold text-base">
            {rel.en} — {rel.ur}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormSection({
  titleEn,
  titleUr,
  children,
}: {
  titleEn: string;
  titleUr: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold">{titleEn}</h3>
        <h3 className="font-semibold font-urdu" dir="rtl">{titleUr}</h3>
      </div>
      {children}
    </div>
  );
}

export function HeaderFields({
  header,
  onChange,
  activeLanguage,
}: {
  header: HeaderData;
  onChange: (h: HeaderData) => void;
  activeLanguage: "en" | "ur";
}) {
  const update = (field: keyof HeaderData, value: BilingualValue) => {
    onChange({ ...header, [field]: value });
  };

  return (
    <FormSection titleEn="Header" titleUr="سرخی">
      <BilingualField labelEn="Union Council" labelUr="یونین کونسل" value={header.unionCouncil} onChange={(v) => update("unionCouncil", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Number" labelUr="نمبر" value={header.number} onChange={(v) => update("number", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Tehsil/Town" labelUr="تحصیل/ٹاؤن" value={header.tehsil} onChange={(v) => update("tehsil", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="District" labelUr="ضلع" value={header.district} onChange={(v) => update("district", v)} activeLanguage={activeLanguage} />
    </FormSection>
  );
}

export function DateFieldInput({
  labelEn,
  labelUr,
  value,
  onChange,
}: {
  labelEn: string;
  labelUr: string;
  value: DateValue;
  onChange: (v: DateValue) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Label>{labelEn}</Label>
        <Label className="font-urdu" dir="rtl">{labelUr}</Label>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="DD"
          maxLength={2}
          value={value.day}
          onChange={(e) => onChange({ ...value, day: e.target.value.replace(/\D/g, "") })}
          className="w-20 text-center text-base font-bold text-slate-900"
        />
        <span className="font-bold text-lg">/</span>
        <Input
          placeholder="MM"
          maxLength={2}
          value={value.month}
          onChange={(e) => onChange({ ...value, month: e.target.value.replace(/\D/g, "") })}
          className="w-20 text-center text-base font-bold text-slate-900"
        />
        <span className="font-bold text-lg">/</span>
        <Input
          placeholder="YYYY"
          maxLength={4}
          value={value.year}
          onChange={(e) => onChange({ ...value, year: e.target.value.replace(/\D/g, "") })}
          className="w-28 text-center text-base font-bold text-slate-900"
        />
      </div>
    </div>
  );
}

export function AddressFieldsForm({
  address,
  onChange,
  activeLanguage,
}: {
  address: AddressData;
  onChange: (a: AddressData) => void;
  activeLanguage: "en" | "ur";
}) {
  const update = (field: keyof AddressData, value: BilingualValue) => {
    onChange({ ...address, [field]: value });
  };

  const mobileVal = address.mobileNumber || address.postalCode || { en: "", ur: "" };

  const handleMobileChange = (v: BilingualValue) => {
    onChange({
      ...address,
      mobileNumber: v,
      postalCode: v,
    });
  };

  return (
    <FormSection titleEn="Address" titleUr="پتہ">
      <BilingualField labelEn="District" labelUr="ضلع" value={address.district} onChange={(v) => update("district", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Tehsil" labelUr="تحصیل" value={address.tehsil} onChange={(v) => update("tehsil", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Village / City" labelUr="گاؤں/شہر" value={address.villageCity} onChange={(v) => update("villageCity", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Flat/House #" labelUr="فلیٹ/مکان نمبر" value={address.flatHouse} onChange={(v) => update("flatHouse", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Lane / Street Number" labelUr="لین/اسٹریٹ نمبر" value={address.laneStreet} onChange={(v) => update("laneStreet", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Sector / Block Number" labelUr="سیکٹر/بلاک" value={address.sectorBlock} onChange={(v) => update("sectorBlock", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Neighbourhood" labelUr="محلہ" value={address.neighbourhood} onChange={(v) => update("neighbourhood", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Additional Address" labelUr="اضافی پتہ" value={address.additionalAddress} onChange={(v) => update("additionalAddress", v)} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Mobile Number" labelUr="موبائل نمبر" type="phone" value={mobileVal} onChange={handleMobileChange} activeLanguage={activeLanguage} />
    </FormSection>
  );
}

export function OfficeUseFields({
  officeUse,
  onChange,
  activeLanguage,
}: {
  officeUse: OfficeUseData;
  onChange: (o: OfficeUseData) => void;
  activeLanguage: "en" | "ur";
}) {
  return (
    <FormSection titleEn="Office Use" titleUr="دفتری استعمال">
      <div className="space-y-2">
        <Label>CRMS Number</Label>
        <Input
          value={officeUse.crmsNumber}
          onChange={(e) => onChange({ ...officeUse, crmsNumber: e.target.value })}
          className="text-base font-bold text-slate-900 font-mono"
        />
      </div>
      <div className="space-y-2">
        <Label>Barcode Number</Label>
        <Input
          value={officeUse.barcodeNumber}
          onChange={(e) => onChange({ ...officeUse, barcodeNumber: e.target.value })}
          className="text-base font-bold text-slate-900 font-mono"
        />
      </div>
      <DateFieldInput labelEn="Application Submission Date" labelUr="درخواست جمع کرانے کی تاریخ" value={officeUse.applicationSubmissionDate} onChange={(v) => onChange({ ...officeUse, applicationSubmissionDate: v })} />
      <DateFieldInput labelEn="Certificate Issuance Date" labelUr="سرٹیفکیٹ جاری کرنے کی تاریخ" value={officeUse.certificateIssuanceDate} onChange={(v) => onChange({ ...officeUse, certificateIssuanceDate: v })} />
      <BilingualField labelEn="Reference" labelUr="حوالہ" value={officeUse.reference} onChange={(v) => onChange({ ...officeUse, reference: v })} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Checked By" labelUr="پڑتال کنندہ" value={officeUse.checkedBy} onChange={(v) => onChange({ ...officeUse, checkedBy: v })} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Secretary's Signature" labelUr="سیکرٹری کے دستخط" value={officeUse.secretarySignature} onChange={(v) => onChange({ ...officeUse, secretarySignature: v })} activeLanguage={activeLanguage} />
      <BilingualField labelEn="Certificate Received By" labelUr="سرٹیفکیٹ وصول کنندہ" value={officeUse.certificateReceivedBy} onChange={(v) => onChange({ ...officeUse, certificateReceivedBy: v })} activeLanguage={activeLanguage} />
    </FormSection>
  );
}

export function RadioGroupField({
  labelEn,
  labelUr,
  options,
  value,
  onChange,
  name,
}: {
  labelEn: string;
  labelUr: string;
  options: { value: string; labelEn: string; labelUr: string }[];
  value: string;
  onChange: (v: string) => void;
  name?: string;
}) {
  const groupName = name || labelEn;
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{labelEn}</Label>
        <Label className="font-urdu" dir="rtl">{labelUr}</Label>
      </div>
      <div className="flex flex-wrap gap-5">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer bg-muted/20 hover:bg-muted/40 px-3 py-1.5 rounded-md border border-slate-200 transition-colors">
            <input
              type="radio"
              name={groupName}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-primary h-4.5 w-4.5 shrink-0"
            />
            <span className="font-bold text-base text-slate-900">{opt.labelEn}</span>
            <span className="font-urdu font-bold text-base text-slate-900" dir="rtl">{opt.labelUr}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
