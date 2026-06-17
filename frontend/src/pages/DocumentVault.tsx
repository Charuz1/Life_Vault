import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { FileText, UploadCloud, X, Loader2, Search as SearchIcon, FileImage, File } from 'lucide-react';
import axios from 'axios';

const DocumentVault = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Upload Form State
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [tags, setTags] = useState('');

  const fetchDocs = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get('http://localhost:5000/api/documents', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDocs();
  }, [user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('tags', tags);

    try {
      await axios.post('http://localhost:5000/api/documents', formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsUploadModalOpen(false);
      setFile(null);
      setTitle('');
      setCategory('Personal');
      setTags('');
      fetchDocs();
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative h-full">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Vault</h1>
          <p className="text-muted-foreground mt-1">Manage and securely store all your important files.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all hover:shadow-lg hover:shadow-primary/30"
        >
          <UploadCloud className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Document Grid */}
      {fetchLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-background/50">
          <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-foreground">Your vault is empty</h3>
          <p className="text-muted-foreground max-w-sm mt-2">Upload your first document to securely store and AI-search your files.</p>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-6 text-primary font-medium hover:underline"
          >
            Upload a file now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: any) => (
            <div key={doc._id} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  {doc.fileType.includes('image') ? <FileImage className="w-6 h-6" /> : <File className="w-6 h-6" />}
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full">
                  {doc.category}
                </span>
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1 truncate" title={doc.title}>{doc.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
              
              <div className="flex gap-2 mb-4 flex-wrap">
                {doc.tags?.map((tag: string, i: number) => (
                  <span key={i} className="text-xs text-muted-foreground bg-background border border-border px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium hover:underline">
                  View File
                </a>
                {doc.ocrText && (
                  <span className="text-xs text-green-600 bg-green-500/10 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <SearchIcon className="w-3 h-3" /> AI Indexed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass w-full max-w-md rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-secondary/50 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Upload to Vault
              </h2>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Document Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Passport, Drivers License"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Financial">Financial</option>
                  <option value="Education">Education</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. travel, id, 2026"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">File (Image or PDF)</label>
                <input 
                  type="file" 
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !file}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg flex justify-center items-center gap-2 mt-6 disabled:opacity-70 transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Upload'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVault;
