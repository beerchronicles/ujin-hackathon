import { useState } from 'react';
import type { Template } from './common';
import {
  MOCK_SCREENS,
  getBuildingsByComplex,
  getComplexes,
  getScreenIds,
  getScreenNameById,
  getScreensByBuilding,
  getScreensByComplex,
} from './common';

interface PreviewModalProps {
  template: Template | null;
  onClose: () => void;
}

export function PreviewModal({ template, onClose }: PreviewModalProps) {
  if (!template) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="preview-container"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="preview-header">
          <h3>Предпросмотр: {template.name}</h3>
          <button onClick={onClose}>Закрыть</button>
        </div>

        <div className="phone-frame">
          <div className="screen-content">
            <div className="mock-widget"></div>
            <div className="mock-widget"></div>
            <div className="mock-widget"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AssignScreensModalProps {
  template: Template | null;
  onClose: () => void;
}

export function AssignScreensModal({
  template,
  onClose,
}: AssignScreensModalProps) {
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);

  if (!template) return null;

  const templateName = template.name;
  const allScreenIds = getScreenIds(MOCK_SCREENS);

  function areAllSelected(ids: string[]) {
    return ids.every((id) => selectedScreens.includes(id));
  }

  function toggleScreens(ids: string[]) {
    setSelectedScreens((currentList) => {
      const shouldRemove = ids.every((id) => currentList.includes(id));

      if (shouldRemove) {
        return currentList.filter((id) => !ids.includes(id));
      }

      return Array.from(new Set([...currentList, ...ids]));
    });
  }

  function handleSubmit() {
    const selectedNames = selectedScreens.map(getScreenNameById).join(', ');

    alert(`Шаблон "${templateName}" назначен на экраны: ${selectedNames}`);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Назначить шаблон на экраны</h3>

        <p className="modal-text">
          Шаблон: <b>{templateName}</b>
        </p>

        <div className="modal-list-box">
          <CheckLine
            label="Список экранов"
            checked={areAllSelected(allScreenIds)}
            onChange={() => toggleScreens(allScreenIds)}
            strong
          />

          {getComplexes().map((complex) => {
            const complexScreens = getScreensByComplex(complex);
            const complexScreenIds = getScreenIds(complexScreens);

            return (
              <div key={complex}>
                <CheckLine
                  label={complex}
                  checked={areAllSelected(complexScreenIds)}
                  onChange={() => toggleScreens(complexScreenIds)}
                  strong
                />

                <div style={{ paddingLeft: '24px' }}>
                  {getBuildingsByComplex(complex).map((building) => {
                    const buildingScreens = getScreensByBuilding(complex, building);
                    const buildingScreenIds = getScreenIds(buildingScreens);

                    return (
                      <div key={`${complex}::${building}`}>
                        <CheckLine
                          label={building}
                          checked={areAllSelected(buildingScreenIds)}
                          onChange={() => toggleScreens(buildingScreenIds)}
                          strong
                        />

                        <div style={{ paddingLeft: '24px' }}>
                          {buildingScreens.map((screen) => (
                            <CheckLine
                              key={screen.id}
                              label={screen.name}
                              checked={selectedScreens.includes(screen.id)}
                              onChange={() => toggleScreens([screen.id])}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-buttons">
          <button
            onClick={handleSubmit}
            disabled={selectedScreens.length === 0}
            style={{ opacity: selectedScreens.length === 0 ? 0.4 : 1 }}
          >
            Назначить
          </button>

          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
}

interface CheckLineProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  strong?: boolean;
}

function CheckLine({ label, checked, onChange, strong = false }: CheckLineProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
        cursor: 'pointer',
        fontWeight: strong ? 'bold' : 'normal',
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}