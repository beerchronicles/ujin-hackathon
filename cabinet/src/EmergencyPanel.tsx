import { useState } from 'react';
import { MOCK_SCREENS, getScreenNameById } from './common';

interface EmergencyPanelProps {
  onBack: () => void;
}

export function EmergencyPanel({ onBack }: EmergencyPanelProps) {
  const [selectedChsScreens, setSelectedChsScreens] = useState<string[]>([]);
  const [selectedNormalScreens, setSelectedNormalScreens] = useState<string[]>([]);
  const [modalStep, setModalStep] = useState(0);
  const [emergencyText, setEmergencyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCount = selectedChsScreens.length + selectedNormalScreens.length;
  const isCommandDisabled = selectedCount === 0 || isSubmitting;

  function toggleScreen(
    screenId: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setList((currentList) => {
      if (currentList.includes(screenId)) {
        return currentList.filter((id) => id !== screenId);
      }

      return [...currentList, screenId];
    });
  }

  function openActionModal() {
    if (selectedNormalScreens.length > 0) {
      setModalStep(2);
      return;
    }

    if (selectedChsScreens.length > 0) {
      setModalStep(1);
    }
  }

  async function submitAction() {
    setIsSubmitting(true);

    // Тут пока имитация запроса, потом заменим на вызов API.
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (modalStep === 1) {
      alert('Режим ЧС отключен');
    }

    if (modalStep === 5) {
      alert('Режим ЧС активирован');
    }

    setIsSubmitting(false);
    setModalStep(0);
    setSelectedChsScreens([]);
    setSelectedNormalScreens([]);
    setEmergencyText('');
  }

  return (
    <div className="admin-panel">
      <header className="emergency-header">
        <h2>Управление режимом ЧС</h2>

        <button
          onClick={onBack}
          style={{ width: 'auto', padding: '8px 20px' }}
        >
          Назад
        </button>
      </header>

      <div className="main-layout emergency-layout">
        <div className="section-box">
          <h3 className="text-red">Экраны с активной ЧС</h3>

          <div className="screen-list-vertical">
            {MOCK_SCREENS.map((screen) => {
              const isSelected = selectedChsScreens.includes(screen.id);

              return (
                <div
                  key={screen.id}
                  className={`screen-item ${isSelected ? 'active-red' : ''}`}
                  onClick={() => toggleScreen(screen.id, setSelectedChsScreens)}
                >
                  {isSelected ? '[ВЫБРАН] ' : ''}
                  {screen.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-box">
          <h3>Экраны в штатном режиме</h3>

          <div className="screen-list-vertical">
            {MOCK_SCREENS.map((screen) => {
              const isSelected = selectedNormalScreens.includes(screen.id);

              return (
                <div
                  key={screen.id}
                  className={`screen-item ${isSelected ? 'active-teal' : ''}`}
                  onClick={() => toggleScreen(screen.id, setSelectedNormalScreens)}
                >
                  {isSelected ? '[ВЫБРАН] ' : ''}
                  {screen.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="emergency-action-sidebar">
          <button
            className="emergency-btn big-emergency-btn"
            disabled={isCommandDisabled}
            style={{ opacity: isCommandDisabled ? 0.4 : 1 }}
            onClick={openActionModal}
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
                <p className="modal-text">
                  Отключить режим ЧС для выбранных экранов?
                </p>

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
                  {[...selectedNormalScreens, ...selectedChsScreens].map((id) => (
                    <div key={id}>{getScreenNameById(id)}</div>
                  ))}
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
                  onChange={(event) => setEmergencyText(event.target.value)}
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

                <div className="modal-list-box">
                  {emergencyText || '[Пусто]'}
                </div>

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
                  <button onClick={submitAction}>
                    {isSubmitting ? 'Отправка...' : 'Да'}
                  </button>

                  <button onClick={() => setModalStep(4)}>Отмена</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}