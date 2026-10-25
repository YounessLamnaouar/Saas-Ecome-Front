import React, { useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, Clock, ShieldCheck, Truck, PackageCheck, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderStatusStepper from "@/components/OrderStatusStepper";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "en_attente", label: "En attente (Pending)" },
  { value: "confirmee", label: "Confirmée (Confirmed)" },
  { value: "en_cours_de_livraison", label: "En livraison (Out for delivery)" },
  { value: "livre", label: "Livrée (Delivered)" },
];

const ORDER_RANKS = {
  en_attente: 1,
  confirmee: 2,
  en_cours_de_livraison: 3,
  livre: 4,
};

export default function OrdersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading, isFetching } = useAdminOrders({
    page,
    perPage: 10,
    status: status === "all" ? undefined : status,
    search: search.trim() || undefined,
  });

  const updateStatus = useUpdateOrderStatus();

  const orders = data?.orders || [];
  const meta = data?.meta;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      toast.success(`Order status updated to "${newStatus}".`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      toast.error(err.payload?.message || err.message || "Failed to update order status.");
    }
  };

  const getAvailableNextStatuses = (currentStatus) => {
    const currentRank = ORDER_RANKS[currentStatus] || 1;
    return [
      { value: "confirmee", label: "Confirmée", rank: 2 },
      { value: "en_cours_de_livraison", label: "En cours de livraison", rank: 3 },
      { value: "livre", label: "Livrée", rank: 4 },
    ].filter((s) => s.rank > currentRank);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track and process customer orders and deliveries.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by code, customer name, phone..."
              className="pl-9"
            />
          </div>

          <div className="w-full sm:w-64">
            <Select
              value={status}
              onValueChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Order Code</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700">City</TableHead>
                <TableHead className="font-semibold text-gray-700">Total</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                    No orders found matching the filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <TableCell className="font-mono font-semibold text-gray-900 text-xs">
                      {order.code}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-900">{order.customer?.name}</p>
                        <p className="text-gray-400 font-mono text-[11px]">{order.customer?.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {order.customer?.city || "—"}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} showIcon />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 px-2.5 text-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye size={13} /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50/50">
            <span>
              Showing page {meta.current_page} of {meta.last_page} ({meta.total} total)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 cursor-pointer"
              >
                <ChevronLeft size={14} className="mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 cursor-pointer"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-6">
                  <div>
                    <DialogTitle className="font-mono text-xl">{selectedOrder.code}</DialogTitle>
                    <DialogDescription>
                      Placed on{" "}
                      {selectedOrder.created_at
                        ? new Date(selectedOrder.created_at).toLocaleString()
                        : "—"}
                    </DialogDescription>
                  </div>
                  <OrderStatusBadge status={selectedOrder.status} showIcon />
                </div>
              </DialogHeader>

              {/* Status Update Control */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Change Order Status</p>
                    <p className="text-[11px] text-gray-500">
                      Transitions are forward-only according to store policy.
                    </p>
                  </div>
                  {getAvailableNextStatuses(selectedOrder.status).length > 0 ? (
                    <Select
                      onValueChange={(val) => handleStatusChange(selectedOrder.id, val)}
                      disabled={updateStatus.isPending}
                    >
                      <SelectTrigger className="w-48 h-8 text-xs bg-white cursor-pointer">
                        <SelectValue placeholder="Advance status to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableNextStatuses(selectedOrder.status).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="cursor-pointer text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-lg">
                      Order fully completed (Livrée)
                    </span>
                  )}
                </div>
              </div>

              {/* Visual stepper */}
              <OrderStatusStepper
                currentStatus={selectedOrder.status}
                histories={selectedOrder.history || []}
              />

              {/* Customer info & delivery details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-1">
                  <p className="font-bold text-gray-900 text-sm mb-2">Delivery Information</p>
                  <p><span className="text-gray-400">Name:</span> {selectedOrder.customer?.name}</p>
                  <p><span className="text-gray-400">Phone:</span> {selectedOrder.customer?.phone}</p>
                  <p><span className="text-gray-400">Address:</span> {selectedOrder.customer?.address}</p>
                  <p><span className="text-gray-400">City:</span> {selectedOrder.customer?.city}</p>
                  {selectedOrder.customer?.notes && (
                    <p className="pt-1 text-gray-500 italic">
                      <span className="not-italic text-gray-400">Notes:</span> {selectedOrder.customer.notes}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-2">
                  <p className="font-bold text-gray-900 text-sm mb-2">Order Summary</p>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-semibold text-gray-900">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Registered Customer:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.user ? selectedOrder.user.name : "Guest Order"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-sm">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">
                      ${Number(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-xs font-bold text-gray-900 mb-2">
                  Items Snapshot ({(selectedOrder.items || []).length})
                </p>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-xs">Product</TableHead>
                        <TableHead className="text-xs text-right">Unit Price</TableHead>
                        <TableHead className="text-xs text-right">Qty</TableHead>
                        <TableHead className="text-xs text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(selectedOrder.items || []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs font-medium text-gray-900">
                            {item.name}
                            {item.color && <span className="text-gray-400 ml-1">({item.color})</span>}
                          </TableCell>
                          <TableCell className="text-xs text-right text-gray-600">
                            ${Number(item.price).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs text-right font-semibold text-gray-900">
                            {item.qty}
                          </TableCell>
                          <TableCell className="text-xs text-right font-bold text-gray-900">
                            ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Status History Timeline */}
              {selectedOrder.history && selectedOrder.history.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-2">Audit History</p>
                  <div className="space-y-2">
                    {selectedOrder.history.map((h, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={h.status} />
                          {h.changed_by && (
                            <span className="text-gray-500 text-[11px]">by {h.changed_by}</span>
                          )}
                        </div>
                        <span className="text-gray-400 font-mono text-[11px]">
                          {h.created_at ? new Date(h.created_at).toLocaleString() : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
