import React, { useState } from "react";
import { Sparkles, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollections } from "@/hooks/useCollections";

export default function Collections() {
  const { data: collections, isLoading } = useCollections();
  const [activeCollection, setActiveCollection] = useState(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  const items = collections || [];
  const selected = activeCollection ? items.find((c) => c.slug === activeCollection) : null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 flex items-center gap-1.5">
        <Sparkles size={14} /> Curated collections fetched from the Laravel API.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((col) => (
          <button key={col.id || col.slug} onClick={() => setActiveCollection(col.slug === activeCollection ? null : col.slug)} className="text-left">
            <Card className={activeCollection === col.slug ? "ring-2 ring-gray-900" : ""}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize mb-1">{col.name}</h3>
                  <p className="text-sm text-gray-500">{col.products_count ?? col.products?.length ?? 0} products</p>
                </div>
                {col.is_featured && <Badge variant="secondary">Featured</Badge>}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
            {selected.is_featured && <Badge variant="success">Featured Collection</Badge>}
          </div>
          <p className="text-sm text-gray-600">{selected.description || "No description provided."}</p>
          {selected.products && selected.products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-3">
              {selected.products.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-3">
                    <img src={p.thumbnail || p.image} alt={p.title || p.name} className="h-24 w-full object-cover rounded-lg bg-gray-100 mb-2" />
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.title || p.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-semibold text-gray-900">${Number(p.price).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 pt-2 flex items-center gap-1">
              <Package size={14} /> Click on items or update products to assign to this collection.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
