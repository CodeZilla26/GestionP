"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface DashboardLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Sidebar />
      <div className="md:ml-72">
        {title && <Header title={title} />}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
