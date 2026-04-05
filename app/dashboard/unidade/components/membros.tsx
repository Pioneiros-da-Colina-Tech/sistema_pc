"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MembroUnidade } from "../page"

export default function MembrosUnidadeTab({ membrosDaUnidade }: { membrosDaUnidade: MembroUnidade[] }) {
    if (membrosDaUnidade.length === 0) {
        return (
            <Card>
                <CardHeader><CardTitle>Membros da Unidade</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Nenhum membro nesta unidade para o ano atual.</p></CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader><CardTitle>Membros da Unidade</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membrosDaUnidade.map((membro) => (
                    <Card key={membro.id} className="p-4">
                        <p className="font-semibold">{membro.nome}</p>
                        <div className="text-sm text-muted-foreground capitalize">
                            <span>{membro.cargo}</span>
                            {membro.codigo_sgc && <span> | SGC: {membro.codigo_sgc}</span>}
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
