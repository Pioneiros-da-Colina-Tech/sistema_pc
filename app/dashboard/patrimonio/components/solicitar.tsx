"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

// --- Dados Mockados ---
const patrimonioMock = [
    { id: 1, nome: "Barraca Iglú 4 Pessoas", quantidadeTotal: 5 },
    { id: 2, nome: "Corda de Sisal 10mm", quantidadeTotal: 2 },
    { id: 3, nome: "Bússola Profissional", quantidadeTotal: 10 },
    { id: 4, nome: "Caixa de Primeiros Socorros", quantidadeTotal: 3 },
]

const reunioesMock = [
    { id: 1, nome: "Reunião Geral", data: "2025-01-25" },
    { id: 2, nome: "Treinamento de Liderança", data: "2025-02-10" },
    { id: 3, nome: "Acampamento de Unidade", data: "2025-03-15" },
]

// Simula solicitações já feitas para diferentes reuniões
const solicitacoesExistentesMock = [
    { reuniaoId: 1, itemId: 1, quantidade: 2 }, // 2 barracas para Reunião Geral
    { reuniaoId: 3, itemId: 1, quantidade: 4 }, // 4 barracas para Acampamento
    { reuniaoId: 3, itemId: 2, quantidade: 1 }, // 1 corda para Acampamento
]

// Simula o histórico de solicitações do usuário logado
const minhasSolicitacoesMock = [
    { id: 101, reuniaoId: 1, status: "aprovado", itens: [{ nome: "Barraca Iglú 4 Pessoas", quantidade: 2 }] },
    { id: 102, reuniaoId: 3, status: "reprovado", motivoReprovacao: "Quantidade de barracas indisponível para a data.", itens: [{ nome: "Barraca Iglú 4 Pessoas", quantidade: 4 }, { nome: "Corda de Sisal 10mm", quantidade: 1 }] },
    { id: 103, reuniaoId: 2, status: "pendente", itens: [{ nome: "Bússola Profissional", quantidade: 10 }] },
]

// --- Fim dos Dados Mockados ---

export default function SolicitarMateriaisTab() {
    const [reuniaoSelecionadaId, setReuniaoSelecionadaId] = useState<string | undefined>();
    const [solicitacoes, setSolicitacoes] = useState<Record<string, number>>({});

    const handleQuantidadeChange = (itemId: number, quantidade: number) => {
        setSolicitacoes(prev => ({
            ...prev,
            [itemId]: quantidade,
        }));
    };

    const getQuantidadeDisponivel = (itemId: number, quantidadeTotal: number) => {
        const jaSolicitado = solicitacoesExistentesMock
            .filter(s => s.reuniaoId.toString() === reuniaoSelecionadaId && s.itemId === itemId)
            .reduce((acc, curr) => acc + curr.quantidade, 0);
        return quantidadeTotal - jaSolicitado;
    };

    const handleSalvarSolicitacoes = () => {
        // Aqui você adicionaria a lógica para salvar as 'solicitacoes' no banco de dados
        alert(`Solicitações para a reunião ID ${reuniaoSelecionadaId} salvas com sucesso!`);
        console.log(solicitacoes);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Solicitar Material do Patrimônio</CardTitle>
                    <CardDescription>Selecione a reunião e informe a quantidade necessária de cada item.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Primeiro, selecione a Reunião</Label>
                        <Select onValueChange={setReuniaoSelecionadaId}>
                            <SelectTrigger className="w-full md:w-1/2">
                                <SelectValue placeholder="Selecione uma reunião..." />
                            </SelectTrigger>
                            <SelectContent>
                                {reunioesMock.map(reuniao => (
                                    <SelectItem key={reuniao.id} value={reuniao.id.toString()}>
                                        {reuniao.nome} ({new Date(reuniao.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {reuniaoSelecionadaId && (
                        <div className="pt-4 border-t">
                            <div className="space-y-3">
                                {patrimonioMock.map(item => {
                                    const disponivel = getQuantidadeDisponivel(item.id, item.quantidadeTotal);
                                    return (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-2 border rounded-md">
                                            <div className="col-span-6">
                                                <p className="font-medium">{item.nome}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Total no estoque: {item.quantidadeTotal} | Disponível para esta reunião: {disponivel}
                                                </p>
                                            </div>
                                            <div className="col-span-3">
                                                <Label htmlFor={`item-${item.id}`} className="sr-only">Quantidade</Label>
                                                <Input
                                                    id={`item-${item.id}`}
                                                    type="number"
                                                    placeholder="Qtd."
                                                    min="0"
                                                    max={disponivel}
                                                    onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <Button className="mt-6" onClick={handleSalvarSolicitacoes}>Enviar Solicitação</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Minhas Solicitações</CardTitle>
                    <CardDescription>Acompanhe o status das suas solicitações de material.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {minhasSolicitacoesMock.map(sol => {
                        const reuniao = reunioesMock.find(r => r.id === sol.reuniaoId);
                        return (
                            <div key={sol.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-md mb-2">
                                            {reuniao?.nome} - {reuniao && new Date(reuniao.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                        </h4>
                                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                            {sol.itens.map(item => <li key={item.nome}>{item.nome} (Qtd: {item.quantidade})</li>)}
                                        </ul>
                                    </div>
                                    <Badge variant={sol.status === 'aprovado' ? 'default' : sol.status === 'reprovado' ? 'destructive' : 'secondary'}>
                                        {sol.status}
                                    </Badge>
                                </div>
                                {sol.status === 'reprovado' && sol.motivoReprovacao && (
                                    <div className="mt-3 pt-3 border-t text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4"/>
                                        <div>
                                            <span className="font-semibold">Motivo da reprovação:</span> {sol.motivoReprovacao}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    )
}