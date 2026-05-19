import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X, Save, LogOut, Layout } from 'lucide-react';
import { auth, loginWithGoogle, logout, subscribeToProjects, addProject, updateProject, deleteProject } from '../lib/supabase.ts';
import { Project } from '../types.ts';
import { getPreviewLink } from '../lib/preview.ts';

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState(auth.currentUser);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState<Partial<Project> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(setUser);
    const unsubscribeProjects = subscribeToProjects(setProjects);
    return () => {
      unsubscribeAuth();
      unsubscribeProjects();
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    setIsLoading(true);
    try {
      if (isEditing.id) {
        await updateProject(isEditing.id, isEditing);
      } else {
        await addProject(isEditing as Omit<Project, 'id'>);
      }
      setIsEditing(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-display text-white mb-2">Espace Administration</h2>
            <p className="text-gray-400">Connectez-vous pour gérer votre catalogue.</p>
          </div>
          <button 
            onClick={() => loginWithGoogle()}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-brand-beige transition-colors flex items-center justify-center gap-3"
          >
            Se connecter avec Google
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">Retour au site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-display tracking-tightest">Projet <span className="text-brand-dark/30">Conception</span></h1>
            <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-[10px] font-bold uppercase tracking-widest rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditing({ title: '', category: 'yan+one', status: 'En cours', imageUrl: '', pdfUrl: '', description: '', details: { client: '', date: '', role: '' } })}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full hover:bg-brand-dark transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <Plus size={18} />
              Nouveau Projet
            </button>
            <button onClick={() => logout()} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Déconnexion">
              <LogOut size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors" title="Fermer">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group bg-gray-50 border border-gray-100 p-6 rounded-2xl flex items-center justify-between hover:border-brand-beige transition-all">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                  <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-display text-xl mb-1">{project.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="uppercase tracking-widest font-bold text-brand-dark">{project.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{project.details.client}</span>
                  </div>
                  {project.pdfUrl && <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest border border-brand-cyan/20 px-2 py-0.5 rounded">PDF InDesign</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsEditing(project)}
                  className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-brand-dark hover:border-brand-beige rounded-xl transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => confirm('Supprimer ce projet ?') && deleteProject(project.id)}
                  className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-md flex items-center justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl h-full bg-white shadow-2xl p-12 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-display">{isEditing.id ? 'Modifier le projet' : 'Nouveau Projet'}</h2>
                <button onClick={() => setIsEditing(null)} className="p-2 text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Titre du projet</label>
                    <input 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige"
                      value={isEditing.title}
                      onChange={e => setIsEditing({...isEditing, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Catégorie</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige"
                      value={isEditing.category}
                      onChange={e => setIsEditing({...isEditing, category: e.target.value})}
                    >
                      <option>yan+one</option>
                      <option>Syn&amp;zyn</option>
                      <option>I❤️M FENNA</option>
                      <option>Morocain Rituals</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Statut</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige"
                      value={isEditing.status}
                      onChange={e => setIsEditing({...isEditing, status: e.target.value as any})}
                    >
                      <option>Terminé</option>
                      <option>En cours</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige"
                    value={isEditing.description}
                    onChange={e => setIsEditing({...isEditing, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Lien InDesign PDF
                    <span className="ml-2 text-brand-cyan normal-case tracking-normal font-normal">Colle le lien src de ton iframe Adobe</span>
                  </label>
                  <input
                    placeholder="https://indd.adobe.com/embed/xxx?startpage=1&allowFullscreen=true"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige font-mono text-sm"
                    value={isEditing.pdfUrl ?? ''}
                    onChange={e => setIsEditing({...isEditing, pdfUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    URL Vignette
                    <span className="ml-2 normal-case tracking-normal font-normal text-gray-400">(optionnel — si pas de PDF)</span>
                  </label>
                  <input
                    placeholder="Lien vers une image de couverture"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige"
                    value={isEditing.imageUrl ?? ''}
                    onChange={e => setIsEditing({...isEditing, imageUrl: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Client</label>
                    <input
                      className="w-full px-4 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-brand-dark"
                      value={isEditing.details?.client}
                      onChange={e => setIsEditing({...isEditing, details: {...isEditing.details!, client: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Année</label>
                    <select
                      className="w-full px-4 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-brand-dark"
                      value={isEditing.details?.date ?? new Date().getFullYear().toString()}
                      onChange={e => setIsEditing({...isEditing, details: {...isEditing.details!, date: e.target.value}})}
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rôle</label>
                    <input
                      className="w-full px-4 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-brand-dark"
                      value={isEditing.details?.role}
                      onChange={e => setIsEditing({...isEditing, details: {...isEditing.details!, role: e.target.value}})}
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full py-4 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-colors flex items-center justify-center gap-3 mt-12"
                >
                  {isLoading ? 'Enregistrement...' : <><Save size={20} /> Publier le projet</>}
                </button>
              </form>

              {isEditing.pdfUrl && (
                <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Aperçu InDesign Direct</h4>
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                    <iframe src={getPreviewLink(isEditing.pdfUrl)} className="w-full h-full" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
