import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <p className="mb-6">
            At GPT-5 Prompts Directory ("we," "our," or "us"), we are committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
            you visit our website and use our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.1 Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Contact information when you reach out to us</li>
            <li>Feedback and suggestions you submit</li>
            <li>Prompts you contribute to our directory</li>
            <li>Account information if you create an account</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.2 Information Automatically Collected</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Usage Data:</strong> Pages visited, time spent, navigation patterns</li>
            <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
            <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
            <li><strong>Cookies:</strong> Session data, preferences, analytics information</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Provide and improve our prompt directory services</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send important notices about service updates</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing and Disclosure</h2>
          
          <p className="mb-4">We do not sell, trade, or rent your personal information. We may share your information only in these circumstances:</p>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Service Providers</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Google Analytics:</strong> Website traffic analysis and user behavior insights</li>
            <li><strong>Google AdSense:</strong> Advertising services and revenue optimization</li>
            <li><strong>Netlify:</strong> Website hosting and content delivery</li>
            <li><strong>GitHub:</strong> Code repository and version control</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Legal Requirements</h3>
          <p className="mb-4">
            We may disclose your information if required by law, court order, or government request, 
            or to protect our rights, property, or safety.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Types of Cookies</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for website functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand user behavior</li>
            <li><strong>Advertising Cookies:</strong> Enable personalized advertisements</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Cookie Management</h3>
          <p className="mb-4">
            You can control cookies through your browser settings. However, disabling certain cookies 
            may affect website functionality and your user experience.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Third-Party Services</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Google AdSense</h3>
          <p className="mb-4">
            We use Google AdSense to display advertisements. Google may use cookies to serve ads based on 
            your prior visits to our website or other websites. You can opt out of personalized advertising 
            by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Reddit Integration</h3>
          <p className="mb-4">
            Our automated system collects publicly available prompts from Reddit using their API. 
            We respect Reddit's terms of service and only collect content that is publicly accessible.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Data Security</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>HTTPS encryption for all data transmission</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal information</li>
            <li>Secure hosting infrastructure</li>
            <li>Regular backup and recovery procedures</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
          <p className="mb-6">
            We retain your information only as long as necessary to provide our services, comply with 
            legal obligations, resolve disputes, and enforce our agreements. Analytics data is typically 
            retained for 26 months.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Your Rights and Choices</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.1 Access and Control</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Request access to your personal information</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Delete your personal information (subject to legal requirements)</li>
            <li>Object to processing for marketing purposes</li>
            <li>Request data portability where applicable</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.2 Marketing Communications</h3>
          <p className="mb-4">
            You can opt out of marketing communications at any time by contacting us directly. 
            We do not send unsolicited marketing emails.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
          <p className="mb-6">
            Our services are not directed to children under 13. We do not knowingly collect personal 
            information from children under 13. If you believe we have collected information from a 
            child under 13, please contact us immediately.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. International Data Transfers</h2>
          <p className="mb-6">
            Your information may be processed in countries other than your own. We ensure appropriate 
            safeguards are in place to protect your information in accordance with this Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy periodically. We will notify you of significant changes 
            by posting the new policy on our website and updating the "Last updated" date. Your continued 
            use of our services after changes become effective constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> privacy@ischatgptfree.com</li>
              <li><strong>Website:</strong> <a href="https://ischatgptfree.netlify.app" className="text-blue-600 underline">https://ischatgptfree.netlify.app</a></li>
              <li><strong>Response Time:</strong> We aim to respond within 48 hours</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Compliance</h2>
          <p className="mb-4">
            This Privacy Policy is designed to comply with applicable privacy laws including:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>General Data Protection Regulation (GDPR)</li>
            <li>California Consumer Privacy Act (CCPA)</li>
            <li>Children's Online Privacy Protection Act (COPPA)</li>
            <li>Other applicable local and international privacy laws</li>
          </ul>

          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <p className="text-blue-800">
              <strong>Note:</strong> This Privacy Policy is effective as of the date listed above and applies to all users 
              of our website and services. By using our website, you acknowledge that you have read and understood 
              this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;