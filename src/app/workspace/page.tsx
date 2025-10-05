'use client';

import { useState } from 'react';
import { useResearch } from '@/shared/contexts/ResearchContext';
import { findPaperById } from '@/shared/utils/paperReference';
import {
  FolderPlus, Trash2, BookmarkCheck, Plus,
  Download, X, Edit2, StickyNote, BarChart3
} from 'lucide-react';

export default function WorkspacePage() {
  const {
    collections, createCollection, deleteCollection,
    removePaperFromCollection,
    savedPapers, notes, readingProgress, deleteNote
  } = useResearch();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'collections' | 'saved' | 'notes'>('collections');
      
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
      setShowCreateCollection(false);
    }
  };

  const handleExportCollection = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    const papers = collection.paperIds.map(id => findPaperById(id)).filter(Boolean);
    const bibtex = papers.map((paper, i) => {
      if (!paper) return '';
      const firstAuthor = paper.authors[0]?.name.split(' ').pop()?.toLowerCase() || 'unknown';
      return `@article{${firstAuthor}${paper.publication_year}_${i},
  author = {${paper.authors.map(a => a.name).join(' and ')}},
  title = {${paper.title}},
  journal = {${paper.journal}},
  year = {${paper.publication_year}},
  doi = {${paper.doi}}
}`;
    }).join('\n\n');

    const blob = new Blob([bibtex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collection.name}.bib`;
    a.click();
  };

  const selectedCollectionData = selectedCollection
    ? collections.find(c => c.id === selectedCollection)
    : null;

    const readCount = Object.keys(readingProgress).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
                <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Workspace</h1>
          <p className="text-gray-600">Manage your research library, notes, and collections</p>
        </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collections</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{collections.length}</p>
              </div>
              <FolderPlus className="w-8 h-8 text-[var(--primary)] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saved Papers</p>
                <p className="text-2xl font-bold text-blue-600">{savedPapers.length}</p>
              </div>
              <BookmarkCheck className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="text-2xl font-bold text-green-600">{notes.length}</p>
              </div>
              <StickyNote className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reading Progress</p>
                <p className="text-2xl font-bold text-purple-600">{readCount}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

                <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('collections')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'collections'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setViewMode('saved')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'saved'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Saved Papers
          </button>
          <button
            onClick={() => setViewMode('notes')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'notes'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Notes
          </button>
        </div>

                {viewMode === 'collections' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">My Collections</h3>
                  <button
                    onClick={() => setShowCreateCollection(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {showCreateCollection && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateCollection}
                        className="flex-1 px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-sm"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateCollection(false);
                          setNewCollectionName('');
                        }}
                        className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => setSelectedCollection(collection.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedCollection === collection.id
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{collection.name}</p>
                          <p className={`text-xs ${
                            selectedCollection === collection.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {collection.paperIds.length} papers
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportCollection(collection.id);
                            }}
                            className="p-1.5 hover:bg-white/20 rounded"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCollection(collection.id);
                            }}
                            className="p-1.5 hover:bg-white/20 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </button>
                  ))}

                  {collections.length === 0 && !showCreateCollection && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No collections yet. Create one to organize your papers.
                    </p>
                  )}
                </div>
              </div>
            </div>

                        <div className="lg:col-span-2">
              {selectedCollectionData ? (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">{selectedCollectionData.name}</h3>
                  <div className="space-y-3">
                    {selectedCollectionData.paperIds.map(paperId => {
                      const paper = findPaperById(paperId);
                      if (!paper) return null;

                      return (
                        <div key={paperId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{paper.title}</h4>
                              <p className="text-xs text-gray-600">
                                {paper.authors.slice(0, 2).map(a => a.name).join(', ')}
                                {paper.authors.length > 2 && ' et al.'} · {paper.publication_year}
                              </p>
                            </div>
                            <button
                              onClick={() => removePaperFromCollection(selectedCollectionData.id, paperId)}
                              className="p-1.5 hover:bg-gray-200 rounded"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {selectedCollectionData.paperIds.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-8">
                        This collection is empty. Add papers from search or chat.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center justify-center h-64">
                  <p className="text-gray-500">Select a collection to view its papers</p>
                </div>
              )}
            </div>
          </div>
        )}

                {viewMode === 'saved' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Saved Papers ({savedPapers.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPapers.map(paperId => {
                const paper = findPaperById(paperId);
                if (!paper) return null;

                return (
                  <div key={paperId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm mb-2">{paper.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {paper.authors.slice(0, 2).map(a => a.name).join(', ')}
                      {paper.authors.length > 2 && ' et al.'} · {paper.publication_year}
                    </p>
                    <div className="text-xs text-gray-500">
                      {paper.journal}
                    </div>
                  </div>
                );
              })}

              {savedPapers.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <BookmarkCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No saved papers yet</p>
                </div>
              )}
            </div>
          </div>
        )}

                {viewMode === 'notes' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">My Notes ({notes.length})</h3>
            <div className="space-y-4">
              {notes.map(note => {
                const paper = findPaperById(note.paperId);

                return (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{paper?.title || 'Unknown Paper'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => console.log('Edit note:', note.id)}
                          className="p-1.5 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {note.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {notes.length === 0 && (
                <div className="text-center py-12">
                  <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notes yet. Create notes in paper details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
