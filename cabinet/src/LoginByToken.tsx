import { type FormEvent, useState } from 'react';
import { api } from './api';

interface LoginByTokenProps {
  onSuccess: () => void;
}

export function LoginByToken({ onSuccess }: LoginByTokenProps) {
  const [token, setToken] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      <div className="section-box login-box">
        <h3>Вход по токену</h3>

        <form onSubmit={handleSubmit}>
          <textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Вставьте токен"
            className="modal-textarea token-textarea"
          />

          {errorText && <p className="text-red login-error">{errorText}</p>}

          <button type="submit" disabled={isSending}>
            {isSending ? 'Проверка токена...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
