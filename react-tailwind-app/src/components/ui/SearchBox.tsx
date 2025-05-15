
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  buttonText?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
  onSearch, 
  placeholder = "Ask a question about your document...", 
  initialValue = "",
  buttonText = "Search"
}) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative w-full">
        <div className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-10 pr-4 py-4 text-lg rounded-l-xl rounded-r-none"
              placeholder={placeholder}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-4 text-lg font-medium rounded-r-xl hover:bg-primary/90 transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBox;
