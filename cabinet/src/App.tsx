import { useState } from 'react';
import './App.css';

import type { Template } from './common';
import { EmergencyPanel } from './EmergencyPanel';
import { AssignScreensModal, PreviewModal } from './Modals';
import { LeftSide, RightSide, TemplateConstructor } from './Panels';

export default function App() {
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isEmergencyPage, setIsEmergencyPage] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Для режима ЧС показываем отдельный экран, а не модалку поверх панели.
  if (isEmergencyPage) {
    return <EmergencyPanel onBack={() => setIsEmergencyPage(false)} />;
  }

  return (
    <div className="admin-panel prototype-theme">
      <header className="header-panel">
        <span>Панель управления УК</span>
      </header>

      <div className="main-layout">
        <LeftSide
          onSelectTemplate={setCurrentTemplate}
          onCreateTemplate={() =>
            setCurrentTemplate({
              id: 'new',
              name: 'Новый шаблон',
              widgets: [],
            })
          }
          onPreview={setPreviewTemplate}
        />

        <TemplateConstructor template={currentTemplate} />

        <RightSide
          currentTemplate={currentTemplate}
          onSave={() => setIsAssignModalOpen(true)}
          onEmergency={() => setIsEmergencyPage(true)}
          onDelete={() => {
            setCurrentTemplate(null);
            alert('Шаблон удален (заглушка)');
          }}
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
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}
    </div>
  );
}