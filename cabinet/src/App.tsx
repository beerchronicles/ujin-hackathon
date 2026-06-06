import { useEffect, useState } from 'react';
import './App.css';

import { api } from './api';
import type { Building, Complex, Screen, Template } from './common';
import { EmergencyPanel } from './EmergencyPanel';
import { LoginByToken } from './LoginByToken';
import { AssignScreensModal, PreviewModal } from './Modals';
import { LeftSide, RightSide, TemplateConstructor } from './Panels';

export default function App() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isEmergencyPage, setIsEmergencyPage] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);

  async function loadData() {
    try {
      setIsLoading(true);

      const [
        screensData,
        templatesData,
        complexesData,
        buildingsData,
      ] = await Promise.all([
        api.getScreens(),
        api.getTemplates(),
        api.getComplexes(),
        api.getBuildings(),
      ]);

      setScreens(screensData);
      setTemplates(templatesData);
      setComplexes(complexesData);
      setBuildings(buildingsData);
      setNeedLogin(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);

      // Если сессии нет или токен не прошёл, показываем форму входа.
      setNeedLogin(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoginSuccess() {
    await loadData();
  }

  async function createTemplate() {
    try {
      const newTemplate = await api.createTemplate({
        name: 'Новый шаблон',
        scrollTime: 5,
      });

      setTemplates((prev) => [...prev, newTemplate]);
      setCurrentTemplate(newTemplate);
    } catch (error) {
      console.error('Ошибка создания шаблона:', error);
      alert('Не удалось создать шаблон');
    }
  }

  async function deleteTemplate() {
    if (!currentTemplate) return;

    try {
      await api.deleteTemplate(currentTemplate.id);

      setTemplates((prev) =>
        prev.filter((template) => template.id !== currentTemplate.id)
      );

      setCurrentTemplate(null);
    } catch (error) {
      console.error('Ошибка удаления шаблона:', error);
      alert('Не удалось удалить шаблон');
    }
  }

  async function assignTemplateToScreens(screenIds: number[]) {
    if (!currentTemplate) return;

    try {
      await Promise.all(
        screenIds.map((screenId) => {
          const screen = screens.find((item) => item.id === screenId);

          return api.updateScreen(screenId, {
            name: screen?.name || 'Экран',
            templateId: currentTemplate.id,
            complex: screen?.complex,
            building: screen?.building,
            chs: screen?.chs || false,
            chsText: screen?.chsText || '',
          });
        })
      );

      await loadData();
      setIsAssignModalOpen(false);

      alert('Шаблон назначен на выбранные экраны');
    } catch (error) {
      console.error('Ошибка назначения шаблона:', error);
      alert('Не удалось назначить шаблон');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <div className="admin-panel">Загрузка...</div>;
  }

  if (needLogin) {
    return <LoginByToken onSuccess={handleLoginSuccess} />;
  }

  if (isEmergencyPage) {
    return (
      <EmergencyPanel
        screens={screens}
        onBack={() => setIsEmergencyPage(false)}
        onReload={loadData}
      />
    );
  }

  return (
    <div className="admin-panel prototype-theme">
      <header className="header-panel">
        <span>Панель управления УК</span>
      </header>

      <div className="main-layout">
        <LeftSide
          screens={screens}
          templates={templates}
          complexes={complexes}
          buildings={buildings}
          onSelectTemplate={setCurrentTemplate}
          onCreateTemplate={createTemplate}
          onPreview={setPreviewTemplate}
        />

        <TemplateConstructor template={currentTemplate} />

        <RightSide
          currentTemplate={currentTemplate}
          onSave={() => setIsAssignModalOpen(true)}
          onEmergency={() => setIsEmergencyPage(true)}
          onDelete={deleteTemplate}
        />
      </div>

      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      {isAssignModalOpen && (
        <AssignScreensModal
          template={currentTemplate}
          screens={screens}
          complexes={complexes}
          buildings={buildings}
          onSubmit={assignTemplateToScreens}
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}
    </div>
  );
}