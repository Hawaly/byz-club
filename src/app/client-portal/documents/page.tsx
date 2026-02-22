"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import {
  FileText, Download, Eye, File, Folder, 
  Search, CheckCircle, X, Filter, SlidersHorizontal,
  FolderOpen, Calendar, Loader2
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  role_code: string;
  role_name: string;
  role_id: number; 
  client_id?: number;
  client_name?: string;
}

interface Document {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: string;
  created_at: string;
  updated_at?: string;
  client_id: number;
  folder_id?: number;
  is_archived: boolean;
}

interface Folder {
  id: number;
  name: string;
  client_id: number;
  parent_folder_id?: number;
  created_at: string;
  document_count: number;
}

export default function DocumentsPage() {
  // useRequireClient garantit que user existe ou redirige
  const { user } = useRequireClient() as { user: User, isLoading: boolean };
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState<{id: number, name: string}[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  
  // État pour gérer les erreurs à afficher à l'utilisateur
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // useRequireClient guarantees user exists or redirects
    if (!user || !user.client_id) return;
    
    async function checkTableExists(tableName: string) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        // Une erreur PGRST116 signifie que la table n'existe pas
        if (error && (error.code === 'PGRST116' || error.message.includes('does not exist'))) {
          return false;
        }
        
        return true;
      } catch (err) {
        console.error(`Erreur lors de la vérification de la table ${tableName}:`, err);
        return false;
      }
    }
    
    async function fetchDocuments() {
      setIsLoading(true);
      setFetchError(null);
      
      try {
        // Vérifier l'existence des tables nécessaires
        const documentFolderExists = await checkTableExists('document_folder');
        const documentExists = await checkTableExists('document');
        
        if (!documentFolderExists || !documentExists) {
          setFolders([]);
          setDocuments([]);
          if (!documentFolderExists && !documentExists) {
            setFetchError("Les tables 'document' et 'document_folder' n'existent pas dans la base de données.");
          } else if (!documentFolderExists) {
            setFetchError("La table 'document_folder' n'existe pas dans la base de données.");
          } else {
            setFetchError("La table 'document' n'existe pas dans la base de données.");
          }
          setIsLoading(false);
          return;
        }
        
        // Fetch folders first
        const { data: folderData, error: folderError } = await supabase
          .from('document_folder')
          .select('*, document_count:document(count)')
          .eq('client_id', user.client_id)
          .order('name', { ascending: true });
        
        if (folderError) {
          console.error('Erreur lors de la récupération des dossiers:', folderError);
          setFetchError(`Erreur lors de la récupération des dossiers: ${folderError.message || folderError.details || 'Erreur inconnue'}`);
          setIsLoading(false);
          return;
        }
        
        // Process folder data to include document count
        const processedFolders = folderData?.map(folder => ({
          ...folder,
          document_count: folder.document_count || 0
        })) || [];
        
        setFolders(processedFolders);
        
        // Fetch root documents (not in folders) or documents in current folder
        let query = supabase
          .from('document')
          .select('*')
          .eq('client_id', user.client_id);
          
        // Si la colonne is_archived existe, l'utiliser pour filtrer
        try {
          query = query.eq('is_archived', false);
        } catch (e) {
          console.warn("La colonne 'is_archived' n'existe peut-être pas dans la table 'document'");
        }
        
        if (currentFolderId !== null) {
          query = query.eq('folder_id', currentFolderId);
        } else {
          query = query.is('folder_id', null);
        }
        
        const { data: docData, error: docError } = await query
          .order('created_at', { ascending: false });
        
        if (docError) {
          console.error('Erreur lors de la récupération des documents:', docError);
          setFetchError(`Erreur lors de la récupération des documents: ${docError.message || docError.details || 'Erreur inconnue'}`);
          setIsLoading(false);
          return;
        }
        
        setDocuments(docData || []);
        
        // Update folder path
        if (currentFolderId !== null) {
          const path = [];
          let currentFolder = processedFolders.find(f => f.id === currentFolderId);
          
          while (currentFolder) {
            path.unshift({ id: currentFolder.id, name: currentFolder.name });
            currentFolder = currentFolder.parent_folder_id 
              ? processedFolders.find(f => f.id === currentFolder?.parent_folder_id) 
              : null;
          }
          
          setFolderPath(path);
        } else {
          setFolderPath([]);
        }
      } catch (error: any) {
        // Amélioration de l'affichage des erreurs
        console.error('Error fetching documents:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : (error.message || error.details || 'Une erreur inconnue est survenue');
        setFetchError(`Erreur lors de la récupération des données: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDocuments();
  }, [user, currentFolderId]);

  // Handle document download
  const handleDownload = async (doc: Document) => {
    setDownloadingId(doc.id);
    try {
      let downloadPath = doc.file_path;
      
      // Convert path to API path for local development
      if (downloadPath.startsWith('/documents/')) {
        downloadPath = `/api/uploads${downloadPath}`;
      }
      // If it's already a /uploads/ path, convert to API path
      else if (downloadPath.startsWith('/uploads/')) {
        downloadPath = `/api${downloadPath}`;
      }
      // If it's a Supabase path (no leading slash), use uploads API
      else if (!downloadPath.startsWith('/') && !downloadPath.startsWith('http')) {
        downloadPath = `/api/uploads/${downloadPath}`;
      }
      
      // Open download in new tab
      window.open(downloadPath, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Erreur lors du téléchargement du fichier');
    } finally {
      setDownloadingId(null);
    }
  };
  
  // Preview document
  const handlePreview = async (doc: Document) => {
    setViewingId(doc.id);
    try {
      let previewPath = doc.file_path;
      
      // Convert path for API path
      if (previewPath.startsWith('/documents/')) {
        previewPath = `/api/uploads${previewPath}`;
      } else if (previewPath.startsWith('/uploads/')) {
        previewPath = `/api${previewPath}`;
      } else if (!previewPath.startsWith('/') && !previewPath.startsWith('http')) {
        previewPath = `/api/uploads/${previewPath}`;
      }
      
      // For PDF and images, open in new tab
      if (doc.file_type.includes('pdf') || 
          doc.file_type.includes('image') || 
          doc.file_type.includes('jpg') || 
          doc.file_type.includes('png') || 
          doc.file_type.includes('jpeg')) {
        window.open(previewPath, '_blank');
      } else {
        // For other files, show document details modal
        setSelectedDocument(doc);
      }
    } catch (error) {
      console.error('Error previewing file:', error);
    } finally {
      setViewingId(null);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folderId: number) => {
    setCurrentFolderId(folderId);
  };
  
  // Navigate to parent folder
  const navigateUp = () => {
    if (folderPath.length > 0) {
      const parentFolderId = folderPath.length > 1 
        ? folderPath[folderPath.length - 2].id 
        : null;
      setCurrentFolderId(parentFolderId);
    }
  };
  
  // Filter documents by search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(documents.map(doc => doc.category))).filter(Boolean);
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  // Get icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
      return <Eye className="w-6 h-6 text-blue-500" />;
    } else if (fileType.includes('doc') || fileType.includes('word')) {
      return <File className="w-6 h-6 text-blue-600" />;
    } else if (fileType.includes('xls') || fileType.includes('sheet')) {
      return <File className="w-6 h-6 text-green-600" />;
    } else if (fileType.includes('ppt') || fileType.includes('presentation')) {
      return <File className="w-6 h-6 text-orange-500" />;
    } else {
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  // Affichage des erreurs
  if (fetchError) {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vos Documents</h1>
          <p className="text-gray-600">Consultez et téléchargez les documents partagés avec vous</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Erreur lors du chargement des documents</h3>
            <p className="mt-1">{fetchError}</p>
            <p className="mt-3 text-sm">
              Si le problème persiste, contactez notre équipe de support en{" "}
              <Link href="/client-portal/contact" className="text-red-700 underline hover:text-red-800">
                cliquant ici
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (documents.length === 0 && folders.length === 0 && !searchTerm && !selectedCategory && !currentFolderId) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 inline-flex p-4 rounded-full mx-auto mb-4">
          <FileText className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun document disponible</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Aucun document n'a été partagé avec vous pour le moment. Contactez notre équipe si vous avez besoin d'accéder à des documents spécifiques.
        </p>
        <Link
          href="/client-portal/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors"
        >
          Contacter l'équipe
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Vos Documents</h1>
        <p className="text-gray-600">Consultez et téléchargez les documents partagés avec vous</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="relative min-w-[180px]">
          <button
            className="flex items-center justify-between gap-2 px-4 py-3 w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => document.getElementById('categoryDropdown')?.classList.toggle('hidden')}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span>{selectedCategory || 'Toutes catégories'}</span>
            </div>
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </button>
          
          <div
            id="categoryDropdown"
            className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg hidden"
          >
            <ul className="py-1">
              <li>
                <button
                  className={`px-4 py-2 w-full text-left hover:bg-gray-50 ${!selectedCategory ? 'font-semibold text-purple-600' : ''}`}
                  onClick={() => {
                    setSelectedCategory(null);
                    document.getElementById('categoryDropdown')?.classList.add('hidden');
                  }}
                >
                  Toutes catégories
                </button>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`px-4 py-2 w-full text-left hover:bg-gray-50 ${selectedCategory === category ? 'font-semibold text-purple-600' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      document.getElementById('categoryDropdown')?.classList.add('hidden');
                    }}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Folder Navigation */}
      {folderPath.length > 0 && (
        <div className="flex items-center flex-wrap gap-1 text-sm bg-gray-50 p-2 rounded-lg">
          <button 
            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md text-gray-600"
            onClick={() => setCurrentFolderId(null)}
          >
            <Folder className="w-4 h-4" /> Documents
          </button>
          
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <span className="text-gray-400 mx-1">/</span>
              {index === folderPath.length - 1 ? (
                <span className="px-2 py-1 bg-gray-200 rounded-md text-gray-800 font-medium">
                  {folder.name}
                </span>
              ) : (
                <button 
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md text-gray-600"
                  onClick={() => navigateToFolder(folder.id)}
                >
                  {folder.name}
                </button>
              )}
            </div>
          ))}
          
          {folderPath.length > 0 && (
            <button 
              onClick={navigateUp}
              className="ml-auto flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md text-gray-600"
            >
              Niveau supérieur
            </button>
          )}
        </div>
      )}

      {/* Folders Grid */}
      {folders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-500" /> Dossiers
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {folders
              .filter(folder => folder.parent_folder_id === currentFolderId)
              .map((folder) => (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                  onClick={() => navigateToFolder(folder.id)}
                >
                  <Card className="p-4 hover:shadow-lg transition-all h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Folder className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{folder.name}</h3>
                        <p className="text-sm text-gray-500">
                          {folder.document_count} document{folder.document_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Files Grid/List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" /> Documents
          {searchTerm && <span className="text-sm font-normal text-gray-500">({filteredDocuments.length} résultats)</span>}
        </h2>
        
        {filteredDocuments.length > 0 ? (
          <div className="overflow-hidden shadow-sm rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fichier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr 
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-gray-100">
                          {getFileIcon(doc.file_type)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{doc.title}</span>
                          {doc.description && (
                            <span className="text-sm text-gray-500 line-clamp-1">{doc.description}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {doc.category || 'Non classé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(doc.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                          onClick={() => handleDownload(doc)}
                          disabled={downloadingId === doc.id}
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Download className="w-5 h-5" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          onClick={() => handlePreview(doc)}
                          disabled={viewingId === doc.id}
                        >
                          {viewingId === doc.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="bg-white inline-flex p-4 rounded-full mx-auto mb-4 shadow-sm">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm ? 'Aucun document trouvé' : 'Aucun document dans ce dossier'}
            </p>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `Aucun document ne correspond à votre recherche "${searchTerm}".` 
                : currentFolderId 
                  ? 'Ce dossier est vide.' 
                  : 'Aucun document disponible pour le moment.'}
            </p>
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {getFileIcon(selectedDocument.file_type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDocument.title}</h2>
                  <p className="text-white/80">{selectedDocument.file_type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {selectedDocument.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                    <p className="text-gray-700">{selectedDocument.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold">Taille</p>
                    <p className="text-gray-900 font-medium">{formatFileSize(selectedDocument.file_size)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold">Catégorie</p>
                    <p className="text-gray-900 font-medium">{selectedDocument.category || 'Non classé'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold">Créé le</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedDocument.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold">Dernière mise à jour</p>
                    <p className="text-gray-900 font-medium">
                      {selectedDocument.updated_at 
                        ? new Date(selectedDocument.updated_at).toLocaleDateString('fr-FR')
                        : 'Jamais'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload(selectedDocument)}
                    disabled={downloadingId === selectedDocument.id}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2 hover:shadow-md"
                  >
                    {downloadingId === selectedDocument.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    Télécharger
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
