export interface Screen {
  id: number;
  name: string;
  templateId: number;
  complex: number;
  building: number;
  chs: boolean;
  chsText?: string | null;
}

export interface Template {
  id: number;
  name: string;
  scrollTime: number;
  mainBlockImage?: string | null;
  mainBlockContent?: string | null;
  mainBlockTitle?: string | null;
  block1Content?: string | null;
  block2Content?: string | null;
  block1Title?: string | null;
  block2Title?: string | null;
  contact1Name?: string | null;
  contact1Phone?: string | null;
  contact2Name?: string | null;
  contact2Phone?: string | null;
  contact3Name?: string | null;
  contact3Phone?: string | null;
  contact4Name?: string | null;
  contact4Phone?: string | null;
}

export type TemplateRequest = Omit<Template, 'id' | 'mainBlockImage'>;

export interface Complex {
  id: number;
  title: string;
  timezone?: string;
}

export interface Building {
  id: number;
  title: string;
  complexId: number;
  complexTitle?: string;
  timezone?: string;
}

export function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export function getScreenIds(screens: Screen[]) {
  return screens.map((screen) => screen.id);
}

export function getScreenNameById(screens: Screen[], id: number) {
  return screens.find((screen) => screen.id === id)?.name || String(id);
}

export function getComplexTitle(complexes: Complex[], id?: number) {
  return complexes.find((complex) => complex.id === id)?.title || `Комплекс ${id ?? '-'}`;
}

export function getBuildingTitle(buildings: Building[], id?: number) {
  return buildings.find((building) => building.id === id)?.title || `Здание ${id ?? '-'}`;
}

export function getTemplateRequest(template: Template): TemplateRequest {
  return {
    name: template.name,
    scrollTime: template.scrollTime,
    mainBlockContent: normalizeOptionalText(template.mainBlockContent),
    mainBlockTitle: normalizeOptionalText(template.mainBlockTitle),
    block1Content: normalizeOptionalText(template.block1Content),
    block2Content: normalizeOptionalText(template.block2Content),
    block1Title: normalizeOptionalText(template.block1Title),
    block2Title: normalizeOptionalText(template.block2Title),
    contact1Name: normalizeOptionalText(template.contact1Name),
    contact1Phone: normalizeOptionalText(template.contact1Phone),
    contact2Name: normalizeOptionalText(template.contact2Name),
    contact2Phone: normalizeOptionalText(template.contact2Phone),
    contact3Name: normalizeOptionalText(template.contact3Name),
    contact3Phone: normalizeOptionalText(template.contact3Phone),
    contact4Name: normalizeOptionalText(template.contact4Name),
    contact4Phone: normalizeOptionalText(template.contact4Phone),
  };
}

export function normalizeOptionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}
