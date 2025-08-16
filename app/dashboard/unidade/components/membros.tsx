"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MembrosUnidadeTab({ membrosDaUnidade }: any) {
    return (
        <Card>
            <CardHeader><CardTitle>Membros da Unidade</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membrosDaUnidade.map((membro: any) => (
                    <Card key={membro.id} className="p-4">
                        <p className="font-semibold">{membro.nome}</p>
                        <div className="text-sm text-muted-foreground">
                            <span>{membro.cargo}</span> | <span>SGC: {membro.codigo_sgc}</span>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}