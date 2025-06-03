'use client';

import React, { useState } from 'react';

type InquiryType = 'general' | 'study' | 'seminar';

const ContactForm: React.FC = () => {
  const [inquiryType, setInquiryType] = useState<InquiryType>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    studyPreference: '', // Bible Study
    availability: '', // Bible Study
    organization: '', // Seminar
    preferredDate: '', // Seminar
  });
  const [status, setStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInquiryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInquiryType(e.target.value as InquiryType);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...');

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    // Append inquiry type for Formspree filtering
    data.append('inquiryType', inquiryType);

    try {
      // TODO: Replace with your actual Formspree endpoint
      const response = await fetch('https://formspree.io/f/xovdlbyp', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('Thank you! Your message has been sent.');
        // Reset form or redirect
        setFormData({
          name: '',
          email: '',
          message: '',
          studyPreference: '',
          availability: '',
          organization: '',
          preferredDate: '',
        });
        setInquiryType('general');
        form.reset(); // Reset native form state
      } else {
        setStatus('Oops! There was a problem submitting your form.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('Oops! There was a problem submitting your form.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-sm">
      {/* Inquiry Type Selection */}
      <div className="mb-6">
        <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1">What would you like to do?</label>
        <select
          id="inquiryType"
          name="inquiryTypeSelect" // Use a different name to avoid conflict with hidden input
          value={inquiryType}
          onChange={handleInquiryTypeChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
          required
        >
          <option value="general">General Inquiry</option>
          <option value="study">Virtual Bible Study Sign-up</option>
          <option value="seminar">Teacher Training Seminar Booking</option>
        </select>
      </div>

      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="name"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
            required
          />
        </div>
      </div>

      {/* Conditional Fields: Bible Study */}
      {inquiryType === 'study' && (
        <div className="mb-6 space-y-6 p-4 border border-olive/50 rounded-sm bg-olive/10">
           <p className="text-sm font-medium text-gray-800">Bible Study Details:</p>
           <div>
            <label htmlFor="studyPreference" className="block text-sm font-medium text-gray-700 mb-1">Preferred Study (Optional)</label>
            <input
              type="text"
              name="studyPreference"
              id="studyPreference"
              value={formData.studyPreference}
              onChange={handleInputChange}
              placeholder="e.g., Old Testament Overview"
              autoComplete="off"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Your Availability (Optional)</label>
            <textarea
              name="availability"
              id="availability"
              rows={3}
              value={formData.availability}
              onChange={handleInputChange}
              placeholder="e.g., Weekday evenings, Saturday mornings"
              autoComplete="off"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
            ></textarea>
          </div>
        </div>
      )}

      {/* Conditional Fields: Seminar Booking */}
      {inquiryType === 'seminar' && (
        <div className="mb-6 space-y-6 p-4 border border-pink/50 rounded-sm bg-pink/10">
          <p className="text-sm font-medium text-gray-800">Seminar Booking Details:</p>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">Organization (Optional)</label>
            <input
              type="text"
              name="organization"
              id="organization"
              value={formData.organization}
              onChange={handleInputChange}
              autoComplete="organization"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date(s) (Optional)</label>
            <input
              type="text"
              name="preferredDate"
              id="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              placeholder="e.g., Any weekend in October"
              autoComplete="off"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* Message Field */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          {inquiryType === 'general' ? 'Message' : 'Additional Comments (Optional)'}
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          autoComplete="off"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-olive focus:border-olive sm:text-sm"
          required={inquiryType === 'general'} // Only required for general inquiry
        ></textarea>
      </div>

      {/* Hidden field for Formspree */}
      <input type="hidden" name="inquiryType" value={inquiryType} />

      {/* Submit Button */}
      <div className="text-center">
        <button type="submit" className="btn-primary w-full md:w-auto">
          Send Message
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <p className={`mt-4 text-center text-sm ${status.includes('Oops') ? 'text-red-600' : 'text-green-600'}`}>
          {status}
        </p>
      )}
    </form>
  );
};

export default ContactForm; 