"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Users, Calendar, FileText, Award, BarChart3, Settings, LogOut, Menu, X, ClipboardCheck, GraduationCap, Star } from "lucide-react"

const menuItems = [
  { href: "/dashboard/reunioes", label: "Reuniões", icon: Calendar },
  { href: "/dashboard/secretaria", label: "Secretaria", icon: FileText },
  { href: "/dashboard/unidade", label: "Unidade", icon: Users },
  { href: "/dashboard/dashboard-unidade", label: "Dashboard Unidade", icon: BarChart3 },
  { href: "/dashboard/painel", label: "Meu Painel", icon: BarChart3 },
  { href: "/dashboard/tesouraria", label: "Tesouraria", icon: Settings },
  { href: "/dashboard/apoio", label: "Apoio Regional", icon: Award },
  { href: "/dashboard/regional", label: "Avaliação Regional", icon: ClipboardCheck },
  { href: "/dashboard/pontuacao", label: "Pontuação", icon: Star },
]

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-lg font-semibold">Pioneiros da Colina</h1>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)

                return (
                    <Link key={item.href} href={item.href}>
                      <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                )
              })}
            </nav>

            <Separator className="my-4" />

            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </Link>
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white shadow-sm border-b h-16 flex items-center px-4 lg:px-6">
            <Button variant="ghost" size="sm" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Pioneiros da Colina</h2>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
  )
}