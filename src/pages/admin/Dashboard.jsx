import React from "react";
import { Package, Tags, Sparkles, AlertTriangle, Star, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats } from "@/hooks/useDashboard";

function KpiCard({ icon: Icon, label, value, hint }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
        <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0">
          <Icon size={18} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-gray-500">Couldn't load dashboard stats. Check VITE_API_BASE_URL and try again.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard icon={Package} label="Total products" value={data.totalProducts.toLocaleString()} />
        <KpiCard icon={Tags} label="Categories" value={data.totalCategories} />
        <KpiCard icon={Sparkles} label="Collections (tags)" value={data.totalCollections} hint={`from last ${data.sampleSize} products`} />
        <KpiCard icon={AlertTriangle} label="Low stock (≤20 units)" value={data.lowStock} hint={`of last ${data.sampleSize} products`} />
        <KpiCard icon={Star} label="Average rating" value={data.avgRating.toFixed(1)} hint="out of 5" />
        <KpiCard
          icon={Wallet}
          label="Inventory value"
          value={`$${data.inventoryValueSample.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          hint={`sample of ${data.sampleSize} products`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Products per category</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.productsPerCategory} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }} />
                <Bar dataKey="count" fill="#111827" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top collections</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.topTags.length === 0 && <p className="text-sm text-gray-400">No tags found in the sample.</p>}
            {data.topTags.map(({ tag, count }) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag} · {count}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
