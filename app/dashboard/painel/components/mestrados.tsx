"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const mestradosMock = [
    { id: 1, nome: "Especialidades Técnicas", progresso: 2, total: 7, especialidades: ["Internet", "Computação"], status: "em-andamento" },
    { id: 2, nome: "Especialidades de Saúde", progresso: 7, total: 7, especialidades: ["Primeiros Socorros", "Enfermagem", "Nutrição"], status: "concluido" },
]

export default function MestradosTab() {
    const [mestrados] = useState(mestradosMock);

    return (
        <Card>
            <CardHeader><CardTitle>Mestrados</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mestrados.map((mestrado) => (
                        <Card key={mestrado.id} className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{mestrado.nome}</h4>
                                    <Badge variant={mestrado.status === "concluido" ? "secondary" : "outline"}>{mestrado.status === "concluido" ? "Concluído" : "Em Andamento"}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm"><span>{mestrado.progresso}/{mestrado.total}</span><span>{Math.round((mestrado.progresso / mestrado.total) * 100)}%</span></div>
                                    <Progress value={(mestrado.progresso / mestrado.total) * 100} />
                                </div>
                                <div className="space-y-2">
                                    <h5 className="text-sm font-medium">Especialidades:</h5>
                                    <div className="flex flex-wrap gap-1">{mestrado.especialidades.map((esp, index) => (<Badge key={index} variant="outline" className="text-xs">{esp}</Badge>))}</div>
                                </div>
                                {mestrado.status === "concluido" && <Button size="sm">Solicitar</Button>}
                            </div>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}