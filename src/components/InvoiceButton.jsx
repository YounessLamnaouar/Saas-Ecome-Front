import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';

export default function InvoiceButton({ order, admin = false, className = '' }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const download = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const path = admin ? `/admin/orders/${order.id}/invoice` : `/my-orders/${encodeURIComponent(order.code)}/invoice`;
      const blob = await apiClient.getBlob(path);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order.code.replace(/[^a-zA-Z0-9-]/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      toast.error(t('invoice.error'));
    } finally {
      setBusy(false);
    }
  };
  return <Button variant="outline" className={className} disabled={busy} onClick={download} aria-busy={busy}>
    {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
    {t(busy ? 'invoice.generating' : 'invoice.download')}
  </Button>;
}
