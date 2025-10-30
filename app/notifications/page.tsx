"use client";

import { useEffect, useMemo, useState } from "react";
import API from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCcw, ListChecks, Folder, Info } from "lucide-react";

interface NotificationItem {
  id: number;
  userId: number | null;
  type: "task" | "project" | "system" | string;
  title: string;
  body: string;
  entity?: { kind: "task" | "project" | string; id: number } | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);
  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const { items, total } = await API.getNotifications({ unread: unreadOnly, limit, offset });
      setItems(items);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly, limit, offset]);

  const markOne = async (id: number) => {
    await API.markNotificationRead(id);
    await fetchPage();
  };

  const markAll = async () => {
    await API.markAllNotificationsRead();
    await fetchPage();
  };

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "task":
        return <ListChecks className="w-4 h-4 text-blue-400" />;
      case "project":
        return <Folder className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-300" />;
    }
  };

  const relativeTime = (iso: string) => {
    const d = new Date(iso).getTime();
    const now = Date.now();
    const diffSec = Math.round((d - now) / 1000);
    const abs = Math.abs(diffSec);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (abs < 60) return rtf.format(diffSec, "second");
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
    const diffHour = Math.round(diffMin / 60);
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
    const diffDay = Math.round(diffHour / 24);
    if (Math.abs(diffDay) < 7) return rtf.format(diffDay, "day");
    const diffWeek = Math.round(diffDay / 7);
    if (Math.abs(diffWeek) < 5) return rtf.format(diffWeek, "week");
    const diffMonth = Math.round(diffDay / 30);
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month");
    const diffYear = Math.round(diffDay / 365);
    return rtf.format(diffYear, "year");
  };

  const typeClasses = (t: string) => {
    switch (t) {
      case "task":
        return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-200 border-blue-500/30";
      case "project":
        return "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-200 border-emerald-500/30";
      default:
        return "bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-200 border-slate-500/30";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-white">Historial de notificaciones</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Consulta y gestiona tus notificaciones. Resalta no leídas.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={unreadOnly ? "default" : "outline"}
                onClick={() => { setPage(1); setUnreadOnly(!unreadOnly); }}
              >
                {unreadOnly ? "Viendo: No leídas" : "Viendo: Todas"}
              </Button>
              <Button variant="secondary" onClick={fetchPage} disabled={loading} className="gap-2">
                <RefreshCcw className="w-4 h-4" /> Refrescar
              </Button>
              <Button onClick={markAll} variant="outline">Marcar todas como leídas</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Cargando…
            </div>
          ) : items.length === 0 ? (
            <div className="text-muted-foreground py-8">No hay notificaciones.</div>
          ) : (
            <ul className="rounded-md overflow-hidden">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`p-4 transition-colors border-b border-white/10 last:border-0 hover:bg-white/5 ${
                    !n.read ? "border-l-4 border-l-blue-500/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <TypeIcon type={n.type} />
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded border capitalize ${typeClasses(n.type)}`}>{n.type}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className={`font-medium truncate ${!n.read ? "text-white" : ""}`}>{n.title}</div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap" title={new Date(n.createdAt).toLocaleString()}>
                          {relativeTime(n.createdAt)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{n.body}</div>
                      <div className="mt-2 flex items-center gap-2">
                        {!n.read && (
                          <Button size="sm" variant="outline" onClick={() => markOne(n.id)}>Marcar leído</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">Total: {total}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <div className="text-sm">Página {page} de {pages}</div>
              <Button variant="outline" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>Siguiente</Button>
              <Separator orientation="vertical" className="h-6" />
              <select
                className="bg-transparent border border-border rounded px-2 py-1 text-sm"
                value={limit}
                onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
