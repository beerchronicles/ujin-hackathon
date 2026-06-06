import { useState } from 'react';
import './App.css';

interface Screen {
  id: string;
  name: string;
  complex: string;
  building: string;
}

interface Template {
  id: string;
  name: string;
  widgets: any[];
}

const MOCK_SCREENS: Screen[] = [
  { id: 'scr_1', name: 'Экран Холл 1', complex: 'Комплекс А', building: 'Здание 1' },
  { id: 'scr_2', name: 'Экран Лифт 1', complex: 'Комплекс А', building: 'Здание 1' },
  { id: 'scr_3', name: 'Экран Ресепшн', complex: 'Комплекс Б', building: 'Главное здание' },
  { id: 'scr_4', name: 'Экран Холл 2', complex: 'Комплекс Б', building: 'Здание 2' },
];

const MOCK_TEMPLATES: Template[] = [
  { id: 'tpl_1', name: 'Шаблон 1', widgets: [] },
  { id: 'tpl_2', name: 'Шаблон 2', widgets: [] },
];

const LeftSide = ({ 
  onSelectTemplate, 
  onCreateTemplate, 
  onPreview 
}: { 
  onSelectTemplate: (t: Template) => void; 
  onCreateTemplate: () => void; 
  onPreview: (t: Template) => void; 
}) => {
  const [expandedComplex, setExpandedComplex] = useState<string | null>(null);
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);

  const complexes = Array.from(new Set(MOCK_SCREENS.map(s => s.complex)));

  return (
    <aside className="sidebar">
      <div className="section-box">
        <h4 className="section-title">Список экранов</h4>
        {complexes.map(complex => (
          <div key={complex}>
            <div 
              className="accordion-title" 
              onClick={() => {
                setExpandedComplex(expandedComplex === complex ? null : complex);
                if (expandedComplex !== complex) setExpandedBuilding(null);
              }}
            >
              {expandedComplex === complex ? '[-] ' : '[+] '} {complex}
            </div>
            
            {expandedComplex === complex && (
              <div className="accordion-content">
                {MOCK_SCREENS
                  .filter(s => s.complex === complex)
                  .map(s => s.building)
                  .filter((v, i, a) => a.indexOf(v) === i) // Уникальные здания
                  .map(building => (
                    <div key={building}>
                      <div 
                        className="accordion-title" 
                        style={{ fontSize: '14px' }}
                        onClick={() => setExpandedBuilding(expandedBuilding === building ? null : building)}
                      >
                        {expandedBuilding === building ? '[-] ' : '[+] '} {building}
                      </div>
                      
                      {expandedBuilding === building && (
                        <div className="accordion-content">
                          {MOCK_SCREENS
                            .filter(s => s.complex === complex && s.building === building)
                            .map(screen => (
                              <div key={screen.id} className="screen-item">
                                {screen.name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="section-box">
        <h4 className="section-title">Список шаблонов</h4>
        {MOCK_TEMPLATES.map(tpl => (
          <div key={tpl.id} style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
            <button className="proto-btn" onClick={() => onSelectTemplate(tpl)} style={{ flex: 1 }}>{tpl.name}</button>
            <button className="proto-btn" onClick={() => onPreview(tpl)} style={{ width: '40px' }}>👁</button>
          </div>
        ))}
        <button className="proto-btn btn-dashed" onClick={onCreateTemplate} style={{ marginTop: '12px' }}>+ Создать новый</button>
      </div>
    </aside>
  );
};

const RightSide = ({ 
  currentTemplate, 
  onSave, 
  onEmergency, 
  onDelete 
}: { 
  currentTemplate: Template | null; 
  onSave: () => void; 
  onEmergency: () => void; 
  onDelete: () => void; 
}) => {
  return (
    <aside className="actions-panel">
      <div className="section-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 className="section-title">Действия</h4>
        <button className="proto-btn btn-bold" onClick={onSave} disabled={!currentTemplate}>Назначить на экраны</button>
        <button className="proto-btn" onClick={() => alert('Редактировать')} disabled={!currentTemplate}>Редактировать</button>
        <button className="proto-btn" onClick={onDelete} disabled={!currentTemplate}>Удалить</button>
      </div>
      <button className="proto-btn btn-black" onClick={onEmergency}>Режим ЧС</button>
    </aside>
  );
};

const TemplateConstructor = ({ template }: { template: Template | null }) => {
  return (
    <main className="constructor-area">
      <div className="area-title">Рабочее поле / {template?.name || 'Не выбрано'}</div>
      <div className="workspace-visual">
        {template ? (
          <div className="workspace-center">
            <h3>[{template.name}]</h3>
            <p>Здесь будет конструктор виджетов</p>
          </div>
        ) : (
          <p className="workspace-empty-text">Выберите шаблон слева или нажмите кнопку создания</p>
        )}
      </div>
    </main>
  );
};

const EmergencyPanel = ({ onBack }: { onBack: () => void }) => {
  const [selectedChsh, setSelectedChsh] = useState<string[]>([]);
  const [selectedNormal, setSelectedNormal] = useState<string[]>([]);
  const [modalStep, setModalStep] = useState(0);
  const [emergencyText, setEmergencyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleScreen = (id: string, isChsh: boolean) => {
    if (isChsh) {
      setSelectedChsh(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedNormal(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
  };

  const handleMainButtonClick = () => {
    if (selectedNormal.length > 0) setModalStep(2);
    else if (selectedChsh.length > 0) setModalStep(1);
  };

  const submitAction = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    if (modalStep === 1) alert('Режим ЧС отключен');
    else if (modalStep === 5) alert('Режим ЧС активирован');
    
    setIsSubmitting(false);
    setModalStep(0);
    setSelectedChsh([]);
    setSelectedNormal([]);
    setEmergencyText('');
  };

  const selectedCount = selectedNormal.length + selectedChsh.length;
  const isButtonDisabled = selectedCount === 0;

  return (
    <div className="admin-panel">
      <header className="emergency-header">
        <h2>Управление режимом ЧС</h2>
        <button onClick={onBack} style={{ width: 'auto', padding: '8px 20px' }}>Назад</button>
      </header>

      <div className="main-layout emergency-layout">
        <div className="section-box">
          <h3 className="text-red">Экраны с активной ЧС</h3>
          <div className="screen-list-vertical">
            {MOCK_SCREENS.map(screen => (
              <div
                key={screen.id}
                className={`screen-item ${selectedChsh.includes(screen.id) ? 'active-red' : ''}`}
                onClick={() => toggleScreen(screen.id, true)}
              >
                {selectedChsh.includes(screen.id) ? '[ВЫБРАН] ' : ''} {screen.name}
              </div>
            ))}
          </div>
        </div>

        <div className="section-box">
          <h3>Экраны в штатном режиме</h3>
          <div className="screen-list-vertical">
            {MOCK_SCREENS.map(screen => (
              <div
                key={screen.id}
                className={`screen-item ${selectedNormal.includes(screen.id) ? 'active-teal' : ''}`}
                onClick={() => toggleScreen(screen.id, false)}
              >
                {selectedNormal.includes(screen.id) ? '[ВЫБРАН] ' : ''} {screen.name}
              </div>
            ))}
          </div>
        </div>

        <div className="emergency-action-sidebar">
          <button
            className="emergency-btn big-emergency-btn"
            disabled={isButtonDisabled || isSubmitting}
            style={{ opacity: (isButtonDisabled || isSubmitting) ? 0.4 : 1 }}
            onClick={handleMainButtonClick}
          >
            {isSubmitting ? 'Отправка...' : 'Выполнить команду ЧС'}
          </button>
        </div>
      </div>

      {modalStep > 0 && (
        <div className="modal-overlay">
          <div className="modal-container">
            {modalStep === 1 && (
              <>
                <p className="modal-text">Отключить режим ЧС для выбранных экранов?</p>
                <div className="modal-buttons">
                  <button onClick={submitAction}>Да</button>
                  <button onClick={() => setModalStep(0)}>Нет</button>
                </div>
              </>
            )}
            {modalStep === 2 && (
              <>
                <p className="modal-text">Экраны для активации ЧС:</p>
                <div className="modal-list-box">
                  {[...selectedNormal, ...selectedChsh].map(id => {
                    const name = MOCK_SCREENS.find(s => s.id === id)?.name;
                    return <div key={id}>{name}</div>;
                  })}
                </div>
                <div className="modal-buttons">
                  <button onClick={() => setModalStep(3)}>Продолжить</button>
                  <button onClick={() => setModalStep(0)}>Отмена</button>
                </div>
              </>
            )}
            {modalStep === 3 && (
              <>
                <p className="modal-text">Текст сообщения ЧС:</p>
                <textarea
                  placeholder="Введите текст..."
                  value={emergencyText}
                  onChange={(e) => setEmergencyText(e.target.value)}
                  className="modal-textarea"
                />
                <div className="modal-buttons">
                  <button onClick={() => setModalStep(4)}>Продолжить</button>
                  <button onClick={() => setModalStep(2)}>Отмена</button>
                </div>
              </>
            )}
            {modalStep === 4 && (
              <>
                <p className="modal-text">Подтвердите отправку:</p>
                <div className="modal-list-box">{emergencyText || '[Пусто]'}</div>
                <div className="modal-buttons">
                  <button onClick={() => setModalStep(5)}>Подтвердить</button>
                  <button onClick={() => setModalStep(3)}>Отмена</button>
                </div>
              </>
            )}
            {modalStep === 5 && (
              <>
                <p className="modal-text">Отправить сообщение на сервер?</p>
                <div className="modal-buttons">
                  <button onClick={submitAction}>{isSubmitting ? 'Отправка...' : 'Да'}</button>
                  <button onClick={() => setModalStep(4)}>Отмена</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewModal = ({ template, onClose }: { template: Template | null; onClose: () => void }) => {
  if (!template) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-container" onClick={(e) => e.stopPropagation()}>
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
};

export default function App() {
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  if (isEmergency) return <EmergencyPanel onBack={() => setIsEmergency(false)} />;

  return (
    <div className="admin-panel prototype-theme">
      <header className="header-panel">
        <span>Панель управления УК</span>
      </header>
      <div className="main-layout">
        <LeftSide
          onSelectTemplate={setCurrentTemplate}
          onCreateTemplate={() => setCurrentTemplate({ id: 'new', name: 'Новый шаблон', widgets: [] })}
          onPreview={setPreviewTemplate}
        />
        <TemplateConstructor template={currentTemplate} />
        <RightSide
          currentTemplate={currentTemplate}
          onSave={() => alert('Шаблон назначен (заглушка)')}
          onEmergency={() => setIsEmergency(true)}
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
    </div>
  );
}