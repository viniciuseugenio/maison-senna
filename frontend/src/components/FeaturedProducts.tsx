import { Link } from "react-router";
import Button from "./Button";

// Sample product data
const products = [
  {
    id: 1,
    name: "The Celestial Pendant",
    price: "$1,250",
    image: "https://placehold.co/600x600",
    category: "Necklaces",
  },
  {
    id: 2,
    name: "Ethereal Diamond Ring",
    price: "$2,800",
    image: "https://placehold.co/600x600",
    category: "Rings",
  },
  {
    id: 3,
    name: "Luminous Pearl Earrings",
    price: "$950",
    image: "https://placehold.co/600x600",
    category: "Earrings",
  },
  {
    id: 4,
    name: "Silk Cashmere Scarf",
    price: "$420",
    image: "https://placehold.co/600x600",
    category: "Accessories",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-mine-shaft font-serif text-3xl font-light tracking-wider sm:text-4xl">
            Featured Collection
          </h2>
          <div className="bg-oyster mx-auto mt-4 h-[1px] w-20" />
          <p className="text-mine-shaft/90 mt-6">
            Exquisite pieces crafted with the finest materials and unparalleled
            attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group">
              <Link to={`/products/${product.id}/`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-oyster font-sans text-sm font-medium tracking-wider uppercase">
                    {product.category}
                  </p>
                  <h3 className="text-mine-shaft mt-2 font-serif text-lg font-light">
                    {product.name}
                  </h3>
                  <p className="text-mine-shaft/90 mt-2 text-sm">
                    {product.price}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center">
          <Link to="/collections">
            <Button variant="outline">VIEW ALL COLLECTIONS</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
