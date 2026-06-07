import type { Building, Complex, Screen, Template, TemplateRequest } from './common';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  path: string,
  method: RequestMethod = 'GET',
  body?: unknown
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error('API request failed:', {
      path,
      status: response.status,
      errorText,
    });

    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

async function upload<T>(path: string, fieldName: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Upload failed:', {
      path,
      status: response.status,
      errorText,
    });

    throw new Error(`Upload error ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function loginByToken(token: string) {
  const formData = new URLSearchParams();
  formData.append('token', token);

  const response = await fetch(`${API_URL}/login/token`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Login failed:', {
      status: response.status,
      errorText,
    });

    throw new Error(`Login error ${response.status}: ${errorText}`);
  }
}

export function getImageUrl(imageKey: string | null | undefined) {
  if (!imageKey) {
    return undefined;
  }

  if (/^https?:\/\//i.test(imageKey)) {
    return imageKey;
  }

  return `${API_URL}/images/${encodeURIComponent(imageKey)}`;
}

export const api = {
  loginByToken,

  getScreens() {
    return request<Screen[]>('/screens?filter=');
  },

  getScreen(id: number) {
    return request<Screen>(`/screens/${id}`);
  },

  updateScreen(id: number, data: Partial<Screen>) {
    return request<Screen>(`/screens/${id}`, 'PUT', data);
  },

  emergencyReset(screenId: number) {
    return request<Screen>(`/screens/${screenId}/emergency_reset`, 'POST');
  },

  createScreen(data: Partial<Screen>) {
    return request<Screen>('/screens', 'POST', data);
  },

  deleteScreen(id: number) {
    return request<void>(`/screens/${id}`, 'DELETE');
  },

  getTemplates() {
    return request<Template[]>('/templates?filter=');
  },

  getTemplate(id: number) {
    return request<Template>(`/templates/${id}`);
  },

  createTemplate(data: TemplateRequest) {
    return request<Template>('/templates', 'POST', data);
  },

  updateTemplate(id: number, data: TemplateRequest) {
    return request<Template>(`/templates/${id}`, 'PUT', data);
  },

  uploadMainBlockImage(id: number, file: File) {
    return upload<Template>(`/templates/${id}/main-block-image`, 'image', file);
  },

  deleteMainBlockImage(id: number) {
    return request<Template>(`/templates/${id}/main-block-image`, 'DELETE');
  },

  deleteTemplate(id: number) {
    return request<void>(`/templates/${id}`, 'DELETE');
  },

  getComplexes() {
    return request<Complex[]>('/complexes');
  },

  getBuildings(complexId?: number) {
    const query = complexId ? `?complexId=${complexId}` : '';
    return request<Building[]>(`/buildings${query}`);
  },
};
