"use client";

import { cn } from "@/components/ui/utils";
import type { BilingualValue, DateValue } from "@/types/certificate";
import { formatDateParts } from "@/lib/utils";

interface CertFieldLineProps {
  labelEn?: string;
  labelUr?: string;
  valueEn?: string;
  valueUr?: string;
  bilingual?: BilingualValue;
  className?: string;
}

export function CertFieldLine({
  labelEn,
  labelUr,
  valueEn,
  valueUr,
  bilingual,
  className,
}: CertFieldLineProps) {
  const en = bilingual?.en ?? valueEn ?? "";
  const ur = bilingual?.ur ?? valueUr ?? "";

  return (
    <div className={cn("flex items-end gap-2 mb-[2.5px] min-h-[17px]", className)}>
      {/* Left Column (English): Label on Left -> Underline with Center-Aligned Value -> Center Line */}
      <div className="flex-1 flex items-end">
        {labelEn && (
          <span className="whitespace-nowrap mr-1 shrink-0 text-[10.5px] text-certificate-red font-bold">
            {labelEn}:
          </span>
        )}
        <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] flex items-end justify-center">
          <span className="font-extrabold text-[13.5px] text-slate-950 px-1 text-center leading-none -translate-y-[3.5px]">
            {en}
          </span>
        </div>
      </div>

      {/* Center Red Vertical Divider Line */}
      <div className="w-[1.5px] bg-certificate-red self-stretch mx-1 shrink-0 min-h-[15px]" />

      {/* Right Column (Urdu): Center Line -> Label on Left -> Underline -> Center-Aligned Value */}
      <div className="flex-1 flex items-end" dir="rtl">
        {labelUr && (
          <span className="whitespace-nowrap ml-1 shrink-0 font-urdu text-[11px] text-certificate-red font-bold">
            {labelUr}:
          </span>
        )}
        <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] flex items-end justify-center">
          <span className="font-urdu font-extrabold text-[13.5px] text-slate-950 px-1 text-center leading-none -translate-y-[3.5px]">
            {ur}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CertDoubleFieldLine({
  labelEn1, labelUr1, bilingual1,
  labelEn2, labelUr2, bilingual2,
  className,
}: {
  labelEn1: string; labelUr1: string; bilingual1?: BilingualValue;
  labelEn2: string; labelUr2: string; bilingual2?: BilingualValue;
  className?: string;
}) {
  const en1 = bilingual1?.en ?? "";
  const ur1 = bilingual1?.ur ?? "";
  const en2 = bilingual2?.en ?? "";
  const ur2 = bilingual2?.ur ?? "";

  return (
    <div className={cn("flex items-end gap-2 mb-[2.5px] min-h-[17px]", className)}>
      {/* Left Column (English): 2 fields side by side */}
      <div className="flex-1 flex items-end gap-2">
        <div className="flex-1 flex items-end">
          <span className="whitespace-nowrap mr-1 shrink-0 text-[10px] text-certificate-red font-bold">{labelEn1}:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] flex items-end justify-center">
            <span className="font-extrabold text-[13px] text-slate-950 px-0.5 text-center leading-none -translate-y-[3.5px]">{en1}</span>
          </div>
        </div>
        <div className="flex-1 flex items-end">
          <span className="whitespace-nowrap mr-1 shrink-0 text-[10px] text-certificate-red font-bold">{labelEn2}:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] flex items-end justify-center">
            <span className="font-extrabold text-[13px] text-slate-950 px-0.5 text-center leading-none -translate-y-[3.5px]">{en2}</span>
          </div>
        </div>
      </div>

      {/* Center Divider Line */}
      <div className="w-[1.5px] bg-certificate-red self-stretch mx-1 shrink-0 min-h-[15px]" />

      {/* Right Column (Urdu): 2 fields side by side */}
      <div className="flex-1 flex items-end gap-2" dir="rtl">
        <div className="flex-1 flex items-end">
          <span className="whitespace-nowrap ml-1 shrink-0 font-urdu text-[10.5px] text-certificate-red font-bold">{labelUr1}:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] flex items-end justify-center">
            <span className="font-urdu font-extrabold text-[13px] text-slate-950 px-0.5 text-center leading-none -translate-y-[3.5px]">{ur1}</span>
          </div>
        </div>
        <div className="flex-1 flex items-end">
          <span className="whitespace-nowrap ml-1 shrink-0 font-urdu text-[10.5px] text-certificate-red font-bold">{labelUr2}:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] flex items-end justify-center">
            <span className="font-urdu font-extrabold text-[13px] text-slate-950 px-0.5 text-center leading-none -translate-y-[3.5px]">{ur2}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertCheckboxLine({
  labelEn,
  labelUr,
  options,
  selected,
  className,
}: {
  labelEn: string;
  labelUr: string;
  options: { value: string; labelEn: string; labelUr: string }[];
  selected: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 mb-[2.5px] min-h-[17px]", className)}>
      {/* Left half: English Label + Checkboxes */}
      <div className="flex-1 flex items-center gap-2 text-[10.5px]">
        <span className="text-certificate-red font-bold shrink-0">{labelEn}:</span>
        <div className="flex items-center gap-2.5">
          {options.map((opt) => (
            <span key={opt.value} className="inline-flex items-center gap-1">
              <span className="text-certificate-red font-bold text-[10px]">{opt.labelEn}</span>
              <span
                className={cn(
                  "inline-flex items-center justify-center w-[14px] h-[14px] border-[1.5px] border-certificate-red text-[11px] font-black leading-none shrink-0 rounded-[2px]",
                  selected === opt.value ? "text-slate-950 bg-red-50 font-black" : "text-transparent bg-white"
                )}
              >
                {selected === opt.value ? "✓" : ""}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Center Red Vertical Line */}
      <div className="w-[1.5px] bg-certificate-red self-stretch mx-1 shrink-0 min-h-[15px]" />

      {/* Right half: Urdu Label next to center line + Checkboxes to the right */}
      <div className="flex-1 flex items-center gap-2 text-[11px]" dir="rtl">
        <span className="font-urdu text-certificate-red font-bold shrink-0">{labelUr}:</span>
        <div className="flex items-center gap-2.5">
          {options.map((opt) => (
            <span key={`ur-${opt.value}`} className="inline-flex items-center gap-1">
              <span className="font-urdu text-certificate-red font-bold text-[10.5px]">{opt.labelUr}</span>
              <span
                className={cn(
                  "inline-flex items-center justify-center w-[14px] h-[14px] border-[1.5px] border-certificate-red text-[11px] font-black leading-none shrink-0 rounded-[2px]",
                  selected === opt.value ? "text-slate-950 bg-red-50 font-black" : "text-transparent bg-white"
                )}
              >
                {selected === opt.value ? "✓" : ""}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CertDateLine({
  labelEn,
  labelUr,
  date,
  className,
}: {
  labelEn: string;
  labelUr: string;
  date: DateValue;
  className?: string;
}) {
  const formatted = formatDateParts(date.day, date.month, date.year);
  return (
    <CertFieldLine
      labelEn={labelEn}
      labelUr={labelUr}
      valueEn={formatted}
      valueUr={formatted}
      className={className}
    />
  );
}

export function CertAgeLine({
  labelEn = "Age",
  labelUr = "عمر",
  days = "",
  months = "",
  years = "",
  className,
}: {
  labelEn?: string;
  labelUr?: string;
  days?: string;
  months?: string;
  years?: string;
  className?: string;
}) {
  const renderBox = (val: string) => (
    <span className="inline-flex items-center justify-center min-w-[22px] h-[15px] border border-certificate-red text-[10.5px] font-extrabold text-slate-950 px-1 bg-white">
      {val || " "}
    </span>
  );

  return (
    <div className={cn("flex items-center gap-2 mb-[2.5px] min-h-[17px]", className)}>
      {/* Left Column (English): Age Days [  ] Months [  ] Years [  ] */}
      <div className="flex-1 flex items-center gap-1.5 text-[10.5px]">
        <span className="text-certificate-red font-bold shrink-0">{labelEn}:</span>
        <div className="flex items-center gap-1.5">
          <span className="text-certificate-red text-[10px]">Days</span>
          {renderBox(days)}
          <span className="text-certificate-red text-[10px]">Months</span>
          {renderBox(months)}
          <span className="text-certificate-red text-[10px]">Years</span>
          {renderBox(years)}
        </div>
      </div>

      {/* Center Divider Line */}
      <div className="w-[1.5px] bg-certificate-red self-stretch mx-1 shrink-0 min-h-[15px]" />

      {/* Right Column (Urdu): عمر  دن [  ] ماہ [  ] سال [  ] */}
      <div className="flex-1 flex items-center gap-1.5 text-[11px]" dir="rtl">
        <span className="font-urdu text-certificate-red font-bold shrink-0">{labelUr}:</span>
        <div className="flex items-center gap-1.5">
          <span className="font-urdu text-certificate-red text-[10.5px]">دن</span>
          {renderBox(days)}
          <span className="font-urdu text-certificate-red text-[10.5px]">ماہ</span>
          {renderBox(months)}
          <span className="font-urdu text-certificate-red text-[10.5px]">سال</span>
          {renderBox(years)}
        </div>
      </div>
    </div>
  );
}

interface CertSectionProps {
  titleEn: string;
  titleUr: string;
  children: React.ReactNode;
  className?: string;
}

export function CertSection({ titleEn, titleUr, children, className }: CertSectionProps) {
  return (
    <div
      className={cn(
        "border border-certificate-red mb-[3px] overflow-hidden bg-white shrink-0",
        className
      )}
    >
      <div className="text-center py-[1px] px-2 font-bold text-[11px] text-certificate-red flex items-center justify-center gap-2 bg-red-50/40">
        <span>{titleEn}</span>
        <span className="font-urdu" dir="rtl">{titleUr}</span>
      </div>
      <div className="px-1.5 pb-0.5 pt-0.5">{children}</div>
    </div>
  );
}

export function CertHeader({
  titleUr,
  header,
}: {
  titleUr: string;
  header: {
    unionCouncil: BilingualValue;
    number: BilingualValue;
    tehsil: BilingualValue;
    district: BilingualValue;
  };
}) {
  return (
    <div className="mb-[3px] shrink-0">
      <h1
        className="text-center font-urdu text-[16px] font-bold mb-1 text-certificate-red"
        dir="rtl"
        style={{ lineHeight: "1.4", wordSpacing: "2px" }}
      >
        {titleUr}
      </h1>

      {/* Row 1: Union Council & Number */}
      <div className="flex items-end justify-between gap-3 mb-1">
        <div className="flex-1 flex items-end">
          <span className="mr-1 shrink-0 text-[10.5px] text-certificate-red font-bold">Union Council:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.unionCouncil.en}</span>
          </div>
          <span className="mx-2 shrink-0 text-[10.5px] text-certificate-red font-bold">Number:</span>
          <div className="w-[75px] border-b border-certificate-red min-h-[15px] pb-[2px] font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.number.en}</span>
          </div>
        </div>
        <div className="flex-1 flex items-end" dir="rtl">
          <span className="ml-1 shrink-0 font-urdu text-[11px] text-certificate-red font-bold">یونین کونسل:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] font-urdu font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.unionCouncil.ur}</span>
          </div>
          <span className="mx-2 shrink-0 font-urdu text-[11px] text-certificate-red font-bold">نمبر:</span>
          <div className="w-[75px] border-b border-certificate-red min-h-[15px] pb-[2px] font-urdu font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.number.ur}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Tehsil/Town & District */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex-1 flex items-end">
          <span className="mr-1 shrink-0 text-[10.5px] text-certificate-red font-bold">Tehsil/Town:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.tehsil.en}</span>
          </div>
          <span className="mx-2 shrink-0 text-[10.5px] text-certificate-red font-bold">District:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.district.en}</span>
          </div>
        </div>
        <div className="flex-1 flex items-end" dir="rtl">
          <span className="ml-1 shrink-0 font-urdu text-[11px] text-certificate-red font-bold">تحصیل/ٹاؤن:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] font-urdu font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.tehsil.ur}</span>
          </div>
          <span className="mx-2 shrink-0 font-urdu text-[11px] text-certificate-red font-bold">ضلع:</span>
          <div className="flex-1 border-b border-certificate-red min-h-[15px] pb-[2px] font-urdu font-extrabold text-[13.5px] text-slate-950 flex justify-center text-center">
            <span className="-translate-y-[3.5px]">{header.district.ur}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertOfficeUse({
  prefix,
  officeUse,
}: {
  prefix: "B" | "D" | "M" | "V";
  officeUse: import("@/types/certificate").OfficeUseData;
}) {
  const renderDigitBoxes = (value: string, count: number) => {
    const chars = value.padEnd(count, " ").split("").slice(0, count);
    return (
      <span className="inline-flex gap-[1px]">
        {chars.map((c, i) => (
          <span
            key={i}
            className="inline-flex items-center justify-center w-[13.5px] h-[13.5px] border border-certificate-red text-[9.5px] font-black text-slate-950"
          >
            {c.trim()}
          </span>
        ))}
      </span>
    );
  };

  const crmsParts = officeUse.crmsNumber.split("-");
  const crmsMain = crmsParts[0]?.replace(/^[^\d]*/, "") || "";
  const crmsMid = crmsParts[1] || "";
  const crmsEnd = crmsParts[2] || "";

  return (
    <CertSection titleEn="For Office Use" titleUr="دفتری استعمال کے لیے">
      <div className="flex gap-1">
        <div className="flex-1 space-y-[2px]">
          <div className="flex items-center gap-1 text-[10.5px]">
            <span className="font-bold">CRMS Number:</span>
            <span className="font-bold">{prefix}</span>
            {renderDigitBoxes(crmsMain, 6)}
            <span>-</span>
            {renderDigitBoxes(crmsMid, 2)}
            <span>-</span>
            {renderDigitBoxes(crmsEnd, 5)}
          </div>
          <div className="flex items-center gap-1 text-[10.5px]">
            <span className="font-bold">Barcode Number:</span>
            {renderDigitBoxes(officeUse.barcodeNumber, 10)}
          </div>
          <CertDateLine
            labelEn="Application Submission Date"
            labelUr="درخواست جمع کرانے کی تاریخ"
            date={officeUse.applicationSubmissionDate}
          />
        </div>
        <div className="w-px bg-certificate-red" />
        <div className="flex-1 space-y-[2px]">
          <CertDateLine
            labelEn="Certificate Issuance Date"
            labelUr="سرٹیفکیٹ جاری کرنے کی تاریخ"
            date={officeUse.certificateIssuanceDate}
          />
          <CertFieldLine
            labelEn="Reference"
            labelUr="حوالہ"
            bilingual={officeUse.reference}
          />
          <CertFieldLine
            labelEn="Checked By"
            labelUr="پڑتال کنندہ"
            bilingual={officeUse.checkedBy}
          />
          <CertFieldLine
            labelEn="Secretary's Signature"
            labelUr="سیکرٹری کے دستخط"
            bilingual={officeUse.secretarySignature}
          />
          <CertFieldLine
            labelEn="Certificate Received By"
            labelUr="سرٹیفکیٹ وصول کنندہ"
            bilingual={officeUse.certificateReceivedBy}
          />
        </div>
      </div>
    </CertSection>
  );
}

export function CertAddressSection({
  titleEn,
  titleUr,
  address,
}: {
  titleEn: string;
  titleUr: string;
  address: import("@/types/certificate").AddressData;
}) {
  const mobileValue = address.mobileNumber || address.postalCode;

  return (
    <CertSection titleEn={titleEn} titleUr={titleUr}>
      <CertDoubleFieldLine
        labelEn1="District" labelUr1="ضلع" bilingual1={address.district}
        labelEn2="Tehsil" labelUr2="تحصیل" bilingual2={address.tehsil}
      />
      <CertDoubleFieldLine
        labelEn1="Village / City" labelUr1="گاؤں/شہر" bilingual1={address.villageCity}
        labelEn2="Flat/House #" labelUr2="فلیٹ/مکان نمبر" bilingual2={address.flatHouse}
      />
      <CertDoubleFieldLine
        labelEn1="Lane / Street #" labelUr1="لین/اسٹریٹ نمبر" bilingual1={address.laneStreet}
        labelEn2="Sector / Block #" labelUr2="سیکٹر/بلاک" bilingual2={address.sectorBlock}
      />
      <CertFieldLine labelEn="Neighbourhood" labelUr="محلہ" bilingual={address.neighbourhood} />
      <CertFieldLine labelEn="Additional Address" labelUr="اضافی پتہ" bilingual={address.additionalAddress} />
      <CertFieldLine labelEn="Mobile Number" labelUr="موبائل نمبر" bilingual={mobileValue} className="mb-0" />
    </CertSection>
  );
}
