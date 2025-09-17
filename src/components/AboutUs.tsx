import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
          <h1 className="text-4xl font-bold mb-4">About GPT-5 Prompts Directory</h1>
          <p className="text-xl opacity-90">
            Empowering AI innovation through the world's most comprehensive collection of curated prompts
          </p>
        </div>

        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Mission Statement */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="text-lg text-blue-900 font-medium">
                  To democratize access to high-quality AI prompts and accelerate innovation by providing 
                  the most comprehensive, well-organized, and continuously updated collection of prompts 
                  for GPT-5 and other AI models.
                </p>
              </div>
              <p className="mb-4">
                In the rapidly evolving landscape of artificial intelligence, effective prompt engineering 
                has become the key to unlocking the full potential of AI models. Our platform bridges the 
                gap between AI capabilities and practical applications by providing users with expertly 
                crafted, tested, and categorized prompts.
              </p>
            </section>

            {/* What We Do */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Collection</h3>
                  <p className="text-gray-700">
                    We maintain a comprehensive database of over 100+ carefully selected prompts, 
                    organized by category, difficulty, and use case for easy discovery.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Automated Updates</h3>
                  <p className="text-gray-700">
                    Our intelligent system continuously scans AI communities, research papers, 
                    and expert forums to discover and add new high-quality prompts daily.
                  </p>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h3>
                  <p className="text-gray-700">
                    Every prompt undergoes our rigorous quality assessment process, ensuring 
                    effectiveness, clarity, and adherence to best practices.
                  </p>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Educational Resources</h3>
                  <p className="text-gray-700">
                    Beyond prompts, we provide context, usage examples, and best practices 
                    to help users understand and apply effective prompt engineering techniques.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Story */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="mb-4">
                  GPT-5 Prompts Directory was born from a simple observation: as AI models became more 
                  powerful, the art and science of prompt engineering became increasingly crucial, yet 
                  resources were scattered across countless forums, papers, and personal collections.
                </p>
                <p className="mb-4">
                  Founded in 2024 by a team of AI researchers and developers, we recognized the need 
                  for a centralized, organized, and continuously updated repository of high-quality 
                  prompts. What started as a personal collection has evolved into a comprehensive 
                  platform serving thousands of users worldwide.
                </p>
                <p>
                  Today, we're proud to be at the forefront of the prompt engineering revolution, 
                  helping individuals, businesses, and researchers harness the full potential of AI 
                  through better prompts.
                </p>
              </div>
            </section>

            {/* Our Approach */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Approach</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Community-Driven</h3>
                  <p className="text-gray-700">
                    We actively monitor leading AI communities including Reddit's r/ChatGPT, r/PromptEngineering, 
                    and r/ArtificialIntelligence to discover emerging techniques and innovative approaches.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Research-Based</h3>
                  <p className="text-gray-700">
                    Our collection incorporates findings from academic research, industry white papers, 
                    and experimental studies to ensure our prompts reflect the latest developments in AI.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Practically Tested</h3>
                  <p className="text-gray-700">
                    Every prompt in our database has been tested for effectiveness, clarity, and reliability 
                    across different AI models and use cases.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuously Evolving</h3>
                  <p className="text-gray-700">
                    Our automated systems ensure that our collection stays current with the rapidly 
                    evolving AI landscape, adding new prompts and updating existing ones regularly.
                  </p>
                </div>
              </div>
            </section>

            {/* Technology */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Technology</h2>
              <p className="mb-6">
                Behind GPT-5 Prompts Directory is a sophisticated technology stack designed for 
                reliability, scalability, and user experience:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Curation</h3>
                  <p className="text-gray-600 text-sm">
                    AI-powered content discovery and quality assessment algorithms
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Robust Database</h3>
                  <p className="text-gray-600 text-sm">
                    Structured data architecture with advanced search and filtering capabilities
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Performance</h3>
                  <p className="text-gray-600 text-sm">
                    Optimized for speed with CDN delivery and efficient caching strategies
                  </p>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🎯 Quality First</h3>
                  <p className="text-gray-700 mb-4">
                    We believe that quality trumps quantity. Every prompt in our collection meets 
                    our rigorous standards for effectiveness and clarity.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🌍 Open Access</h3>
                  <p className="text-gray-700 mb-4">
                    AI should be accessible to everyone. Our platform is free to use and designed 
                    to serve users regardless of their technical background.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🔬 Innovation</h3>
                  <p className="text-gray-700 mb-4">
                    We continuously experiment with new approaches to prompt engineering and 
                    integrate the latest research findings into our platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🤝 Community</h3>
                  <p className="text-gray-700 mb-4">
                    We're part of a larger AI community and believe in collaborative advancement 
                    of the field through shared knowledge and resources.
                  </p>
                </div>
              </div>
            </section>

            {/* Future Vision */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Looking Forward</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="mb-4">
                  As AI technology continues to evolve at a rapid pace, so does our vision for 
                  GPT-5 Prompts Directory. We're working on exciting new features including:
                </p>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Interactive prompt testing and optimization tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>AI-powered prompt generation assistance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Collaborative prompt development platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Advanced analytics and performance tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Multi-language support and localization</span>
                  </li>
                </ul>
                
                <p>
                  Our ultimate goal is to become the definitive resource for AI prompt engineering, 
                  fostering innovation and helping users achieve remarkable results with AI technology.
                </p>
              </div>
            </section>

            {/* Get Involved */}
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Involved</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="mb-4">
                  GPT-5 Prompts Directory thrives because of our community. Here's how you can contribute:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Share Prompts</h3>
                    <p className="text-sm text-gray-600">
                      Submit your best prompts to help others achieve better results
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Provide Feedback</h3>
                    <p className="text-sm text-gray-600">
                      Help us improve by sharing your experience and suggestions
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Spread the Word</h3>
                    <p className="text-sm text-gray-600">
                      Share our platform with others who could benefit from quality prompts
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;