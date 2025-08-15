"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"

// --- Dados Mockados ---
const patrimonioMock = [
    { id: 1, nome: "Barraca Iglú 4 Pessoas", quantidade: 5, descricao: "Modelo Mor", data_aquisicao: "2023-03-15" },
    { id: 2, nome: "Corda de Sisal 10mm", quantidade: 2, descricao: "Rolo de 50 metros", data_aquisicao: "2023-04-20" },
    { id: 3, nome: "Bússola Profissional", quantidade: 10, descricao: "Modelo militar", data_aquisicao: "2023-01-10" },
]
// --- Fim dos Dados Mockados ---

export default function GerenciarPatrimonioTab() {
    const [itens, setItens] = useState(patrimonioMock)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Plus/> Adicionar Item ao Patrimônio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="nome">Nome do Item</Label><Input id="nome" placeholder="Ex: Barraca"/></div>
                        <div className="space-y-2"><Label htmlFor="quantidade">Quantidade</Label><Input id="quantidade" type="number" defaultValue="1"/></div>
                        <div className="space-y-2"><Label htmlFor="data">Data de Aquisição</Label><Input id="data" type="date"/></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="descricao">Descrição (opcional)</Label><Textarea id="descricao" placeholder="Detalhes do item..."/></div>
                    <Button>Adicionar Item</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>📋 Itens no Patrimônio</CardTitle>
                    <CardDescription>Visualize, edite ou remova os itens existentes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left">Nome</th>
                                <th className="px-6 py-3 text-center">Quantidade</th>
                                <th className="px-6 py-3 text-left">Descrição</th>
                                <th className="px-6 py-3 text-center">Data de Aquisição</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {itens.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 font-medium">{item.nome}</td>
                                    <td className="px-6 py-4 text-center">{item.quantidade}</td>
                                    <td className="px-6 py-4">{item.descricao}</td>
                                    <td className="px-6 py-4 text-center">{new Date(item.data_aquisicao).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm"><Edit className="h-4 w-4"/></Button>
                                            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    </td>
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