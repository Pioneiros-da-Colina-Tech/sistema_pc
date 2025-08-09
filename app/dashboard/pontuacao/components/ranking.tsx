"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// --- Dados Mockados ---
const pontuacoesMock = [
    { unidade: "Jaguar", nome: "João Silva", presenca: 10, pontualidade: 10, uniforme: 5, modestia: 10 },
    { unidade: "Jaguar", nome: "Maria Santos", presenca: 8, pontualidade: 10, uniforme: 10, modestia: 10 },
    { unidade: "Gato do Mato", nome: "Pedro Costa", presenca: 9, pontualidade: 8, uniforme: 10, modestia: 10 },
    { unidade: "Gato do Mato", nome: "Ana Oliveira", presenca: 10, pontualidade: 10, uniforme: 10, modestia: 10 },
    { unidade: "Jaguar", nome: "Carlos Ferreira", presenca: 7, pontualidade: 5, uniforme: 5, modestia: 8 },
]

export default function Ranking() {
    const rankingUnidades = pontuacoesMock.reduce((acc, curr) => {
        const total = curr.presenca + curr.pontualidade + curr.uniforme + curr.modestia
        if (!acc[curr.unidade]) {
            acc[curr.unidade] = 0
        }
        acc[curr.unidade] += total
        return acc
    }, {} as Record<string, number>)

    const sortedRanking = Object.entries(rankingUnidades).sort((a, b) => b[1] - a[1])

    const rankingIndividual = pontuacoesMock
        .map((m) => ({
            ...m,
            total: m.presenca + m.pontualidade + m.uniforme + m.modestia,
        }))
        .sort((a, b) => b.total - a.total)

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
                    <CardTitle>🏅 Ranking Individual de Membros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted">
                            <tr>
                                <th className="px-6 py-3">Nome</th>
                                <th className="px-6 py-3">Unidade</th>
                                <th className="px-6 py-3 text-center">Presença</th>
                                <th className="px-6 py-3 text-center">Pontualidade</th>
                                <th className="px-6 py-3 text-center">Uniforme</th>
                                <th className="px-6 py-3 text-center">Modéstia</th>
                                <th className="px-6 py-3 text-center">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rankingIndividual.map((membro, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-6 py-4 font-medium">{membro.nome}</td>
                                    <td className="px-6 py-4"><Badge variant="outline">{membro.unidade}</Badge></td>
                                    <td className="px-6 py-4 text-center">{membro.presenca}</td>
                                    <td className="px-6 py-4 text-center">{membro.pontualidade}</td>
                                    <td className="px-6 py-4 text-center">{membro.uniforme}</td>
                                    <td className="px-6 py-4 text-center">{membro.modestia}</td>
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