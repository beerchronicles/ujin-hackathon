import { useState } from 'react';
import type { Building, Complex, Screen, Template } from './common';
import { getBuildingTitle, getComplexTitle, unique } from './common';

interface LeftSideProps {
  screens: Screen[];
  templates: Template[];
  complexes: Complex[];
  buildings: Building[];
  onSelectTemplate: (template: Template) => void;
  onCreateTemplate: () => void;
  onPreview: (template: Template) => void;
}

export function LeftSide({
  screens,
  templates,
  complexes,
  buildings,
  onSelectTemplate,
  onCreateTemplate,
  onPreview,
}: LeftSideProps) {
  const [expandedComplexes, setExpandedComplexes] = useState<number[]>([]);
  const [expandedBuildings, setExpandedBuildings] = useState<number[]>([]);

  const complexIds = unique(
    screens
      .map((screen) => screen.complex)
      .filter((id): id is number => typeof id === 'number')
  );

  function toggleNumber(
    value: number,
    setList: React.Dispatch<React.SetStateAction<number[]>>
  ) {
    setList((currentList) => {
      if (currentList.includes(value)) {
        return currentList.filter((item) => item !== value);
      }

      return [...currentList, value];
    });
  }

  return (
    <aside className="sidebar">
      <div className="section-box">
        <h4 className="section-title">Список экранов</h4>

        {complexIds.map((complexId) => {
          const isComplexOpen = expandedComplexes.includes(complexId);
          const complexScreens = screens.filter((screen) => screen.complex === complexId);

          const buildingIds = unique(
            complexScreens
              .map((screen) => screen.building)
              .filter((id): id is number => typeof id === 'number')
          );

          return (
            <div key={complexId}>
              <div
                className="accordion-title"
                onClick={() => toggleNumber(complexId, setExpandedComplexes)}
              >
                {isComplexOpen ? '[-] ' : '[+] '}
                {getComplexTitle(complexes, complexId)}
              </div>

              {isComplexOpen && (
                <div className="accordion-content">
                  {buildingIds.map((buildingId) => {
                    const isBuildingOpen = expandedBuildings.includes(buildingId);

                    return (
                      <div key={buildingId}>
                        <div
                          className="accordion-title"
                          style={{ fontSize: '14px' }}
                          onClick={() => toggleNumber(buildingId, setExpandedBuildings)}
                        >
                          {isBuildingOpen ? '[-] ' : '[+] '}
                          {getBuildingTitle(buildings, buildingId)}
                        </div>

                        {isBuildingOpen && (
                          <div className="accordion-content">
                            {screens
                              .filter(
                                (screen) =>
                                  screen.complex === complexId &&
                                  screen.building === buildingId
                              )
                              .map((screen) => (
                                <div key={screen.id} className="screen-item">
                                  {screen.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="section-box">
        <h4 className="section-title">Список шаблонов</h4>

        {templates.map((template) => (
          <div
            key={template.id}
            style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}
          >
            <button
              className="proto-btn"
              onClick={() => onSelectTemplate(template)}
              style={{ flex: 1 }}
            >
              {template.name}
            </button>

            <button
              className="proto-btn"
              onClick={() => onPreview(template)}
              style={{ width: '40px' }}
            >
              👁
            </button>
          </div>
        ))}

        <button
          className="proto-btn btn-dashed"
          onClick={onCreateTemplate}
          style={{ marginTop: '12px' }}
        >
          + Создать новый
        </button>
      </div>
    </aside>
  );
}

interface RightSideProps {
  currentTemplate: Template | null;
  onSave: () => void;
  onEmergency: () => void;
  onDelete: () => void;
}

export function RightSide({
  currentTemplate,
  onSave,
  onEmergency,
  onDelete,
}: RightSideProps) {
  const hasTemplate = currentTemplate !== null;

  return (
    <aside className="actions-panel">
      <div
        className="section-box"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <h4 className="section-title">Действия</h4>

        <button
          className="proto-btn btn-bold"
          onClick={onSave}
          disabled={!hasTemplate}
        >
          Назначить на экраны
        </button>

        <button
          className="proto-btn"
          onClick={() => alert('Редактировать')}
          disabled={!hasTemplate}
        >
          Редактировать
        </button>

        <button
          className="proto-btn"
          onClick={onDelete}
          disabled={!hasTemplate}
        >
          Удалить
        </button>
      </div>

      <button className="proto-btn btn-black" onClick={onEmergency}>
        Режим ЧС
      </button>
    </aside>
  );
}

interface TemplateConstructorProps {
  template: Template | null;
}

export function TemplateConstructor({ template }: TemplateConstructorProps) {
  return (
    <main className="constructor-area">
      <div className="area-title">
        Рабочее поле / {template?.name || 'Не выбрано'}
      </div>

      <div className="workspace-visual">
        {template ? (
          <div className="workspace-center">
            <h3>[{template.name}]</h3>
            <p>Здесь будет конструктор виджетов</p>
          </div>
        ) : (
          <p className="workspace-empty-text">
            Выберите шаблон слева или нажмите кнопку создания
          </p>
        )}
      </div>
    </main>
  );
}