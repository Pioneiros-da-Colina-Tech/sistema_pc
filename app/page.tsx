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
    const [cpf, setCpf] = useState("")
    const router = useRouter()

    // Função para aplicar a máscara de CPF (000.000.000-00)
    const formatarCPF = (value: string) => {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de números)
            .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
            .replace(/(-\d{2})\d+?$/, '$1') // Impede de digitar mais que 14 caracteres
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Validação simples de tamanho antes de prosseguir
        if (cpf.length === 14) {
            console.log("Logando com CPF:", cpf)
            router.push("/dashboard")
        } else {
            alert("Por favor, insira um CPF válido.")
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

            {/* Coluna da Direita: Login com CPF */}
            <div className="flex items-center justify-center p-6 login-background">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Acesso ao Sistema</CardTitle>
                        <CardDescription>Informe seu CPF para localizar seu cadastro.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(e) => setCpf(formatarCPF(e.target.value))}
                                    required
                                    maxLength={14}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Acessar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}