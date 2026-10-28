import { useTranslation } from 'react-i18next';
import { PackageCheck, Star } from 'lucide-react';
import { useUserAuth } from '@/context/UserAuthContext';
import ProductReviews from './ProductReviews';

export default function OrderReviews({ order }) {
  const { t } = useTranslation();
  const { isLoggedIn } = useUserAuth();
  if (order.status !== 'livre') return null;
  const products = [...new Map((order.items || []).map((item) => [item.product_id || `deleted-${item.id}`, item])).values()];
  return <section id="order-reviews" className="scroll-mt-24 space-y-5" aria-labelledby="order-reviews-title">
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
      <h2 id="order-reviews-title" className="flex items-center gap-2 text-lg font-bold"><PackageCheck size={22} />{t('orderReviews.title')}</h2>
      <p className="mt-2 text-sm">{t(isLoggedIn ? 'orderReviews.description' : 'orderReviews.signIn')}</p>
    </div>
    <div className="grid gap-5 md:grid-cols-2">{products.map((item) => <article key={item.product_id || item.id} className="min-w-0 rounded-2xl border bg-card p-5 text-card-foreground">
      <h3 className="mb-4 flex items-start gap-2 font-semibold"><Star size={18} className="mt-0.5 shrink-0 text-amber-500" /><span className="break-words">{item.name}</span></h3>
      {item.product_id ? <ProductReviews productId={item.product_id} compact /> : <p className="text-sm text-muted-foreground">{t('orderReviews.unavailable')}</p>}
    </article>)}</div>
  </section>;
}
