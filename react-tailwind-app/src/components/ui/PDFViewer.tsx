import React, { useRef, useState } from 'react';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  src: string;
  highlightedPages?: number[];
}

const PDFViewer: React.FC<PDFViewerProps> = ({ src, highlightedPages = [] }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  //  Start from the most relevant page
  const [currentPage, setCurrentPage] = useState(highlightedPages.length > 0 ? highlightedPages[0] : 1);

  // Function to navigate to a specific page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (iframeRef.current) {
      iframeRef.current.src = `/pdfjs/web/viewer.html?file=${encodeURIComponent(src)}#page=${pageNumber}`;
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border animate-fade-in">
      <div className="bg-secondary p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium truncate max-w-[200px]">
            {src.split('/').pop() || 'Document'}
          </h3>
        </div>

        {highlightedPages.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Relevant pages:</span>
            <div className="flex space-x-1">
              {highlightedPages.map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-medium cursor-pointer"
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Iframe dynamically updates when a button is clicked */}
      <iframe
        ref={iframeRef}
        src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(src)}#page=${currentPage}`}
        className="w-full h-[500px]"
        title="PDF Document"
      />
    </div>
  );
};

export default PDFViewer;
