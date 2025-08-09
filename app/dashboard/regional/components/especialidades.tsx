"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

// Dados mockados para simular o banco de dados
const unidadesMock = [
    { id: 1, nome: "Jaguar" },
    { id: 2, nome: "Gato do Mato" },
]

const membrosMock = [
    { id: 1, codigo_sgc: "12345", nome: "João Silva", id_unidade: 1 },
    { id: 2, codigo_sgc: "54321", nome: "Maria Santos", id_unidade: 1 },
    { id: 3, codigo_sgc: "67890", nome: "Pedro Costa", id_unidade: 2 },
    { id: 4, codigo_sgc: "11111", nome: "Ana Oliveira", id_unidade: 2 },
]

const especialidadesMock = [
    { id: 1, codigo: "AP-034", nome: "Internet" },
    { id: 2, codigo: "PS-001", nome: "Primeiros Socorros" },
]

const avaliacaoEspecialidadeMock = [
    { id: 1, codigo_sgc: "12345", codigo_especialidade: "AP-034", status: "Avaliação", conclusao: "2025-01-10" },
    { id: 2, codigo_sgc: "67890", codigo_especialidade: "AP-034", status: "Avaliação", conclusao: "2025-01-12" },
    { id: 3, codigo_sgc: "54321", codigo_especialidade: "PS-001", status: "Avaliação", conclusao: "2025-01-15" },
]

const userEspecialidadesMock = [
    { id: 1, codigo_sgc: "11111", codigo_especialidade: "PS-001", status: "Pendente" },
]

export default function Especialidade() {
    const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState(unidadesMock[0].id)
    const [avaliacoes, setAvaliacoes] = useState(avaliacaoEspecialidadeMock)
    const [aprovados, setAprovados] = useState(userEspecialidadesMock)
    const [selecionadosParaAprovacao, setSelecionadosParaAprovacao] = useState<string[]>([])

    const unidadeAtual = unidadesMock.find((u) => u.id === unidadeSelecionadaId)
    const membrosDaUnidade = membrosMock.filter((m) => m.id_unidade === unidadeSelecionadaId)
    const sgcMembrosDaUnidade = membrosDaUnidade.map((m) => m.codigo_sgc)

    const avaliacoesDaUnidade = avaliacoes.filter(
        (a) => sgcMembrosDaUnidade.includes(a.codigo_sgc) && a.status === "Avaliação"
    )

    const aprovadosNaUnidade = aprovados.filter((a) => sgcMembrosDaUnidade.includes(a.codigo_sgc))

    const handleCheckboxChange = (sgc: string, espCodigo: string) => {
        const id = `${sgc}_${espCodigo}`
        setSelecionadosParaAprovacao((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const salvarAprovacoes = () => {
        // Atualizar avaliações para "Aprovado"
        const novasAvaliacoes = avaliacoes.map((av) => {
            const id = `${av.codigo_sgc}_${av.codigo_especialidade}`
            if (selecionadosParaAprovacao.includes(id)) {
                return { ...av, status: "Aprovado" }
            }
            return av
        })
        setAvaliacoes(novasAvaliacoes)

        // Adicionar aos aprovados (user_especialidades)
        const novosAprovados = selecionadosParaAprovacao.map((id) => {
            const [sgc, espCodigo] = id.split("_")
            return { id: Date.now(), codigo_sgc: sgc, codigo_especialidade: espCodigo, status: "Pendente" }
        })
        setAprovados((prev) => [...prev, ...novosAprovados])

        setSelecionadosParaAprovacao([])
        alert("Aprovações salvas com sucesso!")
    }

    const removerAprovacao = (sgc: string, espCodigo: string) => {
        // Remover de user_especialidades
        setAprovados((prev) => prev.filter((a) => !(a.codigo_sgc === sgc && a.codigo_especialidade === espCodigo)))

        // Opcional: reverter o status em avaliacao_especialidade, ou remover
        setAvaliacoes((prev) => prev.filter((a) => !(a.codigo_sgc === sgc && a.codigo_especialidade === espCodigo)))

        alert(`Registro de ${sgc} removido com sucesso!`)
    }

    const especialidadesParaAvaliar = avaliacoesDaUnidade.reduce((acc, a) => {
        if (!acc[a.codigo_especialidade]) {
            acc[a.codigo_especialidade] = []
        }
        acc[a.codigo_especialidade].push(a)
        return acc
    }, {} as Record<string, typeof avaliacoesDaUnidade>)

    const aprovadosPorEspecialidade = aprovadosNaUnidade.reduce((acc, a) => {
        if (!acc[a.codigo_especialidade]) {
            acc[a.codigo_especialidade] = []
        }
        acc[a.codigo_especialidade].push(a.codigo_sgc)
        return acc
    }, {} as Record<string, string[]>)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>✅ Avaliação Regional de Especialidades</CardTitle>
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

                    <h3 className="text-xl font-semibold">🏷️ Especialidades na unidade {unidadeAtual?.nome}</h3>

                    {Object.keys(especialidadesParaAvaliar).length === 0 ? (
                        <p className="text-muted-foreground">Nenhuma especialidade para avaliar no momento.</p>
                    ) : (
                        Object.entries(especialidadesParaAvaliar).map(([espCodigo, avaliacoesDoGrupo]) => (
                            <div key={espCodigo} className="space-y-2 border-t pt-4">
                                <h4 className="text-lg font-medium">
                                    📘 {especialidadesMock.find((e) => e.codigo === espCodigo)?.nome || espCodigo}
                                </h4>
                                {avaliacoesDoGrupo.map((a) => (
                                    <div key={`${a.codigo_sgc}_${espCodigo}`} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${a.codigo_sgc}_${espCodigo}`}
                                            onCheckedChange={() => handleCheckboxChange(a.codigo_sgc, espCodigo)}
                                        />
                                        <Label htmlFor={`${a.codigo_sgc}_${espCodigo}`} className="cursor-pointer">
                                            {membrosMock.find((m) => m.codigo_sgc === a.codigo_sgc)?.nome || a.codigo_sgc} —{" "}
                                            <span className="italic text-muted-foreground">Status atual: {a.status}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}

                    {Object.keys(especialidadesParaAvaliar).length > 0 && (
                        <Button onClick={salvarAprovacoes}>💾 Salvar Aprovações</Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>✅ Registros Aprovados por Especialidade</CardTitle>
                </CardHeader>
                <CardContent>
                    {Object.keys(aprovadosPorEspecialidade).length === 0 ? (
                        <p className="text-muted-foreground">Nenhum registro aprovado para esta unidade.</p>
                    ) : (
                        Object.entries(aprovadosPorEspecialidade).map(([espCodigo, sgcs]) => (
                            <div key={espCodigo} className="space-y-2 border-t pt-4">
                                <h4 className="text-lg font-medium">
                                    📘 {especialidadesMock.find((e) => e.codigo === espCodigo)?.nome || espCodigo}
                                </h4>
                                {sgcs.map((sgc) => (
                                    <div key={sgc} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                        <span>🔹 {membrosMock.find((m) => m.codigo_sgc === sgc)?.nome || sgc}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removerAprovacao(sgc, espCodigo)}
                                            aria-label="Remover"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}