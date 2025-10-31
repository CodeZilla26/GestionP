'use client';

import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FirebaseAPI } from '@/lib/firebase-api';
import NotificationsDropdown from '@/components/notifications/dropdown';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifs, setUnreadNotifs] = useState<number>(0);

  useEffect(() => {
    let alive = true;
    const fetchCount = async () => {
      try {
        const { count } = await FirebaseAPI.getUnreadNotificationsCount();
        if (alive) setUnreadNotifs(count || 0);
      } catch (e) {}
    };
    fetchCount();
    const id = setInterval(fetchCount, 45000);
    // Listen for immediate changes via BroadcastChannel
    let chan: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        chan = new BroadcastChannel('notifications');
        chan.onmessage = (ev) => {
          if (ev?.data?.type === 'changed') {
            fetchCount();
          }
        };
      } catch {}
    }
    return () => {
      alive = false;
      clearInterval(id);
      try { if (chan) chan.close(); } catch {}
    };
  }, []);

  const refreshUnread = async () => {
    try {
      const { count } = await FirebaseAPI.getUnreadNotificationsCount();
      setUnreadNotifs(count || 0);
    } catch {}
  };

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Title */}
        {title && (
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <NotificationsDropdown count={unreadNotifs} onChanged={refreshUnread} />
          
          <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white">
            <Mail className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-blue-500 text-white text-xs flex items-center justify-center">
              5
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
}