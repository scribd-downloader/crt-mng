import Dexie, { type EntityTable } from "dexie";
import type {
  LocalDocument,
  LocalDraft,
  LocalSettings,
  LocalTemplate,
} from "@/types/certificate";

class CertificateDatabase extends Dexie {
  documents!: EntityTable<LocalDocument, "id">;
  drafts!: EntityTable<LocalDraft, "id">;
  templates!: EntityTable<LocalTemplate, "id">;
  settings!: EntityTable<LocalSettings, "id">;

  constructor() {
    super("CertificateDB");
    this.version(1).stores({
      documents: "id, type, title, createdAt, updatedAt",
      drafts: "id, type, updatedAt",
      templates: "id, type, name, createdAt",
      settings: "id",
    });
  }
}

export const db = new CertificateDatabase();

export async function saveDocument(doc: LocalDocument): Promise<void> {
  await db.documents.put(doc);
}

export async function getDocument(id: string): Promise<LocalDocument | undefined> {
  return db.documents.get(id);
}

export async function getAllDocuments(): Promise<LocalDocument[]> {
  return db.documents.orderBy("updatedAt").reverse().toArray();
}

export async function getDocumentsByType(
  type: string
): Promise<LocalDocument[]> {
  return db.documents.where("type").equals(type).reverse().sortBy("updatedAt");
}

export async function deleteDocument(id: string): Promise<void> {
  await db.documents.delete(id);
}

export async function saveDraft(draft: LocalDraft): Promise<void> {
  await db.drafts.put(draft);
}

export async function getDraft(
  type: string
): Promise<LocalDraft | undefined> {
  return db.drafts.where("type").equals(type).first();
}

export async function deleteDraft(id: string): Promise<void> {
  await db.drafts.delete(id);
}

export async function getSettings(): Promise<LocalSettings | undefined> {
  return db.settings.get("default");
}

export async function saveSettings(settings: LocalSettings): Promise<void> {
  await db.settings.put(settings);
}

export async function exportAllData(): Promise<object> {
  const [documents, drafts, templates, settings] = await Promise.all([
    db.documents.toArray(),
    db.drafts.toArray(),
    db.templates.toArray(),
    db.settings.toArray(),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    documents,
    drafts,
    templates,
    settings,
  };
}

export async function importAllData(data: {
  documents?: LocalDocument[];
  drafts?: LocalDraft[];
  templates?: LocalTemplate[];
  settings?: LocalSettings[];
}): Promise<void> {
  await db.transaction(
    "rw",
    [db.documents, db.drafts, db.templates, db.settings],
    async () => {
      if (data.documents) {
        await db.documents.bulkPut(data.documents);
      }
      if (data.drafts) {
        await db.drafts.bulkPut(data.drafts);
      }
      if (data.templates) {
        await db.templates.bulkPut(data.templates);
      }
      if (data.settings) {
        await db.settings.bulkPut(data.settings);
      }
    }
  );
}

export async function getNextDocumentNumber(
  type: import("@/types/certificate").CertificateType
): Promise<string> {
  const settings = await getSettings();
  const seq = settings?.documentNumberSequence?.[type] ?? 1;
  const prefix =
    type === "birth"
      ? "BC"
      : type === "death"
        ? "DC"
        : type === "marriage"
          ? "MC"
          : "DIV";
  const year = new Date().getFullYear();
  const number = `${prefix}-${year}-${String(seq).padStart(6, "0")}`;

  await saveSettings({
    id: "default",
    documentNumberSequence: {
      ...(settings?.documentNumberSequence ?? {
        birth: 1,
        death: 1,
        marriage: 1,
        divorce: 1,
      }),
      [type]: seq + 1,
    },
    dateFormat: settings?.dateFormat ?? "DD / MM / YYYY",
    officeName: settings?.officeName ?? { en: "", ur: "" },
    defaultUnionCouncil: settings?.defaultUnionCouncil ?? { en: "", ur: "" },
  });

  return number;
}
