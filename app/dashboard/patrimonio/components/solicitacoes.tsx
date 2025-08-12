"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, CornerDownLeft } from "lucide-react"

// --- Tipos e Dados Mockados ---
type StatusSolicitacao = "pendente" | "aprovado" | "entregue" | "devolvido" | "reprovado";

type Solicitacao = {
    id: number;
    reuniaoId: number;
    unidade: string;
    status: StatusSolicitacao;
    itens: { nome: string; quantidade: number }[];
};

const reunioesMock = [
    { id: 1, nome: "Acampamento de Unidade", data: "2025-03-15" },
    { id: 2, nome: "Reunião Geral", data: "2025-04-05" },
];

const initialSolicitacoes: Solicitacao[] = [
    { id: 1, reuniaoId: 1, unidade: "Jaguar", status: "pendente", itens: [{ nome: "Barraca Iglú 4 Pessoas", quantidade: 2 }, { nome: "Corda de Sisal 10mm", quantidade: 1 }] },
    { id: 2, reuniaoId: 1, unidade: "Gato do Mato", status: "aprovado", itens: [{ nome: "Bússola Profissional", quantidade: 5 }] },
    { id: 3, reuniaoId: 2, unidade: "Jaguar", status: "entregue", itens: [{ nome: "Caixa de Primeiros Socorros", quantidade: 1 }] },
    { id: 4, reuniaoId: 2, unidade: "Gato do Mato", status: "devolvido", itens: [{ nome: "Barraca Iglú 4 Pessoas", quantidade: 1 }] },
];
// --- Fim dos Dados Mockados ---

export default function SolicitacoesTab() {
    const [solicitacoes, setSolicitacoes] = useState(initialSolicitacoes);

    const handleStatusChange = (solicitacaoId: number, novoStatus: StatusSolicitacao) => {
        setSolicitacoes(prev =>
            prev.map(s => s.id === solicitacaoId ? { ...s, status: novoStatus } : s)
        );
    };

    const solicitacoesAgrupadas = solicitacoes.reduce((acc, sol) => {
        const reuniao = reunioesMock.find(r => r.id === sol.reuniaoId);
        if (!reuniao) return acc;

        if (!acc[reuniao.id]) {
            acc[reuniao.id] = { nome: reuniao.nome, data: reuniao.data, solicitacoes: [] };
        }

        acc[reuniao.id].solicitacoes.push(sol);
        return acc;
    }, {} as any);

    const renderActionButtons = (solicitacao: Solicitacao) => {
        switch (solicitacao.status) {
            case 'pendente':
                return (
                    <>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(solicitacao.id, 'aprovado')}><Check className="h-4 w-4 mr-2"/>Aprovar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleStatusChange(solicitacao.id, 'reprovado')}><X className="h-4 w-4 mr-2"/>Reprovar</Button>
                    </>
                );
            case 'aprovado':
                return <Button size="sm" onClick={() => handleStatusChange(solicitacao.id, 'entregue')}><ArrowRight className="h-4 w-4 mr-2"/>Marcar como Entregue</Button>;
            case 'entregue':
                return <Button size="sm" onClick={() => handleStatusChange(solicitacao.id, 'devolvido')}><CornerDownLeft className="h-4 w-4 mr-2"/>Marcar como Devolvido</Button>;
            default:
                return null; // para 'devolvido' e 'reprovado' não há ações
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solicitações de Materiais</CardTitle>
                <CardDescription>Aprove, gerencie a entrega e a devolução dos materiais solicitados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.values(solicitacoesAgrupadas).map((reuniao: any) => (
                    <Card key={reuniao.nome} className="overflow-hidden">
                        <CardHeader className="bg-muted/50">
                            <CardTitle>{reuniao.nome}</CardTitle>
                            <CardDescription>{new Date(reuniao.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {reuniao.solicitacoes.map((sol: Solicitacao) => (
                                <div key={sol.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-md mb-2">Unidade: {sol.unidade}</h4>
                                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                                {sol.itens.map(item => <li key={item.nome}>{item.nome} (Qtd: {item.quantidade})</li>)}
                                            </ul>
                                        </div>
                                        <Badge variant={sol.status === 'devolvido' || sol.status === 'aprovado' ? 'default' : sol.status === 'reprovado' ? 'destructive' : 'secondary'}>
                                            {sol.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                        {renderActionButtons(sol)}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}