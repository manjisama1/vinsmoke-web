import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Star } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const FAQSearch = ({ className = "" }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { faqs } = useData();

  // Search FAQs
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const searchResults = faqs
      .filter(faq => 
        faq.question.toLowerCase().includes(lowercaseQuery) ||
        faq.answer.toLowerCase().includes(lowercaseQuery) ||
        faq.category.toLowerCase().includes(lowercaseQuery) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .slice(0, 5); // Limit to 5 results

    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
  }, [query, faqs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (faq) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/faq?search=${encodeURIComponent(faq.question)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/faq?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 border-border shadow-lg">
          <CardContent className="p-2">
            <div className="space-y-1">
              {results.map((faq) => (
                <div
                  key={faq.id}
                  onClick={() => handleResultClick(faq)}
                  className="p-3 rounded-md hover:bg-muted cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                        {faq.isHardcoded && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <Star className="w-3 h-3 mr-1" />
                            Core
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {faq.question}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {faq.answer.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {results.length === 5 && (
              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/faq?search=${encodeURIComponent(query)}`);
                  }}
                  className="w-full text-center text-sm text-primary hover:text-primary-hover py-2"
                >
                  View all results for "{query}"
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FAQSearch;