"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, PieChart, Edit, Plus, Users, ArrowUpCircle, ArrowDownCircle, Download, FileClock, CreditCard, CheckCircle2, FileText } from "lucide-react"

// --- Dados Mockados ---
const membrosMock = [
    { id: 1, nome: "João Silva", cargo: "Desbravador" },
    { id: 2, nome: "Maria Santos", cargo: "Diretoria" },
    { id: 3, nome: "Pedro Costa", cargo: "Desbravador" },
    { id: 4, nome: "Ana Pereira", cargo: "Diretoria" },
    { id: 5, nome: "Lucas Martins", cargo: "Desbravador" },
    { id: 6, nome: "Beatriz Lima", cargo: "Desbravador" },
]

const initialMensalidades = [
    { id: 1, mes: "Janeiro 2025", valor: 50.00 },
    { id: 2, mes: "Fevereiro 2025", valor: 50.00 },
]

const initialPagamentosMensalidade = [
    { membroId: 1, mensalidadeId: 1, status: "pago", metodo: "Pix", comprovanteUrl: "/path/to/comprovante_mensal.pdf" },
    { membroId: 2, mensalidadeId: 1, status: "isento", metodo: "N/A" },
    { membroId: 3, mensalidadeId: 1, status: "pendente", metodo: "N/A" },
]

const initialEventos = [
    { id: 1, nome: "Acampamento de Verão", valorDesbravador: 150.00, valorDiretoria: 75.00, inscritos: [1, 2, 3, 4, 5, 6] },
    { id: 2, nome: "Caminhada Ecológica", valorDesbravador: 25.00, valorDiretoria: 10.00, inscritos: [2] },
]

const initialPagamentosEventos = [
    { membroId: 1, eventoId: 1, status: "pago", metodo: "Cartão" },
    { membroId: 2, eventoId: 1, status: "pago", metodo: "Pix", comprovanteUrl: "/path/to/comprovante1.pdf" },
    { membroId: 3, eventoId: 1, status: "pendente", metodo: "N/A" },
    { membroId: 4, eventoId: 1, status: "aguardando-cartao", metodo: "Cartão/Dinheiro" },
    { membroId: 5, eventoId: 1, status: "aguardando-pix", metodo: "Pix" },
    { membroId: 6, eventoId: 1, status: "pago", metodo: "Pix", comprovanteUrl: "/path/to/comprovante2.pdf" },
]

const fluxoCaixaMock = [
    { id: 1, tipo: "entrada", descricao: "Doação Anônima", valor: 200.00, data: "2025-01-15", metodo: "Dinheiro", categoria: "Geral" },
    { id: 2, tipo: "saida", descricao: "Compra de material de limpeza", valor: 80.00, data: "2025-01-16", metodo: "Pix", categoria: "Geral" },
]
// --- Fim dos Dados Mockados ---

export default function TesourariaPage() {
    const [mesRelatorio, setMesRelatorio] = useState("2025-01");
    const [eventoRelatorioId, setEventoRelatorioId] = useState<string | undefined>();
    const [eventoGerenciarId, setEventoGerenciarId] = useState<string | undefined>();
    const [pagamentosEventos, setPagamentosEventos] = useState(initialPagamentosEventos);
    const [pagamentosMensalidade, setPagamentosMensalidade] = useState(initialPagamentosMensalidade);
    const [mensalidadeSelecionadaId, setMensalidadeSelecionadaId] = useState<string | undefined>("1");
    const [mensalidadeSearchTerm, setMensalidadeSearchTerm] = useState("");
    const [eventoSearchTerm, setEventoSearchTerm] = useState("");

    // --- Lógica Geral ---
    const handleMarcarComoPago = (membroId: number, eventoId: number) => {
        setPagamentosEventos(prev => prev.map(p => p.membroId === membroId && p.eventoId === eventoId ? { ...p, status: 'pago' } : p));
    };

    const handleMarcarMensalidade = (membroId: number, mensalidadeId: number, status: string, metodo: string) => {
        setPagamentosMensalidade(prev => {
            const index = prev.findIndex(p => p.membroId === membroId && p.mensalidadeId === mensalidadeId);
            if (index > -1) {
                const newPagamentos = [...prev];
                newPagamentos[index] = { ...newPagamentos[index], status, metodo };
                return newPagamentos;
            }
            return [...prev, { membroId, mensalidadeId, status, metodo, comprovanteUrl: undefined }];
        });
    };

    // --- Lógica para Aba Mensalidades ---
    const membrosFiltrados = membrosMock.filter(m => m.nome.toLowerCase().includes(mensalidadeSearchTerm.toLowerCase()));
    const pagamentosDoMes = pagamentosMensalidade.filter(p => p.mensalidadeId.toString() === mensalidadeSelecionadaId);
    const isentosDoMes = pagamentosDoMes.filter(p => p.status === 'isento').length;
    const atrasadosDoMes = membrosMock.length - pagamentosDoMes.filter(p => p.status !== 'pendente').length;

    // --- Lógica para Aba Eventos ---
    const eventoGerenciarSelecionado = initialEventos.find(e => e.id.toString() === eventoGerenciarId);
    const pagamentosDoEventoGerenciado = pagamentosEventos.filter(p => p.eventoId.toString() === eventoGerenciarId);

    const pendentesFiltrados = pagamentosDoEventoGerenciado.filter(p => {
        const membro = membrosMock.find(m => m.id === p.membroId);
        return membro && membro.nome.toLowerCase().includes(eventoSearchTerm.toLowerCase());
    });

    const pendentesCartao = pendentesFiltrados.filter(p => p.status === 'aguardando-cartao');
    const pendentesPix = pendentesFiltrados.filter(p => p.status === 'aguardando-pix');
    const pagosNoEvento = pagamentosDoEventoGerenciado.filter(p => p.status === 'pago');

    const inscritosDesbravadores = eventoGerenciarSelecionado?.inscritos.filter(id => membrosMock.find(m => m.id === id)?.cargo === 'Desbravador').length || 0;
    const pagosDesbravadores = pagosNoEvento.filter(p => membrosMock.find(m => m.id === p.membroId)?.cargo === 'Desbravador').length;
    const inscritosDiretoria = eventoGerenciarSelecionado?.inscritos.filter(id => membrosMock.find(m => m.id === id)?.cargo === 'Diretoria').length || 0;
    const pagosDiretoria = pagosNoEvento.filter(p => membrosMock.find(m => m.id === p.membroId)?.cargo === 'Diretoria').length;

    // --- Lógica para Aba Relatórios ---
    const mesesDisponiveis = [...new Set(fluxoCaixaMock.map(item => item.data.substring(0, 7)))];
    const lancamentosDoMes = fluxoCaixaMock.filter(item => item.data.startsWith(mesRelatorio));
    const entradasDoMes = lancamentosDoMes.filter(item => item.tipo === 'entrada');
    const saidasDoMes = lancamentosDoMes.filter(item => item.tipo === 'saida');
    const totalEntradasDoMes = entradasDoMes.reduce((acc, item) => acc + item.valor, 0);
    const totalSaidasDoMes = saidasDoMes.reduce((acc, item) => acc + item.valor, 0);
    const saldoDoMes = totalEntradasDoMes - totalSaidasDoMes;
    const eventoSelecionadoRelatorio = initialEventos.find(e => e.id.toString() === eventoRelatorioId);
    const pagamentosDoEventoRelatorio = pagamentosEventos.filter(p => p.eventoId.toString() === eventoRelatorioId);

    const totalEntradasPagamentosRelatorio = pagamentosDoEventoRelatorio.reduce((acc, pagamento) => {
        if (pagamento.status === 'pago') {
            const membro = membrosMock.find(m => m.id === pagamento.membroId);
            if (membro && eventoSelecionadoRelatorio) {
                return acc + (membro.cargo === 'Diretoria' ? eventoSelecionadoRelatorio.valorDiretoria : eventoSelecionadoRelatorio.valorDesbravador);
            }
        }
        return acc;
    }, 0);

    const totalEntradasCaixaRelatorio = fluxoCaixaMock.filter(f => f.tipo === 'entrada' && f.categoria === eventoSelecionadoRelatorio?.nome).reduce((acc, item) => acc + item.valor, 0);
    const totalEntradasRelatorio = totalEntradasPagamentosRelatorio + totalEntradasCaixaRelatorio;
    const totalSaidasRelatorio = fluxoCaixaMock.filter(f => f.tipo === 'saida' && f.categoria === eventoSelecionadoRelatorio?.nome).reduce((acc, item) => acc + item.valor, 0);
    const saldoEventoRelatorio = totalEntradasRelatorio - totalSaidasRelatorio;

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold">Tesouraria</h1><p className="text-muted-foreground">Controle financeiro da organização</p></div>
            <Tabs defaultValue="visao-geral">
                <TabsList className="grid w-full grid-cols-5"><TabsTrigger value="visao-geral">Visão Geral</TabsTrigger><TabsTrigger value="fluxo-caixa">Fluxo de Caixa</TabsTrigger><TabsTrigger value="mensalidades">Mensalidades</TabsTrigger><TabsTrigger value="eventos">Eventos</TabsTrigger><TabsTrigger value="relatorios">Relatórios</TabsTrigger></TabsList>

                <TabsContent value="visao-geral" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Receitas</CardTitle><TrendingUp className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">R$ 2.450,00</div><p className="text-xs text-muted-foreground">Este mês</p></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Despesas</CardTitle><TrendingDown className="h-4 w-4 text-red-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">R$ 1.850,00</div><p className="text-xs text-muted-foreground">Este mês</p></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Saldo</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">R$ 600,00</div><p className="text-xs text-muted-foreground">Disponível</p></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Orçamento</CardTitle><PieChart className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">75%</div><p className="text-xs text-muted-foreground">Utilizado</p></CardContent></Card></div>
                </TabsContent>

                <TabsContent value="fluxo-caixa" className="space-y-4">
                    <Card><CardHeader><CardTitle>Registrar Lançamento no Caixa</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="space-y-2"><Label>Tipo</Label><Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saída</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Categoria</Label><Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="geral">Geral</SelectItem>{initialEventos.map(e => <SelectItem key={e.id} value={e.nome}>{e.nome}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Método</Label><Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="pix">Pix</SelectItem><SelectItem value="cartao">Cartão</SelectItem><SelectItem value="dinheiro">Dinheiro</SelectItem></SelectContent></Select></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="space-y-2"><Label htmlFor="descricao">Descrição</Label><Input id="descricao" placeholder="Ex: Compra de material" /></div><div className="space-y-2"><Label htmlFor="valor">Valor</Label><Input id="valor" type="number" placeholder="R$ 0,00" /></div><div className="space-y-2"><Label htmlFor="data">Data</Label><Input id="data" type="date" /></div></div><Button>Registrar Lançamento</Button></CardContent></Card>
                    <Card><CardHeader><CardTitle>Últimos Lançamentos</CardTitle></CardHeader><CardContent><div className="space-y-3">{fluxoCaixaMock.map(item => (<div key={item.id} className={`flex justify-between items-center p-3 rounded ${item.tipo === 'entrada' ? 'bg-green-50' : 'bg-red-50'}`}><div className="flex items-center gap-3">{item.tipo === 'entrada' ? <ArrowUpCircle className="h-5 w-5 text-green-600"/> : <ArrowDownCircle className="h-5 w-5 text-red-600"/>}<div><p className="font-medium">{item.descricao}</p><p className="text-sm text-muted-foreground">{item.data} - {item.categoria}</p></div></div><span className={`font-bold ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>R$ {item.valor.toFixed(2)}</span></div>))}</div></CardContent></Card>
                </TabsContent>

                <TabsContent value="mensalidades" className="space-y-4">
                    <Card><CardHeader><CardTitle>Gerenciar Mensalidades</CardTitle></CardHeader><CardContent className="space-y-4">{initialMensalidades.map(m => (<div key={m.id} className="flex items-center justify-between p-3 border rounded-md"><div><p className="font-semibold">{m.mes}</p><p className="text-lg">R$ {m.valor.toFixed(2)}</p></div><Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" /> Editar</Button></div>))}<div className="pt-4 border-t"><h4 className="font-semibold mb-2">Criar Novo Mês</h4><div className="flex gap-4"><Input placeholder="Nome do Mês (Ex: Março 2025)"/><Input type="number" placeholder="Valor R$"/><Button><Plus className="h-4 w-4 mr-2"/> Criar</Button></div></div></CardContent></Card>
                    <Card><CardHeader><CardTitle>Controle de Pagamentos</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4"><div className="flex-1 space-y-2"><Label>Selecione o Mês</Label><Select onValueChange={setMensalidadeSelecionadaId} defaultValue="1"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{initialMensalidades.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.mes}</SelectItem>)}</SelectContent></Select></div><div className="flex-1 space-y-2"><Label>Buscar Membro</Label><Input placeholder="Filtrar por nome..." value={mensalidadeSearchTerm} onChange={(e) => setMensalidadeSearchTerm(e.target.value)} /></div></div>
                            {mensalidadeSelecionadaId && (
                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-2 gap-4 mb-4"><div className="p-4 bg-yellow-50 rounded-lg text-center"><p className="text-sm font-medium">Em Atraso</p><p className="text-2xl font-bold">{atrasadosDoMes}</p></div><div className="p-4 bg-blue-50 rounded-lg text-center"><p className="text-sm font-medium">Isentos</p><p className="text-2xl font-bold">{isentosDoMes}</p></div></div>
                                    <div className="space-y-2">
                                        {membrosFiltrados.map(membro => {
                                            const pagamento = pagamentosDoMes.find(p => p.membroId === membro.id);
                                            const status = pagamento?.status || 'pendente';
                                            const metodo = pagamento?.metodo || 'N/A';
                                            return (
                                                <div key={membro.id} className="flex justify-between items-center p-2 border rounded-md">
                                                    <p>{membro.nome}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={status === 'pago' ? 'default' : status === 'isento' ? 'secondary' : 'destructive'}>{status === 'pago' ? `Pago (${metodo})` : status}</Badge>
                                                        {status === 'pendente' && (<><Button size="sm" variant="outline" onClick={() => handleMarcarMensalidade(membro.id, parseInt(mensalidadeSelecionadaId), 'pago', 'Cartão/Dinheiro')}>Dinheiro/Cartão</Button><Button size="sm" variant="outline" onClick={() => handleMarcarMensalidade(membro.id, parseInt(mensalidadeSelecionadaId), 'pago', 'Pix')}>Pix</Button><Button size="sm" variant="ghost" onClick={() => handleMarcarMensalidade(membro.id, parseInt(mensalidadeSelecionadaId), 'isento', 'N/A')}>Isentar</Button></>)}
                                                        {pagamento?.comprovanteUrl && <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-2"/>Comprovante</Button>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="eventos" className="space-y-4">
                    <Card><CardHeader><CardTitle>Gerenciar Eventos</CardTitle></CardHeader><CardContent className="space-y-4">{initialEventos.map(e => (<div key={e.id} className="flex items-center justify-between p-3 border rounded-md"><div><p className="font-semibold">{e.nome}</p><div className="flex gap-4 text-sm"><p>Desbravador: <span className="font-medium">R$ {e.valorDesbravador.toFixed(2)}</span></p><p>Diretoria: <span className="font-medium">R$ {e.valorDiretoria.toFixed(2)}</span></p></div></div><div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground"/> <span>{e.inscritos.length}</span><Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2"/> Editar</Button></div></div>))}<div className="pt-4 border-t"><h4 className="font-semibold mb-2">Criar Novo Evento</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="space-y-2"><Label>Nome</Label><Input placeholder="Ex: Acampamento"/></div><div className="space-y-2"><Label>Valor (Desbravador)</Label><Input type="number" placeholder="R$ 0,00"/></div><div className="space-y-2"><Label>Valor (Diretoria)</Label><Input type="number" placeholder="R$ 0,00"/></div></div><Button className="mt-4"><Plus className="h-4 w-4 mr-2"/> Criar Evento</Button></div></CardContent></Card>
                    <Card><CardHeader><CardTitle>Controle de Pagamentos de Eventos</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-4"><div className="flex-1 space-y-2"><Label>Selecione um evento</Label><Select onValueChange={setEventoGerenciarId}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{initialEventos.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.nome}</SelectItem>)}</SelectContent></Select></div><div className="flex-1 space-y-2"><Label>Buscar Membro</Label><Input placeholder="Filtrar por nome..." value={eventoSearchTerm} onChange={(e) => setEventoSearchTerm(e.target.value)} /></div></div>{eventoGerenciarId && (<><div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"><Card className="p-4"><div className="flex justify-between"><h4 className="font-semibold">Inscritos</h4><Badge>{(eventoGerenciarSelecionado?.inscritos || []).length}</Badge></div><div className="flex justify-between mt-2"><h4 className="font-semibold">Pagos</h4><Badge variant="secondary">{pagosNoEvento.length}</Badge></div></Card><Card className="p-4"><div className="flex justify-between"><h4 className="font-semibold">Desbravadores</h4><Badge>{inscritosDesbravadores} / {pagosDesbravadores} pagos</Badge></div><div className="flex justify-between mt-2"><h4 className="font-semibold">Diretoria</h4><Badge variant="secondary">{inscritosDiretoria} / {pagosDiretoria} pagos</Badge></div></Card></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t"><div><h4 className="font-semibold mb-2 flex items-center gap-2"><CreditCard className="h-5 w-5 text-blue-600"/>Pagto (Cartão/Dinheiro)</h4><div className="space-y-2">{pendentesCartao.length > 0 ? pendentesCartao.map(p => (<div key={p.membroId} className="flex justify-between items-center p-2 border rounded-md text-sm"><span>{membrosMock.find(m=>m.id === p.membroId)?.nome}</span><Button size="sm" onClick={() => handleMarcarComoPago(p.membroId, parseInt(eventoGerenciarId))}>Marcar Pago</Button></div>)) : <p className="text-sm text-muted-foreground">Nenhuma pendência.</p>}</div></div><div><h4 className="font-semibold mb-2 flex items-center gap-2"><FileClock className="h-5 w-5 text-orange-600"/>Aguardando Comprovante (Pix)</h4><div className="space-y-2">{pendentesPix.length > 0 ? pendentesPix.map(p => (<div key={p.membroId} className="flex justify-between items-center p-2 border rounded-md text-sm"><span>{membrosMock.find(m=>m.id === p.membroId)?.nome}</span><Button size="sm" onClick={() => handleMarcarComoPago(p.membroId, parseInt(eventoGerenciarId))}>Confirmar</Button></div>)) : <p className="text-sm text-muted-foreground">Nenhuma pendência.</p>}</div></div><div><h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-600"/>Pagos</h4><div className="space-y-2">{pagosNoEvento.length > 0 ? pagosNoEvento.map(p => (<div key={p.membroId} className="flex items-center p-2 border rounded-md text-sm bg-green-50"><span>{membrosMock.find(m=>m.id === p.membroId)?.nome}</span></div>)) : <p className="text-sm text-muted-foreground">Nenhum pagamento.</p>}</div></div></div></>)}</CardContent></Card>
                    <Card><CardHeader><CardTitle>Inscrever Membro em Evento</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Evento</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o evento..." /></SelectTrigger><SelectContent>{initialEventos.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.nome}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Membro</Label><Select><SelectTrigger><SelectValue placeholder="Selecione o membro..." /></SelectTrigger><SelectContent>{membrosMock.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nome} ({m.cargo})</SelectItem>)}</SelectContent></Select></div><div className="flex gap-2"><Button>Inscrever (Pendente)</Button><Button variant="secondary">Inscrever com Isenção</Button></div></CardContent></Card>
                </TabsContent>

                <TabsContent value="relatorios" className="space-y-4">
                    <Card><CardHeader><CardTitle>Relatório Mensal / Fechamento de Mês</CardTitle></CardHeader><CardContent className="space-y-4"><div className="w-full md:w-1/3"><Label>Selecione o Mês</Label><Select value={mesRelatorio} onValueChange={setMesRelatorio}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{mesesDisponiveis.map(mes => (<SelectItem key={mes} value={mes}>{new Date(mes + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</SelectItem>))}</SelectContent></Select></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"><Card className="p-4 text-center"><p className="text-sm font-medium text-green-600">Total Entradas</p><p className="text-2xl font-bold">R$ {totalEntradasDoMes.toFixed(2)}</p></Card><Card className="p-4 text-center"><p className="text-sm font-medium text-red-600">Total Saídas</p><p className="text-2xl font-bold">R$ {totalSaidasDoMes.toFixed(2)}</p></Card><Card className="p-4 text-center"><p className="text-sm font-medium">Saldo do Mês</p><p className={`text-2xl font-bold ${saldoDoMes >= 0 ? 'text-blue-600' : 'text-red-600'}`}>R$ {saldoDoMes.toFixed(2)}</p></Card></div></CardContent></Card>
                    <Card><CardHeader><CardTitle>Relatório de Eventos</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Selecione o Evento</Label><Select onValueChange={setEventoRelatorioId}><SelectTrigger><SelectValue placeholder="Selecione o evento..." /></SelectTrigger><SelectContent>{initialEventos.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.nome}</SelectItem>)}</SelectContent></Select></div>{eventoRelatorioId && (<div className="pt-4 border-t"><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><Card className="p-4 text-center"><p className="text-sm font-medium text-green-600">Total Entradas</p><p className="text-2xl font-bold">R$ {totalEntradasRelatorio.toFixed(2)}</p></Card><Card className="p-4 text-center"><p className="text-sm font-medium text-red-600">Total Saídas</p><p className="text-2xl font-bold">R$ {totalSaidasRelatorio.toFixed(2)}</p></Card><Card className="p-4 text-center"><p className="text-sm font-medium">Saldo</p><p className={`text-2xl font-bold ${saldoEventoRelatorio >= 0 ? 'text-blue-600' : 'text-red-600'}`}>R$ {saldoEventoRelatorio.toFixed(2)}</p></Card></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Card><CardHeader><CardTitle>Status de Inscrição</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-2"><div className="p-2 bg-blue-50 rounded-lg text-center"><p className="text-xs font-medium">Isentos</p><p className="text-xl font-bold">{pagamentosDoEventoRelatorio.filter(p=>p.status === 'isento').length}</p></div><div className="p-2 bg-yellow-50 rounded-lg text-center"><p className="text-xs font-medium">Pendentes</p><p className="text-xl font-bold">{pagamentosDoEventoRelatorio.filter(p=>p.status !== 'pago' && p.status !== 'isento').length}</p></div><div className="p-2 bg-green-50 rounded-lg text-center"><p className="text-xs font-medium">Pagos</p><p className="text-xl font-bold">{pagamentosDoEventoRelatorio.filter(p=>p.status === 'pago').length}</p></div></CardContent></Card><Card><CardHeader><CardTitle>Detalhes dos Pagos</CardTitle></CardHeader><CardContent className="space-y-2 max-h-48 overflow-y-auto">{pagamentosDoEventoRelatorio.filter(p => p.status === 'pago').map(pago => {const membro = membrosMock.find(m => m.id === pago.membroId); return (<div key={pago.membroId} className="flex justify-between items-center text-sm p-2 border rounded-md"><span>{membro?.nome}</span>{pago.comprovanteUrl ? <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2"/>Ver Comprovante</Button> : <Badge variant="secondary">{pago.metodo}</Badge>}</div>)})} </CardContent></Card></div></div>)}</CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}