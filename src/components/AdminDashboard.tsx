import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ADMIN_KEY = 'admin-secret-key-2025'; // In production, use environment variable

interface AdminStats {
  total_prompts: number;
  by_category: Record<string, number>;
  by_source: Record<string, number>;
  recent_additions: any[];
}

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/__internal__/admin/stats`, {
        headers: {
          'x-admin-key': ADMIN_KEY
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        setMessage('Failed to fetch admin stats');
      }
    } catch (error) {
      console.error('Admin stats error:', error);
      setMessage('Failed to connect to admin API');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeReddit = async (subreddit: string = 'ChatGPT', limit: number = 10) => {
    try {
      setScraping(true);
      setMessage('Scraping Reddit for new prompts...');
      
      const response = await fetch(`${API_BASE_URL}/api/__internal__/scrape/reddit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY
        },
        body: JSON.stringify({ subreddit, limit })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage(`✅ Scraped ${data.data.scraped} new prompts. Total: ${data.data.total}`);
          // Refresh stats
          fetchAdminStats();
        } else {
          setMessage(`❌ Scraping failed: ${data.error}`);
        }
      } else {
        setMessage('❌ Scraping request failed');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      setMessage('❌ Scraping error occurred');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Hidden admin controls - Not visible to public</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleScrapeReddit('ChatGPT', 10)}
                disabled={scraping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {scraping ? 'Scraping...' : 'Scrape r/ChatGPT'}
              </button>
              <button
                onClick={() => handleScrapeReddit('OpenAI', 5)}
                disabled={scraping}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {scraping ? 'Scraping...' : 'Scrape r/OpenAI'}
              </button>
              <button
                onClick={() => handleScrapeReddit('PromptEngineering', 5)}
                disabled={scraping}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {scraping ? 'Scraping...' : 'Scrape r/PromptEngineering'}
              </button>
              <button
                onClick={fetchAdminStats}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh Stats'}
              </button>
            </div>
            
            {message && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{message}</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Prompts */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Total Prompts</h4>
                <p className="text-3xl font-bold text-blue-600">{stats.total_prompts}</p>
              </div>

              {/* By Category */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">By Category</h4>
                <div className="space-y-2">
                  {Object.entries(stats.by_category).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-sm text-gray-600">{category}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Source */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">By Source</h4>
                <div className="space-y-2">
                  {Object.entries(stats.by_source).map(([source, count]) => (
                    <div key={source} className="flex justify-between">
                      <span className="text-sm text-gray-600">{source}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Additions */}
              <div className="bg-white border rounded-lg p-4 md:col-span-2 lg:col-span-3">
                <h4 className="font-semibold text-gray-900 mb-2">Recent Additions</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stats.recent_additions.length > 0 ? (
                    stats.recent_additions.map((prompt, index) => (
                      <div key={index} className="border-b border-gray-100 pb-2">
                        <p className="text-sm font-medium">{prompt.title}</p>
                        <p className="text-xs text-gray-500">
                          {prompt.category} • {prompt.source} • {new Date(prompt.created_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent additions</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Failed to load admin statistics</p>
            </div>
          )}

          {/* Admin Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">🔒 Secure Admin Access</h4>
            <p className="text-yellow-700 text-sm">
              This dashboard is only accessible via the secret admin URL: <code>/admin-secret-panel-2025-gpt5</code>
              <br />
              All admin API endpoints are secured with authentication headers and not discoverable through normal browsing.
              <br />
              <strong>Keep this URL private!</strong> Only you should know this access path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
