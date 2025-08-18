"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// --- Dados Mockados (com a adição do campo 'bonus') ---
const pontuacoesMock = [
    { unidade: "Jaguar", nome: "João Silva", cargo: "Desbravador", presenca: 10, pontualidade: 10, uniforme: 5, modestia: 10, bonus: 5 },
    { unidade: "Jaguar", nome: "Maria Santos", cargo: "Conselheiro", presenca: 8, pontualidade: 10, uniforme: 10, modestia: 10, bonus: 0 },
    { unidade: "Gato do Mato", nome: "Pedro Costa", cargo: "Desbravador", presenca: 9, pontualidade: 8, uniforme: 10, modestia: 10, bonus: 10 },
    { unidade: "Gato do Mato", nome: "Ana Oliveira", cargo: "Desbravador", presenca: 10, pontualidade: 10, uniforme: 10, modestia: 10, bonus: 0 },
    { unidade: "Jaguar", nome: "Carlos Ferreira", cargo: "Diretor", presenca: 7, pontualidade: 5, uniforme: 5, modestia: 8, bonus: 2 },
]

// Função auxiliar para criar rankings por categoria
const createRankingPorCategoria = (categoria: 'presenca' | 'pontualidade' | 'uniforme' | 'modestia') => {
    const ranking = pontuacoesMock.reduce((acc, curr) => {
        if (!acc[curr.unidade]) {
            acc[curr.unidade] = 0
        }
        acc[curr.unidade] += curr[categoria]
        return acc
    }, {} as Record<string, number>)

    return Object.entries(ranking).sort((a, b) => b[1] - a[1]);
}

interface RankingProps {
    filtroAno: string;
    filtroSemestre: string;
}

export default function Ranking({ filtroAno, filtroSemestre }: RankingProps) {
    const [filtroCargo, setFiltroCargo] = useState("todos")

    // A lógica de filtragem por ano e semestre seria aplicada aqui,
    // buscando os dados da API com base nos filtros recebidos.
    // Por enquanto, usamos os dados mockados.

    const rankingUnidades = pontuacoesMock.reduce((acc, curr) => {
        const total = curr.presenca + curr.pontualidade + curr.uniforme + curr.modestia + curr.bonus
        if (!acc[curr.unidade]) {
            acc[curr.unidade] = 0
        }
        acc[curr.unidade] += total
        return acc
    }, {} as Record<string, number>)

    const sortedRanking = Object.entries(rankingUnidades).sort((a, b) => b[1] - a[1])

    const rankingIndividual = pontuacoesMock
        .filter(membro => filtroCargo === "todos" || membro.cargo === filtroCargo)
        .map((m) => ({
            ...m,
            total: m.presenca + m.pontualidade + m.uniforme + m.modestia + m.bonus,
        }))
        .sort((a, b) => b.total - a.total)

    const cargosDisponiveis = ["todos", ...Array.from(new Set(pontuacoesMock.map(p => p.cargo)))]

    const rankingPresenca = createRankingPorCategoria("presenca");
    const rankingPontualidade = createRankingPorCategoria("pontualidade");
    const rankingUniforme = createRankingPorCategoria("uniforme");
    const rankingModestia = createRankingPorCategoria("modestia");


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>🏆 Ranking Geral das Unidades</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sortedRanking.map(([unidade, pontos], index) => (
                        <Card key={unidade} className="p-4 text-center">
                            <div className="text-2xl">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </div>
                            <p className="text-xl font-bold">{unidade}</p>
                            <p className="text-3xl font-semibold text-primary">{pontos}</p>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>📊 Ranking de Unidades por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Presença</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {rankingPresenca.map(([unidade, pontos]) => (
                                <div key={unidade} className="flex justify-between items-center text-sm"><Badge variant="outline">{unidade}</Badge><span className="font-semibold">{pontos}</span></div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Pontualidade</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {rankingPontualidade.map(([unidade, pontos]) => (
                                <div key={unidade} className="flex justify-between items-center text-sm"><Badge variant="outline">{unidade}</Badge><span className="font-semibold">{pontos}</span></div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Uniforme</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {rankingUniforme.map(([unidade, pontos]) => (
                                <div key={unidade} className="flex justify-between items-center text-sm"><Badge variant="outline">{unidade}</Badge><span className="font-semibold">{pontos}</span></div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Modéstia</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {rankingModestia.map(([unidade, pontos]) => (
                                <div key={unidade} className="flex justify-between items-center text-sm"><Badge variant="outline">{unidade}</Badge><span className="font-semibold">{pontos}</span></div>
                            ))}
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>🏅 Ranking Individual de Membros</CardTitle>
                        <div className="w-64">
                            <Label>Filtrar por Cargo</Label>
                            <Select value={filtroCargo} onValueChange={setFiltroCargo}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {cargosDisponiveis.map(cargo => (
                                        <SelectItem key={cargo} value={cargo}>
                                            {cargo === "todos" ? "Todos os Cargos" : cargo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted">
                            <tr>
                                <th className="px-6 py-3">Nome</th>
                                <th className="px-6 py-3">Unidade</th>
                                <th className="px-6 py-3">Cargo</th>
                                <th className="px-6 py-3 text-center">Presença</th>
                                <th className="px-6 py-3 text-center">Pontualidade</th>
                                <th className="px-6 py-3 text-center">Uniforme</th>
                                <th className="px-6 py-3 text-center">Modéstia</th>
                                <th className="px-6 py-3 text-center">Bônus</th>
                                <th className="px-6 py-3 text-center">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rankingIndividual.map((membro, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-6 py-4 font-medium">{membro.nome}</td>
                                    <td className="px-6 py-4"><Badge variant="outline">{membro.unidade}</Badge></td>
                                    <td className="px-6 py-4"><Badge variant="secondary">{membro.cargo}</Badge></td>
                                    <td className="px-6 py-4 text-center">{membro.presenca}</td>
                                    <td className="px-6 py-4 text-center">{membro.pontualidade}</td>
                                    <td className="px-6 py-4 text-center">{membro.uniforme}</td>
                                    <td className="px-6 py-4 text-center">{membro.modestia}</td>
                                    <td className="px-6 py-4 text-center">{membro.bonus}</td>
                                    <td className="px-6 py-4 text-center font-bold text-primary">{membro.total}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}