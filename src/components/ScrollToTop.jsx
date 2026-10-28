import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 350);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  if (!visible) return null;
  return <button
    type="button"
    aria-label={t('common.scrollToTop')}
    title={t('common.scrollToTop')}
    onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
    className="fixed bottom-6 end-6 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-lg transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
  ><ArrowUp size={22} aria-hidden="true" /></button>;
}
