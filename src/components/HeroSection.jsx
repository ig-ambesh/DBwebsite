import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    title: "Wear Better.\nLive Better.",
    badge: "SUSTAINABLE FASHION",
    desc: "Discover eco-friendly fashion made from sustainable materials. Good for you, good for the planet.",
    btn: "Shop Collection",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
  },
  {
    title: "Modern.\nMinimal Style.",
    badge: "NEW COLLECTION",
    desc: "Premium essentials crafted for everyday comfort.",
    btn: "Explore Now",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
  },
  {
    title: "Organic.\nPremium Wear.",
    badge: "SUMMER DROP",
    desc: "Ethically made clothing with timeless design.",
    btn: "View Collection",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
  },
];

export default function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <section className="bg-[#F8F8F4] py-8">
      <div className="relative mx-auto max-w-350 overflow-hidden rounded-[36px] bg-gradient-to-r from-[#fbfaf6] to-[#eef4ea] shadow-xl">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={900}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          onSwiper={setSwiperInstance}
          className="hero-slider"
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div className="grid min-h-[680px] items-center gap-10 px-10 lg:grid-cols-2">
                <div>
                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {s.badge}
                  </span>

                  <h1 className="mt-6 whitespace-pre-line text-6xl font-serif font-bold leading-tight">
                    {s.title}
                  </h1>

                  <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
                    {s.desc}
                  </p>

                  <div className="mt-10 flex gap-4">
                    <button className="rounded-xl bg-green-700 px-8 py-4 text-white hover:bg-green-800">
                      {s.btn}
                    </button>

                    <button className="rounded-xl border px-8 py-4">
                      Explore New Arrivals
                    </button>
                  </div>

                  <div className="mt-12 flex gap-10">
                    <div>
                      <h3 className="font-bold">4.9/5</h3>
                      <p className="text-gray-500">Rating</p>
                    </div>
                    <div>
                      <h3 className="font-bold">Free Shipping</h3>
                      <p className="text-gray-500">Over $50</p>
                    </div>
                    <div>
                      <h3 className="font-bold">Sustainable</h3>
                      <p className="text-gray-500">Eco Materials</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center">
                  <div className="absolute h-[500px] w-[500px] rounded-full bg-green-200 opacity-50 blur-3xl"></div>

                  <img
                    src={s.img}
                    className="relative z-10 h-[650px] rounded-[30px] object-cover"
                  />

                  <div className="absolute right-0 top-28 z-20 rounded-3xl bg-white p-5 shadow-xl">
                    <div className="h-36 w-28 rounded-xl bg-gray-100"></div>
                    <h4 className="mt-3 font-semibold">Linen Overshirt</h4>
                    <p className="text-green-700">$59.99</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow cursor-pointer hover:bg-gray-50 transition"
        >
          <FiChevronLeft />
        </button>

        <button
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow cursor-pointer hover:bg-gray-50 transition"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
}
