"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, BarChart3, Calendar, Shield } from "lucide-react"
import { authApi, setToken } from "@/lib/api"

export default function HomePage() {
  const [documento, setDocumento] = useState("")
  const [nascimento, setNascimento] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    try {
      const res = await authApi.login(documento, nascimento)
      setToken(res.data.access_token)
      router.push("/dashboard")
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Credenciais inválidas.")
    } finally {
      setCarregando(false)
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

        {/* Coluna da Direita: Login */}
        <div className="flex items-center justify-center p-6 login-background">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Acesse sua conta</CardTitle>
              <CardDescription>Insira seu CPF e data de nascimento.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">CPF</Label>
                  <Input
                    id="documento"
                    type="text"
                    placeholder="00000000000"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimento">Data de Nascimento</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={nascimento}
                    onChange={(e) => setNascimento(e.target.value)}
                    required
                  />
                </div>
                {erro && <p className="text-sm text-red-600">{erro}</p>}
                <Button type="submit" className="w-full" disabled={carregando}>
                  {carregando ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
