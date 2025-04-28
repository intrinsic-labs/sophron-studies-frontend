import React from 'react';

// TODO: Fetch actual data from Sanity
async function getProducts() {
  // Placeholder data structure
  return [
    { _id: '1', name: 'Book Title 1', price: 24.00, image: { asset: { _ref: 'image-placeholder-1' } } },
    { _id: '2', name: 'Book Title 2', price: 24.00, image: { asset: { _ref: 'image-placeholder-2' } } },
    { _id: '3', name: 'Book Title 3', price: 24.00, image: { asset: { _ref: 'image-placeholder-3' } } },
    { _id: '4', name: 'Book Title 4', price: 24.00, image: { asset: { _ref: 'image-placeholder-4' } } },
    { _id: '5', name: 'Book Title 5', price: 24.00, image: { asset: { _ref: 'image-placeholder-5' } } },
    { _id: '6', name: 'Book Title 6', price: 24.00, image: { asset: { _ref: 'image-placeholder-6' } } },
  ];
}

// Basic Product Card Placeholder
// TODO: Implement proper image handling with urlFor and Link component
const ProductCard = ({ product }: { product: any }) => (
  <div className="border rounded-md p-4 text-center">
    <div className="w-full h-64 bg-gray-200 mb-4"> {/* Placeholder for image */} </div>
    <h3 className="font-semibold">{product.name}</h3>
    <p>${product.price.toFixed(2)}</p>
  </div>
);

export default async function Shop() {
  const products = await getProducts();

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Section 1: Latest Release */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-8">Latest Release Placeholder</h2>
        {/* Layout will include image, excerpt, and button */}
        <div className="text-center">
          <button className="px-6 py-2 bg-white border border-gray-300">Order Now</button>
        </div>
      </section>

      {/* Section 2: Studies (Product Grid) */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Studies</h2>

        {/* Filters/Search Placeholder */}
        <div className="flex justify-between items-center mb-8 px-4 md:px-0">
          <div>Filter Placeholder</div>
          <div>Search Placeholder</div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination Placeholder */}
        <div className="flex justify-center items-center mt-12 space-x-4">
          <button>&larr;</button>
          <span>Page 1 of X</span>
          <button>&rarr;</button>
        </div>
      </section>
    </div>
  );
} 