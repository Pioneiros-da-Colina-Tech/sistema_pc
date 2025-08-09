"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, TrendingDown, PieChart, Edit, Plus, Users, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

// --- Dados Mockados ---
const membrosMock = [
    { id: 1, nome: "João Silva", cargo: "Desbravador" },
    { id: 2, nome: "Maria Santos", cargo: "Diretoria" },
    { id: 3, nome: "Pedro Costa", cargo: "Desbravador" },
]

const mensalidadesMock = [
    { id: 1, mes: "Janeiro 2025", valor: 50.00 },
    { id: 2, mes: "Fevereiro 2025", valor: 50.00 },
]

const eventosMock = [
    { id: 1, nome: "Acampamento de Verão", valorDesbravador: 150.00, valorDiretoria: 75.00, inscritos: [1, 2, 3] },
    { id: 2, nome: "Caminhada Ecológica", valorDesbravador: 25.00, valorDiretoria: 10.00, inscritos: [2] },
]

const pagamentosEventosMock = [
    { membroId: 1, eventoId: 1, status: "pago", metodo: "Cartão" }, // João (Desbravador)
    { membroId: 2, eventoId: 1, status: "pago", metodo: "Pix" },    // Maria (Diretoria)
    { membroId: 3, eventoId: 1, status: "pendente", metodo: "N/A" }, // Pedro (Desbravador)
]

const fluxoCaixaMock = [
    { id: 1, tipo: "entrada", descricao: "Doação Anônima", valor: 200.00, data: "2025-01-15", metodo: "Dinheiro", categoria: "Geral" },
    { id: 2, tipo: "saida", descricao: "Compra de material de limpeza", valor: 80.00, data: "2025-01-16", metodo: "Pix", categoria: "Geral" },
    { id: 3, tipo: "entrada", descricao: "Venda de lanches", valor: 150.00, data: "2025-01-25", metodo: "Dinheiro", categoria: "Acampamento de Verão" },
    { id: 4, tipo: "saida", descricao: "Transporte para acampamento", valor: 400.00, data: "2025-01-28", metodo: "Pix", categoria: "Acampamento de Verão" },
    { id: 5, tipo: "saida", descricao: "Aluguel de Equipamento", valor: 120.00, data: "2025-02-10", metodo: "Pix", categoria: "Geral" },
]
// --- Fim dos Dados Mockados ---

export default function TesourariaPage() {
    const [mesRelatorio, setMesRelatorio] = useState("2025-01");
    const [eventoRelatorioId, setEventoRelatorioId] = useState<string | undefined>();

    // --- Lógica para Relatório Mensal ---
    const mesesDisponiveis = [...new Set(fluxoCaixaMock.map(item => item.data.substring(0, 7)))];
    const lancamentosDoMes = fluxoCaixaMock.filter(item => item.data.startsWith(mesRelatorio));
    const entradasDoMes = lancamentosDoMes.filter(item => item.tipo === 'entrada');
    const saidasDoMes = lancamentosDoMes.filter(item => item.tipo === 'saida');
    const totalEntradasDoMes = entradasDoMes.reduce((acc, item) => acc + item.valor, 0);
    const totalSaidasDoMes = saidasDoMes.reduce((acc, item) => acc + item.valor, 0);
    const saldoDoMes = totalEntradasDoMes - totalSaidasDoMes;

    // --- Lógica para Relatório de Eventos ---
    const eventoSelecionado = eventosMock.find(e => e.id.toString() === eventoRelatorioId);
    const pagamentosDoEvento = pagamentosEventosMock.filter(p => p.eventoId.toString() === eventoRelatorioId);

    const totalEntradasPagamentos = pagamentosDoEvento.reduce((acc, pagamento) => {
        if (pagamento.status === 'pago') {
            const membro = membrosMock.find(m => m.id === pagamento.membroId);
            if (membro && eventoSelecionado) {
                return acc + (membro.cargo === 'Diretoria' ? eventoSelecionado.valorDiretoria : eventoSelecionado.valorDesbravador);
            }
        }
        return acc;
    }, 0);

    const totalEntradasCaixa = fluxoCaixaMock.filter(f => f.tipo === 'entrada' && f.categoria === eventoSelecionado?.nome).reduce((acc, item) => acc + item.valor, 0);
    const totalEntradas = totalEntradasPagamentos + totalEntradasCaixa;
    const totalSaidas = fluxoCaixaMock.filter(f => f.tipo === 'saida' && f.categoria === eventoSelecionado?.nome).reduce((acc, item) => acc + item.valor, 0);
    const saldoEvento = totalEntradas - totalSaidas;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tesouraria</h1>
                <p className="text-muted-foreground">Controle financeiro da organização</p>
            </div>

            <Tabs defaultValue="visao-geral">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                    <TabsTrigger value="fluxo-caixa">Fluxo de Caixa</TabsTrigger>
                    <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
                    <TabsTrigger value="eventos">Eventos</TabsTrigger>
                    <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                </TabsList>

                <TabsContent value="visao-geral" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Receitas</CardTitle><TrendingUp className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">R$ 2.450,00</div><p className="text-xs text-muted-foreground">Este mês</p></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Despesas</CardTitle><TrendingDown className="h-4 w-4 text-red-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">R$ 1.850,00</div><p className="text-xs text-muted-foreground">Este mês</p></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Saldo</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">R$ 600,00</div><p className="text-xs text-muted-foreground">Disponível</p></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Orçamento</CardTitle><PieChart className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">75%</div><p className="text-xs text-muted-foreground">Utilizado</p></CardContent></Card>
                    </div>
                </TabsContent>

                <TabsContent value="fluxo-caixa" className="space-y-4">
                    <Card><CardHeader><CardTitle>Registrar Lançamento no Caixa</CardTitle><CardDescription>Adicione uma nova entrada ou saída ao fluxo de caixa.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="space-y-2"><Label>Tipo de Lançamento</Label><Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saída</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Categoria</Label><Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="geral">Geral</SelectItem>{eventosMock.map(e => <SelectItem key={e.id} value={e.nome}>{e.nome}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Método</Label><Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="pix">Pix</SelectItem><SelectItem value="cartao">Cartão</SelectItem><SelectItem value="dinheiro">Dinheiro</SelectItem></SelectContent></Select></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="space-y-2"><Label htmlFor="descricao">Descrição</Label><Input id="descricao" placeholder="Ex: Compra de material" /></div><div className="space-y-2"><Label htmlFor="valor">Valor</Label><Input id="valor" type="number" placeholder="R$ 0,00" /></div><div className="space-y-2"><Label htmlFor="data">Data</Label><Input id="data" type="date" /></div></div><Button>Registrar Lançamento</Button></CardContent></Card>
                    <Card><CardHeader><CardTitle>Últimos Lançamentos</CardTitle></CardHeader><CardContent><div className="space-y-3">{fluxoCaixaMock.map(item => (<div key={item.id} className={`flex justify-between items-center p-3 rounded ${item.tipo === 'entrada' ? 'bg-green-50' : 'bg-red-50'}`}><div className="flex items-center gap-3">{item.tipo === 'entrada' ? <ArrowUpCircle className="h-5 w-5 text-green-600"/> : <ArrowDownCircle className="h-5 w-5 text-red-600"/>}<div><p className="font-medium">{item.descricao}</p><p className="text-sm text-muted-foreground">{item.data} - {item.categoria}</p></div></div><span className={`font-bold ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>R$ {item.valor.toFixed(2)}</span></div>))}</div></CardContent></Card>
                </TabsContent>

                <TabsContent value="mensalidades" className="space-y-4">
                    <Card><CardHeader><CardTitle>Gerenciar Mensalidades</CardTitle></CardHeader><CardContent className="space-y-4">{mensalidadesMock.map(m => (<div key={m.id} className="flex items-center justify-between p-3 border rounded-md"><div><p className="font-semibold">{m.mes}</p><p className="text-lg">R$ {m.valor.toFixed(2)}</p></div><Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" /> Editar</Button></div>))}<div className="pt-4 border-t"><Button><Plus className="h-4 w-4 mr-2"/> Criar Novo Mês</Button></div></CardContent></Card>
                    <Card><CardHeader><CardTitle>Registrar Pagamento de Mensalidade</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Mês</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o mês..." /></SelectTrigger><SelectContent>{mensalidadesMock.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.mes}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Membro</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o membro..." /></SelectTrigger><SelectContent>{membrosMock.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nome}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Método de Pagamento</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o método..." /></SelectTrigger><SelectContent><SelectItem value="pix">Pix</SelectItem><SelectItem value="cartao">Cartão</SelectItem><SelectItem value="dinheiro">Dinheiro</SelectItem><SelectItem value="isento">Isento</SelectItem></SelectContent></Select></div><Button>Registrar Pagamento</Button></CardContent></Card>
                </TabsContent>

                <TabsContent value="eventos" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciar Eventos</CardTitle>
                            <CardDescription>Crie e edite os valores dos eventos para Desbravadores e Diretoria.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {eventosMock.map(e => (
                                <div key={e.id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <p className="font-semibold">{e.nome}</p>
                                        <div className="flex gap-4 text-sm">
                                            <p>Desbravador: <span className="font-medium">R$ {e.valorDesbravador.toFixed(2)}</span></p>
                                            <p>Diretoria: <span className="font-medium">R$ {e.valorDiretoria.toFixed(2)}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground"/> <span>{e.inscritos.length}</span>
                                        <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2"/> Editar</Button>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t">
                                <h4 className="font-semibold mb-2">Criar Novo Evento</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2"><Label>Nome do Evento</Label><Input placeholder="Ex: Acampamento"/></div>
                                    <div className="space-y-2"><Label>Valor (Desbravador)</Label><Input type="number" placeholder="R$ 0,00"/></div>
                                    <div className="space-y-2"><Label>Valor (Diretoria)</Label><Input type="number" placeholder="R$ 0,00"/></div>
                                </div>
                                <Button className="mt-4"><Plus className="h-4 w-4 mr-2"/> Criar Evento</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Inscrição e Pagamento de Eventos</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label>Evento</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o evento..." /></SelectTrigger><SelectContent>{eventosMock.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.nome}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Membro</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o membro..." /></SelectTrigger><SelectContent>{membrosMock.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nome} ({m.cargo})</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Método de Pagamento</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o método..." /></SelectTrigger><SelectContent><SelectItem value="pix">Pix</SelectItem><SelectItem value="cartao">Cartão</SelectItem><SelectItem value="dinheiro">Dinheiro</SelectItem><SelectItem value="isento">Isento</SelectItem></SelectContent></Select></div>
                            <Button>Registrar Inscrição/Pagamento</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="relatorios" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Relatório Mensal / Fechamento de Mês</CardTitle>
                            <CardDescription>Balanço de todas as entradas e saídas registradas no período.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="w-full md:w-1/3">
                                <Label>Selecione o Mês</Label>
                                <Select value={mesRelatorio} onValueChange={setMesRelatorio}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {mesesDisponiveis.map(mes => (
                                            <SelectItem key={mes} value={mes}>
                                                {new Date(mes + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                                <Card className="p-4 text-center"><p className="text-sm font-medium text-green-600">Total de Entradas</p><p className="text-2xl font-bold">R$ {totalEntradasDoMes.toFixed(2)}</p></Card>
                                <Card className="p-4 text-center"><p className="text-sm font-medium text-red-600">Total de Saídas</p><p className="text-2xl font-bold">R$ {totalSaidasDoMes.toFixed(2)}</p></Card>
                                <Card className="p-4 text-center"><p className="text-sm font-medium">Saldo do Mês</p><p className={`text-2xl font-bold ${saldoDoMes >= 0 ? 'text-blue-600' : 'text-red-600'}`}>R$ {saldoDoMes.toFixed(2)}</p></Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Detalhes das Entradas</h4>
                                    <div className="space-y-2">
                                        {entradasDoMes.length > 0 ? entradasDoMes.map(item => (
                                            <div key={item.id} className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                                                <div><p className="font-medium">{item.descricao}</p><p className="text-sm text-muted-foreground">{item.data}</p></div>
                                                <span className="font-semibold text-green-800">R$ {item.valor.toFixed(2)}</span>
                                            </div>
                                        )) : <p className="text-sm text-muted-foreground">Nenhuma entrada registrada.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Detalhes das Saídas</h4>
                                    <div className="space-y-2">
                                        {saidasDoMes.length > 0 ? saidasDoMes.map(item => (
                                            <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                                                <div><p className="font-medium">{item.descricao}</p><p className="text-sm text-muted-foreground">{item.data}</p></div>
                                                <span className="font-semibold text-red-800">R$ {item.valor.toFixed(2)}</span>
                                            </div>
                                        )) : <p className="text-sm text-muted-foreground">Nenhuma saída registrada.</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Relatório de Eventos</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label>Selecione o Evento</Label><Select onValueChange={setEventoRelatorioId}><SelectTrigger><SelectValue placeholder="Selecione o evento..." /></SelectTrigger><SelectContent>{eventosMock.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.nome}</SelectItem>)}</SelectContent></Select></div>
                            {eventoRelatorioId && (
                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <Card className="p-4 text-center"><p className="text-sm font-medium text-green-600">Total de Entradas</p><p className="text-2xl font-bold">R$ {totalEntradas.toFixed(2)}</p></Card>
                                        <Card className="p-4 text-center"><p className="text-sm font-medium text-red-600">Total de Saídas</p><p className="text-2xl font-bold">R$ {totalSaidas.toFixed(2)}</p></Card>
                                        <Card className="p-4 text-center"><p className="text-sm font-medium">Saldo do Evento</p><p className={`text-2xl font-bold ${saldoEvento >= 0 ? 'text-blue-600' : 'text-red-600'}`}>R$ {saldoEvento.toFixed(2)}</p></Card>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg text-center"><p className="text-sm font-medium">Isentos</p><p className="text-2xl font-bold">{pagamentosDoEvento.filter(p=>p.status === 'isento').length}</p></div>
                                        <div className="p-4 bg-yellow-50 rounded-lg text-center"><p className="text-sm font-medium">Em Aberto</p><p className="text-2xl font-bold">{pagamentosDoEvento.filter(p=>p.status === 'pendente').length}</p></div>
                                        <div className="p-4 bg-green-50 rounded-lg text-center"><p className="text-sm font-medium">Pagos</p><p className="text-2xl font-bold">{pagamentosDoEvento.filter(p=>p.status === 'pago').length}</p></div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}