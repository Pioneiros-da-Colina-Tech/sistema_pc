"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, BarChart3, Calendar, Shield } from "lucide-react"

export default function HomePage() {
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular login - em produção seria validação real
    if (usuario && senha) {
      router.push("/dashboard")
    }
  }

  return (
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        {/* Coluna da Esquerda: Informações */}
        <div className="hidden lg:flex flex-col items-start justify-center space-y-6 p-12 bg-muted/40">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-8 w-8 text-primary"/>
            <span>Pioneiros da Colina</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter">
            Sistema de Gestão Integrada
          </h1>
          <p className="text-muted-foreground max-w-md">
            Bem-vindo! Acesse o painel para gerenciar sua unidade, acompanhar o progresso em classes e especialidades, e organizar eventos de forma simples e eficiente.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-1"/>
              <div>
                <h3 className="font-semibold">Acompanhamento Individual</h3>
                <p className="text-sm text-muted-foreground">Monitore o desenvolvimento de cada membro em tempo real.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-1"/>
              <div>
                <h3 className="font-semibold">Gestão de Eventos</h3>
                <p className="text-sm text-muted-foreground">Organize acampamentos e reuniões com facilidade.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-primary mt-1"/>
              <div>
                <h3 className="font-semibold">Relatórios e Pontuação</h3>
                <p className="text-sm text-muted-foreground">Visualize o desempenho e a pontuação da sua unidade.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Login com Imagem de Fundo */}
        <div className="flex items-center justify-center p-6 login-background">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Acesse sua conta</CardTitle>
              <CardDescription>Insira suas credenciais para entrar no sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuário</Label>
                  <Input id="usuario" type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}