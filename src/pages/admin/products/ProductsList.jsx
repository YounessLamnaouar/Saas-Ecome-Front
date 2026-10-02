import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

function StockBadge({ stock }) {
  if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>;
  if (stock <= 20) return <Badge variant="warning">Low · {stock}</Badge>;
  return <Badge variant="success">{stock} in stock</Badge>;
}

export default function ProductsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data, isLoading, isFetching } = useProducts({ page, perPage: 10, search: search || undefined, category: category === "all" ? undefined : category });
  const { data: categories } = useCategories();
  const deleteProduct = useDeleteProduct();

  const products = data?.products || [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative sm:max-w-xs w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(categories || []).map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link to="/admin/products/new"><Plus size={16} /> Add product</Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10" /></TableCell></TableRow>
              ))}

            {!isLoading && products.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-gray-400">No products match your filters.</TableCell></TableRow>
            )}

            {!isLoading && products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand || p.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{p.categoryName}</Badge></TableCell>
                <TableCell className="font-medium text-gray-900">${p.price.toFixed(2)}</TableCell>
                <TableCell><StockBadge stock={p.stock} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/products/${p.id}/edit`}><Pencil size={14} className="mr-2" /> Edit</Link>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                            <Trash2 size={14} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{p.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct.mutate(p.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>Page {meta.page} of {meta.total_pages} · {meta.total} products</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1 || isFetching} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={14} /> Prev
            </Button>
            <Button variant="outline" size="sm" disabled={page >= meta.total_pages || isFetching} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
