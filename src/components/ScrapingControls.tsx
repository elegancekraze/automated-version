import React, { useState } from 'react';

interface ScrapingControlsProps {
  onScrapingComplete?: (newPrompts: number) => void;
}

const ScrapingControls: React.FC<ScrapingControlsProps> = ({ onScrapingComplete }) => {
  const [isScrapingReddit, setIsScrapingReddit] = useState(false);
  const [isFullScraping, setIsFullScraping] = useState(false);
  const [scrapingResults, setScrapingResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRedditScraping = async () => {
    setIsScrapingReddit(true);
    setError(null);
    setScrapingResults(null);

    try {
      const response = await fetch('http://localhost:3001/api/scrape/reddit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subreddit: 'ChatGPT',
          limit: 20
        })
      });

      const data = await response.json();

      if (data.success) {
        setScrapingResults(data.data);
        onScrapingComplete?.(data.data.newPrompts);
      } else {
        setError(data.error || 'Failed to scrape Reddit');
      }
    } catch (error) {
      setError('Network error occurred while scraping');
      console.error('Scraping error:', error);
    } finally {
      setIsScrapingReddit(false);
    }
  };

  const handleFullScraping = async () => {
    setIsFullScraping(true);
    setError(null);
    setScrapingResults(null);

    try {
      const response = await fetch('http://localhost:3001/api/scrape/full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setScrapingResults(data.data);
        onScrapingComplete?.(data.data.newPrompts);
      } else {
        setError(data.error || 'Failed to complete full scraping');
      }
    } catch (error) {
      setError('Network error occurred during full scraping');
      console.error('Full scraping error:', error);
    } finally {
      setIsFullScraping(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prompt Scraping</h2>
          <p className="text-gray-600 mt-1">Automatically collect new prompts from various sources</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Reddit API Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Reddit Scraping */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quick Reddit Scrape</h3>
              <p className="text-sm text-gray-600">Scrape latest prompts from r/ChatGPT</p>
            </div>
          </div>
          
          <button
            onClick={handleRedditScraping}
            disabled={isScrapingReddit || isFullScraping}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isScrapingReddit
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {isScrapingReddit ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Scraping...
              </div>
            ) : (
              'Start Quick Scrape'
            )}
          </button>
        </div>

        {/* Full Scraping */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Full Scrape</h3>
              <p className="text-sm text-gray-600">Comprehensive scraping across all subreddits</p>
            </div>
          </div>
          
          <button
            onClick={handleFullScraping}
            disabled={isScrapingReddit || isFullScraping}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isFullScraping
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFullScraping ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Full Scraping...
              </div>
            ) : (
              'Start Full Scrape'
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {scrapingResults && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ Scraping Completed!</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">New Prompts:</span>
              <span className="font-medium ml-2">{scrapingResults.newPrompts}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Prompts:</span>
              <span className="font-medium ml-2">{scrapingResults.totalPrompts}</span>
            </div>
          </div>
          {scrapingResults.message && (
            <p className="text-green-700 mt-2">{scrapingResults.message}</p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">❌ Scraping Failed</h4>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Scraping Information</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Quick scrape collects ~20 recent prompts from r/ChatGPT</li>
          <li>• Full scrape searches multiple subreddits and may take several minutes</li>
          <li>• All scraped prompts are automatically categorized and formatted</li>
          <li>• Duplicates are filtered out automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default ScrapingControls;
