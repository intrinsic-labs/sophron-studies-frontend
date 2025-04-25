export default function AboutPage() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Section 1: Hero */}
      <section className="min-h-[50vh] flex items-center justify-center bg-gray-100">
        {/* TODO: Add specific styling/imagery based on mockup */}
        <h1 className="text-4xl font-bold italic">Meet the Author</h1> 
      </section>

      {/* Section 2: Paragraph About Me */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Paragraph About Me Placeholder</h2>
        {/* Layout will include text and potentially small images */}
      </section>

      {/* Section 3: Multi-image section */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-2xl font-semibold text-center mb-8">Multi-image Section Placeholder</h2>
        {/* Grid or flex layout for images */}
      </section>

      {/* Section 4: Upcoming Release */}
      <section className="py-16 bg-gray-900 text-white">
        <h2 className="text-2xl font-semibold text-center mb-8">Upcoming Release Placeholder</h2>
        {/* Layout will include image, excerpt, and button (Similar to Home page) */}
      </section>

      {/* Section 5: Stay In Touch (Newsletter) */}
      <section className="py-16 border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">Stay In Touch Placeholder</h2>
        {/* Basic form structure (Similar to Home page) */}
        <form className="max-w-md mx-auto">
          <input type="email" placeholder="name@example.com" className="w-full p-2 border border-gray-300 mb-2" />
          <button type="submit" className="w-full p-2 bg-gray-800 text-white">Submit</button>
        </form>
      </section>
    </div>
  );
} 