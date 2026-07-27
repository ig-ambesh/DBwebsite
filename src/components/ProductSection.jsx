
import { FiHeart, FiShoppingBag, FiStar } from "react-icons/fi";

const categories = [
  "All",
  "Men",
  "Women",
  "Accessories",
];

const products = [
  {
    id: 1,
    name: "Organic Cotton Hoodie",
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
  },
  {
    id: 2,
    name: "Eco Denim Jacket",
    price: "$89.99",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600",
  },
  {
    id: 3,
    name: "Linen Summer Shirt",
    price: "$49.99",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
  },
  {
    id: 4,
    name: "Minimal Sneakers",
    price: "$79.99",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
];

export default function ProductSection() {
  return (
    <section className="bg-[#F8F8F4] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="font-medium text-green-700">Featured Collection</p>
            <h2 className="mt-2 text-4xl font-bold">
              Discover Our Best Sellers
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                className="rounded-full border px-5 py-2 transition hover:bg-green-700 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full object-cover"
                />

                <button className="absolute right-4 top-4 rounded-full bg-white p-3 shadow">
                  <FiHeart />
                </button>

                <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                  NEW
                </span>
              </div>

              <div className="p-6">
                <div className="mb-3 flex text-yellow-500">
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                </div>

                <h3 className="text-xl font-semibold">{product.name}</h3>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  {product.price}
                </p>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800">
                  <FiShoppingBag />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[36px] bg-gradient-to-r from-green-700 to-green-900 px-10 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">
            Save up to 50% this Season
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-green-100">
            Shop sustainable fashion with premium quality, ethical sourcing,
            and fast delivery.
          </p>

          <button className="mt-8 rounded-full bg-white px-8 py-4 font-semibold text-green-700 transition hover:scale-105">
            Explore Collection
          </button>
        </div>
      </div>
    </section>
)}
