import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Users, Zap, Star, ChevronRight } from 'lucide-react';

const features = [
  { icon: <Users size={24} />, title: 'Connect with Buyers & Sellers', description: 'Direct access to a vast network of Indian MSMEs and buyers nationwide.' },
  { icon: <Shield size={24} />, title: 'Secure Transactions', description: 'Built-in payment security and buyer protection for all transactions.' },
  { icon: <Truck size={24} />, title: 'Reliable Logistics', description: 'Integrated shipping solutions with real-time tracking across India.' },
  { icon: <Zap size={24} />, title: 'Instant Invoicing', description: 'Automated GST-compliant invoicing for seamless record keeping.' },
];

const categories = [
  { name: 'Textiles & Apparel', emoji: '🧵', count: '2,400+' },
  { name: 'Electronics', emoji: '⚡', count: '1,800+' },
  { name: 'Handicrafts', emoji: '🎨', count: '3,200+' },
  { name: 'Agriculture', emoji: '🌾', count: '1,500+' },
  { name: 'Food Products', emoji: '🍽️', count: '2,100+' },
  { name: 'Chemicals', emoji: '🧪', count: '900+' },
];

const testimonials = [
  { name: 'Rajesh Kumar', business: 'Kumar Textiles, Surat', quote: 'VyaparSetu has helped us reach customers across 15 states. Our sales have grown by 300%.' },
  { name: 'Priya Sharma', business: 'Sharma Electronics, Pune', quote: 'The invoicing and order management features save us hours every week. Highly recommended!' },
  { name: 'Amit Patel', business: 'Patel Handicrafts, Jaipur', quote: 'We started with 10 products online. Now we have over 200 and ship nationwide.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-saffron-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-saffron-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Trusted by 10,000+ MSMEs across India</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your Business<br />
              <span className="text-saffron-300">Gateway</span> to Growth
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              VyaparSetu connects Indian MSMEs with buyers nationwide. List your products, 
              manage orders, generate invoices, and grow your business — all from one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-lg"
              >
                Start Selling <ArrowRight size={20} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold transition-colors text-lg border border-white/20"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Active MSMEs' },
              { value: '50,000+', label: 'Products Listed' },
              { value: '₹250Cr+', label: 'GMV Processed' },
              { value: '28', label: 'States Covered' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything Your Business Needs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From product listing to payment settlement, VyaparSetu handles it all so you can focus on what matters — your business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-gray-600 text-lg">Discover products from diverse Indian industries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className="group bg-gray-50 hover:bg-primary-50 rounded-xl p-6 text-center transition-all duration-200 border border-transparent hover:border-primary-200"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Businesses Like Yours</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-saffron-500 to-saffron-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-saffron-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Indian MSMEs who are already selling on VyaparSetu. 
            Get started in minutes — no setup fees, no hidden charges.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-saffron-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-saffron-50 transition-colors shadow-lg"
          >
            Create Free Account <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
