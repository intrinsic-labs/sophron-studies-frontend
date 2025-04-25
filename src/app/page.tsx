import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Section 1: Hero */}
      <section className="min-h-[60vh] flex items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-semibold">Hero Section Placeholder (Looping Video Background)</h2>
      </section>

      {/* Section 2: Definition of Sophron */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Definition of Sophron Placeholder</h2>
        {/* Layout will include text and image */}
      </section>

      {/* Section 3: Important Point */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-2xl font-semibold text-center mb-8">Important Point Placeholder</h2>
        {/* Layout will include text and image */}
      </section>

      {/* Section 4: Featured Blog Post */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Featured Blog Post Placeholder</h2>
        {/* Layout will include image, excerpt, and button */}
      </section>

      {/* Section 5: Upcoming Release */}
      <section className="py-16 bg-gray-900 text-white">
        <h2 className="text-2xl font-semibold text-center mb-8">Upcoming Release Placeholder</h2>
        {/* Layout will include image, excerpt, and button */}
      </section>

      {/* Section 6: Stay In Touch (Newsletter) */}
      <section className="py-16 border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">Stay In Touch Placeholder</h2>
        {/* Basic form structure */}
        <form className="max-w-md mx-auto">
          <input type="email" placeholder="name@example.com" className="w-full p-2 border border-gray-300 mb-2" />
          <button type="submit" className="w-full p-2 bg-gray-800 text-white">Submit</button>
        </form>
      </section>
    </div>
  );
}
