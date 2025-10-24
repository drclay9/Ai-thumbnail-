import React, { useState, useEffect } from 'react';
import { generateThumbnail } from './services/geminiService';
import StyleSelector, { ThumbnailStyle } from './StyleSelector';
import './App.css';

// --- Helper function to resize image ---
const resizeImage = (base64Str: string, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      // Draw the image onto the canvas, scaling it to the desired dimensions
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
      // Get the data URL of the resized image
      resolve(canvas.toDataURL('image/jpeg', 0.95)); // 0.95 is a high quality setting
    };
    img.onerror = (error) => {
      reject(new Error('Image failed to load for resizing.'));
    };
  });
};

// --- Theme Toggle Component ---
interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
            <svg className="sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <svg className="moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </div>
      </div>
    </button>
  );
};
// --- End Theme Toggle Component ---

// --- Upgrade Popup Component ---
interface UpgradePopupProps {
  onClose: () => void;
}

const UpgradePopup: React.FC<UpgradePopupProps> = ({ onClose }) => {
  const handlePaypalClick = (amount: number) => {
    window.open(`https://www.paypal.me/mohamedbenrouan/${amount}`, "_blank");
  };
  
  return (
    <div className="popup-overlay" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="popup-content">
        <button className="close-popup-btn" onClick={onClose} aria-label="Close dialog">&times;</button>
        <h2 id="popup-title">You've reached your free limit! 🚀</h2>
        <p>Upgrade to unlock unlimited thumbnail generation.</p>
        <div className="popup-actions">
           <button className="popup-button lifetime-button" onClick={() => handlePaypalClick(59)}>
             🔥 Lifetime Access - $59
          </button>
          <button className="popup-button paypal-button" onClick={() => handlePaypalClick(5)}>
             Pay Once - $5
          </button>
        </div>
        <p className="paypal-email-info">Or send payment directly to: <b>mohamedbenrouan@gmail.com</b></p>
      </div>
    </div>
  );
};
// --- End Upgrade Popup Component ---

// --- Footer Component ---
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="App-footer">
      <p>
        &copy; {currentYear} AI YouTube Thumbnail Generator. Crafted with ❤️.
      </p>
      <div className="social-links">
        <a href="https://github.com/simorouan" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
        <a href="https://www.linkedin.com/in/mohamed-ben-rouan-027967204/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
      </div>
    </footer>
  );
};
// --- End Footer Component ---

// --- Loading State Component ---
const LoadingState: React.FC = () => {
  const loadingSteps = [
    'Analyzing video topic...',
    'Crafting bold, clickable text...',
    'Applying cinematic lighting...',
    'Boosting color contrast...',
    'Assembling the final design...',
  ];

  const [currentStep, setCurrentStep] = useState(loadingSteps[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingSteps.length;
      setCurrentStep(loadingSteps[index]);
    }, 1800); // Cycle every 1.8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container" aria-live="polite" aria-label="Generating thumbnail">
      <div className="loading-thumbnail-preview">
        <div className="shimmer-bg"></div>
        <div className="placeholder-text-group">
          <div className="placeholder-text-line one"></div>
          <div className="placeholder-text-line two"></div>
        </div>
      </div>
      <p key={currentStep} className="loading-status-text">
        {currentStep}
      </p>
    </div>
  );
};
// --- End Loading State Component ---

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ThumbnailStyle>('MrBeast');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [generationCount, setGenerationCount] = useState(0);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [isApiKeyError, setIsApiKeyError] = useState(false);
  const FREE_LIMIT = 3;

  // Effect to toggle 'dark-mode' class on body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // After selecting, clear the error to allow the user to try again.
      setError(null);
      setIsApiKeyError(false);
    }
  };

  const handlePaypalClick = (amount: number) => {
    window.open(`https://www.paypal.me/mohamedbenrouan/${amount}`, "_blank");
  };

  const handleGenerateClick = async () => {
    if (generationCount >= FREE_LIMIT) {
      setShowUpgradePopup(true);
      return;
    }

    if (!topic) {
      setError('Please enter a video topic.');
      return;
    }
    setError(null);
    setIsApiKeyError(false);
    setIsLoading(true);
    setThumbnailUrl(null);

    try {
      // Re-initialize the AI client just before the call to ensure the latest key is used.
      const originalUrl = await generateThumbnail(topic, selectedStyle);
      
      // Resize the generated image to the desired 1280x720 dimensions
      const resizedUrl = await resizeImage(originalUrl, 1280, 720);

      setThumbnailUrl(resizedUrl);
      setGenerationCount(prevCount => prevCount + 1);
    } catch (err) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        // Check for permission-related errors that indicate a bad key
        if (msg.includes('permission denied') || msg.includes('entity was not found') || msg.includes('api key not valid') || msg.includes('api_key environment variable not set')) {
            setError('API Key required. Please select a valid key with billing enabled.');
            setIsApiKeyError(true);
        } else {
            setError(err.message);
            setIsApiKeyError(false);
        }
      } else {
        setError('An unknown error occurred.');
        setIsApiKeyError(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!thumbnailUrl) return;
    const link = document.createElement('a');
    link.href = thumbnailUrl;
    link.download = `youtube-thumbnail-1280x720-${selectedStyle.toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSpeak = () => {
    if (!topic || !('speechSynthesis' in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(topic);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="App">
      <header className="App-header">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <h1>AI YouTube Thumbnail Generator</h1>
        <p>Generate high-quality, clickable YouTube thumbnails in the style of top creators.</p>
      </header>
      <main>
        <div className="generator-form">
          <div className="form-step">
            <label htmlFor="topic-input"><span>1</span>Video Topic</label>
            <div className="input-with-button">
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => {
                    setTopic(e.target.value)
                    setError(null);
                    setIsApiKeyError(false);
                }}
                placeholder="e.g., I Survived 7 Days in the Jungle"
              />
              <button
                className="speak-button"
                onClick={handleSpeak}
                disabled={!topic}
                aria-label="Read topic aloud"
                title="Read topic aloud"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </button>
            </div>
          </div>

          <div className="form-step">
             <label><span>2</span>Choose a Style</label>
            <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
          </div>

          <div className="form-step">
            <button
              className="generate-button"
              onClick={handleGenerateClick}
              disabled={isLoading || !topic || generationCount >= FREE_LIMIT}
              title={generationCount >= FREE_LIMIT ? `Free limit reached (${FREE_LIMIT}/${FREE_LIMIT})` : 'Generate Thumbnail'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/><path d="M12 3v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M12 17v4"/><path d="m22 7-3-3-3 3"/><path d="m2 17 3 3 3-3"/><path d="m7 2-3 3 3 3"/><path d="m17 22 3-3-3-3"/></svg>
                {isLoading ? 'Generating...' : generationCount >= FREE_LIMIT ? 'Free Limit Reached' : 'Generate Thumbnail'}
            </button>
            
            {generationCount >= FREE_LIMIT && !isLoading && (
              <button className="paypal-cta" onClick={() => handlePaypalClick(5)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.45,6.72a2.3,2.3,0,0,0-1.63,1,1.5,1.5,0,0,0-.43,1.08c0,.83.61,1.16,1.44,1.16h1.25a.86.86,0,0,1,.84.66l.3,1.68a.61.61,0,0,1-.59.72H9.27a.88.88,0,0,0-.86.65L7,19.26a.65.65,0,0,0,.64.74h2.51a.86.86,0,0,0,.84-.65l.38-2.12a.61.61,0,0,1,.6-.72h.68a2.15,2.15,0,0,0,2.1-1.56l.39-2.18a1.32,1.32,0,0,0-1.28-1.62H14.4a.86.86,0,0,1-.84-.66L13.25,7A.35.35,0,0,0,12.9,6.72Z"/>
                  <path d="M12.18,3,8.69,21.3a.65.65,0,0,0,.64.74h3.23a.35.35,0,0,0,.34-.26L14.09,16a.61.61,0,0,1,.6-.72h.56a3.52,3.52,0,0,0,3.44-2.58l.39-2.18a2.69,2.69,0,0,0-2.62-3.29H14.1a.34.34,0,0,0-.34.26L12.92,12a.61.61,0,0,1-.6.72H11.2a2.2,2.2,0,0,0-2.15,1.55L8.72,16a.87.87,0,0,1-.85.66H6.62a.86.86,0,0,0-.84.65L4.4,22.8a.34.34,0,0,0,.34.39h3.23a.65.65,0,0,0,.64-.74L12.18,3Z"/>
                </svg>
                Pay 5 USD via PayPal to Unlock More
              </button>
            )}

            <div className="generation-counter">
              <p>Free generations left: {Math.max(0, FREE_LIMIT - generationCount)}</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${(generationCount / FREE_LIMIT) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {error && (
            <div className="error-message">
                <span>{error}</span>
                {isApiKeyError && (
                    <button onClick={handleSelectKey} className="select-key-button">
                        Select API Key
                    </button>
                )}
            </div>
        )}

        <div className="thumbnail-container">
          {isLoading ? (
            <LoadingState />
          ) : thumbnailUrl ? (
            <div className="thumbnail-result">
              <img src={thumbnailUrl} alt={`Generated YouTube thumbnail in ${selectedStyle} style`} />
              <button onClick={handleDownloadClick} className="download-button">
                <div className="download-button-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>
                    <div className="download-button-text">
                        <span>Download Thumbnail</span>
                        <small>1280x720 JPEG</small>
                    </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="thumbnail-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <p>Your generated thumbnail will appear here</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {showUpgradePopup && <UpgradePopup onClose={() => setShowUpgradePopup(false)} />}
    </div>
  );
};

export default App;
