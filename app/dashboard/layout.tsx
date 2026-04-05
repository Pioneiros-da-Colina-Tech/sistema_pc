"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CalendarDays,
  ClipboardPen,
  Shield,
  LayoutDashboard,
  User,
  DollarSign,
  ClipboardCheck,
  Star,
  Archive,
  LogOut,
  Menu,
  X,
  Award,
  ChevronRight,
} from "lucide-react"
import { isAuthenticated, removeToken } from "@/lib/api"

const menuGroups = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard/reunioes", label: "Reunioes", icon: CalendarDays },
      { href: "/dashboard/painel", label: "Meu Painel", icon: User },
    ],
  },
  {
    label: "Gestao",
    items: [
      { href: "/dashboard/secretaria", label: "Secretaria", icon: ClipboardPen },
      { href: "/dashboard/unidade", label: "Unidade", icon: Shield },
      { href: "/dashboard/dashboard-unidade", label: "Dashboard Unidade", icon: LayoutDashboard },
      { href: "/dashboard/tesouraria", label: "Tesouraria", icon: DollarSign },
      { href: "/dashboard/patrimonio", label: "Patrimonio", icon: Archive },
    ],
  },
  {
    label: "Avaliacao",
    items: [
      { href: "/dashboard/apoio", label: "Apoio Regional", icon: Award },
      { href: "/dashboard/regional", label: "Avaliacao Regional", icon: ClipboardCheck },
      { href: "/dashboard/pontuacao", label: "Pontuacao", icon: Star },
    ],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/")
    }
  }, [router])

  const handleLogout = () => {
    removeToken()
    router.replace("/")
  }

  // Get current page title
  const getCurrentPageTitle = () => {
    for (const group of menuGroups) {
      for (const item of group.items) {
        if (pathname.startsWith(item.href)) {
          return item.label
        }
      }
    }
    return "Dashboard"
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">Pioneiros da Colina</span>
              <span className="text-xs text-muted-foreground">Sistema de Gestao</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-6">
            {menuGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <span className="px-3 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname.startsWith(item.href)

                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                PC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Usuario</p>
              <p className="text-xs text-muted-foreground truncate">Membro do Clube</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">{getCurrentPageTitle()}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Pioneiros da Colina</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 lg:hidden">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                PC
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-background">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
