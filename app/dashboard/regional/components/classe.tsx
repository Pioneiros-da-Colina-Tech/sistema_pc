"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Check, RotateCcw, ShieldQuestion } from "lucide-react"

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
    { id: 101, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "AM-001" },
    { id: 102, secao: "Descoberta Espiritual", texto: "Memorizar Voto e Lei.", codigo_classe: "AM-001" },
    { id: 201, secao: "Geral", texto: "Requisito avançado de Amigo 1.", codigo_classe: "AM-A-001" },
    { id: 301, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "CP-002" },
    { id: 302, secao: "Saúde", texto: "Completar Primeiros Socorros.", codigo_classe: "CP-002" },
]

const avaliacaoClassesMock = [
    { id: 1, id_unidade: 1, id_requisito: 101, codigo_sgc: "12345", status: "Aprovado" },
    { id: 2, id_unidade: 1, id_requisito: 102, codigo_sgc: "12345", status: "Avaliação" },
    { id: 3, id_unidade: 1, id_requisito: 101, codigo_sgc: "54321", status: "Avaliação" },
    { id: 4, id_unidade: 2, id_requisito: 301, codigo_sgc: "67890", status: "Aprovado" },
    { id: 5, id_unidade: 2, id_requisito: 302, codigo_sgc: "67890", status: "Refazer" },
]

// --- Componente da Página ---
export default function Classe() {
    const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState(unidadesMock[0].id)
    const [avaliacoes, setAvaliacoes] = useState(avaliacaoClassesMock)

    const unidadeAtual = unidadesMock.find((u) => u.id === unidadeSelecionadaId)
    const membrosDaUnidade = membrosMock.filter((m) => m.id_unidade === unidadeSelecionadaId)

    const handleStatusChange = (id_requisito: number, codigo_sgc: string, novoStatus: "Aprovado" | "Refazer" | "Avaliação") => {
        setAvaliacoes((prev) => {
            const existingIndex = prev.findIndex(av => av.id_requisito === id_requisito && av.codigo_sgc === codigo_sgc);
            if (existingIndex > -1) {
                const newAvaliacoes = [...prev];
                newAvaliacoes[existingIndex] = { ...newAvaliacoes[existingIndex], status: novoStatus };
                return newAvaliacoes;
            }
            return [...prev, { id: Date.now(), id_unidade: unidadeSelecionadaId, id_requisito, codigo_sgc, status: novoStatus }];
        });
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Avaliação de Classe por Membro</CardTitle>
                    <CardDescription>
                        Aprove ou solicite a refação dos requisitos de classe para cada membro da unidade selecionada.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-64">
                        <Label>Selecione a Unidade</Label>
                        <Select onValueChange={(value) => setUnidadeSelecionadaId(Number.parseInt(value))} defaultValue={"1"}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{unidadesMock.map((unidade) => (<SelectItem key={unidade.id} value={unidade.id.toString()}>{unidade.nome}</SelectItem>))}</SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {membrosDaUnidade.map((membro) => {
                const codigosClasse = [unidadeAtual?.codigo_classe_regular, unidadeAtual?.codigo_classe_avancada].filter(Boolean)
                const requisitosDaUnidade = requisitosClassesMock.filter(req => codigosClasse.includes(req.codigo_classe))
                const avaliacoesDoMembro = avaliacoes.filter((a) => a.codigo_sgc === membro.codigo_sgc)

                const getStatus = (reqId: number) => avaliacoesDoMembro.find(a => a.id_requisito === reqId)?.status || "Pendente";

                const requisitosParaAvaliar = requisitosDaUnidade.filter(req => ["Avaliação", "Refazer"].includes(getStatus(req.id)));
                const requisitosAprovados = requisitosDaUnidade.filter(req => getStatus(req.id) === "Aprovado");

                return (
                    <Card key={membro.id}>
                        <CardHeader><CardTitle>{membro.nome}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {requisitosParaAvaliar.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><ShieldQuestion className="h-5 w-5 text-yellow-600"/> Para Avaliar / Refazer</h4>
                                    {requisitosParaAvaliar.map(req => (
                                        <div key={req.id} className="flex justify-between items-center p-2 border rounded-md">
                                            <p>{req.texto}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{getStatus(req.id)}</Badge>
                                                <Button size="sm" onClick={() => handleStatusChange(req.id, membro.codigo_sgc, "Aprovado")}><Check className="h-4 w-4 mr-2"/> Aprovar</Button>
                                                <Button size="sm" variant="secondary" onClick={() => handleStatusChange(req.id, membro.codigo_sgc, "Refazer")}><RotateCcw className="h-4 w-4 mr-2"/> Refazer</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {requisitosAprovados.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><Check className="h-5 w-5 text-green-600"/> Aprovados</h4>
                                    {requisitosAprovados.map(req => (
                                        <div key={req.id} className="flex justify-between items-center p-2 border rounded-md bg-green-50">
                                            <p>{req.texto}</p>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, membro.codigo_sgc, "Refazer")}>
                                                    <RotateCcw className="h-4 w-4 mr-2" /> Mover para Refazer
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {requisitosParaAvaliar.length === 0 && requisitosAprovados.length === 0 && (
                                <p className="text-sm text-muted-foreground">Nenhum requisito em avaliação ou aprovado para este membro.</p>
                            )}

                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}