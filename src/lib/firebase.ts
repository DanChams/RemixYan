/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Mock Firebase for Local Development when Firebase is declined
import { Project } from '../types.ts';
import { PROJECTS as INITIAL_PROJECTS } from '../data.ts';

// Initial state from localStorage or static data
const getStoredProjects = (): Project[] => {
  const stored = localStorage.getItem('projects');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored projects', e);
    }
  }
  return INITIAL_PROJECTS;
};

let currentProjects: Project[] = getStoredProjects();
const listeners: ((projects: Project[]) => void)[] = [];

const notify = () => {
  localStorage.setItem('projects', JSON.stringify(currentProjects));
  listeners.forEach(cb => cb([...currentProjects]));
};

// Mock Auth
export const auth = {
  currentUser: { uid: 'local-admin', email: 'admin@factory-premium.com' },
  onAuthStateChanged: (cb: (user: any) => void) => {
    cb({ uid: 'local-admin', email: 'admin@factory-premium.com' });
    return () => {};
  }
};

export const loginWithGoogle = async () => {
  console.log('Mock login');
  return { user: auth.currentUser };
};

export const logout = async () => {
  console.log('Mock logout');
};

// Mock Firestore
export const subscribeToProjects = (callback: (projects: Project[]) => void) => {
  listeners.push(callback);
  callback([...currentProjects]);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};

export const addProject = async (project: Omit<Project, 'id'>) => {
  const newProject = {
    ...project,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  } as Project;
  
  currentProjects = [newProject, ...currentProjects];
  notify();
  return newProject;
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  currentProjects = currentProjects.map(p => 
    p.id === id ? { ...p, ...project, updatedAt: new Date().toISOString() } : p
  );
  notify();
};

export const deleteProject = async (id: string) => {
  currentProjects = currentProjects.filter(p => p.id !== id);
  notify();
};

export const db = {}; // Dummy export to prevent breakages if imported elsewhere
