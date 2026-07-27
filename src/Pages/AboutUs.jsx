
import {
  FiArrowRight,
  FiUsers,
  FiShield,
  FiHeart,
  FiGlobe,
  FiTruck,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

const values = [
  { icon: <FaLeaf />, title: "Sustainable", desc: "Eco-friendly materials and reduced waste." },
  { icon: <FiUsers />, title: "Ethical", desc: "Fair wages and safe working conditions." },
  { icon: <FiShield />, title: "Quality", desc: "Long-lasting premium products." },
  { icon: <FiHeart />, title: "Community", desc: "Supporting local communities." },
];

const team = [
  ["Emma Johnson","Founder & CEO"],
  ["Liam Carter","Head of Design"],
  ["Sophia Martinez","Sustainability Lead"],
  ["Noah Brown","Operations Manager"],
];

export default function AboutUs(){
  return(
    <div className="bg-[#F8F8F4]">
      

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm text-green-700">Home / About Us</p>
            <h1 className="mt-4 text-6xl font-serif font-bold">About EcoStyle</h1>
            <p className="mt-6 text-2xl font-semibold">Sustainable fashion for a better tomorrow.</p>
            <p className="mt-5 max-w-xl leading-8 text-gray-600">
              We create stylish, high-quality clothing using sustainable materials
              and ethical manufacturing. Every purchase supports a greener future.
            </p>
            <button className="mt-8 flex items-center gap-2 rounded-xl bg-green-700 px-8 py-4 text-white hover:bg-green-800">
              Our Story <FiArrowRight/>
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000"
            className="h-[500px] w-full rounded-[32px] object-cover shadow-xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-10 text-center text-4xl font-bold">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v)=>(
            <div key={v.title} className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                {v.icon}
              </div>
              <h3 className="text-xl font-semibold">{v.title}</h3>
              <p className="mt-3 text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto my-12 grid max-w-7xl grid-cols-2 gap-6 rounded-3xl bg-white p-10 shadow-sm md:grid-cols-4">
        <Stat value="10K+" label="Happy Customers"/>
        <Stat value="50+" label="Products"/>
        <Stat value="25+" label="Countries"/>
        <Stat value="100%" label="Eco Friendly"/>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-10 text-center text-4xl font-bold">Why Choose EcoStyle?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Eco Materials","Organic fabrics & dyes"],
            ["Responsible Production","Ethical factories"],
            ["Sustainable Packaging","Recyclable packaging"],
            ["Carbon Neutral Shipping","Lower emissions"],
          ].map(([t,d])=>(
            <div key={t} className="rounded-3xl bg-white p-8 shadow-sm">
              <FaLeaf className="mb-5 text-4xl text-green-700"/>
              <h3 className="text-xl font-semibold">{t}</h3>
              <p className="mt-3 text-gray-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-4xl font-bold">Meet Our Team</h2>
          <button className="rounded-xl border border-green-700 px-6 py-3 text-green-700">Join Our Journey</button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {team.map(([name,role],i)=>(
            <div key={name} className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <img
                src={`https://i.pravatar.cc/300?img=${i+10}`}
                className="mx-auto h-28 w-28 rounded-full"
              />
              <h3 className="mt-5 text-xl font-semibold">{name}</h3>
              <p className="text-gray-600">{role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto my-12 flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#eef4ea] to-[#f8f8f4] p-10 lg:flex-row">
        <div>
          <h2 className="text-4xl font-bold">Let's build a greener tomorrow together.</h2>
          <p className="mt-3 text-gray-600">Every purchase supports a sustainable future.</p>
        </div>
        <button className="rounded-xl bg-green-700 px-8 py-4 text-white">Shop Sustainable</button>
      </section>

      <section className="mx-auto mb-12 grid max-w-7xl gap-6 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-4">
        <Feature icon={<FaLeaf/>} title="Sustainable Materials"/>
        <Feature icon={<FiTruck/>} title="Free Shipping"/>
        <Feature icon={<FiShield/>} title="Easy Returns"/>
        <Feature icon={<FiGlobe/>} title="Secure Payments"/>
      </section>

      
    </div>
  )
}

function Stat({value,label}){
  return <div className="text-center"><h3 className="text-5xl font-bold text-green-700">{value}</h3><p className="mt-2">{label}</p></div>
}

function Feature({icon,title}){
  return <div className="flex items-center gap-4"><div className="text-3xl text-green-700">{icon}</div><div><h4 className="font-semibold">{title}</h4><p className="text-sm text-gray-500">Premium service</p></div></div>
}
