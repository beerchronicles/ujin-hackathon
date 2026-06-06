import { useState } from 'react';
import { api } from './api';

interface LoginByTokenProps {
  onSuccess: () => void;
}

export function LoginByToken({ onSuccess }: LoginByTokenProps) {
  const [token, setToken] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedToken = token.trim();

    if (!trimmedToken) {
      setErrorText('Введите токен');
      return;
    }

    try {
      setIsSending(true);
      setErrorText('');

      await api.loginByToken(trimmedToken);

      // После успешного login backend должен поставить cookie SESSION.
      // Дальше App заново загрузит данные уже с credentials.
      onSuccess();
    } catch (error) {
      console.error('Ошибка входа по токену:', error);
      setErrorText('Не удалось войти по токену');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="admin-panel">
      <div
        className="section-box"
        style={{
          width: '420px',
          margin: '80px auto',
        }}
      >
        <h3>Вход по токену</h3>

        <form onSubmit={handleSubmit}>
          <textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Вставьте токен"
            className="modal-textarea"
            style={{
              height: '120px',
              resize: 'vertical',
            }}
          />

          {errorText && (
            <p
              className="text-red"
              style={{
                display: 'block',
                marginBottom: '10px',
              }}
            >
              {errorText}
            </p>
          )}

          <button type="submit" disabled={isSending}>
            {isSending ? 'Проверка токена...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}