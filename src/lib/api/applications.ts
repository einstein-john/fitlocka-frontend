import { apiDeleteMessage, apiGet, apiPost, apiPut } from '@/lib/api/client';
import type { Application } from '@/lib/api/types';

export async function listApplications(): Promise<Application[] | undefined> {
  const data = await apiGet<{ applications: Application[] } | { items: Application[] } | Application[]>(
    '/applications',
    null
  );
  if (Array.isArray(data)) return data;
  if (data && 'applications' in data) return data.applications;
  if (data && 'items' in data) return data.items;
  return undefined;
}

export async function getApplication(id: number): Promise<Application | undefined> {
  const data = await apiGet<{ application: Application } | Application>(`/applications/${id}`, null);
  if (data && 'application' in data) return data.application;
  return data as Application | undefined;
}

export async function createApplication(name: string): Promise<Application | undefined> {
  const data = await apiPost<{ application: Application } | Application, { name: string }>(
    '/applications',
    { name },
    null
  );
  if (data && 'application' in data) return data.application;
  return data as Application | undefined;
}

export async function updateApplication(id: number, name: string): Promise<Application | undefined> {
  const data = await apiPut<{ application: Application } | Application, { name: string }>(
    `/applications/${id}`,
    { name },
    null
  );
  if (data && 'application' in data) return data.application;
  return data as Application | undefined;
}

export async function deleteApplication(id: number): Promise<string> {
  return apiDeleteMessage(`/applications/${id}`, null);
}
