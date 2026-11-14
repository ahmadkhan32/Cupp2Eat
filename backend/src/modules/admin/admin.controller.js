const supabase = require('../../config/supabase');
const authService = require('../auth/auth.service');

module.exports = {
  async getDashboard(req, res, next) {
    try {
      const [ordersRes, profilesRes, revenueRes, pendingRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total').eq('payment_status', 'paid'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('order_status', 'pending'),
      ]);

      const totalRevenue = revenueRes.data?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;

      res.json({
        success: true,
        stats: {
          total_revenue: totalRevenue,
          total_orders: ordersRes.count || 0,
          total_customers: profilesRes.count || 0,
          pending_orders: pendingRes.count || 0,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getAdminUsers(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_roles!inner(role, created_by, created_at)')
        .in('user_roles.role', ['super_admin', 'org_admin', 'admin'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ success: true, users: data || [] });
    } catch (err) {
      next(err);
    }
  },

  async createAdminUser(req, res, next) {
    try {
      const { email, password, full_name, role, organization_name } = req.body;

      // Hierarchy validation: Org Admin cannot create Super Admin or another Org Admin
      if (req.user.role === 'org_admin' && (role === 'super_admin' || role === 'org_admin')) {
        return res.status(403).json({
          success: false,
          message: 'Organization Admins can only provision Operations Admins.',
        });
      }

      const user = await authService.createAdminUser(
        email,
        password,
        full_name,
        role,
        organization_name,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: `${role.replace('_', ' ')} created successfully for ${email}`,
        user,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateOrderStatus(req, res, next) {
    try {
      const { status, payment_status } = req.body;
      const updates = { order_status: status, updated_at: new Date().toISOString() };
      if (payment_status) updates.payment_status = payment_status;

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;

      // Audit Log
      await supabase.from('audit_logs').insert({
        action: 'UPDATE_ORDER_STATUS',
        performed_by: req.user.id,
        details: { order_id: req.params.id, status },
      });

      res.json({ success: true, order: data });
    } catch (err) {
      next(err);
    }
  },

  async addShipment(req, res, next) {
    try {
      const { courier_name, tracking_number, tracking_url, estimated_delivery } = req.body;
      await supabase.from('shipments').upsert({
        order_id: req.params.id,
        courier_name,
        tracking_number,
        tracking_url,
        estimated_delivery,
        shipped_at: new Date().toISOString(),
      });

      await supabase.from('orders').update({ order_status: 'shipped' }).eq('id', req.params.id);

      res.json({ success: true, message: 'Shipment dispatched & tracking recorded' });
    } catch (err) {
      next(err);
    }
  },

  async getInventory(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*, product_variants(name, sku, flavour, size, products(name, slug))')
        .order('quantity', { ascending: true });

      if (error) throw error;
      res.json({ success: true, inventory: data || [] });
    } catch (err) {
      next(err);
    }
  },

  async getCustomers(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_roles(role)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ success: true, customers: data || [] });
    } catch (err) {
      next(err);
    }
  },

  async getSalesReport(req, res, next) {
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('total, created_at, order_status, payment_status')
        .eq('payment_status', 'paid');

      const totalRevenue = orders?.reduce((s, o) => s + parseFloat(o.total || 0), 0) || 0;
      res.json({ success: true, total_revenue: totalRevenue, total_orders: orders?.length || 0, orders });
    } catch (err) {
      next(err);
    }
  },
};
