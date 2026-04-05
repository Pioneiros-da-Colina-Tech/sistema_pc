"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { MembroUnidade } from "../page"

const especialidadesDisponiveis = [
    { id: "internet", nome: "Internet" },
    { id: "primeiros-socorros", nome: "Primeiros Socorros" },
    { id: "culinaria", nome: "Culinária" },
    { id: "natureza", nome: "Natureza" },
]

type RegistroEspecialidade = {
    id: string
    especialidadeId: string
    especialidadeNome: string
    userId: string
    userName: string
    status: "Em Avaliação" | "Aprovado"
}

export default function ProgressoEspecialidadeTab({ membrosDaUnidade }: { membrosDaUnidade: MembroUnidade[] }) {
    const [registros, setRegistros] = useState<RegistroEspecialidade[]>([])
    const [membroSelecionado, setMembroSelecionado] = useState<string>("")
    const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string>("")

    const handleRegistrar = () => {
        if (!membroSelecionado || !especialidadeSelecionada) return
        const membro = membrosDaUnidade.find((m) => m.id === membroSelecionado)
        const esp = especialidadesDisponiveis.find((e) => e.id === especialidadeSelecionada)
        if (!membro || !esp) return
        setRegistros((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                especialidadeId: esp.id,
                especialidadeNome: esp.nome,
                userId: membro.id,
                userName: membro.nome,
                status: "Em Avaliação",
            },
        ])
        setMembroSelecionado("")
        setEspecialidadeSelecionada("")
    }

    // Group by specialty
    const porEspecialidade = especialidadesDisponiveis
        .map((esp) => ({
            ...esp,
            membros: registros.filter((r) => r.especialidadeId === esp.id),
        }))
        .filter((esp) => esp.membros.length > 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Progresso de Especialidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {porEspecialidade.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma especialidade registrada.</p>
                ) : (
                    <div className="space-y-3">
                        <h4 className="font-medium">Especialidades em Andamento</h4>
                        {porEspecialidade.map((esp) => (
                            <div key={esp.id} className="border rounded p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h5 className="font-medium">{esp.nome}</h5>
                                    <Badge variant={esp.membros.every((m) => m.status === "Aprovado") ? "default" : "secondary"}>
                                        {esp.membros.every((m) => m.status === "Aprovado") ? "Aprovado" : "Em Avaliação"}
                                    </Badge>
                                </div>
                                <p className="text-sm font-semibold text-muted-foreground">Membros:</p>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {esp.membros.map((r) => <li key={r.id}>{r.userName}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-4 border-t space-y-4">
                    <h4 className="font-medium">Registrar Nova Especialidade</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Membro</Label>
                            <Select value={membroSelecionado} onValueChange={setMembroSelecionado}>
                                <SelectTrigger><SelectValue placeholder="Selecione o membro" /></SelectTrigger>
                                <SelectContent>
                                    {membrosDaUnidade.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Especialidade</Label>
                            <Select value={especialidadeSelecionada} onValueChange={setEspecialidadeSelecionada}>
                                <SelectTrigger><SelectValue placeholder="Selecione a especialidade" /></SelectTrigger>
                                <SelectContent>
                                    {especialidadesDisponiveis.map((esp) => (
                                        <SelectItem key={esp.id} value={esp.id}>{esp.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleRegistrar} disabled={!membroSelecionado || !especialidadeSelecionada}>
                        Registrar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
