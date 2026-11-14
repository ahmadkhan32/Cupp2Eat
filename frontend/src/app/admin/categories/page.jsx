'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

const INITIAL_CATEGORIES = [
  { id: 'cat-001', name: 'Cup Noodles', slug: 'cup-noodles', description: 'Artisan instant noodles with rich gravy & toppings', count: 12, is_active: true },
  { id: 'cat-002', name: 'Cup Soups', slug: 'cup-soups', description: 'Nutritious comforting soups ready in boiling water', count: 8, is_active: true },
  { id: 'cat-003', name: 'Cup Desserts', slug: 'cup-desserts', description: 'Gourmet warm lava cakes and sweet puddings in cups', count: 10, is_active: true },
  { id: 'cat-004', name: 'Beverages', slug: 'beverages', description: 'Artisanal teas, coffees, and hot chocolates', count: 15, is_active: true },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', is_active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setFormData({ name: c.name, description: c.description, is_active: c.is_active });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name is required');

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? {
        ...c,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        is_active: formData.is_active,
      } : c));
      toast.success('Category updated');
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        count: 0,
        is_active: formData.is_active,
      };
      setCategories([...categories, newCat]);
      toast.success('Category created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Categories (CRUD)</h1>
          <p className="text-gray-500 text-sm mt-1">Organize product collections & menu groups.</p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-gold" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-brand-green/10 text-brand-green">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-brand-charcoal text-base">{c.name}</h3>
                <p className="text-xs font-mono text-brand-gold bg-brand-charcoal px-2 py-0.5 rounded inline-block mt-1">
                  /{c.slug}
                </p>
                <p className="text-xs text-gray-500 mt-2 max-w-sm">{c.description}</p>
                <span className="inline-block mt-3 text-xs font-semibold text-brand-green bg-emerald-50 px-2 py-0.5 rounded">
                  {c.count} items active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleOpenEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Create Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              placeholder="e.g. Protein Boost Cups"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingCategory ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
