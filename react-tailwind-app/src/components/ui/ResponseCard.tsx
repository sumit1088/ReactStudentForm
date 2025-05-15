
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ResponseCardProps {
  response: string;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ response }) => {
  return (
    <div className="w-full rounded-xl glassmorphism p-6 animate-fade-in-up">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">AI Response</h3>
          <div 
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: response }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
