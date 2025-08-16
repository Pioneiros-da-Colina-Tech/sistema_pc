"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const pontuacoesDetalhadasMock = [
    { codigo_sgc: "12345", presenca: 40, pontualidade: 50, uniforme: 35, modestia: 40 },
    { codigo_sgc: "54321", presenca: 48, pontualidade: 50, uniforme: 50, modestia: 50 },
    { codigo_sgc: "67890", presenca: 45, pontualidade: 40, uniforme: 50, modestia: 50 },
]

export default function PontuacaoTab({ membrosDaUnidade, unidadeAtual }: any) {
    return (
        <Card>
            <CardHeader><CardTitle>Pontuação Detalhada da Unidade: {unidadeAtual?.nome}</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left">Membro</th>
                            <th className="px-6 py-3 text-center">Presença</th>
                            <th className="px-6 py-3 text-center">Pontualidade</th>
                            <th className="px-6 py-3 text-center">Uniforme</th>
                            <th className="px-6 py-3 text-center">Modéstia</th>
                            <th className="px-6 py-3 text-center">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {membrosDaUnidade.map((membro: any) => {
                            const pontuacao = pontuacoesDetalhadasMock.find(p => p.codigo_sgc === membro.codigo_sgc);
                            const total = pontuacao ? pontuacao.presenca + pontuacao.pontualidade + pontuacao.uniforme + pontuacao.modestia : 0;
                            return (
                                <tr key={membro.id} className="border-b">
                                    <td className="px-6 py-4 font-medium">{membro.nome}</td>
                                    <td className="px-6 py-4 text-center">{pontuacao?.presenca || 0}</td>
                                    <td className="px-6 py-4 text-center">{pontuacao?.pontualidade || 0}</td>
                                    <td className="px-6 py-4 text-center">{pontuacao?.uniforme || 0}</td>
                                    <td className="px-6 py-4 text-center">{pontuacao?.modestia || 0}</td>
                                    <td className="px-6 py-4 text-center font-bold text-primary">{total}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}