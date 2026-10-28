import i18n from "@/i18n";
import InvoiceButton from '@/components/InvoiceButton';
import { useTranslation } from 'react-i18next';
import { T } from '@/context/Preferences';
import React from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";
import { useMyOrders } from "@/hooks/useOrders";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, ChevronRight, ShoppingBag, Loader2 } from "lucide-react";

export default function MyOrders() {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useUserAuth();
  const { data: orders, isLoading, isError } = useMyOrders();

  if (!isLoggedIn) {
    return (
      <section className="py-24 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2"> <T>My Orders</T> </h1>
            <p className="text-gray-500 text-sm mb-6"> <T>Please sign in with your customer account to view your order history.</T> </p>
            <div className="space-y-3">
              <Link
                to="/track-order"
                className="block w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
              > <T>Track Guest Order</T> </Link>
              <Link
                to="/"
                className="block w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
              > <T>Back to Store</T> </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900"> <T>My Orders</T> </h1>
            <p className="text-gray-500 text-sm mt-1"> <T>Welcome back,</T> {user?.name} <T>. Here is your order history.</T> </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm self-start sm:self-auto"
          >
            <ShoppingBag size={14} /> <T>Shop More</T> </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 size={32} className="animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm"> <T>Loading your orders...</T> </p>
          </div>
        ) : isError ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm"> <T>Failed to load order history. Please try again later.</T> </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Package size={48} className="text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-1"> <T>No Orders Yet</T> </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-sm mx-auto"> <T>You haven't placed any orders yet. Discover our latest collections and start shopping!</T> </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
            > <T>Start Shopping</T> </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-sm border-gray-200 hover:border-gray-300 transition-all">
                <CardContent className="p-5">
                  {order.status === 'livre' && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"><span>{t('orderReviews.title')}</span><Link to={`/orders/${order.code}`} className="font-semibold underline underline-offset-4">{t('orderReviews.action')}</Link></div>}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-gray-900 text-base"><bdi dir="ltr">{order.code}</bdi></span>
                        <OrderStatusBadge status={order.status} showIcon />
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Calendar size={13} />
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(i18n.resolvedLanguage, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : <T>Recently</T>}
                        <span>•</span>
                        <span>{(order.items || []).length} <T>item(s)</T> </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <InvoiceButton order={order} />
                      <div className="sm:text-end">
                        <p className="text-xs text-gray-400"> <T>Total</T> </p>
                        <p className="text-lg font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                      </div>
                      <Link
                        to={`/orders/${order.code}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-900 text-white px-3.5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      > <T>Details</T> <ChevronRight size={14} className="rtl:rotate-180" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
