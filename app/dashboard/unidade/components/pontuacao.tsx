"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { scoresApi, type UserRankingEntry } from "@/lib/api"
import type { MembroUnidade } from "../page"

export default function PontuacaoTab({ membrosDaUnidade, pontuacaoTotal }: { membrosDaUnidade: MembroUnidade[]; pontuacaoTotal: number | null }) {
    const [ranking, setRanking] = useState<UserRankingEntry[]>([])

    useEffect(() => {
        const currentYear = new Date().getFullYear().toString()
        scoresApi.getRanking(currentYear, 1)
            .then((res) => setRanking(res.data.individual))
            .catch(console.error)
    }, [])

    const userIds = new Set(membrosDaUnidade.map((m) => m.id))
    const membroRanking = ranking.filter((r) => userIds.has(r.user_id))

    return (
        <Card>
            <CardHeader><CardTitle>Pontuação Detalhada da Unidade</CardTitle></CardHeader>
            <CardContent>
                {membroRanking.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem pontuação registrada para este período.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted">
                                <tr>
                                    <th className="px-6 py-3 text-left">Membro</th>
                                    <th className="px-6 py-3 text-center">Presença</th>
                                    <th className="px-6 py-3 text-center">Pontualidade</th>
                                    <th className="px-6 py-3 text-center">Uniforme</th>
                                    <th className="px-6 py-3 text-center">Modéstia</th>
                                    <th className="px-6 py-3 text-center">Bônus</th>
                                    <th className="px-6 py-3 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membroRanking.map((entry) => (
                                    <tr key={entry.user_id} className="border-b">
                                        <td className="px-6 py-4 font-medium">{entry.name ?? entry.document}</td>
                                        <td className="px-6 py-4 text-center">{entry.presenca}</td>
                                        <td className="px-6 py-4 text-center">{entry.pontualidade}</td>
                                        <td className="px-6 py-4 text-center">{entry.uniforme}</td>
                                        <td className="px-6 py-4 text-center">{entry.modestia}</td>
                                        <td className="px-6 py-4 text-center">{entry.bonus}</td>
                                        <td className="px-6 py-4 text-center font-bold text-primary">{entry.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
