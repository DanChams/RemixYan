/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Project } from '../types.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Mappers ────────────────────────────────────────────────────────────────

const rowToProject = (row: Record<string, unknown>): Project => ({
  id: row.id as string,
  title: row.title as string,
  category: row.category as string,
  status: row.status as Project['status'],
  description: row.description as string,
  imageUrl: row.image_url as string,
  threeDUrl: (row.three_d_url as string | null) ?? undefined,
  pdfUrl: (row.pdf_url as string | null) ?? undefined,
  details: {
    client: row.client as string,
    date: row.date as string,
    role: row.role as string,
  },
});

const projectToRow = (project: Partial<Project>) => ({
  title: project.title,
  category: project.category,
  status: project.status,
  description: project.description,
  image_url: project.imageUrl,
  three_d_url: project.threeDUrl ?? null,
  pdf_url: project.pdfUrl ?? null,
  client: project.details?.client,
  date: project.details?.date,
  role: project.details?.role,
});

// ─── Auth (désactivée — accès admin direct) ───────────────────────────────────

const MOCK_USER = { uid: 'admin', email: 'admin@local' };

export const auth = {
  currentUser: MOCK_USER,
  onAuthStateChanged: (cb: (user: unknown) => void) => {
    cb(MOCK_USER);
    return () => {};
  },
};

export const loginWithGoogle = async () => {};
export const logout = async () => {};

// ─── Projets (realtime) ───────────────────────────────────────────────────────

const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }
  return (data ?? []).map(rowToProject);
};

export const subscribeToProjects = (callback: (projects: Project[]) => void) => {
  fetchProjects().then(callback);

  const channelId = `projects-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const channel = supabase
    .channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
      fetchProjects().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectToRow(project)])
    .select()
    .single();

  if (error) throw error;
  return rowToProject(data);
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .update({ ...projectToRow(project), updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const db = supabase;
