import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <p className="mb-6">
            Welcome to GPT-5 Prompts Directory. These Terms of Service ("Terms") govern your use of our website 
            and services. By accessing or using our website, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing, browsing, or using GPT-5 Prompts Directory ("Service"), you acknowledge that you have read, 
            understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these 
            Terms, you must not use our Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p className="mb-4">
            GPT-5 Prompts Directory is a platform that provides:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>A curated collection of AI prompts for various use cases</li>
            <li>Categorized and searchable prompt database</li>
            <li>Automated content aggregation from public sources</li>
            <li>Educational resources about AI prompt engineering</li>
            <li>Tools for discovering and sharing effective AI prompts</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Eligibility</h2>
          <p className="mb-4">
            To use our Service, you must:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Be at least 13 years old (or the age of digital consent in your jurisdiction)</li>
            <li>Have the legal capacity to enter into these Terms</li>
            <li>Not be prohibited from using our Service under applicable law</li>
            <li>Provide accurate and complete information when required</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Acceptable Use Policy</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Permitted Uses</h3>
          <p className="mb-4">You may use our Service to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Browse, search, and access prompts for personal or commercial use</li>
            <li>Share prompts in accordance with their respective licenses</li>
            <li>Provide feedback and suggestions for improvement</li>
            <li>Contribute original prompts to our community</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Prohibited Uses</h3>
          <p className="mb-4">You may not:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Use the Service for illegal, harmful, or unauthorized purposes</li>
            <li>Violate any local, state, national, or international law</li>
            <li>Infringe upon intellectual property rights of others</li>
            <li>Submit false, misleading, or fraudulent information</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated tools to scrape or download content excessively</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Impersonate any person or entity</li>
            <li>Distribute malware, viruses, or other harmful code</li>
            <li>Engage in harassment, abuse, or hateful conduct</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property Rights</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Our Content</h3>
          <p className="mb-4">
            The Service, including its design, functionality, text, graphics, logos, and software, is owned by 
            us or our licensors and is protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 User-Generated Content</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>You retain ownership of any original content you submit</li>
            <li>You grant us a license to use, display, and distribute your submissions</li>
            <li>You represent that you have the right to grant such licenses</li>
            <li>You are responsible for ensuring your content doesn't infringe others' rights</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.3 Third-Party Content</h3>
          <p className="mb-6">
            Prompts collected from public sources remain subject to their original terms 
            and licenses. We aggregate this content under fair use principles for educational and 
            informational purposes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Privacy and Data Protection</h2>
          <p className="mb-6">
            Your privacy is important to us. Our collection, use, and protection of your personal information 
            is governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Disclaimers</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 Service Availability</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We provide the Service on an "as is" and "as available" basis</li>
            <li>We do not guarantee continuous, uninterrupted access</li>
            <li>We may modify, suspend, or discontinue the Service at any time</li>
            <li>We are not responsible for third-party service interruptions</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 Content Accuracy</h3>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>We do not guarantee the accuracy, completeness, or usefulness of any content</li>
            <li>Prompts are provided for informational and educational purposes</li>
            <li>Users are responsible for verifying information before use</li>
            <li>We do not endorse any specific AI model or service</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <p className="text-yellow-800 mb-4">
              <strong>Important Legal Notice:</strong>
            </p>
            <p className="text-yellow-800">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
              DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING 
              FROM YOUR USE OF THE SERVICE.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Indemnification</h2>
          <p className="mb-6">
            You agree to indemnify, defend, and hold harmless GPT-5 Prompts Directory, its affiliates, officers, 
            agents, employees, and partners from and against any claims, liabilities, damages, losses, and expenses 
            arising out of or in any way connected with your use of the Service or violation of these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Termination</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10.1 Termination by You</h3>
          <p className="mb-4">
            You may stop using the Service at any time. You may also request deletion of your account 
            and associated data by contacting us.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10.2 Termination by Us</h3>
          <p className="mb-6">
            We may suspend or terminate your access to the Service immediately, without notice, for any 
            reason, including violation of these Terms or applicable law.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Dispute Resolution</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11.1 Informal Resolution</h3>
          <p className="mb-4">
            Before pursuing formal legal action, we encourage you to contact us to seek a resolution.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11.2 Governing Law</h3>
          <p className="mb-6">
            These Terms are governed by and construed in accordance with the laws of the jurisdiction 
            where our service is operated, without regard to conflict of law principles.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
          <p className="mb-6">
            We reserve the right to modify these Terms at any time. We will notify users of significant 
            changes by posting the updated Terms on our website and updating the "Last updated" date. 
            Your continued use of the Service after changes become effective constitutes acceptance of 
            the updated Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Severability</h2>
          <p className="mb-6">
            If any provision of these Terms is found to be unenforceable or invalid, that provision will 
            be limited or eliminated to the minimum extent necessary, and the remaining provisions will 
            remain in full force and effect.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Entire Agreement</h2>
          <p className="mb-6">
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
            GPT-5 Prompts Directory regarding the use of the Service and supersede all prior agreements and understandings.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">15. Contact Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> legal@ischatgptfree.com</li>
              <li><strong>Website:</strong> <a href="https://ischatgptfree.netlify.app" className="text-blue-600 underline">https://ischatgptfree.netlify.app</a></li>
              <li><strong>Response Time:</strong> We aim to respond within 48 hours</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <p className="text-blue-800">
              <strong>Acknowledgment:</strong> By using our Service, you acknowledge that you have read and 
              understood these Terms of Service and agree to be bound by them. If you do not agree to these 
              Terms, you must discontinue use of our Service immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;