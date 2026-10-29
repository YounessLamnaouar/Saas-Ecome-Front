import { useSearchParams } from 'react-router-dom';
import InvoiceButton from '@/components/InvoiceButton';
import i18n from "@/i18n";
import { translate } from '@/lib/translations';
import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

const STATUS_OPTIONS = [
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All Statuses" },
  { value: "en_attente", label: "Pending" },
  { value: "confirmee", label: "Confirmed" },
  { value: "en_cours_de_livraison", label: "Out for delivery" },
  { value: "livre", label: "Delivered" },
];

const ORDER_RANKS = {
  en_attente: 1,
  confirmee: 2,
  en_cours_de_livraison: 3,
  livre: 4,
};

export default function OrdersList() {
 const { t: tr } = useTranslationPreferences();

  const [page, setPage] = useState(1);
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [status, setStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);

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
      toast.success(translate(`Order status updated to "${tr(STATUS_OPTIONS.find(option => option.value === newStatus)?.label || newStatus)}".`));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      setCancelOrderId(null);
    } catch (err) {
      toast.error(translate(err.payload?.message || err.message || "Failed to update order status."));
    }
  };

  const getAvailableNextStatuses = (currentStatus) => {
    if (currentStatus === "cancelled") return [];
    const currentRank = ORDER_RANKS[currentStatus] || 1;
    const nextStatuses = [
      { value: "confirmee", label: "Confirmed", rank: 2 },
      { value: "en_cours_de_livraison", label: "Out for delivery", rank: 3 },
      { value: "livre", label: "Delivered", rank: 4 },
    ].filter((s) => s.rank > currentRank);
    if (currentStatus === "en_attente") {
      nextStatuses.push({ value: "cancelled", label: "Cancelled" });
    }
    return nextStatuses;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900"> <T>Orders Management</T> </h2>
          <p className="text-xs text-gray-500 mt-0.5"> <T>Track and process customer orders and deliveries.</T> </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={tr("Search by code, customer name, phone...")}
              className="ps-9"
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
                <SelectValue placeholder={tr("Filter by status")} />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                    <T>{opt.label}</T>
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
                <TableHead className="font-semibold text-gray-700"> <T>Order Code</T> </TableHead>
                <TableHead className="font-semibold text-gray-700"> <T>Date</T> </TableHead>
                <TableHead className="font-semibold text-gray-700"> <T>Customer</T> </TableHead>
                <TableHead className="font-semibold text-gray-700"> <T>City</T> </TableHead>
                <TableHead className="font-semibold text-gray-700"> <T>Total</T> </TableHead>
                <TableHead className="font-semibold text-gray-700"> <T>Status</T> </TableHead>
                <TableHead className="font-semibold text-gray-700 text-end"> <T>Actions</T> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" /> <T>Loading orders...</T> </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500 text-sm"> <T>No orders found matching the filter criteria.</T> </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <TableCell className="font-mono font-semibold text-gray-900 text-xs">
                      {order.code}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString(i18n.resolvedLanguage) : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-900">{order.customer?.name}</p>
                        <p className="text-gray-400 font-mono text-[11px]"><bdi dir="ltr">{order.customer?.phone}</bdi></p>
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
                    <TableCell className="text-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 px-2.5 text-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye size={13} /> <T>View</T> </Button>
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
            <span> <T>Showing page</T> {meta.current_page} <T>of</T> {meta.last_page} ({meta.total} <T>total)</T> </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 cursor-pointer"
              >
                <ChevronLeft size={14} className="rtl:rotate-180 me-1" /> <T>Previous</T> </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 cursor-pointer"
              > <T>Next</T> <ChevronRight size={14} className="rtl:rotate-180 ms-1" />
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pe-6">
                  <div>
                    <DialogTitle className="font-mono text-xl"><bdi dir="ltr">{selectedOrder.code}</bdi></DialogTitle>
                    <DialogDescription> <T>Placed on</T> <T>{" "}</T>
                      {selectedOrder.created_at
                        ? new Date(selectedOrder.created_at).toLocaleString(i18n.resolvedLanguage)
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
                    <p className="text-xs font-bold text-gray-900"> <T>Change Order Status</T> </p>
                    <p className="text-[11px] text-gray-500"> <T>Transitions are forward-only according to store policy.</T> </p>
                  </div>
                  {getAvailableNextStatuses(selectedOrder.status).length > 0 ? (
                    <Select
                      value=""
                      onValueChange={(val) => val === 'cancelled' ? setCancelOrderId(selectedOrder.id) : handleStatusChange(selectedOrder.id, val)}
                      disabled={updateStatus.isPending}
                    >
                      <SelectTrigger className="w-48 h-8 text-xs cursor-pointer">
                        <SelectValue placeholder={tr("Advance status to...")} />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableNextStatuses(selectedOrder.status).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="cursor-pointer text-xs">
                            <T>{opt.label}</T>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-lg"> <T>{selectedOrder.status === "cancelled" ? "Cancelled" : "Order fully completed (Delivered)"}</T> </span>
                  )}
                </div>
              </div>

              {/* Visual stepper */}
              <InvoiceButton order={selectedOrder} admin />
              <OrderStatusStepper
                currentStatus={selectedOrder.status}
                histories={selectedOrder.history || []}
              />

              {/* Customer info & delivery details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-1">
                  <p className="font-bold text-gray-900 text-sm mb-2"> <T>Delivery Information</T> </p>
                  <p><span className="text-gray-400"> <T>Name:</T> </span> {selectedOrder.customer?.name}</p>
                  <p><span className="text-gray-400"> <T>Phone:</T> </span> {selectedOrder.customer?.phone}</p>
                  <p><span className="text-gray-400"> <T>Address:</T> </span> {selectedOrder.customer?.address}</p>
                  <p><span className="text-gray-400"> <T>City:</T> </span> {selectedOrder.customer?.city}</p>
                  {selectedOrder.customer?.notes && (
                    <p className="pt-1 text-gray-500 italic">
                      <span className="not-italic text-gray-400"> <T>Notes:</T> </span> {selectedOrder.customer.notes}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-2">
                  <p className="font-bold text-gray-900 text-sm mb-2"> <T>Order Summary</T> </p>
                  <div className="flex justify-between">
                    <span className="text-gray-500"> <T>Payment:</T> </span>
                    <span className="font-semibold text-gray-900"> <T>Cash on Delivery</T> </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500"> <T>Registered Customer:</T> </span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.user ? selectedOrder.user.name : <T>Guest Order</T>}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-sm">
                    <span className="font-bold text-gray-900"> <T>Total:</T> </span>
                    <span className="font-bold text-gray-900">
                      ${Number(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-xs font-bold text-gray-900 mb-2"> <T>Items Snapshot (</T> {(selectedOrder.items || []).length})
                </p>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-xs"> <T>Product</T> </TableHead>
                        <TableHead className="text-xs text-end"> <T>Unit Price</T> </TableHead>
                        <TableHead className="text-xs text-end"> <T>Qty</T> </TableHead>
                        <TableHead className="text-xs text-end"> <T>Subtotal</T> </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(selectedOrder.items || []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs font-medium text-gray-900">
                            {item.name}
                            {item.color && <span className="text-gray-400 ms-1">({item.color})</span>}
                          </TableCell>
                          <TableCell className="text-xs text-end text-gray-600">
                            ${Number(item.price).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs text-end font-semibold text-gray-900">
                            {item.qty}
                          </TableCell>
                          <TableCell className="text-xs text-end font-bold text-gray-900">
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
                  <p className="text-xs font-bold text-gray-900 mb-2"> <T>Audit History</T> </p>
                  <div className="space-y-2">
                    {selectedOrder.history.map((h, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={h.status} />
                          {h.changed_by && (
                            <span className="text-gray-500 text-[11px]"> <T>by</T> {h.changed_by}</span>
                          )}
                        </div>
                        <span className="text-gray-400 font-mono text-[11px]">
                          {h.created_at ? new Date(h.created_at).toLocaleString(i18n.resolvedLanguage) : "—"}
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
      <AlertDialog open={cancelOrderId !== null} onOpenChange={(open) => { if (!open && !updateStatus.isPending) setCancelOrderId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><T>Cancel this order?</T></AlertDialogTitle>
            <AlertDialogDescription><T>This cannot be undone. The ordered quantities will be returned to stock.</T></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStatus.isPending}><T>Keep order</T></AlertDialogCancel>
            <AlertDialogAction disabled={updateStatus.isPending} onClick={(event) => { event.preventDefault(); handleStatusChange(cancelOrderId, 'cancelled'); }}>
              {updateStatus.isPending && <Loader2 className="me-2 animate-spin" size={16} />}<T>Confirm cancellation</T>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
