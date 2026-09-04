import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const categoryColors: Record<string, string> = {
    'Textiles': 'bg-pink-100 text-pink-700',
    'Electronics': 'bg-blue-100 text-blue-700',
    'Handicrafts': 'bg-amber-100 text-amber-700',
    'Agriculture': 'bg-green-100 text-green-700',
    'Food': 'bg-orange-100 text-orange-700',
    'Chemicals': 'bg-purple-100 text-purple-700',
    'default': 'bg-gray-100 text-gray-700',
  };

  const categoryColor = categoryColors[product.category] || categoryColors['default'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <a href={`/products/${product.id}`} className="block">
        <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
          <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-300">
            {product.category === 'Textiles' && '🧵'}
            {product.category === 'Electronics' && '⚡'}
            {product.category === 'Handicrafts' && '🎨'}
            {product.category === 'Agriculture' && '🌾'}
            {product.category === 'Food' && '🍽️'}
            {product.category === 'Chemicals' && '🧪'}
            {!['Textiles', 'Electronics', 'Handicrafts', 'Agriculture', 'Food', 'Chemicals'].includes(product.category) && '📦'}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </a>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <a href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 text-sm">
              {product.name}
            </h3>
          </a>
        </div>

        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${categoryColor} mb-2`}>
          {product.category}
        </span>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart size={16} />
            </button>
          ) : (
            <button disabled className="p-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed">
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
