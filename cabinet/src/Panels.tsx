import { type ChangeEvent, type Dispatch, type SetStateAction, useState } from 'react';
import { getImageUrl } from './api';
import type { Building, Complex, Screen, Template } from './common';
import { getBuildingTitle, getComplexTitle, unique } from './common';

interface LeftSideProps {
  screens: Screen[];
  templates: Template[];
  complexes: Complex[];
  buildings: Building[];
  currentTemplateId?: number;
  onSelectTemplate: (template: Template) => void;
  onCreateTemplate: () => void;
  onPreview: (template: Template) => void;
}

export function LeftSide({
  screens,
  templates,
  complexes,
  buildings,
  currentTemplateId,
  onSelectTemplate,
  onCreateTemplate,
  onPreview,
}: LeftSideProps) {
  const [expandedComplexes, setExpandedComplexes] = useState<number[]>([]);
  const [expandedBuildings, setExpandedBuildings] = useState<number[]>([]);

  const complexIds = unique(screens.map((screen) => screen.complex));
  const ungroupedScreens = screens.filter((screen) => !screen.complex || !screen.building);

  function toggleNumber(value: number, setList: Dispatch<SetStateAction<number[]>>) {
    setList((currentList) => {
      if (currentList.includes(value)) {
        return currentList.filter((item) => item !== value);
      }

      return [...currentList, value];
    });
  }

  return (
    <aside className="sidebar">
      <div className="section-box section-scroll">
        <h4 className="section-title">Список экранов</h4>

        {complexIds.map((complexId) => {
          const isComplexOpen = expandedComplexes.includes(complexId);
          const complexScreens = screens.filter((screen) => screen.complex === complexId);
          const buildingIds = unique(complexScreens.map((screen) => screen.building));

          return (
            <div key={complexId}>
              <button
                type="button"
                className="accordion-title"
                onClick={() => toggleNumber(complexId, setExpandedComplexes)}
              >
                {isComplexOpen ? '[-]' : '[+]'} {getComplexTitle(complexes, complexId)}
              </button>

              {isComplexOpen && (
                <div className="accordion-content">
                  {buildingIds.map((buildingId) => {
                    const isBuildingOpen = expandedBuildings.includes(buildingId);

                    return (
                      <div key={buildingId}>
                        <button
                          type="button"
                          className="accordion-title accordion-title-small"
                          onClick={() => toggleNumber(buildingId, setExpandedBuildings)}
                        >
                          {isBuildingOpen ? '[-]' : '[+]'} {getBuildingTitle(buildings, buildingId)}
                        </button>

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
                                  <span>{screen.name}</span>
                                  {screen.templateId === currentTemplateId && (
                                    <span className="screen-badge">текущий</span>
                                  )}
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

        {ungroupedScreens.map((screen) => (
          <div key={screen.id} className="screen-item">
            {screen.name}
          </div>
        ))}
      </div>

      <div className="section-box section-scroll">
        <h4 className="section-title">Список шаблонов</h4>

        {templates.map((template) => (
          <div key={template.id} className="template-row">
            <button
              type="button"
              className={`proto-btn template-name-btn ${
                template.id === currentTemplateId ? 'active-template' : ''
              }`}
              onClick={() => onSelectTemplate(template)}
            >
              {template.name}
            </button>

            <button
              type="button"
              className="proto-btn template-preview-btn"
              onClick={() => onPreview(template)}
              title="Предпросмотр"
            >
              ◉
            </button>
          </div>
        ))}

        <button
          type="button"
          className="proto-btn btn-dashed"
          onClick={onCreateTemplate}
        >
          + Создать новый
        </button>
      </div>
    </aside>
  );
}

interface RightSideProps {
  currentTemplate: Template | null;
  onAssign: () => void;
  onPreview: () => void;
  onEmergency: () => void;
  onDelete: () => void;
}

export function RightSide({
  currentTemplate,
  onAssign,
  onPreview,
  onEmergency,
  onDelete,
}: RightSideProps) {
  const hasTemplate = currentTemplate !== null;

  return (
    <aside className="actions-panel">
      <div className="section-box actions-box">
        <h4 className="section-title">Действия</h4>

        <button
          type="button"
          className="proto-btn btn-bold"
          onClick={onAssign}
          disabled={!hasTemplate}
        >
          Назначить на экраны
        </button>

        <button
          type="button"
          className="proto-btn"
          onClick={onPreview}
          disabled={!hasTemplate}
        >
          Предпросмотр
        </button>

        <button
          type="button"
          className="proto-btn"
          onClick={onDelete}
          disabled={!hasTemplate}
        >
          Удалить
        </button>
      </div>

      <button type="button" className="proto-btn btn-black" onClick={onEmergency}>
        Режим ЧС
      </button>
    </aside>
  );
}

interface TemplateConstructorProps {
  template: Template | null;
  onChange: (template: Template) => void;
  onSave: (template: Template) => void;
  onUploadMainBlockImage: (template: Template, file: File) => void;
  onDeleteMainBlockImage: (template: Template) => void;
}

export function TemplateConstructor({
  template,
  onChange,
  onSave,
  onUploadMainBlockImage,
  onDeleteMainBlockImage,
}: TemplateConstructorProps) {
  if (!template) {
    return (
      <main className="constructor-area">
        <div className="area-title">Рабочее поле / не выбрано</div>
        <div className="workspace-visual">
          <p className="workspace-empty-text">
            Выберите шаблон слева или создайте новый.
          </p>
        </div>
      </main>
    );
  }

  const activeTemplate = template;

  function updateField<K extends keyof Template>(key: K, value: Template[K]) {
    const nextDraft = { ...activeTemplate, [key]: value };
    onChange(nextDraft);
  }

  function updateTextField(key: keyof Template) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(key, event.target.value as never);
    };
  }

  function updateScrollTime(event: ChangeEvent<HTMLInputElement>) {
    updateField('scrollTime', Math.max(0, Number(event.target.value) || 0));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onUploadMainBlockImage(activeTemplate, file);
      event.target.value = '';
    }
  }

  const imageUrl = getImageUrl(activeTemplate.mainBlockImage);

  return (
    <main className="constructor-area">
      <div className="area-title">Рабочее поле / {activeTemplate.name}</div>

      <div className="constructor-form">
        <section className="form-section">
          <h3>Основные настройки</h3>
          <TextField label="Название шаблона" value={activeTemplate.name} onChange={updateTextField('name')} />
          <TextField
            label="Скорость слайдера, мс"
            type="number"
            value={String(activeTemplate.scrollTime)}
            onChange={updateScrollTime}
          />
        </section>

        <section className="form-section">
          <h3>Главный информационный блок</h3>
          <TextField
            label="Заголовок"
            value={activeTemplate.mainBlockTitle || ''}
            onChange={updateTextField('mainBlockTitle')}
          />
          <TextArea
            label="Контент"
            value={activeTemplate.mainBlockContent || ''}
            onChange={updateTextField('mainBlockContent')}
          />

          <div className="image-control">
            <div>
              <span className="field-label">Изображение</span>
              <p className="field-hint">
                Используется в основном блоке шаблона.
              </p>
            </div>
            {imageUrl && <img src={imageUrl} alt="" className="image-thumb" />}
            <label className="file-button">
              Загрузить
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            <button
              type="button"
              className="proto-btn"
              disabled={!activeTemplate.mainBlockImage}
              onClick={() => onDeleteMainBlockImage(activeTemplate)}
            >
              Удалить
            </button>
          </div>
        </section>

        <section className="form-section form-grid-two">
          <InfoBlockEditor
            title="Блок 1"
            titleValue={activeTemplate.block1Title || ''}
            contentValue={activeTemplate.block1Content || ''}
            onTitleChange={updateTextField('block1Title')}
            onContentChange={updateTextField('block1Content')}
          />
          <InfoBlockEditor
            title="Блок 2"
            titleValue={activeTemplate.block2Title || ''}
            contentValue={activeTemplate.block2Content || ''}
            onTitleChange={updateTextField('block2Title')}
            onContentChange={updateTextField('block2Content')}
          />
        </section>

        <section className="form-section">
          <h3>Контакты</h3>
          <div className="contacts-grid">
            {[1, 2, 3, 4].map((index) => (
              <ContactEditor
                key={index}
                index={index}
                name={String(activeTemplate[`contact${index}Name` as keyof Template] || '')}
                phone={String(activeTemplate[`contact${index}Phone` as keyof Template] || '')}
                onNameChange={updateTextField(`contact${index}Name` as keyof Template)}
                onPhoneChange={updateTextField(`contact${index}Phone` as keyof Template)}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="constructor-footer">
        <button type="button" className="proto-btn btn-bold" onClick={() => onSave(activeTemplate)}>
          Сохранить шаблон
        </button>
      </div>
    </main>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function TextField({ label, value, onChange, type = 'text' }: TextFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input type={type} value={value} onChange={onChange} />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextArea({ label, value, onChange }: TextAreaProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea value={value} onChange={onChange} />
    </label>
  );
}

interface InfoBlockEditorProps {
  title: string;
  titleValue: string;
  contentValue: string;
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

function InfoBlockEditor({
  title,
  titleValue,
  contentValue,
  onTitleChange,
  onContentChange,
}: InfoBlockEditorProps) {
  return (
    <div>
      <h3>{title}</h3>
      <TextField label="Заголовок" value={titleValue} onChange={onTitleChange} />
      <TextArea label="Контент" value={contentValue} onChange={onContentChange} />
    </div>
  );
}

interface ContactEditorProps {
  index: number;
  name: string;
  phone: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function ContactEditor({
  index,
  name,
  phone,
  onNameChange,
  onPhoneChange,
}: ContactEditorProps) {
  return (
    <div className="contact-editor">
      <h4>Контакт {index}</h4>
      <TextField label="Имя" value={name} onChange={onNameChange} />
      <TextField label="Телефон" value={phone} onChange={onPhoneChange} />
    </div>
  );
}
