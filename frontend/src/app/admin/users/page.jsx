'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserPlus,
  ShieldCheck,
  Building2,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Lock,
  Mail,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

const adminCreationSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email address required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['org_admin', 'admin', 'super_admin']),
  organization_name: z.string().optional(),
});

const INITIAL_USERS = [
  {
    id: 'u-1',
    full_name: 'Ahmad Khan (Founder)',
    email: 'ahmadkhan32@cup2eat.com',
    role: 'super_admin',
    organization_name: 'CUP2EAT Corporate HQ',
    created_at: '2024-01-10',
    status: 'active',
  },
  {
    id: 'u-2',
    full_name: 'Mumbai Regional Operations',
    email: 'mumbai.ops@cup2eat.com',
    role: 'org_admin',
    organization_name: 'Maharashtra Operations Hub',
    created_at: '2024-03-15',
    status: 'active',
  },
  {
    id: 'u-3',
    full_name: 'Delhi NCR Logistics Lead',
    email: 'delhi.admin@cup2eat.com',
    role: 'org_admin',
    organization_name: 'Northern Regional Hub',
    created_at: '2024-04-20',
    status: 'active',
  },
  {
    id: 'u-4',
    full_name: 'Sunil Mehta (Inventory Mgr)',
    email: 'sunil.inventory@cup2eat.com',
    role: 'admin',
    organization_name: 'Maharashtra Operations Hub',
    created_at: '2024-06-02',
    status: 'active',
  },
];

const roleBadges = {
  super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  org_admin: { label: 'Organization Admin', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  admin: { label: 'Operations Admin', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminCreationSchema),
    defaultValues: {
      role: 'org_admin',
      organization_name: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    // Simulate server side Supabase user creation via Express / Admin API
    const newUser = {
      id: `u-${Date.now()}`,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      organization_name: data.organization_name || (data.role === 'super_admin' ? 'CUP2EAT Corporate HQ' : 'Regional Branch'),
      created_at: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setUsers([newUser, ...users]);
    setCreatedCredentials({
      email: data.email,
      password: data.password,
      role: data.role,
      org: newUser.organization_name,
    });
    toast.success(`Account created successfully for ${data.email}`);
    reset();
  };

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to revoke this admin access?')) {
      setUsers(users.filter((u) => u.id !== id));
      toast.success('Admin privileges revoked');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.organization_name && u.organization_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Role & Administrative Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Super Admins can create Organization Admins and assign regional enterprise access.
          </p>
        </div>
        <Button
          onClick={() => {
            setCreatedCredentials(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 text-brand-gold" /> Create New Admin
        </Button>
      </div>

      {/* Role Hierarchy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-purple-600" />
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">👑</span>
            <div>
              <h4 className="font-extrabold text-brand-charcoal text-base">Super Admin Role</h4>
              <p className="text-[11px] text-purple-700 font-bold uppercase">Enterprise Master Level</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mt-2">
            Highest authority. Full permission to manage global catalog, financial audits, settings, and <strong>create Organization Admins</strong>.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">🏢</span>
            <div>
              <h4 className="font-extrabold text-brand-charcoal text-base">Organization Admin</h4>
              <p className="text-[11px] text-blue-700 font-bold uppercase">Regional Entity Level</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mt-2">
            Manages assigned regional entity/hub. Can <strong>create Operational Admins</strong>, handle branch inventory, local orders, and reports.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600" />
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">👤</span>
            <div>
              <h4 className="font-extrabold text-brand-charcoal text-base">Operations Admin</h4>
              <p className="text-[11px] text-emerald-700 font-bold uppercase">Staff & Dispatch Level</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mt-2">
            Handles day-to-day product listings, order status transitions, tracking numbers, customer tickets, and review moderation.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or org..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-green"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admins</option>
            <option value="org_admin">Organization Admins</option>
            <option value="admin">Operations Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              <tr>
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role Assigned</th>
                <th className="px-6 py-4">Organization / Branch</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => {
                const badge = roleBadges[u.role] || roleBadges.admin;
                return (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-brand-charcoal flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green font-bold flex items-center justify-center text-xs shrink-0">
                        {u.full_name[0]}
                      </div>
                      <span>{u.full_name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-brand-gold shrink-0" />
                      <span>{u.organization_name || 'Global HQ'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{u.created_at}</td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'super_admin' ? (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-semibold italic">Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Admin Account"
        maxWidth="max-w-xl"
      >
        {createdCredentials ? (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">Credentials Generated Successfully</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Share these login credentials securely with the administrator. They can sign in at <code>/admin/login</code>.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3 font-mono text-xs border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-charcoal">{createdCredentials.email}</span>
                  <button onClick={() => copyToClipboard(createdCredentials.email)} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Temporary Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-green">{createdCredentials.password}</span>
                  <button onClick={() => copyToClipboard(createdCredentials.password)} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Role Assigned:</span>
                <span className="font-bold uppercase text-purple-700">{createdCredentials.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Organization:</span>
                <span className="font-bold text-brand-charcoal">{createdCredentials.org}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setCreatedCredentials(null);
                setIsModalOpen(false);
              }}
              className="w-full"
            >
              Done & Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Admin Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('full_name')}
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
              </div>
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Work Email (Login ID)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@cup2eat.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Role & Permissions Level
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
              >
                <option value="org_admin">Organization Admin (Regional / Branch Head)</option>
                <option value="admin">Operations Admin (Catalog & Orders Manager)</option>
                <option value="super_admin">Super Admin (Full Enterprise Master Access)</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Organization / Regional Hub Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('organization_name')}
                  type="text"
                  placeholder="e.g. Bangalore South Logistics Hub"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Assign Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Create & Grant Access
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
