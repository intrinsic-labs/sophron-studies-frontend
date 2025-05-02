import ContactForm from "@/components/ContactForm";
import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="heading-1 text-gray-700 mb-2">Get In Touch</h1>
        <p className="body-text-subtle">
          Have a question, want to sign up for a study, or book a training? Let us know below!
        </p>
      </div>
      <ContactForm />
    </div>
  );
} 