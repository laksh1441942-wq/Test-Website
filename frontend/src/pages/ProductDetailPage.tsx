import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Package, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      const [productData, productsData] = await Promise.all([
        api.getProduct(Number(id)),
        api.getProducts(),
      ]);
      setProduct(productData);
      setAllProducts(productsData);
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const relatedProducts = allProducts
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="h-72 md:h-[480px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-8xl opacity-30">
                {product.category === 'Textiles' && '🧵'}
                {product.category === 'Electronics' && '⚡'}
                {product.category === 'Handicrafts' && '🎨'}
                {product.category === 'Agriculture' && '🌾'}
                {product.category === 'Food' && '🍽️'}
                {product.category === 'Chemicals' && '🧪'}
                {!['Textiles', 'Electronics', 'Handicrafts', 'Agriculture', 'Food', 'Chemicals'].includes(product.category) && '📦'}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8 flex flex-col">
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700 self-start mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                ))}
                <span className="text-sm text-gray-500">(4.0)</span>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors rounded-l-lg"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <Truck size={20} className="mx-auto text-primary-600 mb-1" />
                  <p className="text-xs text-gray-500">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield size={20} className="mx-auto text-primary-600 mb-1" />
                  <p className="text-xs text-gray-500">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RotateCcw size={20} className="mx-auto text-primary-600 mb-1" />
                  <p className="text-xs text-gray-500">7-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
