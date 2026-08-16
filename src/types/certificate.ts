export type CertificateType = "birth" | "death" | "marriage" | "divorce";

export interface BilingualValue {
  en: string;
  ur: string;
}

export interface DateValue {
  day: string;
  month: string;
  year: string;
}

export interface AddressData {
  district: BilingualValue;
  tehsil: BilingualValue;
  villageCity: BilingualValue;
  flatHouse: BilingualValue;
  laneStreet: BilingualValue;
  sectorBlock: BilingualValue;
  neighbourhood: BilingualValue;
  additionalAddress: BilingualValue;
  mobileNumber: BilingualValue;
  postalCode?: BilingualValue;
}

export interface OfficeUseData {
  crmsNumber: string;
  barcodeNumber: string;
  applicationSubmissionDate: DateValue;
  certificateIssuanceDate: DateValue;
  reference: BilingualValue;
  checkedBy: BilingualValue;
  secretarySignature: BilingualValue;
  certificateReceivedBy: BilingualValue;
}

export interface HeaderData {
  unionCouncil: BilingualValue;
  number: BilingualValue;
  tehsil: BilingualValue;
  district: BilingualValue;
}

export interface BirthCertificateData {
  header: HeaderData;
  applicantName: BilingualValue;
  applicantCnic: BilingualValue;
  childName: BilingualValue;
  relationOfChild: BilingualValue;
  religion: BilingualValue;
  disability: BilingualValue;
  vaccinated: "yes" | "no" | "";
  placeOfBirth: "hospital" | "home" | "healthCenter" | "other" | "";
  districtOfBirth: BilingualValue;
  dateOfBirth: DateValue;
  areTwins: "yes" | "no" | "";
  gender: "male" | "female" | "";
  fatherName: BilingualValue;
  fatherCnic: BilingualValue;
  fatherNationality: BilingualValue;
  motherName: BilingualValue;
  motherCnic: BilingualValue;
  motherNationality: BilingualValue;
  grandFatherName: BilingualValue;
  grandFatherCnic: BilingualValue;
  doctorMidwifeName: BilingualValue;
  oldRegistrationNumber: BilingualValue;
  registrationDate: DateValue;
  address: AddressData;
  verifiedBy: BilingualValue;
  officeUse: OfficeUseData;
}

export interface DeathCertificateData {
  header: HeaderData;
  deceasedName: BilingualValue;
  deceasedCnic: BilingualValue;
  nationality: BilingualValue;
  religion: BilingualValue;
  maritalStatus: BilingualValue;
  gender: "male" | "female" | "";
  natureOfDeath: "normal" | "deadBodyFound" | "";
  reasonOfDeath: BilingualValue;
  dateOfBirth: DateValue;
  dateOfDeath: DateValue;
  applicantName: BilingualValue;
  applicantCnic: BilingualValue;
  relationWithDeceased: BilingualValue;
  husbandName: BilingualValue;
  husbandCnic: BilingualValue;
  fatherName: BilingualValue;
  fatherCnic: BilingualValue;
  motherName: BilingualValue;
  motherCnic: BilingualValue;
  buriedByName: BilingualValue;
  dateOfBurial: DateValue;
  buriedByRelation: BilingualValue;
  buriedByCnic: BilingualValue;
  placeOfDeath: BilingualValue;
  oldRegistrationNumber: BilingualValue;
  additionalInfo: BilingualValue;
  doctorName: BilingualValue;
  placeOfBurial: BilingualValue;
  sicknessPeriodDays: string;
  sicknessPeriodMonths: string;
  sicknessPeriodYears: string;
  address: AddressData;
  verifiedBy: BilingualValue;
  officeUse: OfficeUseData;
}

export interface PersonDetails {
  name: BilingualValue;
  cnic: BilingualValue;
  nationality: BilingualValue;
  ageDays: string;
  ageMonths: string;
  ageYears: string;
  religion: BilingualValue;
  maritalStatus: "married" | "single" | "widower" | "widow" | "divorced" | "";
  fatherName: BilingualValue;
  fatherCnic: BilingualValue;
}

export interface MarriageCertificateData {
  header: HeaderData;
  groom: PersonDetails;
  bride: PersonDetails;
  dateOfMarriage: DateValue;
  registrationDate: DateValue;
  oldRegistrationNumber: BilingualValue;
  solemnizedByName: BilingualValue;
  solemnizedByCnic: BilingualValue;
  dowerAmount: BilingualValue;
  groomAddress: AddressData;
  brideAddress: AddressData;
  verifiedBy: BilingualValue;
  officeUse: OfficeUseData;
}

export interface DivorceCertificateData {
  header: HeaderData;
  divorcerName: BilingualValue;
  divorcerCnic: BilingualValue;
  divorcerNationality: BilingualValue;
  divorcerReligion: BilingualValue;
  divorcerFatherName: BilingualValue;
  divorcerFatherCnic: BilingualValue;
  divorceeName: BilingualValue;
  divorceeCnic: BilingualValue;
  divorceeNationality: BilingualValue;
  divorceeReligion: BilingualValue;
  divorceeFatherName: BilingualValue;
  divorceeFatherCnic: BilingualValue;
  authorityForDivorce: BilingualValue;
  divorceDetail: BilingualValue;
  placeOfMarriage: BilingualValue;
  arbitrationDetails: BilingualValue;
  childrenFromWedlock: string;
  previousDivorcesHusband: string;
  previousDivorcesWife: string;
  conciliationFailureDate: DateValue;
  noticeForDivorceDate: DateValue;
  registrationDate: DateValue;
  marriageDate: DateValue;
  divorceDecisionDate: DateValue;
  divorcerAddress: AddressData;
  divorceeAddress: AddressData;
  verifiedBy: BilingualValue;
  officeUse: OfficeUseData;
}

export type CertificateData =
  | BirthCertificateData
  | DeathCertificateData
  | MarriageCertificateData
  | DivorceCertificateData;

export interface LocalDocument {
  id: string;
  type: CertificateType;
  title: string;
  data: CertificateData;
  documentNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalDraft {
  id: string;
  type: CertificateType;
  data: CertificateData;
  updatedAt: string;
}

export interface LocalTemplate {
  id: string;
  name: string;
  type: CertificateType;
  data: Partial<CertificateData>;
  createdAt: string;
}

export interface LocalSettings {
  id: string;
  documentNumberSequence: Record<CertificateType, number>;
  dateFormat: string;
  officeName: BilingualValue;
  defaultUnionCouncil: BilingualValue;
}

export const RELIGION_OPTIONS: BilingualValue[] = [
  { en: "Islam", ur: "اسلام" },
  { en: "Christianity", ur: "عیسائیت" },
  { en: "Hinduism", ur: "ہندو مت" },
  { en: "Sikhism", ur: "سکھ مت" },
  { en: "Zoroastrianism", ur: "زرتشتی" },
  { en: "Buddhism", ur: "بدھ مت" },
  { en: "Jainism", ur: "جین مت" },
  { en: "Other", ur: "دیگر" },
];

export function defaultPakistani(): BilingualValue {
  return { en: "Pakistani", ur: "پاکستانی" };
}

export function defaultIslam(): BilingualValue {
  return { en: "Islam", ur: "اسلام" };
}

export function defaultNoDisability(): BilingualValue {
  return { en: "No", ur: "نہیں" };
}

export function emptyBilingual(): BilingualValue {
  return { en: "", ur: "" };
}

export function emptyDate(): DateValue {
  return { day: "", month: "", year: "" };
}

export function emptyAddress(): AddressData {
  return {
    district: emptyBilingual(),
    tehsil: emptyBilingual(),
    villageCity: emptyBilingual(),
    flatHouse: emptyBilingual(),
    laneStreet: emptyBilingual(),
    sectorBlock: emptyBilingual(),
    neighbourhood: emptyBilingual(),
    additionalAddress: emptyBilingual(),
    mobileNumber: emptyBilingual(),
    postalCode: emptyBilingual(),
  };
}

export function emptyOfficeUse(): OfficeUseData {
  return {
    crmsNumber: "",
    barcodeNumber: "",
    applicationSubmissionDate: emptyDate(),
    certificateIssuanceDate: emptyDate(),
    reference: emptyBilingual(),
    checkedBy: emptyBilingual(),
    secretarySignature: emptyBilingual(),
    certificateReceivedBy: emptyBilingual(),
  };
}

export function emptyHeader(): HeaderData {
  return {
    unionCouncil: emptyBilingual(),
    number: emptyBilingual(),
    tehsil: emptyBilingual(),
    district: emptyBilingual(),
  };
}

export function createEmptyBirthData(): BirthCertificateData {
  return {
    header: emptyHeader(),
    applicantName: emptyBilingual(),
    applicantCnic: emptyBilingual(),
    childName: emptyBilingual(),
    relationOfChild: emptyBilingual(),
    religion: defaultIslam(),
    disability: defaultNoDisability(),
    vaccinated: "yes",
    placeOfBirth: "",
    districtOfBirth: emptyBilingual(),
    dateOfBirth: emptyDate(),
    areTwins: "no",
    gender: "male",
    fatherName: emptyBilingual(),
    fatherCnic: emptyBilingual(),
    fatherNationality: defaultPakistani(),
    motherName: emptyBilingual(),
    motherCnic: emptyBilingual(),
    motherNationality: defaultPakistani(),
    grandFatherName: emptyBilingual(),
    grandFatherCnic: emptyBilingual(),
    doctorMidwifeName: emptyBilingual(),
    oldRegistrationNumber: emptyBilingual(),
    registrationDate: emptyDate(),
    address: emptyAddress(),
    verifiedBy: emptyBilingual(),
    officeUse: emptyOfficeUse(),
  };
}

export function createEmptyDeathData(): DeathCertificateData {
  return {
    header: emptyHeader(),
    deceasedName: emptyBilingual(),
    deceasedCnic: emptyBilingual(),
    nationality: defaultPakistani(),
    religion: defaultIslam(),
    maritalStatus: emptyBilingual(),
    gender: "male",
    natureOfDeath: "normal",
    reasonOfDeath: emptyBilingual(),
    dateOfBirth: emptyDate(),
    dateOfDeath: emptyDate(),
    applicantName: emptyBilingual(),
    applicantCnic: emptyBilingual(),
    relationWithDeceased: emptyBilingual(),
    husbandName: emptyBilingual(),
    husbandCnic: emptyBilingual(),
    fatherName: emptyBilingual(),
    fatherCnic: emptyBilingual(),
    motherName: emptyBilingual(),
    motherCnic: emptyBilingual(),
    buriedByName: emptyBilingual(),
    dateOfBurial: emptyDate(),
    buriedByRelation: emptyBilingual(),
    buriedByCnic: emptyBilingual(),
    placeOfDeath: emptyBilingual(),
    oldRegistrationNumber: emptyBilingual(),
    additionalInfo: emptyBilingual(),
    doctorName: emptyBilingual(),
    placeOfBurial: emptyBilingual(),
    sicknessPeriodDays: "",
    sicknessPeriodMonths: "",
    sicknessPeriodYears: "",
    address: emptyAddress(),
    verifiedBy: emptyBilingual(),
    officeUse: emptyOfficeUse(),
  };
}

export function emptyPersonDetails(): PersonDetails {
  return {
    name: emptyBilingual(),
    cnic: emptyBilingual(),
    nationality: defaultPakistani(),
    ageDays: "",
    ageMonths: "",
    ageYears: "",
    religion: defaultIslam(),
    maritalStatus: "single",
    fatherName: emptyBilingual(),
    fatherCnic: emptyBilingual(),
  };
}

export function createEmptyMarriageData(): MarriageCertificateData {
  return {
    header: emptyHeader(),
    groom: emptyPersonDetails(),
    bride: emptyPersonDetails(),
    dateOfMarriage: emptyDate(),
    registrationDate: emptyDate(),
    oldRegistrationNumber: emptyBilingual(),
    solemnizedByName: emptyBilingual(),
    solemnizedByCnic: emptyBilingual(),
    dowerAmount: emptyBilingual(),
    groomAddress: emptyAddress(),
    brideAddress: emptyAddress(),
    verifiedBy: emptyBilingual(),
    officeUse: emptyOfficeUse(),
  };
}

export function createEmptyDivorceData(): DivorceCertificateData {
  return {
    header: emptyHeader(),
    divorcerName: emptyBilingual(),
    divorcerCnic: emptyBilingual(),
    divorcerNationality: defaultPakistani(),
    divorcerReligion: defaultIslam(),
    divorcerFatherName: emptyBilingual(),
    divorcerFatherCnic: emptyBilingual(),
    divorceeName: emptyBilingual(),
    divorceeCnic: emptyBilingual(),
    divorceeNationality: defaultPakistani(),
    divorceeReligion: defaultIslam(),
    divorceeFatherName: emptyBilingual(),
    divorceeFatherCnic: emptyBilingual(),
    authorityForDivorce: emptyBilingual(),
    divorceDetail: emptyBilingual(),
    placeOfMarriage: emptyBilingual(),
    arbitrationDetails: emptyBilingual(),
    childrenFromWedlock: "",
    previousDivorcesHusband: "",
    previousDivorcesWife: "",
    conciliationFailureDate: emptyDate(),
    noticeForDivorceDate: emptyDate(),
    registrationDate: emptyDate(),
    marriageDate: emptyDate(),
    divorceDecisionDate: emptyDate(),
    divorcerAddress: emptyAddress(),
    divorceeAddress: emptyAddress(),
    verifiedBy: emptyBilingual(),
    officeUse: emptyOfficeUse(),
  };
}

export const CERTIFICATE_PREFIXES: Record<CertificateType, string> = {
  birth: "BC",
  death: "DC",
  marriage: "MC",
  divorce: "DIV",
};

export const DEMO_BIRTH_DATA: BirthCertificateData = {
  ...createEmptyBirthData(),
  header: {
    unionCouncil: { en: "UC-12 Model Town", ur: "یو سی-۱۲ ماڈل ٹاؤن" },
    number: { en: "001234", ur: "۰۰۱۲۳۴" },
    tehsil: { en: "Lahore City", ur: "لاہور سٹی" },
    district: { en: "Lahore", ur: "لاہور" },
  },
  applicantName: { en: "Ahmed Khan", ur: "احمد خان" },
  applicantCnic: { en: "42101-1234567-1", ur: "42101-1234567-1" },
  childName: { en: "Muhammad Ali", ur: "محمد علی" },
  relationOfChild: { en: "Son", ur: "بیٹا" },
  religion: { en: "Islam", ur: "اسلام" },
  gender: "male",
  vaccinated: "yes",
  placeOfBirth: "hospital",
  dateOfBirth: { day: "15", month: "03", year: "2026" },
  fatherName: { en: "Ahmed Khan", ur: "احمد خان" },
  motherName: { en: "Fatima Khan", ur: "فاطمہ خان" },
};
