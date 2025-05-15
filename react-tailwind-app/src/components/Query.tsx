import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Search, ChevronDown, X, ExternalLink, Save, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import DashboardLayout from './DashboardLayout';

interface PagewiseResult {
  result_title: string;
  result_page: number;
  result: string;
}

interface DocumentResult {
  title: string;
  date: string;
  pdf_name: string;
  top_pages: number[];
  pagewise_results: PagewiseResult[];
}

interface SearchResponse {
  response: DocumentResult[];
}

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("Making LLMs Work for Enterprise?");
  const [activeTab, setActiveTab] = useState("Summary");
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isDocumentCollapsed, setIsDocumentCollapsed] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showMySearches, setShowMySearches] = useState(false);
  const [sliderValue, setSliderValue] = useState(2);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [excelError, setExcelError] = useState<string | null>(null);

  const savedSearches = [
    "Making LLMs Work for Enterprise?",
    "What are the market estimates for the global mobile analytics market?",
    "What is the projected CAGR for the mobile analytics industry?",
    "What is the market size forecast for 2025?",
    "Which regions are leading in mobile analytics adoption?",
    "Can you give me insights on the end-user segments for mobile analytics?",
    "What are the key application areas for mobile analytics in this report?",
    "How is the mobile analytics market segmented by deployment?",
    "How is the mobile analytics market expected to grow between 2023 and 2030?",
    "What are the historical trends in mobile analytics market size?",
    "Who are the major players in the global mobile analytics market?",
    "Are there any company profiles or competitor analysis included?",
    "What is the market forecast for North America in mobile analytics?",
    "How does the Asia Pacific mobile analytics market compare to other regions?",
    "Can you summarize the table on market share by region?",
    "List the top 5 companies by revenue in the mobile analytics market."
  ];

  const mySearchesRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<{ message: string, show: boolean }>({
    message: "",
    show: false
  });
  const [showHelp, setShowHelp] = useState(false);

  const scrollToPDFPage = (page: number) => {
    setPdfPage(page);
  };

  const isExcelFile = (fileName: string) => {
    return fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
  };
  const getFileUrl = (fileName: string) => {
    return `/api/pdf/${fileName}`;
  };
  

  useEffect(() => {
    fetch('/api/uploads')
      .then((res) => res.json())
      .then((data) => {
        console.log("Uploaded files:", data.files);
        // Example: setFileList(data.files) in state
      });
  }, []);
  

  const loadExcelData = async (fileName: string) => {
    setExcelData(null);
    setExcelError(null);
    try {
      const response = await fetch(getFileUrl(fileName));
      if (!response.ok) {
        throw new Error('Failed to fetch Excel file');
      }
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(jsonData as any[][]);
    } catch (error) {
      console.error('Error loading Excel file:', error);
      setExcelError('Failed to load Excel preview. Please try downloading the file.');
    }
  };

  const fetchSearchResults = async (query: string) => {
    setIsLoading(true);
    try {
      console.log("Sending request with:", { query, Relevance: sliderValue });
      const response = await fetch("http://127.0.0.1:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, Relevance: sliderValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data: SearchResponse = await response.json();
      console.log("API Response:", data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

    const handleDocumentSelect = (index: number) => {
      if (selectedDocument === index && isDocumentCollapsed) {
        setIsDocumentCollapsed(false);
      } else {
        setSelectedDocument(index);
        setIsDocumentCollapsed(true);
        if (searchResults && isExcelFile(searchResults.response[index].pdf_name)) {
          loadExcelData(searchResults.response[index].pdf_name);
        } else {
          setExcelData(null);
          setExcelError(null);
        }
      }
    };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      fetchSearchResults(searchQuery);
      setIsDocumentCollapsed(false);
      setSelectedDocument(null);
      setExcelData(null);
      setExcelError(null);
    }
  };

  const addToRecentSearches = (query: string) => {
    setRecentSearches(prevSearches => {
      const filteredSearches = prevSearches.filter(search => search !== query);
      return [query, ...filteredSearches].slice(0, 3);
    });
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    fetchSearchResults(query);
    setShowRecentSearches(false);
    setIsDocumentCollapsed(false);
    setSelectedDocument(null);
    setExcelData(null);
    setExcelError(null);
  };

  const handleSavedSearchClick = (query: string) => {
    setSearchQuery(query);
    if (searchInputRef.current) {
      searchInputRef.current.value = query;
    }
    fetchSearchResults(query);
    setShowMySearches(false);
    setIsDocumentCollapsed(false);
    setSelectedDocument(null);
    setExcelData(null);
    setExcelError(null);
  };

  const handleInputFocus = () => {
    if (searchQuery === '') {
      setShowRecentSearches(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowRecentSearches(value === '');
  };

  const showNotification = (message: string) => {
    setNotification({
      message,
      show: true
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSave = () => {
    showNotification("Search Saved");
  };

  const handleShare = () => {
    const currentUrl = window.location.href.split('?')[0];
    const shareableUrl = `${currentUrl}?query=${encodeURIComponent(searchQuery)}`;

    navigator.clipboard.writeText(shareableUrl)
      .then(() => {
        showNotification("Link copied to clipboard");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showNotification("Failed to copy link");
      });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    console.log("Slider value changed to:", value);
  };

  const toggleMySearches = () => {
    setShowMySearches(!showMySearches);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowRecentSearches(false);
      }
      if (mySearchesRef.current && !mySearchesRef.current.contains(event.target as Node)) {
        setShowMySearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchSearchResults(searchQuery);
    setRecentSearches([searchQuery]);
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query');
    if (queryParam) {
      setSearchQuery(queryParam);
      fetchSearchResults(queryParam);
    }
  }, []);

  return (
    <DashboardLayout>
    <div className="flex flex-col bg-white font-sans min-h-screen">
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes slideInLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          @keyframes slideDown {
            0% { transform: translateY(-100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes scaleUp {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes rotateIn {
            0% { transform: rotate(-90deg); opacity: 0; }
            100% { transform: rotate(0); opacity: 1; }
          }
          @keyframes collapseLeft {
            0% { width: 25%; }
            100% { width: 10%; }
          }
          @keyframes expandLeft {
            0% { width: 10%; }
            100% { width: 25%; }
          }
          @keyframes expandSection {
            0% { width: 33.33%; }
            100% { width: 30%; }
          }
          @keyframes collapseSection {
            0% { width: 30%; }
            100% { width: 33.33%; }
          }
          @keyframes expandPDF {
            0% { width: 41.66%; }
            100% { width: 70%; }
          }
          @keyframes collapsePDF {
            0% { width: 70%; }
            100% { width: 41.66%; }
          }
          @keyframes searchesMorph {
            0% {
              border-radius: 8px 8px 8px 8px / 8px 8px 8px 8px;
              transform: scale(1);
            }
            25% {
              border-radius: 12px 6px 10px 8px / 8px 10px 6px 12px;
              transform: scale(1.02) translateY(-1px);
            }
            50% {
              border-radius: 10px 10px 6px 12px / 6px 12px 10px 10px;
              transform: scale(1.04) translateY(-2px);
            }
            75% {
              border-radius: 6px 12px 10px 8px / 10px 8px 12px 6px;
              transform: scale(1.02) translateY(-1px);
            }
            100% {
              border-radius: 8px 8px 8px 8px / 8px 8px 8px 8px;
              transform: scale(1);
            }
          }
          @keyframes searchesGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes chevronBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
          }
          @keyframes chevronGlow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.2)); }
            50% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6)); }
          }
          .my-searches-button {
            position: relative;
            background: linear-gradient(90deg, 
              rgba(59, 130, 246, 1), 
              rgba(16, 185, 129, 1), 
              rgba(99, 102, 241, 1), 
              rgba(59, 130, 246, 1));
            background-size: 300% 300%;
            color: white;
            font-weight: 500;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
            animation: searchesGradient 6s ease infinite;
          }
          .my-searches-button:hover {
            animation: searchesMorph 4s infinite alternate, searchesGradient 6s infinite linear;
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.5);
          }
          .my-searches-button::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: 0.5s;
          }
          .my-searches-button:hover::before {
            left: 100%;
            transition: 0.5s;
          }
          .chevron-icon {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .chevron-animate {
            color: white;
            transition: transform 0.3s ease;
          }
          .my-searches-button:hover .chevron-animate {
            animation: chevronBounce 1.5s infinite ease-in-out, chevronGlow 1.5s infinite ease-in-out;
          }
          @keyframes geminiMorph {
            0% {
              border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
              transform: scale(1);
              filter: hue-rotate(0deg);
            }
            25% {
              border-radius: 60% 40% 50% 50% / 40% 50% 60% 40%;
              transform: scale(1.05) rotate(5deg);
              filter: hue-rotate(90deg);
            }
            50% {
              border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%;
              transform: scale(1.1);
              filter: hue-rotate(180deg);
            }
            75% {
              border-radius: 50% 50% 40% 60% / 60% 40% 50% 50%;
              transform: scale(1.05) rotate(-5deg);
              filter: hue-rotate(270deg);
            }
            100% {
              border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
              transform: scale(1);
              filter: hue-rotate(360deg);
            }
          }
          @keyframes geminiGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .gemini-button {
            position: relative;
            background: linear-gradient(90deg, 
              rgba(232, 74, 187, 1), 
              rgba(103, 87, 254, 1), 
              rgba(51, 187, 255, 1), 
              rgba(0, 216, 180, 1), 
              rgba(232, 74, 187, 1));
            background-size: 500% 500%;
            animation: geminiGradient 8s ease infinite;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(103, 87, 254, 0.3);
          }
          .gemini-button:hover {
            animation: geminiMorph 6s infinite alternate, geminiGradient 8s infinite linear;
            box-shadow: 0 5px 15px rgba(103, 87, 254, 0.6);
          }
          .gemini-button::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: 0.5s;
          }
          .gemini-button:hover::before {
            left: 100%;
            transition: 0.5s;
          }
          .gemini-button span {
            color: white;
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            z-index: 2;
            position: relative;
          }
          @keyframes pulseGlow {
            0% {
              transform: scale(1);
              box-shadow: 0 0 5px rgba(234, 179, 8, 0.5);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 0 15px rgba(234, 179, 8, 0.8);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 5px rgba(234, 179, 8, 0.5);
            }
          }
          @keyframes rotateHue {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
          .help-button {
            position: relative;
            background: linear-gradient(135deg, 
              rgba(234, 179, 8, 1), 
              rgba(239, 68, 68, 1), 
              rgba(234, 179, 8, 1));
            background-size: 200% 200%;
            animation: rotateHue 10s linear infinite;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(234, 179, 8, 0.3);
          }
          .help-button:hover {
            animation: pulseGlow 1.5s infinite ease-in-out, rotateHue 10s linear infinite;
            box-shadow: 0 5px 15px rgba(234, 179, 8, 0.6);
          }
          .help-button::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 50%);
            transition: transform 0.5s ease;
            transform: scale(0);
          }
          .help-button:hover::before {
            transform: scale(1);
            transition: transform 0.5s ease;
          }
          .help-button span {
            color: white;
            font-weight: 500;
            font-style: italic;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            z-index: 2;
            position: relative;
          }
          .custom-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            background: linear-gradient(to right, #2563eb ${(sliderValue / 4) * 100}%, #d1d5db ${(sliderValue / 4) * 100}%);
            border-radius: 5px;
            outline: none;
            transition: background 0.3s ease;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            background: #2563eb;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .custom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          .custom-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: #2563eb;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .custom-slider::-moz-range-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          .excel-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          .excel-table th, .excel-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .excel-table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .excel-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        `}
      </style>

      {notification.show && (
        <div
          className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-[fadeIn_0.3s_ease-out]"
        >
          {notification.message}
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed top-0 right-0 w-96 h-full bg-white rounded-l-lg shadow-lg p-6 animate-[slideInRight_0.3s_ease-out] overflow-y-auto"
            style={{ animation: showHelp ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-out' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Help Guide</h3>
              <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm"><strong>1. Search:</strong> Type your query and press Enter to search across all documents.</p>
              <p className="text-sm"><strong>2. Recent Searches:</strong> Click on the search box when empty to see your recent searches.</p>
              <p className="text-sm"><strong>3. Document Navigation:</strong> Click on document titles in the left panel to switch between documents.</p>
              <p className="text-sm"><strong>4. Save & Share:</strong> Use the buttons in the top right to save your search or share it with others.</p>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-gray-200 py-3 animate-[slideDown_0.5s_ease-out]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between w-full">
            {/* <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/logo.png"
                alt="Concise Logo"
                className="h-20 w-auto object-contain rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </Link> */}

            <form onSubmit={handleSearch} className="flex items-center flex-grow max-w-2xl mx-4 space-x-4">
              <div className="relative flex items-center flex-grow">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  placeholder="Search documents..."
                />
                <button
                  type="submit"
                  className="gemini-button absolute right-8 w-8 h-8 rounded-md flex items-center justify-center"
                >
                  <Search size={20} className="text-white" />
                </button>

                {showRecentSearches && recentSearches.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 animate-[bounceIn_0.4s_ease-out]">
                    <div className="p-2 border-b border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500">Recent Searches</h3>
                    </div>
                    <ul>
                      {recentSearches.map((search, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition-colors duration-200"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          <div className="flex items-center">
                            <Search size={14} className="text-gray-400 mr-2 transition-transform duration-300 hover:rotate-90" />
                            {search}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="custom-slider h-2 w-32 rounded-full cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-full shadow-sm">{sliderValue}</span>
              </div>
            </form>

            <div className="flex items-center space-x-2">
              <button
                className="bg-blue-500 text-white p-2 rounded-md transition-all duration-300 hover:bg-blue-600 hover:-translate-y-1"
                onClick={handleSave}
                title="Save"
              >
                <Save size={16} />
              </button>
              <button
                className="bg-gray-200 text-gray-700 p-2 rounded-md transition-all duration-300 hover:bg-gray-300 hover:-translate-y-1"
                onClick={handleShare}
                title="Share"
              >
                <Share2 size={16} />
              </button>

              <div className="relative" ref={mySearchesRef}>
                <button
                  className="my-searches-button px-6 py-2 rounded-md text-sm flex items-center justify-center"
                  onClick={toggleMySearches}
                >
                  <span className="mr-2">My Searches</span>
                  <div className="chevron-icon">
                    <ChevronDown size={16} className="chevron-animate" />
                  </div>
                </button>

                {showMySearches && (
                  <div className="absolute top-full right-0 mt-1 w-96 bg-white border border-gray-300 rounded-md shadow-lg z-10 animate-[slideDown_0.4s_ease-out]">
                    <div className="p-2 border-b border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500">Saved Searches</h3>
                    </div>
                    <ul className="max-h-96 overflow-y-auto">
                      {savedSearches.map((search, index) => (
                        <li
                          key={index}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 border-b border-gray-100 transition-colors duration-200"
                          onClick={() => handleSavedSearchClick(search)}
                        >
                          <div className="flex items-center">
                            <Search size={14} className="text-gray-400 mr-2 transition-transform duration-300 hover:rotate-90" />
                            <span className="line-clamp-2">{search}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                className="help-button w-8 h-8 rounded-md flex items-center justify-center"
                onClick={() => setShowHelp(true)}
              >
                <span className="text-lg">i</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 animate-[bounceIn_0.5s_ease-out]">
            <div className="text-gray-500">Loading results...</div>
          </div>
        ) : searchResults ? (
          <div className="flex transition-all duration-500">
            <div
              className={`pr-3 transition-all duration-500 ${isDocumentCollapsed ? 'w-[10%] animate-[collapseLeft_0.5s_ease-out]' : 'w-1/4 animate-[expandLeft_0.5s_ease-out]'}`}
            >
              <div className="border border-gray-200 rounded-md overflow-hidden transition-all duration-300 hover:shadow-xl h-full">
                <div className="flex justify-between items-center p-3 border-b border-gray-200">
                  <h3 className="font-medium transition-colors duration-300 hover:text-blue-600 truncate">Documents</h3>
                  <button className="text-gray-400 transition-transform duration-300 hover:rotate-90">
                    <ExternalLink size={16} />
                  </button>
                </div>
                <div className="bg-gray-100 px-3 py-1 text-xs text-green-600 truncate">
                  ALL RESPONSES FROM DIFFERENT FILES
                </div>
                {searchResults.response.map((doc, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b border-gray-200 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:scale-[1.01] ${selectedDocument === index ? 'bg-blue-50' : ''}`}
                    onClick={() => handleDocumentSelect(index)}
                  >
                    <h4 className={`font-medium mb-1 transition-colors duration-300 hover:text-blue-600 ${isDocumentCollapsed ? 'truncate w-16' : ''}`}>
                      {doc.title}
                      {index === 0 && <span className="inline-block ml-2 w-3 h-3 bg-green-500 rounded-full animate-[bounceIn_0.5s_ease-out]"></span>}
                      {index === 1 && <span className="inline-block ml-2 w-3 h-3 bg-green-500 rounded-full animate-[bounceIn_0.5s_ease-out]"></span>}
                      {index === 2 && <span className="inline-block ml-2 w-3 h-3 bg-red-500 rounded-full animate-[bounceIn_0.5s_ease-out]"></span>}
                    </h4>
                    {!isDocumentCollapsed && (
                      <>
                        <div className="text-xs text-gray-500 mb-1">
                          {index === 0 && "Sustainability, DevOOPS 2021"}
                          {index === 1 && "McKinsey 2024"}
                          {index === 2 && "New Outsourcing Report | Gartner"}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {index === 0 ? "253 MB" : index === 1 ? "203 MB" : "703 MB"}
                          </span>
                          <span>{doc.date}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedDocument !== null && (
              <div
                className={`px-2 transition-all duration-500 ${isDocumentCollapsed ? 'w-[30%] animate-[expandSection_0.5s_ease-out]' : 'w-1/3 animate-[collapseSection_0.5s_ease-out]'}`}
              >
                <div className="border border-gray-200 rounded-md overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`px-6 py-2 text-sm transition-all duration-300 hover:scale-105 ${activeTab === 'Summary' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('Summary')}
                    >
                      Summary
                    </button>
                    <button
                      className={`px-6 py-2 text-sm transition-all duration-300 hover:scale-105 ${activeTab === 'Tables' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('Tables')}
                    >
                      Tables
                    </button>
                  </div>
                  <div className="p-4">
                    {searchResults.response[selectedDocument].pagewise_results.map((result, idx) => (
                      <div
                        key={idx}
                        className={`cursor-pointer border-b pb-4 transition-all duration-300 hover:bg-gray-50 hover:-translate-y-1 ${idx > 0 ? "mt-6 pt-4" : ""}`}
                        onClick={() => {
                          setExpandedIndex(expandedIndex === idx ? null : idx);
                          if (!isExcelFile(searchResults.response[selectedDocument].pdf_name)) {
                            scrollToPDFPage(result.result_page);
                          }
                        }}
                      >
                        <h3 className={`font-medium mb-1 text-blue-600 underline transition-colors duration-300 hover:text-blue-800 ${isDocumentCollapsed ? 'text-lg' : ''}`}>
                          {result.result_title}
                        </h3>
                        <div className={`text-gray-500 mb-1 ${isDocumentCollapsed ? 'text-base' : 'text-xs'}`}>
                          {isExcelFile(searchResults.response[selectedDocument].pdf_name) ? 'Sheet' : 'Page No'} {result.result_page}
                        </div>
                        <div className={`text-gray-700 transition-all duration-300 ${isDocumentCollapsed ? 'text-lg' : 'text-sm'}`}>
                          {expandedIndex === idx ? result.result : `${result.result.substring(0, 100)}...`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedDocument !== null && (
              <div
                className={`pl-2 transition-all duration-500 ${isDocumentCollapsed ? 'w-[70%] animate-[expandPDF_0.5s_ease-out]' : 'w-5/12 animate-[collapsePDF_0.5s_ease-out]'}`}
              >
                <div className="border border-gray-200 rounded-md overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
                  <div className="flex justify-between items-center p-3 border-b border-gray-200">
                    <h3 className={`font-medium transition-colors duration-300 hover:text-blue-600 ${isDocumentCollapsed ? 'text-lg' : ''}`}>
                      {searchResults.response[selectedDocument].title}
                    </h3>
                    <button className="text-gray-500 transition-transform duration-300 hover:rotate-90">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-6 h-full">
                    {isExcelFile(searchResults.response[selectedDocument].pdf_name) ? (
                      <div className="w-full h-full flex flex-col">
                        <div className={`w-full border rounded overflow-auto ${isDocumentCollapsed ? 'h-[600px]' : 'h-[500px]'}`}>
                          {excelError ? (
                            <div className="flex items-center justify-center h-full text-red-600">
                              {excelError}
                            </div>
                          ) : excelData ? (
                            <table className="excel-table">
                              <tbody>
                                {excelData.map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                      <td key={cellIndex}>{cell || ''}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              Loading Excel preview...
                            </div>
                          )}
                        </div>
                        <a
                          href={getFileUrl(searchResults.response[selectedDocument].pdf_name)}
                          download
                          className="mt-4 text-blue-600 hover:underline self-center"
                        >
                          Download Excel File
                        </a>
                      </div>
                    ) : (
                      <iframe
                        key={pdfPage}
                        src={`${getFileUrl(searchResults.response[selectedDocument].pdf_name)}#page=${pdfPage}`}
                        title="PDF Viewer"
                        className={`w-full border rounded ${isDocumentCollapsed ? 'h-[600px]' : 'h-[500px]'}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 animate-[rotateIn_0.5s_ease-out]">
            <div className="text-gray-500">No results found. Try a different search query.</div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
} 