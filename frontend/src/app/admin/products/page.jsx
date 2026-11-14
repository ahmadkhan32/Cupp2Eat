'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Search, Check, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { formatPrice } from '@/lib/utils';

const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Masala Magic Cup Noodles',
    slug: 'masala-magic-cup-noodles',
    category_id: 'cat-001',
    category_name: 'Cup Noodles',
    base_price: 149,
    sale_price: 119,
    stock: 45,
    is_published: true,
    is_featured: true,
    rating: 4.8,
    image_url: '/logo/cup2eat-logo.png',
  },
  {
    id: 'prod-002',
    name: 'Creamy Tomato Basil Soup Cup',
    slug: 'creamy-tomato-basil-soup-cup',
    category_id: 'cat-002',
    category_name: 'Cup Soups',
    base_price: 129,
    sale_price: 99,
    stock: 28,
    is_published: true,
    is_featured: false,
    rating: 4.6,
    image_url: '/logo/cup2eat-logo.png',
  },
  {
    id: 'prod-003',
    name: 'Belgian Chocolate Lava Cup Cake',
    slug: 'belgian-chocolate-lava-cup-cake',
    category_id: 'cat-003',
    category_name: 'Cup Desserts',
    base_price: 199,
    sale_price: 169,
    stock: 15,
    is_published: true,
    is_featured: true,
    rating: 4.9,
    image_url: '/logo/cup2eat-logo.png',
  },
  {
    id: 'prod-004',
    name: 'Spicy Schezwan Hakka Cup',
    slug: 'spicy-schezwan-hakka-cup',
    category_id: 'cat-001',
    category_name: 'Cup Noodles',
    base_price: 159,
    sale_price: 129,
    stock: 6,
    is_published: true,
    is_featured: false,
    rating: 4.7,
    image_url: '/logo/cup2eat-logo.png',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category_name: 'Cup Noodles',
    base_price: 149,
    sale_price: 119,
    stock: 50,
    is_published: true,
    is_featured: false,
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_name: 'Cup Noodles',
      base_price: 149,
      sale_price: 119,
      stock: 50,
      is_published: true,
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category_name: p.category_name,
      base_price: p.base_price,
      sale_price: p.sale_price || '',
      stock: p.stock,
      is_published: p.is_published,
      is_featured: p.is_featured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category_name: formData.category_name,
                base_price: Number(formData.base_price),
                sale_price: formData.sale_price ? Number(formData.sale_price) : null,
                stock: Number(formData.stock),
                is_published: formData.is_published,
                is_featured: formData.is_featured,
              }
            : p
        )
      );
      toast.success('Product updated successfully');
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: 'cat-001',
        category_name: formData.category_name,
        base_price: Number(formData.base_price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        stock: Number(formData.stock),
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        rating: 5.0,
        image_url: '/logo/cup2eat-logo.png',
      };
      setProducts([newProd, ...products]);
      toast.success('Product created successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product removed');
    }
  };

  const togglePublish = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, is_published: !p.is_published } : p
      )
    );
    toast.success('Visibility toggled');
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Products Catalog (CRUD)</h1>
          <p className="text-gray-500 text-sm mt-1">Manage Cup Foods, pricing in INR (₹), flavours, and stock.</p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-gold" /> Add New Product
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500">{filtered.length} products total</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price (INR)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-brand-green/10 shrink-0">
                      <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-charcoal">{p.name}</p>
                      <p className="text-[11px] font-mono text-gray-400">ID: {p.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{p.category_name}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-brand-green">{formatPrice(p.sale_price || p.base_price)}</span>
                    {p.sale_price && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        {formatPrice(p.base_price)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        p.stock < 10
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(p.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        p.is_published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.is_published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Cup Food Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Masala Magic Cup Noodles"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
              >
                <option value="Cup Noodles">Cup Noodles</option>
                <option value="Cup Soups">Cup Soups</option>
                <option value="Cup Desserts">Cup Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Stock Units
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Regular Price (₹ INR)
              </label>
              <input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Sale Price (₹ INR)
              </label>
              <input
                type="number"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                placeholder="Optional discount"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded text-brand-green accent-brand-green"
              />
              Publish to Storefront
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded text-brand-green accent-brand-green"
              />
              Mark as Bestseller / Featured
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
