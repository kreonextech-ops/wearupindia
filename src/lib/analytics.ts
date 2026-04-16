import { SupabaseClient } from '@supabase/supabase-js';

export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'overall';

function getDateRange(range: TimeRange): { from: string; prev_from: string; prev_to: string } | null {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();

  if (range === 'overall') return null;

  let from: Date;
  let prev_from: Date;
  let prev_to: Date;

  if (range === 'today') {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    prev_from = new Date(from); prev_from.setDate(prev_from.getDate() - 1);
    prev_to = new Date(from);
  } else if (range === 'week') {
    from = new Date(now); from.setDate(now.getDate() - 7);
    prev_from = new Date(from); prev_from.setDate(prev_from.getDate() - 7);
    prev_to = new Date(from);
  } else if (range === 'month') {
    from = new Date(now); from.setDate(now.getDate() - 30);
    prev_from = new Date(from); prev_from.setDate(prev_from.getDate() - 30);
    prev_to = new Date(from);
  } else {
    // year
    from = new Date(now); from.setFullYear(now.getFullYear() - 1);
    prev_from = new Date(from); prev_from.setFullYear(prev_from.getFullYear() - 1);
    prev_to = new Date(from);
  }

  return { from: iso(from), prev_from: iso(prev_from), prev_to: iso(prev_to) };
}

export interface DashboardStats {
  totalRevenue: number;
  prevRevenue: number;
  totalOrders: number;
  prevOrders: number;
  totalCustomers: number;
  prevCustomers: number;
  totalProducts: number;
  pendingOrders: number;
}

export interface CategorySales {
  category: string;
  slug: string;
  revenue: number;
  orders: number;
  units: number;
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_email?: string;
}

export interface TopProduct {
  name: string;
  slug: string;
  revenue: number;
  units: number;
  category: string;
}

export async function fetchDashboardStats(supabase: SupabaseClient, range: TimeRange): Promise<DashboardStats> {
  const dateRange = getDateRange(range);

  // Orders query
  let ordersQuery = supabase.from('orders').select('total_amount, created_at, status', { count: 'exact' }).eq('payment_status', 'paid');
  let prevOrdersQuery = supabase.from('orders').select('total_amount', { count: 'exact' }).eq('payment_status', 'paid');

  if (dateRange) {
    ordersQuery = ordersQuery.gte('created_at', dateRange.from);
    prevOrdersQuery = prevOrdersQuery.gte('created_at', dateRange.prev_from).lt('created_at', dateRange.prev_to);
  }

  const [{ data: orders, count: orderCount }, { data: prevOrders, count: prevOrderCount }] = await Promise.all([
    ordersQuery,
    prevOrdersQuery
  ]);

  const totalRevenue = orders?.reduce((s, o) => s + (o.total_amount || 0), 0) ?? 0;
  const prevRevenue = prevOrders?.reduce((s, o) => s + (o.total_amount || 0), 0) ?? 0;

  // Customers
  let customersQ = supabase.from('profiles').select('created_at', { count: 'exact' });
  let prevCustomersQ = supabase.from('profiles').select('created_at', { count: 'exact' });
  if (dateRange) {
    customersQ = customersQ.gte('created_at', dateRange.from);
    prevCustomersQ = prevCustomersQ.gte('created_at', dateRange.prev_from).lt('created_at', dateRange.prev_to);
  }
  const [{ count: customerCount }, { count: prevCustomerCount }] = await Promise.all([customersQ, prevCustomersQ]);

  // Products & pending
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'processing']);

  return {
    totalRevenue,
    prevRevenue,
    totalOrders: orderCount ?? 0,
    prevOrders: prevOrderCount ?? 0,
    totalCustomers: customerCount ?? 0,
    prevCustomers: prevCustomerCount ?? 0,
    totalProducts: productCount ?? 0,
    pendingOrders: pendingCount ?? 0,
  };
}

export async function fetchCategorySales(supabase: SupabaseClient, range: TimeRange): Promise<CategorySales[]> {
  const dateRange = getDateRange(range);

  // Get all categories
  const { data: categories } = await supabase.from('categories').select('id, name, slug');
  if (!categories?.length) return [];

  const results: CategorySales[] = [];

  for (const cat of categories) {
    // Get products for this category
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', cat.id);

    if (!products?.length) {
      results.push({ category: cat.name, slug: cat.slug, revenue: 0, orders: 0, units: 0 });
      continue;
    }

    const productIds = products.map(p => p.id);

    // Get order items for these products
    let orderItemsQuery = supabase
      .from('order_items')
      .select('quantity, price_at_purchase, order_id, orders!inner(created_at, payment_status)')
      .in('product_id', productIds)
      .eq('orders.payment_status', 'paid');

    // Apply date filter via join
    if (dateRange) {
      orderItemsQuery = orderItemsQuery.gte('orders.created_at', dateRange.from);
    }

    const { data: items } = await orderItemsQuery;

    const revenue = items?.reduce((s, i) => s + (i.price_at_purchase * i.quantity), 0) ?? 0;
    const units = items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;
    const uniqueOrders = new Set(items?.map(i => i.order_id)).size;

    results.push({
      category: cat.name,
      slug: cat.slug,
      revenue,
      orders: uniqueOrders,
      units,
    });
  }

  return results.sort((a, b) => b.revenue - a.revenue);
}

export async function fetchSalesTrend(supabase: SupabaseClient, range: TimeRange): Promise<SalesTrendPoint[]> {
  const days = range === 'today' ? 1 : range === 'week' ? 7 : range === 'month' ? 30 : range === 'year' ? 365 : 90;
  const from = new Date(); from.setDate(from.getDate() - days);

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('payment_status', 'paid')
    .gte('created_at', from.toISOString())
    .order('created_at', { ascending: true });

  if (!orders?.length) return [];

  // Group by date
  const grouped: Record<string, { revenue: number; orders: number }> = {};

  for (const order of orders) {
    const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    if (!grouped[date]) grouped[date] = { revenue: 0, orders: 0 };
    grouped[date].revenue += order.total_amount || 0;
    grouped[date].orders += 1;
  }

  return Object.entries(grouped).map(([date, v]) => ({ date, ...v }));
}

export async function fetchRecentOrders(supabase: SupabaseClient): Promise<RecentOrder[]> {
  const { data } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at, profiles(email)')
    .order('created_at', { ascending: false })
    .limit(6);

  if (!data) return [];

  return data.map(o => ({
    id: o.id,
    total_amount: o.total_amount,
    status: o.status,
    created_at: o.created_at,
    user_email: (o.profiles as any)?.email,
  }));
}

export async function fetchTopProducts(supabase: SupabaseClient, range: TimeRange): Promise<TopProduct[]> {
  const dateRange = getDateRange(range);

  let query = supabase
    .from('order_items')
    .select('quantity, price_at_purchase, products(name, slug, categories(name)), orders!inner(created_at, payment_status)')
    .eq('orders.payment_status', 'paid');

  if (dateRange) query = query.gte('orders.created_at', dateRange.from);

  const { data: items } = await query;
  if (!items?.length) return [];

  const map: Record<string, TopProduct> = {};
  for (const item of items) {
    const prod = item.products as any;
    if (!prod) continue;
    const slug = prod.slug;
    if (!map[slug]) {
      map[slug] = { name: prod.name, slug, revenue: 0, units: 0, category: prod.categories?.name || '—' };
    }
    map[slug].revenue += item.price_at_purchase * item.quantity;
    map[slug].units += item.quantity;
  }

  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}

export function pctChange(current: number, prev: number): { value: string; isUp: boolean } {
  if (prev === 0 && current === 0) return { value: '0%', isUp: true };
  if (prev === 0) return { value: '+100%', isUp: true };
  const diff = ((current - prev) / prev) * 100;
  return { value: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`, isUp: diff >= 0 };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}
