"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge" // <<< CORREÇÃO AQUI
import { Check, RotateCcw, ShieldQuestion, Trash2 } from "lucide-react"

// --- Dados Mockados ---
const unidadesMock = [
    { id: 1, nome: "Jaguar" },
    { id: 2, nome: "Gato do Mato" },
]

const membrosMock = [
    { id: 1, codigo_sgc: "12345", nome: "João Silva", id_unidade: 1 },
    { id: 2, codigo_sgc: "54321", nome: "Maria Santos", id_unidade: 1 },
    { id: 3, codigo_sgc: "67890", nome: "Pedro Costa", id_unidade: 2 },
]

const especialidadesMock = [
    { id: 1, codigo: "AP-034", nome: "Internet" },
    { id: 2, codigo: "PS-001", nome: "Primeiros Socorros" },
    { id: 3, codigo: "NA-001", nome: "Nós e Amarras" },
]

const avaliacaoEspecialidadeMock = [
    { id: 1, codigo_sgc: "12345", codigo_especialidade: "AP-034", status: "Aprovado" },
    { id: 2, codigo_sgc: "12345", codigo_especialidade: "PS-001", status: "Avaliação" },
    { id: 3, codigo_sgc: "54321", codigo_especialidade: "AP-034", status: "Refazer" },
]
// --- Fim dos Dados Mockados ---

export default function Especialidade() {
    const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState(unidadesMock[0].id)
    const [avaliacoes, setAvaliacoes] = useState(avaliacaoEspecialidadeMock)

    const unidadeAtual = unidadesMock.find((u) => u.id === unidadeSelecionadaId)
    const membrosDaUnidade = membrosMock.filter((m) => m.id_unidade === unidadeSelecionadaId)

    const handleStatusChange = (codigo_especialidade: string, codigo_sgc: string, novoStatus: string) => {
        setAvaliacoes((prev) => {
            const existingIndex = prev.findIndex(av => av.codigo_especialidade === codigo_especialidade && av.codigo_sgc === codigo_sgc);
            if (existingIndex > -1) {
                const newAvaliacoes = [...prev];
                newAvaliacoes[existingIndex] = { ...newAvaliacoes[existingIndex], status: novoStatus };
                return newAvaliacoes;
            }
            return [...prev, { id: Date.now(), codigo_especialidade, codigo_sgc, status: novoStatus }];
        });
    }

    const handleRemove = (codigo_especialidade: string, codigo_sgc: string) => {
        setAvaliacoes(prev => prev.filter(av => !(av.codigo_especialidade === codigo_especialidade && av.codigo_sgc === codigo_sgc)));
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Avaliação de Especialidades por Membro</CardTitle>
                    <CardDescription>
                        Aprove ou solicite a refação das especialidades para cada membro da unidade selecionada.
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
                const avaliacoesDoMembro = avaliacoes.filter((a) => a.codigo_sgc === membro.codigo_sgc)

                const getStatus = (espCodigo: string) => avaliacoesDoMembro.find(a => a.codigo_especialidade === espCodigo)?.status || "Pendente";

                const especialidadesParaAvaliar = especialidadesMock.filter(esp => ["Avaliação", "Refazer"].includes(getStatus(esp.codigo)));
                const especialidadesAprovadas = especialidadesMock.filter(esp => getStatus(esp.codigo) === "Aprovado");

                return (
                    <Card key={membro.id}>
                        <CardHeader><CardTitle>{membro.nome}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {especialidadesParaAvaliar.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><ShieldQuestion className="h-5 w-5 text-yellow-600"/> Para Avaliar / Refazer</h4>
                                    {especialidadesParaAvaliar.map(esp => (
                                        <div key={esp.id} className="flex justify-between items-center p-2 border rounded-md">
                                            <p>{esp.nome}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{getStatus(esp.codigo)}</Badge>
                                                <Button size="sm" onClick={() => handleStatusChange(esp.codigo, membro.codigo_sgc, "Aprovado")}><Check className="h-4 w-4 mr-2"/> Aprovar</Button>
                                                <Button size="sm" variant="secondary" onClick={() => handleStatusChange(esp.codigo, membro.codigo_sgc, "Refazer")}><RotateCcw className="h-4 w-4 mr-2"/> Refazer</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {especialidadesAprovadas.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><Check className="h-5 w-5 text-green-600"/> Aprovadas</h4>
                                    {especialidadesAprovadas.map(esp => (
                                        <div key={esp.id} className="flex justify-between items-center p-2 border rounded-md bg-green-50">
                                            <p>{esp.nome}</p>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleRemove(esp.codigo, membro.codigo_sgc)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {especialidadesParaAvaliar.length === 0 && especialidadesAprovadas.length === 0 && (
                                <p className="text-sm text-muted-foreground">Nenhuma especialidade em avaliação ou aprovada para este membro.</p>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}