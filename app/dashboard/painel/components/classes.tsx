"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const minhasClassesMock = [
    { id: 1, nome: "Amigo", codigo: "AM-001", status: "investida" },
    { id: 2, nome: "Companheiro", codigo: "CP-002", status: "em-avaliacao" },
]

export default function ClassesTab() {
    const [minhasClasses] = useState(minhasClassesMock);

    return (
        <Card>
            <CardHeader><CardTitle>Minhas Classes</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-3">
                        <h4 className="font-medium">Classes Registradas</h4>
                        <div className="space-y-2">
                            {minhasClasses.map((classe) => (
                                <div key={classe.id} className="flex items-center justify-between p-3 border rounded">
                                    <div className="flex items-center gap-3"><span className="font-medium">{classe.nome}</span><Badge variant="outline">{classe.codigo}</Badge></div>
                                    <Badge variant={classe.status === "investida" ? "default" : "secondary"}>{classe.status === "investida" ? "Investida" : "Em Avaliação"}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}