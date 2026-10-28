import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Star, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useUserAuth } from '@/context/UserAuthContext';
import { Button } from '@/components/ui/button';
import UserAuthModal from './UserAuthModal';
import { toast } from 'sonner';

function ReviewEditor({ existing, save, remove, pending }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(existing?.rating || 0);
  const [comment, setComment] = useState(existing?.comment || '');
  return <form onSubmit={(e) => { e.preventDefault(); if (rating) save({ rating, comment }); }} className="rounded-2xl border bg-muted/30 p-5 space-y-4">
    <h3 className="font-semibold">{t(existing ? 'reviews.edit' : 'reviews.write')}</h3>
    <fieldset disabled={pending}><legend className="mb-2 text-sm">{t('reviews.yourRating')}</legend><div className="flex gap-2">{[1,2,3,4,5].map((value) => <label key={value} className="cursor-pointer"><input type="radio" name="review-rating" value={value} checked={rating === value} onChange={() => setRating(value)} className="peer sr-only" required aria-label={t('reviews.stars', { count: value })} /><Star className={`h-8 w-8 rounded peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}`} aria-hidden="true" /></label>)}</div></fieldset>
    <label className="block text-sm">{t('reviews.comment')}<textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={4} disabled={pending} className="mt-2 w-full rounded-xl border bg-background p-3 text-foreground" /></label>
    <div className="flex flex-wrap gap-3"><Button disabled={pending || !rating} type="submit">{t(pending ? 'reviews.saving' : 'reviews.save')}</Button>{existing && <Button type="button" variant="outline" disabled={pending} onClick={remove}>{t('reviews.delete')}</Button>}</div>
  </form>;
}

export default function ProductReviews({ productId }) {
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn } = useUserAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [authOpen, setAuthOpen] = useState(false);
  const reviews = useQuery({ queryKey: ['reviews', productId, page, sort], queryFn: async () => (await apiClient.get(`/products/${productId}/reviews`, { params: { page, sort } })).data });
  const mine = useQuery({ queryKey: ['my-review', productId, user?.id], enabled: Boolean(isLoggedIn), queryFn: async () => (await apiClient.get(`/products/${productId}/my-review`)).data });
  const mutation = useMutation({
    mutationFn: (payload) => payload ? apiClient.put(`/products/${productId}/reviews`, payload) : apiClient.delete(`/products/${productId}/reviews`),
    onSuccess: () => {
      setPage(1);
      for (const key of ['reviews','my-review','product','products','dashboard-stats']) qc.invalidateQueries({ queryKey: [key] });
      toast.success(t('reviews.saved'));
    },
    onError: () => toast.error(t('reviews.error')),
  });
  const data = reviews.data;
  return <section id="customer-reviews" className="mb-16 border-t pt-10">
    <UserAuthModal open={authOpen} onOpenChange={setAuthOpen} />
    <h2 className="mb-7 text-2xl font-bold">{t('reviews.title')}</h2>
    {reviews.isLoading && <p role="status">{t('common.loading')}</p>}
    {reviews.isError && <div role="alert"><p>{t('reviews.loadError')}</p><Button variant="outline" onClick={() => reviews.refetch()}>{t('commerce.refresh')}</Button></div>}
    {data && <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <div className="space-y-6"><div className="rounded-2xl border p-6"><div className="flex items-baseline gap-3"><strong className="text-5xl">{data.count ? data.average.toFixed(1) : '—'}</strong><span className="text-muted-foreground">/ 5</span></div><p className="mt-2 text-sm text-muted-foreground">{t('commerce.reviewCount', { count: data.count })}</p><div className="mt-6 space-y-3">{data.distribution.map((row) => <div key={row.rating} className="flex items-center gap-3 text-xs"><span className="flex items-center gap-1">{row.rating}<Star size={12} aria-hidden="true" /></span><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-amber-400" style={{ width: `${data.count ? row.count / data.count * 100 : 0}%` }} /></div><span className="w-6 text-end">{row.count}</span></div>)}</div></div>
      {!isLoggedIn ? <Button variant="outline" onClick={() => setAuthOpen(true)}>{t('reviews.signIn')}</Button> : mine.isError ? <Button variant="outline" onClick={() => mine.refetch()}>{t('reviews.loadError')}</Button> : mine.isLoading ? <p>{t('common.loading')}</p> : mine.data?.eligible ? <ReviewEditor key={`${user.id}-${mine.data.review?.rating}-${mine.data.review?.comment}`} existing={mine.data.review} pending={mutation.isPending} save={mutation.mutate} remove={() => mutation.mutate(null)} /> : <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">{t('reviews.eligible')}</p>}
      </div>
      <div><div className="mb-5 flex justify-between items-center gap-3"><span className="text-sm text-muted-foreground">{t('reviews.verifiedOnly')}</span><label className="text-sm"><span className="sr-only">{t('reviews.sort')}</span><select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="rounded-full border bg-background px-3 py-2"><option value="newest">{t('reviews.newest')}</option><option value="highest">{t('reviews.highest')}</option><option value="lowest">{t('reviews.lowest')}</option></select></label></div>
      {!data.count && <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">{t('reviews.empty')}</p>}
      {data.reviews.map((review) => <article key={review.id} className="border-b py-5 first:pt-0"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{review.author}</strong><time className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString(i18n.resolvedLanguage)}</time></div><div className="mt-2 flex flex-wrap items-center gap-3"><span className="flex text-amber-400" aria-label={t('reviews.stars', { count: review.rating })}>{[1,2,3,4,5].map((v) => <Star key={v} size={15} fill={v <= review.rating ? 'currentColor' : 'none'} aria-hidden="true" />)}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck size={13} />{t('reviews.verified')}</span></div>{review.comment && <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">{review.comment}</p>}</article>)}
      {data.last_page > 1 && <div className="mt-5 flex items-center justify-between"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t('common.previous')}</Button><span className="text-sm">{page} / {data.last_page}</span><Button variant="outline" disabled={page >= data.last_page} onClick={() => setPage(page + 1)}>{t('common.next')}</Button></div>}
      </div>
    </div>}
  </section>;
}
