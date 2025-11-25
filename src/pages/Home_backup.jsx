import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const allTechniciansData = [
  {
    id: 1,
    name: "Mobile Wizards",
    rating: 4.9,
    reviews: 1200,
    services: ["Screen Repair", "Battery Fix"],
    distance: 1.5,
    price: "$50 - $250",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpjnPGaHMNfySM0XdsWGFM8Ac4KNQNKiXUS3Y6B3gNfw3PTX9qpxQaSzsRnBaJdznzm0o9gDi_XN7i1hittn0ZBLKollEJYw2JPng1XBJ82gMs0KL8Rle5bHZlwSFnPrdglNHk5jgeBhx0cKwnyTKpYvPXXyX0Auy7nVCgKaZy8xC54es7beBmU6OvPQOkM0MefRI2PFhKld5d-Q-AA8J08pqF23RYVLyxrvWaCzD6B1RxfL3i9302086lobuhNvXmueMbSDoHo7sX"
  },
  {
    id: 2,
    name: "Fone Fixers",
    rating: 4.8,
    reviews: 850,
    services: ["Charging Port", "Water Damage"],
    distance: 2.1,
    price: "$70 - $300",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYOQbF9Rf31b64CLzucTed9New93PsgPBtgxJ84A5qIVGFE4OV4gR7slRLP3NAsLkIyiy7sKdk0sYR-BAaDUAK8UwIY0FdVaHKdXU2DeXWsMBX2klyWNUPjypUw1UjxHPcHWax28skPdRjyyo9IzzXnBwWKmYCzZyg6lSzrRO2ZGqPccfaCK7irz7BAfIiUT8irri9YDNKJVtSu6H4-xMw5f-i9QdPDbG1cgyERN-NIR565NTz8lozduJ4aJghNxrdVSmRJCw4PNqR"
  },
  {
    id: 3,
    name: "Pocket Techs",
    rating: 4.7,
    reviews: 700,
    services: ["Camera Repair", "Speaker Fix"],
    distance: 0.8,
    price: "$60 - $200",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDovMWLM9pCPQ8Ifx2gK6QbFZyjK_8Xszb1KqMH4HoOBNwvibbfjCTHdAJUECnONA5em1tE-3E8gID1-C3bqmvyamYQcczH4g9KvCUQgZHEMY8Fybh67oeuNWDwALrDXujzJyfnliU5GnwThYDmw6U8ZDmhIudwsyYdKnKCb9CKgm93QdTn2l2VplZLQrtlQIGJFsOco4OvJYA_7W4VR-oMNDvJS-O59cvPVpJp0-Rv0dzDuooML-EEQM9WhEj5icklAfaB88WKQDeZ"
  }
];

const allTechnicians = [
  ...techniciansData,
  {
    id: 4,
    name: "Gadget Gurus",
    rating: 4.9,
    reviews: 950,
    services: ["Screen Replacement", "Battery Fix"],
    distance: 0.7,
    price: "$40 - $250",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVBlUcL_i6v0gf7HT1S32tiSlfqP9XjXZsfRL1Me6FDZyH9ZRGG000GTl6VhcjC1Ye4041mB9hUvKdDAUlNgYulBA4LyCcr4xvNKoiiDVGjv25QtQj2sI9l-d1d6Goy2O-YZABGTHJFv_MmpYtCRCAg3mGBBxnUqVHVWRqV1peD66tPoLSk1kVkxy9I8QPHDaI4vo_Yqw5WC4SByDqjbMCAZToncoUhTF783_sf_XMXcEkzz2xhfpA2X0IXQArOj9O47WIpJdtSmSj"
  },
  {
    id: 5,
    name: "Smart Device Solutions",
    rating: 4.8,
    reviews: 1100,
    services: ["All Device Repair", "Troubleshooting"],
    distance: 4.2,
    price: "$50 - $450",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJVH4GGJ9HAziqsTCiIS5yDwLQioof-9lMTxK8C7AXPg6oNXt8W7sAjnwVXl2cSHwS9NrxVISjP0sSQUA6wXFtnXhr5ECzWXhefODI5d0rJxzW2z8wcGw89f_xFayyRLhq4cDxcbaXadfsKl7N2lB128Ru-xWK92pcFNcWyU4QPbu1DxGCnh7mXdKSlkpl1m6ORlBMh7e8-5HAdSJpOyLXwRfE8PhaEvp3JJrDjUOPkGTETIB_69CixuBfadL3r-0p8pHEjEOg2ZM8"
  },
  {
    id: 6,
    name: "Circuit Saviors",
    rating: 4.9,
    reviews: 600,
    services: ["Motherboard Repair", "Soldering"],
    distance: 2.9,
    price: "$80 - $350",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALlmvVTUunr20eDi-YYDYe1yN3H6X4tx-WEPxHc08nuF3-fvg-FvBWh4Mn4JAinBIWEWAYZ-bucMOAyTkIRWt8NcothFt4yCImqYjln4BQExKiS_0vSSLXDvdXAj3vMfAe2Vo31FcjWS7Th7WBXNq4uX-X8u_ZsNQ2BNlSVBU7AIOk4Vd_ZLU2n3RngClXHoqBbkOPwQKBFb3ulAlCBmBsYfECPJP3vepSimljJyyS_REFzNPzYTlV_O54nNBznN98nJd3aT2E3E8C"
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('');
  const [issue, setIssue] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [distance, setDistance] = useState('');

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main>
          <section className="py-16 sm:py-24">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Your Trusted Partner for Mobile Device Repairs
                </h2>
                <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
                  Find trusted and skilled technicians for smartphones and tablets. Fast, reliable, and convenient service, right at your fingertips.
                </p>
                <button 
                  onClick={() => {
                    document.getElementById('featured-technicians')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-8 bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                  Find Technicians Now
                </button>
              </div>
              <div>
                <img 
                  alt="Technician repairing a mobile phone" 
                  className="rounded-lg shadow-lg" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_lzbEzJb4eEjVp0CIkCF6L2MNjhlw1xLi7dmxYmuqoLwryRiNBI1VTAwgtvBqiY7LXEiNQZB2hXrT4aeQNiqUhsYxCkwRNztvR21MVk2g35oQSp7KS8aId4T60lKrASdFVY3xvLRljwUZow5uCZ3rBp4Ug5pkwiLRL1Wm8PXR1hqcd9jT08Iq-m20c787tlth48nRiT1RkQ_tfcrAihjmPFyFDQDRI8UVGeLZXOlB3S3Q1QRh60nsPYF7UvdwI3IQ1euw5jlCjtFR"
                />
              </div>
            </div>
          </section>

          <section className="py-12 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
            <div className="px-8">
              <h3 className="text-xl font-semibold mb-6">Refine Your Search</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                    search
                  </span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="Search..." 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Brand</option>
                  <option value="apple">Apple</option>
                  <option value="samsung">Samsung</option>
                  <option value="google">Google</option>
                </select>
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                >
                  <option value="">Issue</option>
                  <option value="screen">Screen Repair</option>
                  <option value="battery">Battery</option>
                  <option value="camera">Camera</option>
                </select>
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">Price Range</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200+">$200+</option>
                </select>
                <div className="grid grid-cols-2 gap-4 lg:col-span-1">
                  <select 
                    className="w-full py-3 px-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                  >
                    <option value="">Distance</option>
                    <option value="0-1">0-1 miles</option>
                    <option value="1-5">1-5 miles</option>
                    <option value="5+">5+ miles</option>
                  </select>
                  <button className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="featured-technicians" className="py-16">
            <h3 className="text-3xl font-bold mb-8">Featured Mobile Technicians Near You</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {techniciansData.map((tech) => (
                <TechnicianCard key={tech.id} technician={tech} />
              ))}
            </div>
          </section>

          <section className="py-16">
            <h3 className="text-3xl font-bold mb-8">All Mobile Repair Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allTechnicians.map((tech) => (
                <TechnicianCard key={tech.id} technician={tech} />
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="bg-background-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Load More Services
              </button>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;
