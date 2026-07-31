import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, "heroBanners"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const fetchedBanners = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (fetchedBanners.length > 0) {
          setBanners(fetchedBanners);
        } else {
          setBanners(slides); // Fallback to hardcoded slides
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
        setBanners(slides); // Fallback on error
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

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
          {banners.map((s, i) => (
            <SwiperSlide key={s.id || i}>
              <div className="flex flex-col-reverse lg:grid min-h-[500px] md:min-h-[680px] items-center gap-8 md:gap-10 px-6 md:px-10 py-8 lg:py-0 lg:grid-cols-2">
                <div>
                  <span className="rounded-full bg-green-100 px-4 py-2 text-xs md:text-sm font-semibold text-green-700">
                    {s.badge}
                  </span>

                  <h1 className="mt-4 md:mt-6 whitespace-pre-line text-4xl md:text-6xl font-serif font-bold leading-tight text-gray-900">
                    {s.title}
                  </h1>

                  <p className="mt-4 md:mt-6 max-w-lg text-base md:text-lg leading-7 md:leading-8 text-gray-600">
                    {s.desc}
                  </p>

                  <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
                    <button className="rounded-xl bg-green-700 px-6 md:px-8 py-3 md:py-4 text-white hover:bg-green-800 transition shadow-lg shadow-green-200 w-full sm:w-auto font-medium">
                      {s.btn}
                    </button>

                    <button className="rounded-xl border border-gray-300 px-6 md:px-8 py-3 md:py-4 hover:bg-gray-50 transition w-full sm:w-auto font-medium">
                      Explore New Arrivals
                    </button>
                  </div>

                  <div className="mt-10 md:mt-12 grid grid-cols-3 gap-2 md:gap-10 text-center sm:text-left">
                    <div>
                      <h3 className="font-bold text-sm md:text-base">4.9/5</h3>
                      <p className="text-gray-500 text-xs md:text-sm">Rating</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base">Free Ship</h3>
                      <p className="text-gray-500 text-xs md:text-sm">Over ₹500</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base">Sustainable</h3>
                      <p className="text-gray-500 text-xs md:text-sm">Eco Materials</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center w-[calc(100%+48px)] md:w-full mt-0 md:mt-4 lg:mt-0 -mx-6 md:mx-0">
                  <div className="absolute h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-green-200 opacity-50 blur-3xl"></div>

                  <img
                    src={s.img}
                    className="relative z-10 h-[350px] md:h-[650px] w-full lg:w-auto rounded-none md:rounded-[30px] object-cover md:shadow-xl"
                  />

                  {s.productTile && (
                    <Link to={`/product/${s.productTile.id}`} className="absolute right-0 md:-right-4 top-16 md:top-28 z-20 rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm p-3 md:p-5 shadow-xl border border-white hover:scale-105 transition-transform duration-300 block">
                      <div className="h-20 w-16 md:h-36 md:w-28 rounded-lg md:rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                        {s.productTile.img ? (
                          <img src={s.productTile.img} alt={s.productTile.name} className="w-full h-full object-cover" />
                        ) : (
                          <FaLeaf className="text-gray-300 text-xl md:text-3xl" />
                        )}
                      </div>
                      <h4 className="mt-2 md:mt-3 font-semibold text-xs md:text-base line-clamp-1 max-w-[80px] md:max-w-[120px]" title={s.productTile.name}>
                        {s.productTile.name}
                      </h4>
                      <p className="text-green-700 text-xs md:text-sm font-bold">₹{s.productTile.price}</p>
                    </Link>
                  )}
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
