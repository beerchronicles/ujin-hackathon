import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getImageUrl } from './api';
import type { Building, Complex, Screen, Template } from './common';
import {
  getBuildingTitle,
  getComplexTitle,
  getScreenIds,
  unique,
} from './common';

const DISPLAY_APP_URL = import.meta.env.VITE_DISPLAY_APP_URL as string | undefined;

interface PreviewModalProps {
  template: Template;
  screens: Screen[];
  complexes: Complex[];
  buildings: Building[];
  onClose: () => void;
}

export function PreviewModal({
  template,
  screens,
  complexes,
  buildings,
  onClose,
}: PreviewModalProps) {
  const relatedScreens = screens.filter((screen) => screen.templateId === template.id);
  const initialScreenId = relatedScreens[0]?.id ?? screens[0]?.id ?? 0;
  const [screenId, setScreenId] = useState(initialScreenId);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const selectedScreen = screens.find((screen) => screen.id === screenId);
  const contacts = useMemo(() => getTemplateContacts(template), [template]);
  const imageUrl = getImageUrl(template.mainBlockImage);
  const displayPreviewUrl = DISPLAY_APP_URL
    ? `${DISPLAY_APP_URL}${DISPLAY_APP_URL.includes('?') ? '&' : '?'}preview=1`
    : undefined;

  const sendPreviewPayload = useCallback(() => {
    if (!displayPreviewUrl || !iframeRef.current?.contentWindow) {
      return;
    }

    iframeRef.current.contentWindow.postMessage(
      {
        type: 'UJIN_DISPLAY_PREVIEW',
        template,
        screen: selectedScreen,
        availability: {
          freeStorages: 0,
          freeParkings: 0,
        },
      },
      '*'
    );
  }, [displayPreviewUrl, selectedScreen, template]);

  useEffect(() => {
    if (!displayPreviewUrl) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UJIN_DISPLAY_PREVIEW_READY') {
        sendPreviewPayload();
      }
    };

    window.addEventListener('message', handleMessage);
    sendPreviewPayload();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [displayPreviewUrl, sendPreviewPayload]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="preview-container"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="preview-header">
          <div>
            <h3>Предпросмотр: {template.name}</h3>
            {selectedScreen && (
              <p className="preview-subtitle">
                {selectedScreen.name} · {getComplexTitle(complexes, selectedScreen.complex)} ·{' '}
                {getBuildingTitle(buildings, selectedScreen.building)}
              </p>
            )}
          </div>

          <button type="button" className="proto-btn preview-close" onClick={onClose}>
            Закрыть
          </button>
        </div>

        <label className="field preview-screen-select">
          <span className="field-label">Экран для предпросмотра</span>
          <select
            value={screenId}
            onChange={(event) => setScreenId(Number(event.target.value))}
            disabled={screens.length === 0}
          >
            {screens.length === 0 && <option value={0}>Нет экранов</option>}
            {screens.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.name}
              </option>
            ))}
          </select>
        </label>

        {displayPreviewUrl ? (
          <iframe
            ref={iframeRef}
            className="display-preview-iframe"
            src={displayPreviewUrl}
            title={`Предпросмотр ${template.name}`}
            onLoad={sendPreviewPayload}
          />
        ) : (
          <div className="display-preview-frame">
          {selectedScreen?.chs && (
            <div className="preview-emergency">
              {selectedScreen.chsText || 'Включен режим ЧС'}
            </div>
          )}

          <section className="preview-news">
            <h2>Новости ЖК</h2>
            <div className="preview-news-grid">
              <article>
                <h3>Новость будет показана здесь</h3>
                <p>
                  В реальном экране этот блок заполняется актуальными новостями для выбранного ЖК.
                </p>
              </article>
              <ul>
                <li>Последние объявления</li>
                <li>Работы управляющей компании</li>
                <li>Информация для жителей</li>
              </ul>
            </div>
          </section>

          <section className="preview-info">
            <h2>Полезная информация</h2>
            <div className="preview-info-grid">
              <div className="preview-main-block">
                {template.mainBlockTitle && <h3>{template.mainBlockTitle}</h3>}
                {imageUrl && <img src={imageUrl} alt="" />}
                <TemplateHtml content={template.mainBlockContent} fallback="Основной текст не заполнен" />
              </div>

              <div className="preview-side-blocks">
                {contacts.length > 0 && (
                  <div className="preview-card">
                    <h3>Контакты</h3>
                    {contacts.map((contact) => (
                      <p key={`${contact.name}:${contact.phone}`}>
                        {contact.name}: {contact.phone}
                      </p>
                    ))}
                  </div>
                )}

                <PreviewInfoBlock
                  title={template.block1Title}
                  content={template.block1Content}
                  fallbackTitle="Блок 1"
                />
                <PreviewInfoBlock
                  title={template.block2Title}
                  content={template.block2Content}
                  fallbackTitle="Блок 2"
                />
              </div>
            </div>
          </section>
          </div>
        )}
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

  const allScreenIds = getScreenIds(screens);

  function areAllSelected(ids: number[]) {
    return ids.length > 0 && ids.every((id) => selectedScreens.includes(id));
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

  const complexIds = unique(screens.map((screen) => screen.complex));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Назначить шаблон на экраны</h3>

        <p className="modal-text">
          Шаблон: <b>{template.name}</b>
        </p>

        <div className="modal-list-box">
          <CheckLine
            label="Все экраны"
            checked={areAllSelected(allScreenIds)}
            onChange={() => toggleScreens(allScreenIds)}
            strong
          />

          {complexIds.map((complexId) => {
            const complexScreens = screens.filter(
              (screen) => screen.complex === complexId
            );
            const complexScreenIds = getScreenIds(complexScreens);
            const buildingIds = unique(complexScreens.map((screen) => screen.building));

            return (
              <div key={complexId}>
                <CheckLine
                  label={getComplexTitle(complexes, complexId)}
                  checked={areAllSelected(complexScreenIds)}
                  onChange={() => toggleScreens(complexScreenIds)}
                  strong
                />

                <div className="modal-indent">
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

                        <div className="modal-indent">
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
            type="button"
            onClick={() => onSubmit(selectedScreens)}
            disabled={selectedScreens.length === 0}
          >
            Назначить
          </button>

          <button type="button" onClick={onClose}>Отмена</button>
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
    <label className={`check-line ${strong ? 'check-line-strong' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function TemplateHtml({
  content,
  fallback,
}: {
  content?: string | null;
  fallback?: string;
}) {
  if (!content) {
    return fallback ? <p className="preview-muted">{fallback}</p> : null;
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
}

function PreviewInfoBlock({
  title,
  content,
  fallbackTitle,
}: {
  title?: string | null;
  content?: string | null;
  fallbackTitle: string;
}) {
  if (!title && !content) {
    return (
      <div className="preview-card preview-muted">
        {fallbackTitle} не заполнен
      </div>
    );
  }

  return (
    <div className="preview-card">
      <h3>{title || fallbackTitle}</h3>
      <TemplateHtml content={content} />
    </div>
  );
}

function getTemplateContacts(template: Template) {
  return [
    [template.contact1Name, template.contact1Phone],
    [template.contact2Name, template.contact2Phone],
    [template.contact3Name, template.contact3Phone],
    [template.contact4Name, template.contact4Phone],
  ].flatMap(([name, phone]) => (name && phone ? [{ name, phone }] : []));
}

function sanitizeHtml(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');

  document.querySelectorAll('script, iframe, object, embed, link, meta').forEach((node) => node.remove());
  document.body.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith('on') || value.startsWith('javascript:')) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
}
