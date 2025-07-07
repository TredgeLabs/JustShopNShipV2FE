import React from 'react';
import { Shield, Eye, Lock, Users, FileText, AlertCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2 text-blue-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                JustShopAndShip ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our international shipping and package forwarding services, including our website, mobile application, and related services (collectively, the "Service").
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-green-600" />
                Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-4">We may collect the following personal information:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Name, email address, phone number, and mailing address</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Government-issued identification for customs and verification purposes</li>
                <li>Shipping preferences and delivery instructions</li>
                <li>Communication history and customer service interactions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Package Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Package contents, descriptions, and values</li>
                <li>Sender and recipient information</li>
                <li>Tracking and delivery information</li>
                <li>Photos of packages for verification and insurance purposes</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>IP address, browser type, and device information</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (with your consent)</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-purple-600" />
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Providing and managing our shipping and forwarding services</li>
                <li>Processing payments and managing your account</li>
                <li>Communicating with you about your shipments and account</li>
                <li>Complying with customs, legal, and regulatory requirements</li>
                <li>Improving our services and customer experience</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Marketing and promotional communications (with your consent)</li>
                <li>Analytics and business intelligence</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We work with third-party service providers including shipping carriers, payment processors, customs brokers, and technology providers who need access to your information to provide services on our behalf.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information when required by law, court order, or government regulation, including customs and tax authorities.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Transfers</h3>
              <p className="text-gray-700 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2 text-red-600" />
                Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and employee training</li>
                <li>Secure data centers and infrastructure</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
              <p className="text-gray-700">
                For more detailed information about our use of cookies, please refer to our Cookie Policy.
              </p>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-700">
                As an international shipping service, we may transfer your information across borders to provide our services. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Specific retention periods vary based on the type of information and applicable legal requirements.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> privacy@justshopandship.com</li>
                  <li><strong>Phone:</strong> +91 9876543210</li>
                  <li><strong>Address:</strong> Plot No. 45, Sector 18, Gurgaon, Haryana 122001, India</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
              <p className="text-blue-800 text-sm">
                This Privacy Policy is part of our Terms of Service. By using our services, you agree to the collection and use of information in accordance with this policy. Please review this policy regularly as it may be updated from time to time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;