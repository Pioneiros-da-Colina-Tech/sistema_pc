"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Upload, Trash2, Search, Filter, ArrowLeft, FileCheck2, FileX2, Check, X, Download, Eye, AlertCircle } from "lucide-react"

// --- Tipos e Dados Mockados ---
type DocumentoStatus = "aprovado" | "aguardando-avaliacao" | "reprovado";
type Documentos = { [key: string]: { status: DocumentoStatus; url?: string; motivoReprovacao?: string } };

type Membro = {
    id: number;
    nome: string;
    cpf: string;
    codigo_sgc: string;
    unidade: string;
    cargo: string;
    nascimento: string;
    documentos: Documentos;
};

const todosDocumentos = ["RG", "CPF", "Comprovante de Residência", "Cartão do Sus", "Carteirinha do convênio"];

const membrosMock: Membro[] = [
    { id: 1, nome: "João Silva", cpf: "123.456.789-00", codigo_sgc: "12345", unidade: "Jaguar", cargo: "Desbravador", nascimento: "2010-05-15",
        documentos: {
            "RG": { status: "aprovado", url: "/path/to/doc.pdf" },
            "CPF": { status: "aprovado", url: "/path/to/doc.pdf" },
            "Comprovante de Residência": { status: "aprovado", url: "/path/to/doc.pdf" },
            "Cartão do Sus": { status: "aprovado", url: "/path/to/doc.pdf" },
            "Carteirinha do convênio": { status: "aprovado", url: "/path/to/doc.pdf" }
        }
    },
    { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", codigo_sgc: "54321", unidade: "Jaguar", cargo: "Conselheiro", nascimento: "1995-08-20",
        documentos: {
            "RG": { status: "aprovado", url: "/path/to/doc.pdf" },
            "CPF": { status: "aguardando-avaliacao", url: "/path/to/doc.pdf" }
        }
    },
    { id: 3, nome: "Pedro Costa", cpf: "111.222.333-44", codigo_sgc: "67890", unidade: "Gato do Mato", cargo: "Desbravador", nascimento: "2011-03-10",
        documentos: {
            "RG": { status: "aprovado", url: "/path/to/doc.pdf" },
            "CPF": { status: "reprovado", url: "/path/to/doc.pdf", motivoReprovacao: "Documento ilegível." },
            "Comprovante de Residência": { status: "aguardando-avaliacao", url: "/path/to/doc.pdf" }
        }
    },
]
// --- Fim dos Dados Mockados ---

function MembroForm({ membro, onSave, onBack }: { membro?: Membro | null; onSave: (membroData: Partial<Membro>) => void; onBack: () => void }) {
    const [formData, setFormData] = useState<Partial<Membro>>(
        membro || { nome: "", cpf: "", codigo_sgc: "", nascimento: "", unidade: "Jaguar", cargo: "Desbravador", documentos: {} }
    );
    const [reprovingDoc, setReprovingDoc] = useState<string | null>(null);
    const [reprovalReason, setReprovalReason] = useState("");
    const isNew = !membro;

    const handleSave = () => {
        if (formData.nome && formData.cpf && formData.codigo_sgc && formData.nascimento) {
            onSave(formData);
        } else {
            alert("Por favor, preencha todos os campos cadastrais.");
        }
    };

    const handleDocStatusChange = (docName: string, status: DocumentoStatus, reason?: string) => {
        setFormData(prev => ({
            ...prev,
            documentos: {
                ...prev.documentos,
                [docName]: { ...prev.documentos?.[docName], status, motivoReprovacao: reason || undefined }
            }
        }));
        setReprovingDoc(null);
        setReprovalReason("");
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4"/></Button>
                    <div>
                        <CardTitle>{isNew ? "Novo Membro" : "Editar Membro"}</CardTitle>
                        <CardDescription>{isNew ? "Preencha os dados para criar um novo membro." : `Altere as informações de ${membro?.nome}.`}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Nome</Label><Input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})}/></div>
                    <div className="space-y-2"><Label>CPF</Label><Input value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})}/></div>
                    <div className="space-y-2"><Label>SGC</Label><Input value={formData.codigo_sgc} onChange={e => setFormData({...formData, codigo_sgc: e.target.value})}/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Nascimento</Label><Input type="date" value={formData.nascimento} onChange={e => setFormData({...formData, nascimento: e.target.value})}/></div>
                    <div className="space-y-2"><Label>Unidade</Label><Select value={formData.unidade} onValueChange={value => setFormData({...formData, unidade: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Jaguar">Jaguar</SelectItem><SelectItem value="Gato do Mato">Gato do Mato</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Cargo</Label><Select value={formData.cargo} onValueChange={value => setFormData({...formData, cargo: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Desbravador">Desbravador</SelectItem><SelectItem value="Conselheiro">Conselheiro</SelectItem><SelectItem value="Diretoria">Diretoria</SelectItem></SelectContent></Select></div>
                </div>
                <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Documentos</h4>
                    <div className="space-y-2 mb-4">
                        {todosDocumentos.map(doc => {
                            const docInfo = formData.documentos?.[doc];
                            const status = docInfo?.status;

                            return (
                                <div key={doc} className="p-3 border rounded-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <p>{doc}</p>
                                            {status && <Badge variant={status === 'aprovado' ? 'default' : status === 'reprovado' ? 'destructive' : 'secondary'}>{status.replace('-', ' ')}</Badge>}
                                        </div>
                                        <div className="flex gap-2">
                                            {status === 'aguardando-avaliacao' && (
                                                <>
                                                    <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-2"/>Ver Documento</Button>
                                                    <Button size="sm" variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200" onClick={() => handleDocStatusChange(doc, 'aprovado')}><Check className="h-4 w-4 mr-2"/>Aprovar</Button>
                                                    <Button size="sm" variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200" onClick={() => setReprovingDoc(doc)}><X className="h-4 w-4 mr-2"/>Reprovar</Button>
                                                </>
                                            )}
                                            {status === 'aprovado' && <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2"/>Baixar</Button>}
                                        </div>
                                    </div>
                                    {docInfo?.motivoReprovacao && (
                                        <p className="text-sm text-red-600 mt-2">Motivo da reprovação: {docInfo.motivoReprovacao}</p>
                                    )}
                                    {reprovingDoc === doc && (
                                        <div className="mt-4 pt-4 border-t space-y-2">
                                            <Label htmlFor={`reason-${doc}`}>Motivo da Reprovação</Label>
                                            <Input id={`reason-${doc}`} value={reprovalReason} onChange={(e) => setReprovalReason(e.target.value)} placeholder="Descreva o motivo..."/>
                                            <Button size="sm" onClick={() => handleDocStatusChange(doc, 'reprovado', reprovalReason)}>Confirmar Reprovação</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setReprovingDoc(null)}>Cancelar</Button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-md"><Upload className="h-8 w-8 text-muted-foreground"/><div className="flex-1 space-y-1"><p className="font-medium">Upload de documento</p><p className="text-sm text-muted-foreground">Arraste ou clique para selecionar.</p></div>
                        <Select><SelectTrigger className="w-64"><SelectValue placeholder="Selecione o tipo..." /></SelectTrigger><SelectContent>{todosDocumentos.map(doc => <SelectItem key={doc} value={doc}>{doc}</SelectItem>)}</SelectContent></Select>
                        <Input type="file" className="hidden" id="file-upload"/><Button asChild><Label htmlFor="file-upload">Selecionar</Label></Button>
                    </div>
                </div>
                <div className="flex justify-start gap-2 pt-6 border-t"><Button onClick={handleSave}>Salvar Alterações</Button>{!isNew && <Button variant="destructive">Excluir Membro</Button>}</div>
            </CardContent>
        </Card>
    )
}

function DocumentosFaltantesView({ membros, onBack, onEdit }: { membros: Membro[]; onBack: () => void; onEdit: (membro: Membro) => void; }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4"/></Button>
                    <div><CardTitle>Membros com Documentos Pendentes</CardTitle><CardDescription>Lista de documentos faltantes, reprovados ou aguardando avaliação.</CardDescription></div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {membros.filter(m => !todosDocumentos.every(doc => m.documentos[doc]?.status === 'aprovado')).map(membro => {
                    const docsNaoAprovados = todosDocumentos.filter(doc => membro.documentos[doc]?.status !== 'aprovado');
                    return(
                        <Card key={membro.id} className="p-4 bg-amber-50">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">{membro.nome}</h4>
                                <Button size="sm" variant="outline" onClick={() => onEdit(membro)}>Ver / Avaliar</Button>
                            </div>
                            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                                {docsNaoAprovados.map(doc => {
                                    const status = membro.documentos[doc]?.status;
                                    return <li key={doc}>{doc} <Badge variant="outline" className="ml-2">{status ? status.replace('-', ' ') : 'Faltante'}</Badge></li>
                                })}
                            </ul>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default function MembrosTab() {
    const [membros, setMembros] = useState(membrosMock);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroUnidade, setFiltroUnidade] = useState("todas");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [viewMode, setViewMode] = useState<'list' | 'edit' | 'new' | 'missingDocs'>('list');
    const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(null);

    const handleEditClick = (membro: Membro) => { setMembroSelecionado(membro); setViewMode('edit'); };
    const handleNewClick = () => { setMembroSelecionado(null); setViewMode('new'); };
    const handleBack = () => { setViewMode('list'); setMembroSelecionado(null); };

    const handleSaveMembro = (membroData: Partial<Membro>) => {
        if (membroData.id) {
            setMembros(prev => prev.map(m => m.id === membroData.id ? {...m, ...membroData} as Membro : m));
        } else {
            const newId = Math.max(...membros.map(m => m.id), 0) + 1;
            setMembros(prev => [...prev, { ...membroData, id: newId, documentos: membroData.documentos || {} } as Membro]);
        }
        handleBack();
    };

    const getDocumentStatusForMember = (membro: Membro) => {
        const totalDocs = todosDocumentos.length;
        const docsAprovados = todosDocumentos.filter(doc => membro.documentos[doc]?.status === 'aprovado').length;
        if (docsAprovados === totalDocs) return { text: "Completo", icon: <FileCheck2 className="h-4 w-4 text-green-600"/>, color: "text-green-600" };

        const temPendente = todosDocumentos.some(doc => membro.documentos[doc]?.status === 'aguardando-avaliacao' || membro.documentos[doc]?.status === 'reprovado' || !membro.documentos[doc]);
        if (temPendente) return { text: "Pendente", icon: <AlertCircle className="h-4 w-4 text-amber-600"/>, color: "text-amber-600" };

        return { text: "Status Desconhecido", icon: <FileX2 className="h-4 w-4 text-gray-500"/>, color: "text-gray-500" };
    }

    const membrosFiltrados = membros.filter((membro) => {
        const matchesSearch = membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) || membro.cpf.includes(searchTerm) || membro.codigo_sgc.includes(searchTerm);
        const matchesUnidade = filtroUnidade === "todas" || membro.unidade === filtroUnidade;
        const matchesTipo = filtroTipo === "todos" || membro.cargo === filtroTipo;
        return matchesSearch && matchesUnidade && matchesTipo;
    });

    const docsCompletos = membros.filter(m => todosDocumentos.every(doc => m.documentos[doc]?.status === 'aprovado')).length;
    const docsFaltantes = membros.length - docsCompletos;

    if (viewMode === 'missingDocs') {
        return <DocumentosFaltantesView membros={membros} onBack={handleBack} onEdit={handleEditClick} />;
    }

    if (viewMode === 'edit' || viewMode === 'new') {
        return <MembroForm membro={membroSelecionado} onBack={handleBack} onSave={handleSaveMembro as any} />;
    }

    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users /> Gerenciar Membros</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3"><Card className="p-4 text-center"><Users className="h-6 w-6 mx-auto mb-2 text-blue-600"/><p className="text-2xl font-bold">{membros.length}</p><p className="text-sm text-muted-foreground">Membros Ativos</p></Card><Card className="p-4 text-center"><FileCheck2 className="h-6 w-6 mx-auto mb-2 text-green-600"/><p className="text-2xl font-bold">{docsCompletos}</p><p className="text-sm text-muted-foreground">Docs 100%</p></Card><Card className="p-4 text-center hover:bg-amber-50 cursor-pointer" onClick={() => setViewMode('missingDocs')}><FileX2 className="h-6 w-6 mx-auto mb-2 text-amber-600"/><p className="text-2xl font-bold">{docsFaltantes}</p><p className="text-sm text-muted-foreground">Docs Pendentes</p></Card></div>
                <div className="flex gap-2 pt-4 border-t"><Button onClick={handleNewClick}><Plus className="h-4 w-4 mr-2" />Novo Membro</Button><Button variant="outline"><Upload className="h-4 w-4 mr-2" />Importar</Button></div>
                <div className="grid gap-4 md:grid-cols-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div><Select value={filtroUnidade} onValueChange={setFiltroUnidade}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todas">Todas Unidades</SelectItem><SelectItem value="Jaguar">Jaguar</SelectItem><SelectItem value="Gato do Mato">Gato do Mato</SelectItem></SelectContent></Select><Select value={filtroTipo} onValueChange={setFiltroTipo}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos Cargos</SelectItem><SelectItem value="Desbravador">Desbravador</SelectItem><SelectItem value="Conselheiro">Conselheiro</SelectItem></SelectContent></Select><Button variant="outline" onClick={() => { setSearchTerm(""); setFiltroUnidade("todas"); setFiltroTipo("todos"); }}><Filter className="h-4 w-4 mr-2" /> Limpar</Button></div>
                <div className="space-y-3">{membrosFiltrados.map((membro) => {
                    const docStatus = getDocumentStatusForMember(membro);
                    return (<Card key={membro.id} className="p-4"><div className="flex items-center justify-between"><div className="space-y-1"><p className="font-medium">{membro.nome}</p><div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground"><span>CPF: {membro.cpf}</span><span>SGC: {membro.codigo_sgc}</span><span>Unidade: {membro.unidade}</span><Badge variant="secondary">{membro.cargo}</Badge><span className={`flex items-center gap-1 font-semibold ${docStatus.color}`}>{docStatus.icon} {docStatus.text}</span></div></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => handleEditClick(membro)}>Editar</Button><Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button></div></div></Card>)
                })}</div>
            </CardContent>
        </Card>
    )
}