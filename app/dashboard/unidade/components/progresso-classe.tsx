"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { MembroUnidade } from "../page"

const requisitosClassesMock = [
    { id: 101, secao: "Geral", texto: "Ser membro ativo do Clube." },
    { id: 102, secao: "Descoberta Espiritual", texto: "Memorizar Voto e Lei." },
    { id: 201, secao: "Avançado", texto: "Requisito avançado de Amigo." },
    { id: 202, secao: "Avançado", texto: "Completar projeto de serviço." },
]

type Avaliacao = { id: number; id_requisito: number; user_id: string; status: string }

export default function ProgressoClasseTab({ membrosDaUnidade }: { membrosDaUnidade: MembroUnidade[] }) {
    const [avaliacaoClasses, setAvaliacaoClasses] = useState<Avaliacao[]>([])
    const [requisitoPendente, setRequisitoPendente] = useState<string | undefined>()

    const handleAdicionarRequisitoPendente = () => {
        if (!requisitoPendente) return
        const requisitoId = parseInt(requisitoPendente)
        setAvaliacaoClasses((prev) => {
            const novas = [...prev]
            membrosDaUnidade.forEach((membro) => {
                if (!novas.some((a) => a.user_id === membro.id && a.id_requisito === requisitoId)) {
                    novas.push({ id: Date.now() + Math.random(), id_requisito: requisitoId, user_id: membro.id, status: "Pendente" })
                }
            })
            return novas
        })
        setRequisitoPendente(undefined)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Adicionar Requisito para a Unidade</CardTitle>
                    <CardDescription>Selecione um requisito para marcar como "Pendente" para todos os membros da unidade.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Select value={requisitoPendente} onValueChange={setRequisitoPendente}>
                        <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione um requisito..." /></SelectTrigger>
                        <SelectContent>
                            {requisitosClassesMock.map((req) => (
                                <SelectItem key={req.id} value={req.id.toString()}>{req.texto}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAdicionarRequisitoPendente} disabled={!requisitoPendente}>Adicionar Pendência</Button>
                </CardContent>
            </Card>

            {membrosDaUnidade.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum membro nesta unidade para o ano atual.</p>
            ) : (
                <div className="space-y-4">
                    {membrosDaUnidade.map((membro) => {
                        const avaliacoesDoMembro = avaliacaoClasses.filter((a) => a.user_id === membro.id)
                        const aprovadosCount = requisitosClassesMock.filter((req) =>
                            avaliacoesDoMembro.some((a) => a.id_requisito === req.id && a.status === "Aprovado")
                        ).length
                        const progresso = (aprovadosCount / requisitosClassesMock.length) * 100

                        return (
                            <Card key={membro.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{membro.nome}</CardTitle>
                                        <span className="text-sm text-muted-foreground">{aprovadosCount} de {requisitosClassesMock.length} requisitos aprovados</span>
                                    </div>
                                    <Progress value={progresso} className="mt-2" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {requisitosClassesMock.map((req) => {
                                        const avaliacao = avaliacoesDoMembro.find((a) => a.id_requisito === req.id)
                                        const status = avaliacao?.status ?? "Não Iniciado"
                                        const isRegular = req.secao !== "Avançado"
                                        return (
                                            <div key={req.id} className="flex items-center justify-between p-2 border rounded-md">
                                                <div>
                                                    <span className={`mr-2 text-xs font-semibold ${isRegular ? "text-blue-600" : "text-purple-600"}`}>
                                                        {isRegular ? "REGULAR" : "AVANÇADO"}
                                                    </span>
                                                    <span>{req.texto}</span>
                                                </div>
                                                <Badge variant={status === "Aprovado" ? "default" : status === "Avaliação" ? "secondary" : status === "Refazer" ? "destructive" : "outline"}>
                                                    {status}
                                                </Badge>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </>
    )
}
