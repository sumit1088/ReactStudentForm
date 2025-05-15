import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Upload } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from './DashboardLayout';
import FileUploader from '../components/ui/FileUploader';
import { uploadFiles } from '../utils/api';

const UploadPage = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (pdfFiles.length === 0) {
      toast.error('Please upload at least one PDF file');
      return;
    }

    setIsUploading(true);

    try {
      const success = await uploadFiles(pdfFiles);
      if (success) {
        toast.success('All files uploaded successfully');
        setTimeout(() => navigate('/query'), 1500);
      } else {
        toast.error('Failed to upload files');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="page-title">Upload Your PDFs</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Upload one or more PDF documents to begin processing and asking questions based on their content.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-8">
            <div className="flex justify-center">
              <FileUploader
                accept=".pdf"
                id="pdf-upload"
                label="PDF Documents"
                multiple
                onChange={setPdfFiles}
                value={pdfFiles}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={pdfFiles.length === 0 || isUploading}
                className={`
                  button-primary min-w-[200px] flex items-center justify-center
                  ${pdfFiles.length === 0 || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload & Process
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-6 text-center">What Happens Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-sm text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

const steps = [
  {
    title: 'Document Analysis',
    description: 'We extract text from your PDFs and process the data.',
    icon: Upload,
  },
  {
    title: 'Semantic Indexing',
    description: 'AI creates embeddings to understand your content.',
    icon: Upload,
  },
  {
    title: 'Ready to Query',
    description: 'Once processed, you can ask questions from your PDFs.',
    icon: Check,
  },
];

export default UploadPage;
