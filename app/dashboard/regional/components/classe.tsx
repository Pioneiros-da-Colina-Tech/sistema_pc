"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label" // <<< LINHA ADICIONADA
import { Check, RotateCcw } from "lucide-react"

// --- Dados Mockados para Simulação ---
const unidadesMock = [
    { id: 1, nome: "Jaguar", codigo_classe_regular: "AM-001", codigo_classe_avancada: "AM-A-001" },
    { id: 2, nome: "Gato do Mato", codigo_classe_regular: "CP-002", codigo_classe_avancada: "CP-A-002" },
]

const membrosMock = [
    { id: 1, codigo_sgc: "12345", nome: "João Silva", id_unidade: 1 },
    { id: 2, codigo_sgc: "54321", nome: "Maria Santos", id_unidade: 1 },
    { id: 3, codigo_sgc: "67890", nome: "Pedro Costa", id_unidade: 2 },
]

const requisitosClassesMock = [
    // Amigo Regular
    { id: 101, secao: "Geral", texto: "Ser membro ativo do Clube de Desbravadores.", codigo_classe: "AM-001" },
    { id: 102, secao: "Descoberta Espiritual", texto: "Memorizar o Voto e a Lei do Desbravador.", codigo_classe: "AM-001" },
    // Amigo Avançado
    { id: 201, secao: "Geral", texto: "Requisito avançado de Amigo 1.", codigo_classe: "AM-A-001" },
    // Companheiro Regular
    { id: 301, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "CP-002" },
    { id: 302, secao: "Saúde", texto: "Completar a especialidade de Primeiros Socorros.", codigo_classe: "CP-002" },
]

const avaliacaoClassesMock = [
    // João Silva (Jaguar)
    { id: 1, id_unidade: 1, id_requisito: 101, codigo_sgc: "12345", status: "Aprovado", conclusao: "2025-01-10" },
    { id: 2, id_unidade: 1, id_requisito: 102, codigo_sgc: "12345", status: "Avaliação", conclusao: "2025-01-12" },
    // Maria Santos (Jaguar)
    { id: 3, id_unidade: 1, id_requisito: 101, codigo_sgc: "54321", status: "Avaliação", conclusao: "2025-01-15" },
    // Pedro Costa (Gato do Mato)
    { id: 4, id_unidade: 2, id_requisito: 301, codigo_sgc: "67890", status: "Aprovado", conclusao: "2025-01-18" },
    { id: 5, id_unidade: 2, id_requisito: 302, codigo_sgc: "67890", status: "Avaliação", conclusao: "2025-01-20" },
]

// --- Componente da Página ---
export default function Classe() {
    const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState(unidadesMock[0].id)
    const [avaliacoes, setAvaliacoes] = useState(avaliacaoClassesMock)

    const unidadeAtual = unidadesMock.find((u) => u.id === unidadeSelecionadaId)
    const membrosDaUnidade = membrosMock.filter((m) => m.id_unidade === unidadeSelecionadaId)

    const handleStatusChange = (id_requisito: number, codigo_sgc: string, novoStatus: "Aprovado" | "Refazer" | "Avaliação") => {
        setAvaliacoes((prev) =>
            prev.map((av) =>
                av.id_requisito === id_requisito && av.codigo_sgc === codigo_sgc ? { ...av, status: novoStatus } : av
            )
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>📘 Avaliação de Classe por Membro</CardTitle>
                    <CardDescription>
                        Aprove, ou peça para refazer, os requisitos de classe para cada membro da unidade selecionada.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-64">
                        <Label>Selecione a Unidade</Label>
                        <Select onValueChange={(value) => setUnidadeSelecionadaId(Number.parseInt(value))} defaultValue={"1"}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {unidadesMock.map((unidade) => (
                                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                                        {unidade.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {membrosDaUnidade.map((membro) => {
                const codigosClasse = [unidadeAtual?.codigo_classe_regular, unidadeAtual?.codigo_classe_avancada].filter(Boolean)
                const requisitosDaUnidade = requisitosClassesMock.filter(req => codigosClasse.includes(req.codigo_classe))

                const avaliacoesDoMembro = avaliacoes.filter((a) => a.codigo_sgc === membro.codigo_sgc)

                return (
                    <Card key={membro.id}>
                        <CardHeader>
                            <CardTitle>{membro.nome}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {requisitosDaUnidade.map((req) => {
                                const avaliacao = avaliacoesDoMembro.find((a) => a.id_requisito === req.id)
                                const status = avaliacao?.status || "Pendente"
                                const isRegular = req.codigo_classe === unidadeAtual?.codigo_classe_regular

                                return (
                                    <div key={req.id} className="p-3 border rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={isRegular ? "secondary" : "outline"}>
                                                        {isRegular ? "Classe Regular" : "Classe Avançada"}
                                                    </Badge>
                                                    <p className="font-semibold">Seção {req.secao}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{req.texto}</p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                                <Badge variant={
                                                    status === "Aprovado" ? "default" : status === "Avaliação" ? "secondary" : "destructive"
                                                }>
                                                    {status}
                                                </Badge>
                                                {status === "Avaliação" && (
                                                    <>
                                                        <Button size="sm" onClick={() => handleStatusChange(req.id, membro.codigo_sgc, "Aprovado")}>
                                                            <Check className="h-4 w-4 mr-2" /> Aprovar
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, membro.codigo_sgc, "Refazer")}>
                                                            <RotateCcw className="h-4 w-4 mr-2" /> Refazer
                                                        </Button>
                                                    </>
                                                )}
                                                {status === "Aprovado" && (
                                                    <>
                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, membro.codigo_sgc, "Refazer")}>
                                                            <RotateCcw className="h-4 w-4 mr-2" /> Refazer
                                                        </Button>
                                                        <Button size="sm" variant="secondary" onClick={() => handleStatusChange(req.id, membro.codigo_sgc, "Avaliação")}>
                                                            Avaliação
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}