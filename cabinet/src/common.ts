export interface Screen {
  id: number;
  name: string;
  templateId?: number;
  complex?: number;
  building?: number;
  chs?: boolean;
  chsText?: string;
}

export interface Template {
  id: number;
  name: string;
  scrollTime?: number;
  mainBlockImage?: string;
  mainBlockContent?: string;
  mainBlockTitle?: string;
  block1Content?: string;
  block2Content?: string;
  block1Title?: string;
  block2Title?: string;
  contact1Name?: string;
  contact1Phone?: string;
  contact2Name?: string;
  contact2Phone?: string;
  contact3Name?: string;
  contact3Phone?: string;
  contact4Name?: string;
  contact4Phone?: string;
}

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