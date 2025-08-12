"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const minhasEspecialidadesMock = [
    { id: 1, nome: "Internet", codigo: "AP-034", status: "concluida" },
    { id: 2, nome: "Primeiros Socorros", codigo: "PS-001", status: "em-andamento" },
]

export default function EspecialidadesTab() {
    const [minhasEspecialidades] = useState(minhasEspecialidadesMock);

    return (
        <Card>
            <CardHeader><CardTitle>Minhas Especialidades</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-3">
                        <h4 className="font-medium">Especialidades Registradas</h4>
                        <div className="space-y-2">
                            {minhasEspecialidades.map((esp) => (
                                <div key={esp.id} className="flex items-center justify-between p-3 border rounded">
                                    <div className="flex items-center gap-3"><span className="font-medium">{esp.nome}</span><Badge variant="outline">{esp.codigo}</Badge></div>
                                    <Badge variant={esp.status === "concluida" ? "default" : "secondary"}>{esp.status === "concluida" ? "Concluída" : "Em Andamento"}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}