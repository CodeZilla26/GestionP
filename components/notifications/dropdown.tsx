"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, ListChecks, Folder, Info } from "lucide-react";
import { FirebaseAPI } from "@/lib/firebase-api";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NotificationItem {
  id: string;
  userId: number | null;
  type: "task" | "project" | "system" | string;
  title: string;
  body: string;
  entity?: { kind: "task" | "project" | string; id: number } | null;
  read: boolean;
  createdAt: string;
}

interface Props {
  count: number;
  onChanged?: () => void; // to refresh counters in parent
  userId?: number; // optional filter if available
}

export default function NotificationsDropdown({ count, onChanged, userId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalItems, setModalItems] = useState<NotificationItem[]>([]);
  const [modalTotal, setModalTotal] = useState(0);
  const [modalUnreadOnly, setModalUnreadOnly] = useState(false);
  const [modalLimit, setModalLimit] = useState(10);
  const [modalPage, setModalPage] = useState(1);
  const router = useRouter();

  const badgeText = useMemo(() => (count > 99 ? "99+" : String(count)), [count]);

  const fetchLatest = async () => {
    setLoading(true);
    try {
      const list = await FirebaseAPI.getNotifications();
      const normalized = (list ?? []).map((n: any) => ({
        id: String(n.id ?? ""),
        userId: n.userId ?? null,
        type: n.type ?? "system",
        title: n.title ?? "",
        body: n.body ?? "",
        entity: n.entity ?? null,
        read: !!n.read,
        createdAt:
          typeof n.createdAt === "string"
            ? n.createdAt
            : n.createdAt?.toDate
            ? n.createdAt.toDate().toISOString()
            : new Date().toISOString(),
      }));
      const filtered = userId != null ? normalized.filter((n: NotificationItem) => n.userId === userId) : normalized;
      // últimas 10 para dropdown
      const latest = filtered.slice(0, 10);
      setItems(latest);
      setTotal(filtered.length);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  const fetchModalPage = async () => {
    setModalLoading(true);
    try {
      const list = await FirebaseAPI.getNotifications();
      const normalized = (list ?? []).map((n: any) => ({
        id: String(n.id ?? ""),
        userId: n.userId ?? null,
        type: n.type ?? "system",
        title: n.title ?? "",
        body: n.body ?? "",
        entity: n.entity ?? null,
        read: !!n.read,
        createdAt:
          typeof n.createdAt === "string"
            ? n.createdAt
            : n.createdAt?.toDate
            ? n.createdAt.toDate().toISOString()
            : new Date().toISOString(),
      }));
      let filtered: NotificationItem[] = userId != null ? normalized.filter((n: NotificationItem) => n.userId === userId) : normalized;
      if (modalUnreadOnly) filtered = filtered.filter((n) => !n.read);
      const total = filtered.length;
      const start = (modalPage - 1) * modalLimit;
      const pageItems = filtered.slice(start, start + modalLimit);
      setModalItems(pageItems);
      setModalTotal(total);
    } catch {
      // noop
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen) fetchModalPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, modalUnreadOnly, modalLimit, modalPage]);

  useEffect(() => {
    if (open) fetchLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const markAll = async () => {
    try {
      await FirebaseAPI.markAllNotificationsRead(userId);
      onChanged?.();
      await fetchLatest();
    } catch {}
  };

  const markOne = async (id: string) => {
    try {
      await FirebaseAPI.markNotificationRead(id);
      onChanged?.();
      await fetchLatest();
    } catch {}
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
    const diffSec = Math.round((d - now) / 1000); // negative for past
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

  const openEntity = (n: NotificationItem) => {
    if (n.entity?.kind === "task") {
      router.push("/tasks");
    } else if (n.entity?.kind === "project") {
      router.push("/projects");
    }
  };

  const typeColor = (t: string) => {
    switch (t) {
      case "task":
        return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-200 border-blue-500/30";
      case "project":
        return "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-200 border-emerald-500/30";
      default:
        return "bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-200 border-slate-500/30";
    }
  };

  const renderList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cargando…
        </div>
      );
    }
    if (items.length === 0) {
      return <div className="p-6 text-sm text-muted-foreground">No hay notificaciones recientes.</div>;
    }
    return (
      <ul className="max-h-96 overflow-auto">
        {items.map((n) => (
          <li key={n.id} className="p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <TypeIcon type={n.type} />
              </div>
              <div className={`px-2 py-0.5 text-xs rounded border ${typeColor(n.type)}`}>{n.type}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap" title={new Date(n.createdAt).toLocaleString()}>
                    {relativeTime(n.createdAt)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground truncate">{n.body}</div>
                <div className="mt-2 flex items-center gap-2">
                  {n.entity ? (
                    <Button variant="outline" size="sm" onClick={() => openEntity(n)}>Abrir</Button>
                  ) : null}
                  {!n.read ? (
                    <Button variant="ghost" size="sm" onClick={() => markOne(n.id)}>Marcar leído</Button>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-blue-500 text-white text-[10px] leading-none flex items-center justify-center">
            {badgeText}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-medium">Notificaciones</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAll} className="gap-1">
              <CheckCheck className="w-4 h-4" />
              Marcar todas
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setOpen(false);
                setModalOpen(true);
              }}
            >
              Ver todas
            </Button>
          </div>
        </div>
        <Separator />

        {renderList()}
        <div className="px-4 py-2 text-xs text-muted-foreground">Total: {total}</div>
      </PopoverContent>
    </Popover>

    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="max-w-3xl bg-white/5 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Todas las notificaciones</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">Total: {modalTotal}</div>
          <div className="flex items-center gap-2">
            <Button
              variant={modalUnreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => { setModalPage(1); setModalUnreadOnly(!modalUnreadOnly); }}
            >
              {modalUnreadOnly ? "Viendo: No leídas" : "Viendo: Todas"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => fetchModalPage()} className="gap-1">
              <Loader2 className={`w-4 h-4 ${modalLoading ? 'animate-spin' : ''}`} />
              Refrescar
            </Button>
            <Button variant="outline" size="sm" onClick={async () => { await markAll(); await fetchModalPage(); }}>Marcar todas</Button>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-white/10 overflow-hidden">
          {modalLoading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cargando…
            </div>
          ) : modalItems.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No hay notificaciones.</div>
          ) : (
            <ul>
              {modalItems.map((n) => (
                <li key={n.id} className="p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <TypeIcon type={n.type} />
                    </div>
                    <div className={`px-2 py-0.5 text-xs rounded border ${typeColor(n.type)}`}>{n.type}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className={`font-medium truncate ${!n.read ? 'text-white' : ''}`}>{n.title}</div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap" title={new Date(n.createdAt).toLocaleString()}>
                          {relativeTime(n.createdAt)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{n.body}</div>
                      <div className="mt-2">
                        {!n.read && (
                          <Button size="sm" variant="outline" onClick={async () => { await markOne(n.id); await fetchModalPage(); }}>Marcar leído</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between pt-3">
          <div className="text-sm text-muted-foreground">Página {modalPage} de {Math.max(1, Math.ceil(modalTotal / modalLimit))}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={modalPage <= 1} onClick={() => setModalPage((p) => Math.max(1, p - 1))}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={modalPage >= Math.max(1, Math.ceil(modalTotal / modalLimit))} onClick={() => setModalPage((p) => p + 1)}>Siguiente</Button>
            <Separator orientation="vertical" className="h-6" />
            <select
              className="bg-transparent border border-border rounded px-2 py-1 text-sm"
              value={modalLimit}
              onChange={(e) => { setModalPage(1); setModalLimit(Number(e.target.value)); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}
