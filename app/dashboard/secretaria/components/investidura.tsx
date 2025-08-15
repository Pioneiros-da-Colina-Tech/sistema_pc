"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, Users, Check, RotateCcw, ShoppingCart, ArrowRight } from "lucide-react"

// --- Dados Mockados ---
const unidadesMock = [
    { id: 1, nome: "Jaguar" },
    { id: 2, nome: "Gato do Mato" },
    { id: 3, nome: "Jaguarundi" },
    { id: 4, nome: "Pantera Negra" },
];

const membrosMock = [
    { id: 1, nome: "João Silva", codigo_sgc: "12345", id_unidade: 1, cargo: "Desbravador" },
    { id: 2, nome: "Maria Santos", codigo_sgc: "54321", id_unidade: 1, cargo: "Conselheiro" },
    { id: 3, nome: "Pedro Costa", codigo_sgc: "67890", id_unidade: 2, cargo: "Desbravador" },
    { id: 4, nome: "Ana Pereira", codigo_sgc: "11122", id_unidade: 2, cargo: "Conselheiro Associado" },
    { id: 5, nome: "Carlos Lima", codigo_sgc: "33344", id_unidade: 3, cargo: "Desbravador" },
    { id: 6, nome: "Beatriz Souza", codigo_sgc: "55566", id_unidade: 4, cargo: "Diretoria" },
];

const classesMock = [{ id: "AM-001", nome: "Amigo" }];
const especialidadesMock = [{ id: "AP-034", nome: "Internet" }];

const userItemsAprovados = [
    { codigo_sgc: "12345", itemId: 'AM-001', tipo: 'Classe', status: 'Pendente de compra' },
    { codigo_sgc: "54321", itemId: 'AM-001', tipo: 'Classe', status: 'Pendente de compra' },
    { codigo_sgc: "67890", itemId: 'AM-001', tipo: 'Classe', status: 'Pendente de compra' },
    { codigo_sgc: "11122", itemId: 'AM-001', tipo: 'Classe', status: 'Entregue' },
    { codigo_sgc: "33344", itemId: 'AM-001', tipo: 'Classe', status: 'Pendente de compra' },
    { codigo_sgc: "12345", itemId: 'AP-034', tipo: 'Especialidade', status: 'Pendente de compra' },
    { codigo_sgc: "55566", itemId: 'AP-034', tipo: 'Especialidade', status: 'Pendente de compra' },
];

const unidadeOrdem = [
    "Jaguar", "Jaguarundi", "Gato do Mato", "Gato do Deserto", "Pantera Negra", "Pantera Nebulosa",
];

type Status = 'Pendente de compra' | 'Pendente de entrega' | 'Investidura' | 'Entregue';

// --- Componente ---
export default function InvestiduraTab() {
    const [itens, setItens] = useState(userItemsAprovados);
    const [estoque, setEstoque] = useState<Record<string, number>>({ 'AM-001': 1, 'AP-034': 0 });
    const [compras, setCompras] = useState<Record<string, number | string>>({});

    const membrosCompletos = useMemo(() => {
        return itens.map(item => {
            const membro = membrosMock.find(m => m.codigo_sgc === item.codigo_sgc);
            const unidade = unidadesMock.find(u => u.id === membro?.id_unidade);
            return { ...item, ...membro, unidade: unidade?.nome };
        });
    }, [itens]);

    const itensAgrupados = useMemo(() => {
        const grupos: Record<string, any[]> = {};
        membrosCompletos.forEach(item => {
            if (!grupos[item.itemId]) grupos[item.itemId] = [];
            grupos[item.itemId].push(item);
        });
        return grupos;
    }, [membrosCompletos]);

    const chaveOrdenacao = (p: any) => {
        const prioridadeCargo = p.cargo === "Desbravador" ? 0 : (["Conselheiro", "Conselheiro Associado"].includes(p.cargo) ? 1 : 2);
        const prioridadeUnidade = unidadeOrdem.includes(p.unidade) ? unidadeOrdem.indexOf(p.unidade) : unidadeOrdem.length;
        return (prioridadeCargo * 100) + prioridadeUnidade;
    };

    const handleRegistrarCompra = (itemId: string) => {
        const qtd = Number(compras[itemId] || 0);
        if (qtd > 0) {
            setEstoque(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + qtd }));
            setCompras(prev => ({ ...prev, [itemId]: "" }));
            alert(`${qtd} iten(s) adicionados ao estoque.`);
        }
    };

    const handleDistribuirTudo = (itemId: string) => {
        const emEstoque = estoque[itemId] || 0;
        if (emEstoque <= 0) {
            alert("Não há itens em estoque para distribuir.");
            return;
        }

        const pendentes = itensAgrupados[itemId]
            .filter(p => p.status === 'Pendente de compra')
            .sort((a, b) => chaveOrdenacao(a) - chaveOrdenacao(b));

        const paraDistribuir = pendentes.slice(0, emEstoque);
        const sgcsParaDistribuir = paraDistribuir.map(p => p.codigo_sgc);

        setItens(prevItens =>
            prevItens.map(item =>
                item.itemId === itemId && sgcsParaDistribuir.includes(item.codigo_sgc)
                    ? { ...item, status: 'Pendente de entrega' }
                    : item
            )
        );

        setEstoque(prev => ({ ...prev, [itemId]: emEstoque - paraDistribuir.length }));
        alert(`${paraDistribuir.length} iten(s) distribuídos e movidos para "Pendente de entrega".`);
    };

    const handleStatusChange = (sgc: string, itemId: string, novoStatus: Status) => {
        const oldStatus = itens.find(item => item.codigo_sgc === sgc && item.itemId === itemId)?.status;

        if (oldStatus !== novoStatus) {
            // Devolve ao estoque
            if (['Investidura', 'Entregue'].includes(oldStatus!) && novoStatus === 'Pendente de entrega') {
                setEstoque(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
            }
            // Retira do estoque
            if (oldStatus === 'Pendente de entrega' && ['Investidura', 'Entregue'].includes(novoStatus)) {
                setEstoque(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
            }
        }

        setItens(prev => prev.map(item =>
            item.codigo_sgc === sgc && item.itemId === itemId ? { ...item, status: novoStatus as any } : item
        ));
    };

    const todosOsItens = { ...classesMock.reduce((acc, c) => ({...acc, [c.id]: c.nome}), {}), ...especialidadesMock.reduce((acc, e) => ({...acc, [e.id]: e.nome}), {})};

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Distribuição de Investidura</CardTitle>
                    <CardDescription>Gerencie o estoque e a distribuição de classes e especialidades para os membros.</CardDescription>
                </CardHeader>
            </Card>
            {Object.keys(itensAgrupados).map(itemId => {
                const itemNome = todosOsItens[itemId] || itemId;
                const membrosDoItem = itensAgrupados[itemId];
                const emEstoque = estoque[itemId] || 0;
                const precisam = membrosDoItem.filter(p => p.status === 'Pendente de compra').length;

                return (
                    <Card key={itemId}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{itemNome}</span>
                                <Badge variant="outline">Estoque: {emEstoque} / Necessário: {precisam}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 p-4 border rounded-lg">
                                    <Label htmlFor={`compra-${itemId}`} className="flex items-center gap-2"><ShoppingCart/> Registrar Compra</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id={`compra-${itemId}`}
                                            type="number"
                                            placeholder="Qtd."
                                            value={compras[itemId] || ""}
                                            onChange={e => setCompras(prev => ({ ...prev, [itemId]: e.target.value }))}
                                        />
                                        <Button onClick={() => handleRegistrarCompra(itemId)}>Adicionar ao Estoque</Button>
                                    </div>
                                </div>
                                <div className="space-y-2 p-4 border rounded-lg">
                                    <Label className="flex items-center gap-2"><ArrowRight/> Distribuição Automática</Label>
                                    <Button onClick={() => handleDistribuirTudo(itemId)} className="w-full" disabled={emEstoque === 0 || precisam === 0}>
                                        Distribuir {Math.min(emEstoque, precisam)} do Estoque
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold my-4">Status dos Membros</h4>
                                <div className="space-y-2 max-h-72 overflow-y-auto">
                                    {membrosDoItem.sort((a, b) => chaveOrdenacao(a) - chaveOrdenacao(b)).map(membro => (
                                        <div key={membro.codigo_sgc} className="flex justify-between items-center p-2 border rounded-md">
                                            <div>
                                                <p className="font-medium">{membro.nome}</p>
                                                <p className="text-sm text-muted-foreground">{membro.unidade} - {membro.cargo}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={membro.status === 'Entregue' ? 'default' : membro.status === 'Pendente de compra' ? 'destructive' : 'secondary'}>{membro.status}</Badge>
                                                {membro.status !== 'Pendente de compra' && (
                                                    <Button size="icon" variant="outline" title="Retornar para Pendente de Compra" onClick={() => handleStatusChange(membro.codigo_sgc, itemId, 'Pendente de compra')}>
                                                        <RotateCcw className="h-4 w-4"/>
                                                    </Button>
                                                )}
                                                {membro.status === 'Pendente de entrega' && (
                                                    <Button size="sm" onClick={() => handleStatusChange(membro.codigo_sgc, itemId, 'Investidura')}>
                                                        Separar para Investidura
                                                    </Button>
                                                )}
                                                {membro.status === 'Investidura' && (
                                                    <Button size="sm" onClick={() => handleStatusChange(membro.codigo_sgc, itemId, 'Entregue')}>
                                                        <Check className="h-4 w-4 mr-2"/> Marcar como Entregue
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}