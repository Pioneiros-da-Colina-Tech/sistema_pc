"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Loader2 } from "lucide-react"
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
      setErro(err instanceof Error ? err.message : "Credenciais invalidas.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Column: Hero Image */}
      <div className="hidden lg:block relative">
        <Image
          src="/images/login-hero.jpg"
          alt="Desbravadores em acampamento na natureza"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xl font-bold">Pioneiros da Colina</span>
                <p className="text-sm text-white/80">Sistema de Gestao</p>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Gestao Integrada para seu Clube
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Acesse o painel para gerenciar sua unidade, acompanhar o progresso em classes e especialidades, e organizar eventos de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Login */}
      <div className="flex items-center justify-center p-6 min-h-screen lg:min-h-0 bg-muted/30">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-2 lg:hidden mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold text-foreground">Pioneiros da Colina</span>
          </div>
          
          <Card className="shadow-lg border-0 bg-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
              <CardDescription>Insira suas credenciais para acessar o sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documento" className="text-sm font-medium">CPF</Label>
                  <Input
                    id="documento"
                    type="text"
                    placeholder="Digite seu CPF"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimento" className="text-sm font-medium">Data de Nascimento</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={nascimento}
                    onChange={(e) => setNascimento(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                
                {erro && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">{erro}</p>
                  </div>
                )}
                
                <Button type="submit" className="w-full h-11 font-medium" disabled={carregando}>
                  {carregando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-muted-foreground">
            Pioneiros da Colina - Sistema de Gestao de Desbravadores
          </p>
        </div>
      </div>
    </div>
  )
}
