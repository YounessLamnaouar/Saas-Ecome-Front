import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package, ShoppingBag, Wallet, Star, RefreshCw, ArrowUpRight, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useDashboardStats();
  const money = (value) => new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const status = (value) => t(`commerce.status.${value}`);
  if (isLoading) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-32" />)}</div>;
  if (!data) return <div className="space-y-4"><p role="alert">{t('commerce.loadError')}</p><Button onClick={() => refetch()}>{t('commerce.refresh')}</Button></div>;
  const cards = [
    [ShoppingBag, t('commerce.pendingOrders'), data.pendingOrders, t('commerce.totalOrders', { count: data.totalOrders })],
    [Wallet, t('commerce.revenue'), money(data.deliveredRevenue), t('commerce.deliveredOnly')],
    [Package, t('commerce.products'), data.totalProducts, t('commerce.catalogCounts', { categories: data.totalCategories, collections: data.totalCollections })],
    [Star, t('commerce.rating'), data.reviewCount ? `${data.avgRating.toFixed(1)} / 5` : '—', t('commerce.reviewCount', { count: data.reviewCount })],
  ];
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h2 className="text-2xl font-bold tracking-tight">{t('commerce.overview')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('commerce.updated', { time: new Date(dataUpdatedAt).toLocaleTimeString(i18n.resolvedLanguage) })}</p></div>
      <Button variant="outline" disabled={isFetching} onClick={() => refetch()}><RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />{t('commerce.refresh')}</Button>
    </div>
    {isError && <p role="alert" className="text-sm text-destructive">{t('commerce.staleError')}</p>}
    {data.pendingEmails > 0 && <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle className="me-2 inline" size={17} />{t('commerce.pendingEmails', { count: data.pendingEmails })}{data.emailPermissionDenied && <p className="mt-2 font-medium">{t('commerce.emailPermissionDenied')}</p>}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([Icon, label, value, hint]) => <Card key={label}><CardContent className="p-5"><div className="flex justify-between gap-3 text-muted-foreground"><span className="text-sm">{label}</span><Icon size={18} /></div><p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs text-muted-foreground">{hint}</p></CardContent></Card>)}</div>
    <div className="grid gap-5 xl:grid-cols-3">
      <Card className="xl:col-span-2"><CardHeader><CardTitle>{t('commerce.orderTrend')}</CardTitle><p className="text-sm text-muted-foreground">{t('commerce.last30')}</p></CardHeader><CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%"><AreaChart data={data.trend} margin={{ left: -20, right: 10 }}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="date" minTickGap={36} tickFormatter={(date) => new Date(`${date}T12:00:00`).toLocaleDateString(i18n.resolvedLanguage, { day: 'numeric', month: 'short' })} tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: 12, color: 'var(--foreground)' }} /><Area name={t('commerce.orders')} dataKey="orders" type="monotone" stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.08} strokeWidth={2} /></AreaChart></ResponsiveContainer>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>{t('commerce.fulfilment')}</CardTitle></CardHeader><CardContent className="space-y-5">{['en_attente','confirmee','en_cours_de_livraison','livre'].map((key) => { const count = Number(data.orderStatuses.find((s) => s.status === key)?.count || 0); return <div key={key}><div className="mb-2 flex justify-between text-sm"><span>{status(key)}</span><strong>{count}</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${data.totalOrders ? count / data.totalOrders * 100 : 0}%` }} /></div></div>; })}<p className="border-t pt-4 text-xs text-muted-foreground">{t('commerce.openValue')}: {money(data.openOrderValue)}</p></CardContent></Card>
    </div>
    <div className="grid gap-5 xl:grid-cols-3">
      <Card className="xl:col-span-2"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t('commerce.recentOrders')}</CardTitle><Link to="/admin/orders" className="text-xs underline">{t('commerce.viewAll')}</Link></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-start text-sm"><thead><tr className="border-b text-muted-foreground">{['order','customer','statusLabel','total'].map((key) => <th key={key} className="pb-3 text-start font-medium">{t(`commerce.${key}`)}</th>)}</tr></thead><tbody>{data.recentOrders.map((order) => <tr key={order.id} className="border-b last:border-0"><td className="py-4"><Link to={`/admin/orders?search=${encodeURIComponent(order.code)}`} className="font-medium underline underline-offset-4">{order.code}</Link></td><td className="px-3">{order.customer_name}</td><td className="px-3"><span className="whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-xs">{status(order.status)}</span></td><td className="whitespace-nowrap">{money(order.total)}</td></tr>)}</tbody></table></div>{!data.recentOrders.length && <p className="py-8 text-center text-muted-foreground">{t('commerce.noOrders')}</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle>{t('commerce.inventory')}</CardTitle><p className="text-sm text-muted-foreground">{t('commerce.stockCounts', { low: data.lowStock, out: data.outOfStock })}</p></CardHeader><CardContent><div className="space-y-4">{data.stockAlerts.map((p) => <Link key={p.id} to={`/admin/products/${p.id}/edit`} className="flex items-center gap-3"><img src={p.thumbnail} alt="" className="h-10 w-10 rounded-md bg-muted object-contain" /><span className="min-w-0 flex-1 truncate text-sm">{p.title}</span><span className="text-sm font-semibold">{p.stock}</span><ArrowUpRight size={14} /></Link>)}{!data.stockAlerts.length && <p className="text-sm text-muted-foreground">{t('commerce.healthyStock')}</p>}</div><div className="mt-6 border-t pt-4"><p className="text-xs text-muted-foreground">{t('commerce.inventoryValue')}</p><p className="mt-1 text-xl font-semibold">{money(data.inventoryValue)}</p></div></CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle>{t('commerce.collections')}</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{data.collections.map((c) => <Link key={c.id} to={`/shop?collection=${encodeURIComponent(c.slug)}`} className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted"><span className="text-sm font-medium">{c.name}</span><span className="text-xs text-muted-foreground">{c.products_count} <ArrowUpRight className="ms-2 inline" size={14} /></span></Link>)}</CardContent></Card>
  </div>;
}
