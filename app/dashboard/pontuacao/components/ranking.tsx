"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { scoresApi, type RankingAPI } from "@/lib/api"

interface RankingProps {
    filtroAno: string
    filtroSemestre: string
}

const medals = ["🥇", "🥈", "🥉"]

export default function Ranking({ filtroAno, filtroSemestre }: RankingProps) {
    const [filtroCargo, setFiltroCargo] = useState("todos")
    const [ranking, setRanking] = useState<RankingAPI | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        setCarregando(true)
        scoresApi
            .getRanking(filtroAno, Number(filtroSemestre))
            .then((res) => setRanking(res.data))
            .catch(console.error)
            .finally(() => setCarregando(false))
    }, [filtroAno, filtroSemestre])

    if (carregando) {
        return <p className="text-muted-foreground py-4">Carregando ranking...</p>
    }

    if (!ranking) return null

    const { individual, units } = ranking

    const cargosDisponiveis = [
        "todos",
        ...Array.from(new Set(individual.map((e) => e.unit_role).filter(Boolean) as string[])),
    ]

    const rankingIndividual = individual.filter(
        (e) => filtroCargo === "todos" || e.unit_role === filtroCargo
    )

    const categoryRanking = (key: "presenca" | "pontualidade" | "uniforme" | "modestia") =>
        [...units].sort((a, b) => b[key] - a[key])

    return (
        <div className="space-y-6">
            {/* Unit general ranking */}
            <Card>
                <CardHeader>
                    <CardTitle>🏆 Ranking Geral das Unidades</CardTitle>
                </CardHeader>
                <CardContent>
                    {units.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sem dados para este período.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {units.map((u, i) => (
                                <Card key={u.unit_id} className="p-4 text-center">
                                    <div className="text-2xl">{medals[i] ?? "🎖️"}</div>
                                    <p className="text-xl font-bold">{u.unit_name}</p>
                                    <p className="text-3xl font-semibold text-primary">{u.total}</p>
                                    {u.unit_bonus > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            inclui {u.unit_bonus} pts bônus de unidade
                                        </p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Per-category unit ranking */}
            <Card>
                <CardHeader>
                    <CardTitle>📊 Ranking de Unidades por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(["presenca", "pontualidade", "uniforme", "modestia"] as const).map((cat) => (
                        <Card key={cat}>
                            <CardHeader>
                                <CardTitle className="text-base capitalize">{cat}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {categoryRanking(cat).map((u) => (
                                    <div key={u.unit_id} className="flex justify-between items-center text-sm">
                                        <Badge variant="outline">{u.unit_name}</Badge>
                                        <span className="font-semibold">{u[cat]}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            {/* Individual ranking */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>🏅 Ranking Individual de Membros</CardTitle>
                        <div className="w-64">
                            <Label>Filtrar por Cargo</Label>
                            <Select value={filtroCargo} onValueChange={setFiltroCargo}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {cargosDisponiveis.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c === "todos" ? "Todos os Cargos" : c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {rankingIndividual.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sem dados para este período.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Nome</th>
                                        <th className="px-4 py-3">Unidade</th>
                                        <th className="px-4 py-3 text-center">Presença</th>
                                        <th className="px-4 py-3 text-center">Pontualidade</th>
                                        <th className="px-4 py-3 text-center">Uniforme</th>
                                        <th className="px-4 py-3 text-center">Modéstia</th>
                                        <th className="px-4 py-3 text-center">Bônus</th>
                                        <th className="px-4 py-3 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankingIndividual.map((entry, i) => (
                                        <tr key={entry.user_id} className="border-b">
                                            <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                            <td className="px-4 py-3 font-medium">
                                                {entry.name ?? entry.document}
                                            </td>
                                            <td className="px-4 py-3">
                                                {entry.unit_name
                                                    ? <Badge variant="outline">{entry.unit_name}</Badge>
                                                    : <span className="text-xs text-muted-foreground italic">—</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-center">{entry.presenca}</td>
                                            <td className="px-4 py-3 text-center">{entry.pontualidade}</td>
                                            <td className="px-4 py-3 text-center">{entry.uniforme}</td>
                                            <td className="px-4 py-3 text-center">{entry.modestia}</td>
                                            <td className="px-4 py-3 text-center">{entry.bonus}</td>
                                            <td className="px-4 py-3 text-center font-bold text-primary">{entry.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
