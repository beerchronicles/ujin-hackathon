export interface Screen {
  id: string;
  name: string;
  complex: string;
  building: string;
}

export interface Template {
  id: string;
  name: string;
  widgets: any[];
}

export const MOCK_SCREENS: Screen[] = [
  { id: 'scr_1', name: 'Экран Холл 1', complex: 'Комплекс А', building: 'Здание 1' },
  { id: 'scr_2', name: 'Экран Лифт 1', complex: 'Комплекс А', building: 'Здание 1' },
  { id: 'scr_3', name: 'Экран Ресепшн', complex: 'Комплекс Б', building: 'Главное здание' },
  { id: 'scr_4', name: 'Экран Холл 2', complex: 'Комплекс Б', building: 'Здание 2' },
];

export const MOCK_TEMPLATES: Template[] = [
  { id: 'tpl_1', name: 'Шаблон 1', widgets: [] },
  { id: 'tpl_2', name: 'Шаблон 2', widgets: [] },
];

export function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export function getComplexes() {
  return unique(MOCK_SCREENS.map((screen) => screen.complex));
}

export function getBuildingsByComplex(complex: string) {
  return unique(
    MOCK_SCREENS
      .filter((screen) => screen.complex === complex)
      .map((screen) => screen.building)
  );
}

export function getScreensByComplex(complex: string) {
  return MOCK_SCREENS.filter((screen) => screen.complex === complex);
}

export function getScreensByBuilding(complex: string, building: string) {
  return MOCK_SCREENS.filter(
    (screen) => screen.complex === complex && screen.building === building
  );
}

export function getScreenIds(screens: Screen[]) {
  return screens.map((screen) => screen.id);
}

export function getScreenNameById(id: string) {
  return MOCK_SCREENS.find((screen) => screen.id === id)?.name || id;
}