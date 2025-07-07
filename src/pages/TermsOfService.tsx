import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Scale className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using our services. By using JustShopAndShip, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using JustShopAndShip's services, website, or mobile application, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services. These Terms constitute a legally binding agreement between you and JustShopAndShip Private Limited ("Company," "we," "us," or "our").
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Service Description
              </h2>
              <p className="text-gray-700 mb-4">
                JustShopAndShip provides international package forwarding and shipping services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Personal vault addresses in India for package receipt</li>
                <li>Package consolidation and repackaging services</li>
                <li>International shipping and delivery</li>
                <li>Personal shopping assistance</li>
                <li>Customs handling and documentation</li>
                <li>Package tracking and customer support</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-purple-600" />
                User Responsibilities
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Registration</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Package Contents</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Ensure all items comply with shipping regulations</li>
                <li>Provide accurate descriptions and values</li>
                <li>Not ship prohibited or restricted items</li>
                <li>Comply with customs and import/export laws</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Obligations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Pay all applicable fees and charges</li>
                <li>Provide valid payment information</li>
                <li>Pay customs duties and taxes as required</li>
                <li>Resolve payment disputes promptly</li>
              </ul>
            </section>

            {/* Prohibited Items */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <XCircle className="h-6 w-6 mr-2 text-red-600" />
                Prohibited Items
              </h2>
              <p className="text-gray-700 mb-4">
                The following items are strictly prohibited and cannot be shipped through our service:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dangerous Goods</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                    <li>Explosives and fireworks</li>
                    <li>Flammable liquids and gases</li>
                    <li>Toxic and corrosive substances</li>
                    <li>Radioactive materials</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Restricted Items</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                    <li>Weapons and ammunition</li>
                    <li>Illegal drugs and substances</li>
                    <li>Counterfeit goods</li>
                    <li>Perishable food items</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                For a complete list of prohibited items, please refer to our Prohibited Items page.
              </p>
            </section>

            {/* Fees and Payment */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fees and Payment</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Fees</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Shipping fees based on weight, dimensions, and destination</li>
                <li>Service fees for package handling and processing</li>
                <li>Storage fees for extended storage periods</li>
                <li>Additional fees for special services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Payment is due before shipment processing</li>
                <li>We accept major credit cards and digital payments</li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>Currency conversion fees may apply</li>
              </ul>
            </section>

            {/* Liability and Insurance */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Liability and Insurance</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Liability</h3>
              <p className="text-gray-700 mb-4">
                Our liability is limited to the declared value of your package or the actual loss/damage amount, whichever is lower. We are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Delays due to customs, weather, or carrier issues</li>
                <li>Consequential or indirect damages</li>
                <li>Loss of business or profits</li>
                <li>Damage to prohibited or improperly packaged items</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Insurance Coverage</h3>
              <p className="text-gray-700">
                Basic insurance is included with all shipments. Additional insurance coverage is available for high-value items. Claims must be reported within 30 days of delivery.
              </p>
            </section>

            {/* Customs and Duties */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customs and Duties</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You are responsible for all customs duties, taxes, and fees</li>
                <li>We provide customs documentation but cannot guarantee clearance</li>
                <li>Packages may be inspected or delayed by customs authorities</li>
                <li>Refused or undeliverable packages may be returned at your expense</li>
                <li>We are not responsible for customs seizures or forfeitures</li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to our services at any time, with or without notice, for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activities</li>
                <li>Non-payment of fees</li>
                <li>Shipping prohibited items</li>
                <li>Abuse of our services or staff</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700">
                All content, trademarks, logos, and intellectual property on our website and services are owned by JustShopAndShip or our licensors. You may not use, copy, or distribute our intellectual property without written permission.
              </p>
            </section>

            {/* Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our services, you consent to our privacy practices.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these Terms or our services shall be resolved through:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Good faith negotiations between the parties</li>
                <li>Mediation if negotiations fail</li>
                <li>Binding arbitration under Indian law</li>
                <li>Courts in Gurgaon, Haryana, India for any remaining disputes</li>
              </ol>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of India. Any legal proceedings shall be conducted in the courts of Gurgaon, Haryana, India.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Company:</strong> JustShopAndShip Private Limited</li>
                  <li><strong>Email:</strong> legal@justshopandship.com</li>
                  <li><strong>Phone:</strong> +91 9876543210</li>
                  <li><strong>Address:</strong> Plot No. 45, Sector 18, Gurgaon, Haryana 122001, India</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Important Legal Notice</h3>
              <p className="text-yellow-800 text-sm">
                These Terms of Service constitute a binding legal agreement. Please read them carefully and ensure you understand your rights and obligations. If you do not agree with any part of these terms, you should not use our services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;