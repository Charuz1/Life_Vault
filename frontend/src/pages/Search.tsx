import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { Search as SearchIcon, Loader2, Sparkles, FileText, ExternalLink } from 'lucide-react';
import axios from 'axios';

const Search = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setResults(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Search Bar */}
      <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">AI Smart Search</h1>
          <p className="text-muted-foreground mb-8">
            Ask for anything. We search through your document titles, tags, and even the <span className="font-medium text-foreground">text inside your images</span>.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "passport", "insurance", or "university certificate"'
                className="w-full bg-background border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all text-lg shadow-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-primary text-primary-foreground px-8 rounded-2xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-70 flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground px-2">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </h2>
          
          {results.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-medium text-foreground">No matches found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search terms or keywords.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((doc: any) => (
                <div key={doc._id} className="glass-card rounded-2xl p-6 flex items-start gap-4 group">
                  <div className="bg-secondary p-4 rounded-xl">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-sm font-medium text-primary mt-1">{doc.category}</p>
                      </div>
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-primary bg-secondary/50 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                    
                    {doc.ocrText && (
                      <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border/50">
                        <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-primary" /> Extracted Text Context
                        </p>
                        <p className="text-sm text-foreground/80 line-clamp-2 italic">"{doc.ocrText}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
