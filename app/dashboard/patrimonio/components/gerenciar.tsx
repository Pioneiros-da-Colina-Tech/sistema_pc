"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { heritageApi, type HeritageItemAPI } from "@/lib/api"

const PAGE_SIZE = 10

export default function GerenciarPatrimonioTab() {
    const [itens, setItens] = useState<HeritageItemAPI[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [busca, setBusca] = useState("")
    const [buscaInput, setBuscaInput] = useState("")
    const [carregando, setCarregando] = useState(true)

    // Add form
    const [nome, setNome] = useState("")
    const [quantidade, setQuantidade] = useState("1")
    const [dataAquisicao, setDataAquisicao] = useState("")
    const [descricao, setDescricao] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")

    // Edit modal
    const [editItem, setEditItem] = useState<HeritageItemAPI | null>(null)
    const [editNome, setEditNome] = useState("")
    const [editQuantidade, setEditQuantidade] = useState("1")
    const [editDataAquisicao, setEditDataAquisicao] = useState("")
    const [editDescricao, setEditDescricao] = useState("")
    const [editSalvando, setEditSalvando] = useState(false)
    const [editErro, setEditErro] = useState("")

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const carregar = useCallback(async (p: number, search: string) => {
        setCarregando(true)
        try {
            const res = await heritageApi.listItems({ name: search || undefined, page: p, page_size: PAGE_SIZE })
            setItens(res.data.items)
            setTotal(res.data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setCarregando(false)
        }
    }, [])

    useEffect(() => {
        carregar(page, busca)
    }, [page, busca, carregar])

    const handleBuscar = () => {
        setPage(1)
        setBusca(buscaInput)
    }

    const handleAdicionar = async () => {
        if (!nome.trim() || !dataAquisicao) {
            setErro("Nome e data de aquisição são obrigatórios.")
            return
        }
        setErro("")
        setSalvando(true)
        try {
            await heritageApi.createItem({
                name: nome.trim(),
                quantity: parseInt(quantidade) || 1,
                acquisition_date: dataAquisicao,
                description: descricao.trim() || undefined,
            })
            setNome("")
            setQuantidade("1")
            setDataAquisicao("")
            setDescricao("")
            setPage(1)
            await carregar(1, busca)
        } catch (err) {
            setErro(err instanceof Error ? err.message : "Erro ao adicionar item.")
        } finally {
            setSalvando(false)
        }
    }

    const handleRemover = async (id: string) => {
        try {
            await heritageApi.deleteItem(id)
            await carregar(page, busca)
        } catch (err) {
            console.error(err)
        }
    }

    const abrirEditar = (item: HeritageItemAPI) => {
        setEditItem(item)
        setEditNome(item.name)
        setEditQuantidade(String(item.quantity))
        setEditDataAquisicao(item.acquisition_date)
        setEditDescricao(item.description ?? "")
        setEditErro("")
    }

    const handleSalvarEdicao = async () => {
        if (!editItem) return
        if (!editNome.trim()) {
            setEditErro("Nome é obrigatório.")
            return
        }
        setEditErro("")
        setEditSalvando(true)
        try {
            await heritageApi.updateItem(editItem.id_, {
                name: editNome.trim(),
                quantity: parseInt(editQuantidade) || 0,
                acquisition_date: editDataAquisicao,
                description: editDescricao.trim() || null,
            })
            setEditItem(null)
            await carregar(page, busca)
        } catch (err) {
            setEditErro(err instanceof Error ? err.message : "Erro ao salvar edição.")
        } finally {
            setEditSalvando(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Add Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Adicionar Item ao Patrimônio
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label>Nome do Item</Label>
                            <Input placeholder="Ex: Barraca Iglú 4 Pessoas" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Quantidade</Label>
                            <Input type="number" min="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Data de Aquisição</Label>
                            <Input type="date" value={dataAquisicao} onChange={(e) => setDataAquisicao(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Descrição (opcional)</Label>
                        <Textarea placeholder="Detalhes do item..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    </div>
                    {erro && <p className="text-sm text-red-600">{erro}</p>}
                    <Button onClick={handleAdicionar} disabled={salvando}>
                        {salvando ? "Adicionando..." : "Adicionar Item"}
                    </Button>
                </CardContent>
            </Card>

            {/* Items List */}
            <Card>
                <CardHeader>
                    <CardTitle>Itens no Patrimônio</CardTitle>
                    <CardDescription>Pesquise, edite ou remova os itens. A coluna "Disponível" mostra o estoque livre (total − comprometido em solicitações ativas).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Buscar por nome..."
                            value={buscaInput}
                            onChange={(e) => setBuscaInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                            className="max-w-sm"
                        />
                        <Button variant="outline" onClick={handleBuscar}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    {carregando ? (
                        <p className="text-sm text-muted-foreground">Carregando...</p>
                    ) : itens.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum item encontrado.</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded border">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Nome</th>
                                            <th className="px-4 py-3 text-center">Total</th>
                                            <th className="px-4 py-3 text-center">Comprometido</th>
                                            <th className="px-4 py-3 text-center">Disponível</th>
                                            <th className="px-4 py-3 text-left">Descrição</th>
                                            <th className="px-4 py-3 text-center">Aquisição</th>
                                            <th className="px-4 py-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {itens.map((item) => (
                                            <tr key={item.id_} className="hover:bg-muted/30">
                                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {item.committed_quantity > 0 ? (
                                                        <Badge variant="secondary">{item.committed_quantity}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">0</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant={item.available_quantity === 0 ? "destructive" : item.available_quantity < item.quantity * 0.3 ? "outline" : "default"}>
                                                        {item.available_quantity}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{item.description ?? "—"}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {new Date(item.acquisition_date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button variant="outline" size="sm" onClick={() => abrirEditar(item)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleRemover(item.id_)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{total} item{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span>Página {page} de {totalPages}</span>
                                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Edit Panel */}
            {editItem && (
                <Card className="border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pencil className="h-4 w-4" /> Editar Item
                        </CardTitle>
                        <CardDescription>Editando: {editItem.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Nome</Label>
                                <Input value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Quantidade</Label>
                                <Input type="number" min="0" value={editQuantidade} onChange={(e) => setEditQuantidade(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Data de Aquisição</Label>
                                <Input type="date" value={editDataAquisicao} onChange={(e) => setEditDataAquisicao(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} />
                        </div>
                        {editErro && <p className="text-sm text-red-600">{editErro}</p>}
                        <div className="flex gap-2">
                            <Button onClick={handleSalvarEdicao} disabled={editSalvando}>
                                {editSalvando ? "Salvando..." : "Salvar"}
                            </Button>
                            <Button variant="outline" onClick={() => setEditItem(null)}>Cancelar</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
