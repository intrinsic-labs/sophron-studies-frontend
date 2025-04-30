import { sanityClient } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";

// TODO: Define the product type properly based on schema
type Product = {
  _id: string;
  name: string;
  price: number;
  description?: any[]; // Adjust based on actual schema for block content
  // Add other fields as needed: image, details etc.
};

// Fetch a single product by slug
async function getProduct(slug: string): Promise<Product | null> {
  const query = groq`*[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    price,
    description,
    // Fetch other fields
  }`;
  return sanityClient.fetch(query, { slug });
}

// Generate static paths if desired (optional, good for performance)
// export async function generateStaticParams() {
//   const slugs: string[] = await sanityClient.fetch(groq`*[_type == "product" && defined(slug.current)][].slug.current`);
//   return slugs.map((slug) => ({ slug }));
// }

type PageProps = {
  params: { slug: string };
};

const ProductPage = async ({ params }: PageProps) => {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound(); // Display 404 if product not found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* TODO: Build out detailed product layout with image, description, price, add to cart button */}
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl mb-4">${product.price.toFixed(2)}</p>
      
      {/* Placeholder for description - needs proper rendering for block content */}
      <div className="prose lg:prose-xl mt-8">
        <p>Description placeholder...</p>
        {/* {product.description && <PortableText value={product.description} />} */}
      </div>

      <div className="mt-8">
        {/* Placeholder for Add to Cart */}
        <button className="px-6 py-3 bg-black text-white">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductPage; 