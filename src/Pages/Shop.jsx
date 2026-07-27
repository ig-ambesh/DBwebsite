import { FiFilter, FiGrid, FiList, FiHeart, FiPlus, FiChevronDown } from "react-icons/fi";

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: [
    "Organic Cotton Hoodie",
    "Linen Regular Shirt",
    "Eco Sneakers",
    "Canvas Tote Bag",
    "Recycled Cap",
  ][i % 5],
  price: (19.99 + i * 5).toFixed(2),
  image: `https://picsum.photos/seed/product${i}/400/500`,
}));

export default function Shop() {
  return (
    <div className="bg-[#F8F8F4] min-h-screen mb-8">
      

      <section className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-r from-[#f8f6ef] to-[#eef3e7] px-10 py-16">
        <p className="text-sm text-gray-500">Home / Shop</p>
        <h1 className="mt-3 text-5xl font-bold">Shop All Products</h1>
        <p className="mt-4 max-w-lg text-gray-600">
          Discover our collection of sustainable and eco‑friendly fashion.
        </p>
      </section>

      <div className="mx-auto mt-8 max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {["Filter", "Categories", "Size", "Color", "Price"].map((x) => (
              <button
                key={x}
                className="flex items-center gap-2 rounded-xl border bg-white px-5 py-3 shadow-sm"
              >
                {x}
                <FiChevronDown />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border bg-white p-3">
              <FiGrid />
            </button>
            <button className="rounded-xl border bg-white p-3">
              <FiList />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
              <FiFilter />
              Filters
            </h2>

            <div className="space-y-6">
              {["Categories", "Size", "Color"].map((title) => (
                <div key={title}>
                  <h3 className="mb-3 font-semibold">{title}</h3>
                  <div className="space-y-2 text-gray-600">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      All
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      Men
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      Women
                    </label>
                  </div>
                </div>
              ))}

              <button className="w-full rounded-xl bg-green-700 py-3 text-white">
                Apply Filter
              </button>
            </div>
          </aside>

          <section>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-72 w-full object-cover"
                    />
                    <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow">
                      <FiHeart />
                    </button>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="mt-2 text-xl font-bold text-green-700">
                      ${p.price}
                    </p>

                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-green-700 py-3 text-white">
                      <FiPlus />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-2">
              {[1,2,3,4,5].map(n=>(
                <button key={n} className={`h-10 w-10 rounded-lg border ${n===1?"bg-green-700 text-white":"bg-white"}`}>{n}</button>
              ))}
            </div>
          </section>
        </div>
      </div>

      
    </div>
  );
}
