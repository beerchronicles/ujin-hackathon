import { useState } from 'react';
import type { Building, Complex, Screen, Template } from './common';
import {
  getBuildingTitle,
  getComplexTitle,
  getScreenIds,
  unique,
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
  screens: Screen[];
  complexes: Complex[];
  buildings: Building[];
  onSubmit: (screenIds: number[]) => void;
  onClose: () => void;
}

export function AssignScreensModal({
  template,
  screens,
  complexes,
  buildings,
  onSubmit,
  onClose,
}: AssignScreensModalProps) {
  const [selectedScreens, setSelectedScreens] = useState<number[]>([]);

  if (!template) return null;

  const templateName = template.name;
  const allScreenIds = getScreenIds(screens);

  function areAllSelected(ids: number[]) {
    return ids.every((id) => selectedScreens.includes(id));
  }

  function toggleScreens(ids: number[]) {
    setSelectedScreens((currentList) => {
      const shouldRemove = ids.every((id) => currentList.includes(id));

      if (shouldRemove) {
        return currentList.filter((id) => !ids.includes(id));
      }

      return Array.from(new Set([...currentList, ...ids]));
    });
  }

  const complexIds = unique(
    screens
      .map((screen) => screen.complex)
      .filter((id): id is number => typeof id === 'number')
  );

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

          {complexIds.map((complexId) => {
            const complexScreens = screens.filter(
              (screen) => screen.complex === complexId
            );

            const complexScreenIds = getScreenIds(complexScreens);

            const buildingIds = unique(
              complexScreens
                .map((screen) => screen.building)
                .filter((id): id is number => typeof id === 'number')
            );

            return (
              <div key={complexId}>
                <CheckLine
                  label={getComplexTitle(complexes, complexId)}
                  checked={areAllSelected(complexScreenIds)}
                  onChange={() => toggleScreens(complexScreenIds)}
                  strong
                />

                <div style={{ paddingLeft: '24px' }}>
                  {buildingIds.map((buildingId) => {
                    const buildingScreens = screens.filter(
                      (screen) =>
                        screen.complex === complexId &&
                        screen.building === buildingId
                    );

                    const buildingScreenIds = getScreenIds(buildingScreens);

                    return (
                      <div key={buildingId}>
                        <CheckLine
                          label={getBuildingTitle(buildings, buildingId)}
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
            onClick={() => onSubmit(selectedScreens)}
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