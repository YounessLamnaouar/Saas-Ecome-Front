import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTrackOrder } from "@/hooks/useOrders";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderStatusStepper from "@/components/OrderStatusStepper";
import { Search, Package, MapPin, Calendar, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function TrackOrder() {
 const { t: tr } = useTranslationPreferences();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [code, setCode] = useState(initialCode);
  const [phone, setPhone] = useState(initialPhone);
  const [submittedQuery, setSubmittedQuery] = useState({
    code: initialCode,
    phone: initialPhone,
  });

  const {
    data: order,
    isLoading,
    isError,
    error,
    isFetching,
  } = useTrackOrder(
    { code: submittedQuery.code, phone: submittedQuery.phone },
    { enabled: Boolean(submittedQuery.code && submittedQuery.phone) }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !phone.trim()) return;
    setSubmittedQuery({ code: code.trim(), phone: phone.trim() });
    setSearchParams({ code: code.trim(), phone: phone.trim() });
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={16} /> <T>Back to Store</T> </Link>
          <h1 className="text-3xl font-bold text-gray-900"> <T>Track Your Order</T> </h1>
          <p className="text-gray-600 text-sm mt-1"> <T>Enter your order code (e.g. CMD-YYYYMMDD-XXXX) and the phone number used during checkout.</T> </p>
        </div>

        {/* Tracking Search Form */}
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-700"> <T>Order Code</T> </label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={tr("CMD-20261018-XXXX")}
                  required
                  className="font-mono"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-700"> <T>Phone Number</T> </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={tr("e.g. 0612345678 or +212...")}
                  required
                />
              </div>
              <div className="sm:col-span-1 flex items-end">
                <Button
                  type="submit"
                  disabled={isLoading || isFetching}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                >
                  {isFetching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  <span className="ml-1 sm:hidden"> <T>Track</T> </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Error message */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 mb-8">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold"> <T>Order not found</T> </p>
              <p className="text-xs text-red-600 mt-0.5">
                {error?.payload?.message ||
                  "Please verify the order code and phone number. Both must match the records."}
              </p>
            </div>
          </div>
        )}

        {/* Order Details View */}
        {order && (
          <div className="space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-mono font-bold text-gray-900">{order.code}</span>
                      <OrderStatusBadge status={order.status} showIcon />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                      <Calendar size={13} /> <T>Placed on</T> <T>{" "}</T>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recently"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-500"> <T>Total Amount</T> </p>
                    <p className="text-2xl font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                    <span className="text-[11px] text-gray-400"> <T>Cash on Delivery</T> </span>
                  </div>
                </div>

                {/* Status Stepper */}
                <OrderStatusStepper currentStatus={order.status} histories={order.history || []} />

                {/* Delivery details and items */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-500" /> <T>Delivery Address</T> </h3>
                    <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-1 text-gray-600 border border-gray-100">
                      <p className="font-semibold text-gray-900">{order.customer?.name}</p>
                      <p>{order.customer?.phone}</p>
                      <p>{order.customer?.address}</p>
                      <p>{order.customer?.city}</p>
                      {order.customer?.notes && (
                        <p className="italic text-gray-500 pt-1 border-t border-gray-200/60 mt-2"> <T>Note: "</T> {order.customer.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                      <Package size={16} className="text-gray-500" /> <T>Items (</T> {(order.items || []).length})
                    </h3>
                    <div className="space-y-2">
                      {(order.items || []).map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-gray-500"> <T>Qty:</T> {item.qty}</p>
                          </div>
                          <span className="font-bold text-gray-900">
                            ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
