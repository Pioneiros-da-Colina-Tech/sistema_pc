"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const especialidadesMock = [
    { id: 1, nome: "Internet", membros: ["João Silva", "Pedro Costa"], status: "aprovado" },
    { id: 2, nome: "Primeiros Socorros", membros: ["Maria Santos"], status: "avaliacao" },
]

export default function ProgressoEspecialidadeTab({ membrosDaUnidade }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Progresso de Especialidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium mb-2">Especialidades em Andamento</h4>
                    {especialidadesMock.map((esp) => (
                        <div key={esp.id} className="border rounded p-4 mb-2">
                            <div className="flex justify-between items-center">
                                <h5 className="font-medium">{esp.nome}</h5>
                                <Badge variant={esp.status === "aprovado" ? "default" : "secondary"}>
                                    {esp.status === "aprovado" ? "Aprovado" : "Em Avaliação"}
                                </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">
                                <p className="font-semibold">Membros:</p>
                                <ul className="list-disc pl-5">
                                    {esp.membros.map((membro, index) => <li key={index}>{membro}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Registrar Nova Especialidade</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Membros</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Selecione os membros" /></SelectTrigger>
                                <SelectContent>
                                    {membrosDaUnidade.map((membro: any) => (
                                        <SelectItem key={membro.id} value={membro.id.toString()}>{membro.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Especialidade</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Selecione a especialidade" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internet">Internet</SelectItem>
                                    <SelectItem value="primeiros-socorros">Primeiros Socorros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button className="mt-4">Registrar</Button>
                </div>
            </CardContent>
        </Card>
    )
}