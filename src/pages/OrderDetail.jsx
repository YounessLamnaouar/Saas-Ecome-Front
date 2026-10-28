import i18n from "@/i18n";
import InvoiceButton from '@/components/InvoiceButton';
import OrderReviews from '@/components/OrderReviews';
import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
import React, { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";
import { useMyOrder, useTrackOrder } from "@/hooks/useOrders";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderStatusStepper from "@/components/OrderStatusStepper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, MapPin, Package, AlertCircle, Loader2, Search } from "lucide-react";

export default function OrderDetail() {
 const { t: tr } = useTranslationPreferences();

  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const phoneParam = searchParams.get("phone") || "";
  const { isLoggedIn } = useUserAuth();

  const [phone, setPhone] = useState(phoneParam);
  const [activePhone, setActivePhone] = useState(phoneParam);

  // Authenticated user query
  const myOrderQuery = useMyOrder(isLoggedIn ? code : null);

  // Unauthenticated public tracking query
  const trackQuery = useTrackOrder(
    { code, phone: activePhone },
    { enabled: !isLoggedIn && Boolean(code && activePhone) }
  );

  const order = isLoggedIn ? myOrderQuery.data : trackQuery.data;
  const isLoading = isLoggedIn ? myOrderQuery.isLoading : trackQuery.isLoading;
  const isError = isLoggedIn ? myOrderQuery.isError : trackQuery.isError;
  const error = isLoggedIn ? myOrderQuery.error : trackQuery.error;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.trim()) {
      setActivePhone(phone.trim());
    }
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="mb-8">
          <Link
            to={isLoggedIn ? "/my-orders" : "/"}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" /> <T>{isLoggedIn ? "Back to My Orders" : "Back to Store"}</T>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono"><bdi dir="ltr">{code}</bdi></h1>
                {order && <OrderStatusBadge status={order.status} showIcon />}
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-1"> <T>Order tracking and status timeline.</T> </p>
            </div>
            {order && isLoggedIn && <InvoiceButton order={order} />}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-20 text-center">
            <Loader2 size={32} className="animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm"> <T>Loading order details...</T> </p>
          </div>
        )}

        {/* Phone prompt for guest tracking if not yet provided */}
        {!isLoggedIn && !order && !isLoading && (
          <Card className="mb-8 shadow-sm border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-base font-bold text-gray-900 mb-2"> <T>Security Verification</T> </h2>
              <p className="text-xs text-gray-600 mb-4"> <T>Please enter the phone number associated with order</T> <span className="font-mono font-semibold"><bdi dir="ltr">{code}</bdi></span> <T>to view its progress.</T> </p>
              <form onSubmit={handlePhoneSubmit} className="flex gap-2 max-w-md">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={tr("e.g. 0612345678")}
                  required
                />
                <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer">
                  <Search size={14} className="me-1" /> <T>Verify</T> </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error state */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 mb-8">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold"> <T>Unable to load order</T> </p>
              <p className="text-xs text-red-600 mt-0.5">
                {error?.payload?.message ||
                  "The order code or phone number does not match our records. Please verify your details."}
              </p>
            </div>
          </div>
        )}

        {/* Order Display */}
        {order && (
          <div className="space-y-6">
            <OrderReviews order={order} />
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Calendar size={13} /> <T>Placed on</T> <T>{" "}</T>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString(i18n.resolvedLanguage, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : <T>Recently</T>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5"> <T>Payment Method: Cash on Delivery</T> </p>
                  </div>
                  <div className="text-start sm:text-end">
                    <p className="text-xs text-gray-500"> <T>Order Total</T> </p>
                    <p className="text-2xl font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>

                {/* Status Timeline Stepper */}
                <OrderStatusStepper currentStatus={order.status} histories={order.history || []} />

                {/* Delivery and Items */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-500" /> <T>Customer Information</T> </h3>
                    <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-1.5 text-gray-600 border border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{order.customer?.name}</p>
                      <p><bdi dir="ltr">{order.customer?.phone}</bdi></p>
                      <p>{order.customer?.address}</p>
                      <p>{order.customer?.city}</p>
                      {order.customer?.notes && (
                        <p className="italic text-gray-500 pt-2 border-t border-gray-200/60 mt-2"> <T>Note: "</T> {order.customer.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                      <Package size={16} className="text-gray-500" /> <T>Items in Order (</T> {(order.items || []).length})
                    </h3>
                    <div className="space-y-2">
                      {(order.items || []).map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-gray-500"> <T>Quantity:</T> {item.qty}</p>
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
