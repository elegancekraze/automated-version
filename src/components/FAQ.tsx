import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const faqData: FAQItem[] = [
    // Getting Started
    {
      id: '1',
      question: 'What is GPT-5 Prompts Directory?',
      answer: 'GPT-5 Prompts Directory is a comprehensive platform that curates, organizes, and provides access to high-quality AI prompts specifically designed for GPT-5 and other advanced language models. Our collection includes over 105+ carefully selected prompts across various categories including business, content creation, technical development, creative writing, and more.',
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'How do I use the prompts on this website?',
      answer: 'Using our prompts is simple: 1) Browse or search for prompts by category or keyword, 2) Click on any prompt to view details and usage instructions, 3) Copy the prompt text using our one-click copy feature, 4) Paste it into your preferred AI platform (ChatGPT, GPT-5, Claude, etc.), 5) Customize the prompt with your specific requirements if needed.',
      category: 'getting-started'
    },
    {
      id: '3',
      question: 'Is this website free to use?',
      answer: 'Yes! GPT-5 Prompts Directory is completely free to use. You can browse, search, and copy any prompt without creating an account or paying any fees. We believe AI resources should be accessible to everyone, and we support our platform through ethical advertising and community contributions.',
      category: 'getting-started'
    },
    {
      id: '4',
      question: 'Do I need to create an account?',
      answer: 'No account is required to browse and use our prompts. However, creating a free account (coming soon) will allow you to save favorite prompts, contribute your own prompts to the community, track your usage history, and receive personalized recommendations.',
      category: 'getting-started'
    },

    // Prompts and Quality
    {
      id: '5',
      question: 'How do you ensure prompt quality?',
      answer: 'We maintain high quality through multiple methods: 1) Automated screening using AI-powered quality assessment, 2) Community-sourced prompts from expert AI forums and communities, 3) Manual curation by our team of AI specialists, 4) Continuous testing across different AI models, 5) User feedback and rating system, 6) Regular updates based on the latest AI research.',
      category: 'prompts'
    },
    {
      id: '6',
      question: 'Where do the prompts come from?',
      answer: 'Our prompts are sourced from various high-quality channels: expert AI communities and forums, academic research papers, AI industry publications, user contributions, and our own original research. All sources are properly attributed and we respect intellectual property rights.',
      category: 'prompts'
    },
    {
      id: '7',
      question: 'How often are new prompts added?',
      answer: 'We add new prompts daily through our automated content discovery system. Our AI continuously monitors relevant communities and sources for fresh, high-quality prompts. Major updates with curated collections are released weekly, ensuring our database stays current with the latest AI developments.',
      category: 'prompts'
    },
    {
      id: '8',
      question: 'Can I suggest or submit my own prompts?',
      answer: 'Absolutely! We welcome community contributions. You can submit prompts through our contact form, specifying the category, use case, and any special instructions. Submitted prompts undergo our quality review process before being added to the public database. Contributors are credited for their submissions.',
      category: 'prompts'
    },

    // Technical
    {
      id: '9',
      question: 'Which AI models work with these prompts?',
      answer: 'Our prompts are designed to work with various advanced language models including GPT-5, GPT-4, ChatGPT, Claude (Anthropic), Gemini (Google), LLaMA, and other transformer-based models. While optimized for GPT-5, most prompts are model-agnostic and can be adapted for different AI platforms.',
      category: 'technical'
    },
    {
      id: '10',
      question: 'Why aren\'t some prompts working as expected?',
      answer: 'Several factors can affect prompt performance: 1) Different AI models may interpret prompts differently, 2) Model version or training differences, 3) Context length limitations, 4) Prompts may need customization for your specific use case, 5) Some prompts work better with certain parameter settings. Try adjusting the prompt wording or breaking complex prompts into smaller parts.',
      category: 'technical'
    },
    {
      id: '11',
      question: 'How do I modify prompts for my specific needs?',
      answer: 'Prompt customization is encouraged! Replace placeholder text with your specific requirements, adjust the tone or complexity level, add context relevant to your industry or use case, modify output format requirements, and experiment with different instruction styles. Our prompts are designed as starting points for your specific applications.',
      category: 'technical'
    },
    {
      id: '12',
      question: 'Can I use these prompts for commercial purposes?',
      answer: 'Yes, most prompts can be used for commercial purposes. However, please review our Terms of Service and check individual prompt licenses. Prompts sourced from third parties may have specific usage restrictions. We recommend reviewing the source attribution for any commercial applications.',
      category: 'technical'
    },

    // Categories and Organization
    {
      id: '13',
      question: 'How are prompts categorized?',
      answer: 'Prompts are organized into six main categories: Business & Productivity (strategy, analysis, planning), Content & Marketing (writing, social media, SEO), Development & Technical (coding, debugging, architecture), Creative & Design (writing, art direction, ideation), Analysis & Research (data analysis, academic research), and Official OpenAI (examples from OpenAI\'s documentation).',
      category: 'organization'
    },
    {
      id: '14',
      question: 'What do the difficulty levels mean?',
      answer: 'Difficulty levels help you choose appropriate prompts: Beginner (simple, straightforward prompts requiring minimal customization), Intermediate (moderate complexity, may need some adaptation), Advanced (complex prompts requiring understanding of prompt engineering principles), Expert (highly specialized prompts for specific use cases or advanced techniques).',
      category: 'organization'
    },
    {
      id: '15',
      question: 'How does the rating system work?',
      answer: 'Prompts are rated on a 5-star scale based on effectiveness, clarity, versatility, and user feedback. Ratings consider factors like: output quality consistency, ease of use, adaptability to different contexts, and community feedback. Higher-rated prompts typically produce more reliable and useful results.',
      category: 'organization'
    },

    // Privacy and Data
    {
      id: '16',
      question: 'Do you collect personal information?',
      answer: 'We collect minimal information necessary to provide our service. This includes anonymous usage analytics (pages visited, search queries, popular prompts), technical data (browser type, device info for optimization), and contact information only if you voluntarily provide it. We do not collect or store personal conversations or prompt outputs.',
      category: 'privacy'
    },
    {
      id: '17',
      question: 'How do you use cookies?',
      answer: 'We use cookies for: essential website functionality (search preferences, UI settings), analytics to improve user experience (Google Analytics), and advertising optimization (Google AdSense). You can control cookie preferences through your browser settings. Essential cookies are required for basic functionality.',
      category: 'privacy'
    },
    {
      id: '18',
      question: 'Is my usage data private?',
      answer: 'Yes, we respect your privacy. Usage data is anonymized and aggregated for analytics purposes only. We never share individual usage patterns or link them to personal identities. All data handling complies with GDPR, CCPA, and other applicable privacy regulations.',
      category: 'privacy'
    },

    // Troubleshooting
    {
      id: '19',
      question: 'The website is loading slowly. What can I do?',
      answer: 'Try these solutions: clear your browser cache and cookies, disable browser extensions temporarily, try a different browser or incognito/private mode, check your internet connection, or try accessing the site at a different time. If problems persist, please contact us with your browser and device details.',
      category: 'troubleshooting'
    },
    {
      id: '20',
      question: 'Search isn\'t returning expected results. Help!',
      answer: 'To improve search results: use specific keywords related to your use case, try different search terms or synonyms, browse categories manually if search isn\'t helpful, use filters to narrow down results, or check spelling and try broader terms. Our search covers titles, descriptions, and tags.',
      category: 'troubleshooting'
    },
    {
      id: '21',
      question: 'I found an error or inappropriate content. How do I report it?',
      answer: 'Please report any issues immediately through our contact form or email. Include: the specific prompt or page URL, description of the problem, screenshots if applicable, and your contact information. We review all reports within 24 hours and take appropriate action.',
      category: 'troubleshooting'
    },

    // Advanced Usage
    {
      id: '22',
      question: 'Can I integrate these prompts into my application?',
      answer: 'While we don\'t currently offer a public API, you can manually integrate prompts into your applications. Please respect our Terms of Service and rate limits. For enterprise integrations or bulk access, contact us to discuss partnership opportunities and proper attribution requirements.',
      category: 'advanced'
    },
    {
      id: '23',
      question: 'How do I create effective prompts myself?',
      answer: 'Effective prompt engineering involves: being specific and clear about desired outputs, providing relevant context and examples, using structured formats (step-by-step, bullet points), specifying constraints and requirements, testing and iterating based on results, and studying successful prompts in our database for patterns and techniques.',
      category: 'advanced'
    },
    {
      id: '24',
      question: 'What\'s the future roadmap for this platform?',
      answer: 'Upcoming features include: user accounts with favorites and collections, prompt testing and comparison tools, AI-powered prompt optimization suggestions, community rating and review system, mobile app, API access for developers, and advanced search with semantic matching. Follow our updates for announcements.',
      category: 'advanced'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'getting-started', name: 'Getting Started', count: faqData.filter(item => item.category === 'getting-started').length },
    { id: 'prompts', name: 'Prompts & Quality', count: faqData.filter(item => item.category === 'prompts').length },
    { id: 'technical', name: 'Technical', count: faqData.filter(item => item.category === 'technical').length },
    { id: 'organization', name: 'Organization', count: faqData.filter(item => item.category === 'organization').length },
    { id: 'privacy', name: 'Privacy & Data', count: faqData.filter(item => item.category === 'privacy').length },
    { id: 'troubleshooting', name: 'Troubleshooting', count: faqData.filter(item => item.category === 'troubleshooting').length },
    { id: 'advanced', name: 'Advanced Usage', count: faqData.filter(item => item.category === 'advanced').length }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90 mb-6">
            Find answers to common questions about GPT-5 Prompts Directory
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQ..."
              className="w-full px-4 py-3 pr-10 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="p-8">
          {/* Category Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap -mb-px">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`mr-2 mb-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                      activeCategory === category.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {category.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQ.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No questions found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              filteredFAQ.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {item.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          openItems.includes(item.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Didn't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help! Get in touch with any questions, feedback, or suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@ischatgptfree.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Support
                </a>
                <button className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2V4a2 2 0 012-2h4a2 2 0 012 2v4z" />
                  </svg>
                  Contact Form
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-500">
                  <strong>Response Time:</strong> We typically respond within 24-48 hours during business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;