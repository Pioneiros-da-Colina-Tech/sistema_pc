"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Upload, Trash2, Search, Filter, ArrowLeft, FileCheck2, FileX2, Check, X, Download, Eye, AlertCircle, UserCheck, MapPin, HeartPulse, User } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// --- Tipos e Dados Mockados ---
type DocumentoStatus = "aprovado" | "aguardando-avaliacao" | "reprovado" | "faltante";

interface FotoPerfil {
    status: DocumentoStatus;
    url?: string | null;
    motivoReprovacao?: string;
}

interface Endereco {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
}

interface Saude {
    tipoSanguineo: string;
    alergias: string;
    problemasSaude: string;
    possuiConvenio: string;
    nomeConvenio: string;
}

interface Membro {
    id: number;
    nome: string;
    cpf: string;
    codigo_sgc: string;
    unidade: string;
    cargo: string;
    nascimento: string;
    telefone: string;
    status: "ativo" | "inativo";
    rematricula_preenchida: boolean;
    fotoPerfil?: FotoPerfil; // Marcado como opcional para evitar quebras
    endereco?: Endereco;
    saude?: Saude;
    documentos: { [key: string]: { status: DocumentoStatus; url?: string; motivoReprovacao?: string } };
}

const todosDocumentos = ["RG", "CPF", "Comprovante de Residência", "Cartão do Sus", "Carteirinha do convênio"];

const membroVazio: Membro = {
    id: 0, nome: "", cpf: "", codigo_sgc: "", unidade: "Jaguar", cargo: "Desbravador", nascimento: "", telefone: "", status: "ativo", rematricula_preenchida: false,
    fotoPerfil: { status: "faltante", url: null },
    endereco: { cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "" },
    saude: { tipoSanguineo: "", alergias: "", problemasSaude: "", possuiConvenio: "nao", nomeConvenio: "" },
    documentos: {}
};

const membrosMock: Membro[] = [
    {
        id: 1, nome: "João Silva", cpf: "123.456.789-00", codigo_sgc: "12345", unidade: "Jaguar", cargo: "Desbravador", nascimento: "2010-05-15", telefone: "(11) 99999-9999", status: "ativo", rematricula_preenchida: true,
        fotoPerfil: { status: "aguardando-avaliacao", url: "https://github.com/shadcn.png" },
        endereco: { cep: "01000-000", logradouro: "Rua das Flores", numero: "123", bairro: "Centro", cidade: "São Paulo", uf: "SP" },
        saude: { tipoSanguineo: "O+", alergias: "Dipirona", problemasSaude: "", possuiConvenio: "sim", nomeConvenio: "Unimed" },
        documentos: {
            "RG": { status: "aprovado", url: "/doc.pdf" },
            "CPF": { status: "aprovado", url: "/doc.pdf" },
            "Comprovante de Residência": { status: "aprovado", url: "/doc.pdf" },
            "Cartão do Sus": { status: "aprovado", url: "/doc.pdf" },
            "Carteirinha do convênio": { status: "aprovado", url: "/doc.pdf" }
        }
    },
    {
        id: 2, nome: "Maria Santos", cpf: "987.654.321-00", codigo_sgc: "54321", unidade: "Jaguar", cargo: "Conselheiro", nascimento: "1995-08-20", telefone: "(11) 88888-8888", status: "ativo", rematricula_preenchida: false,
        fotoPerfil: { status: "aprovado", url: "https://github.com/shadcn.png" },
        endereco: { cep: "02000-000", logradouro: "Av. Paulista", numero: "1000", bairro: "Bela Vista", cidade: "São Paulo", uf: "SP" },
        saude: { tipoSanguineo: "A+", alergias: "", problemasSaude: "", possuiConvenio: "nao", nomeConvenio: "" },
        documentos: {
            "RG": { status: "aprovado", url: "/doc.pdf" },
            "CPF": { status: "aguardando-avaliacao", url: "/doc.pdf" }
        }
    },
    {
        id: 3, nome: "Pedro Costa", cpf: "111.222.333-44", codigo_sgc: "67890", unidade: "Gato do Mato", cargo: "Desbravador", nascimento: "2011-03-10", telefone: "(11) 77777-7777", status: "inativo", rematricula_preenchida: true,
        fotoPerfil: { status: "reprovado", url: "https://github.com/shadcn.png", motivoReprovacao: "Foto de óculos escuros" },
        endereco: { cep: "03000-000", logradouro: "Rua Torta", numero: "50", bairro: "Vila Nova", cidade: "São Paulo", uf: "SP" },
        saude: { tipoSanguineo: "B-", alergias: "Amendoim", problemasSaude: "Asma", possuiConvenio: "nao", nomeConvenio: "" },
        documentos: {
            "RG": { status: "aprovado", url: "/doc.pdf" },
            "CPF": { status: "reprovado", url: "/doc.pdf", motivoReprovacao: "Documento ilegível." },
            "Comprovante de Residência": { status: "aguardando-avaliacao", url: "/doc.pdf" }
        }
    },
]
// --- Fim dos Dados Mockados ---

function MembroForm({ membro, onSave, onBack }: { membro?: Membro | null; onSave: (membroData: Partial<Membro>) => void; onBack: () => void }) {
    // Inicialização segura com valores padrão caso venha null
    const [formData, setFormData] = useState<Membro>(() => {
        if (!membro) return { ...membroVazio, id: Date.now() };
        return {
            ...membroVazio,
            ...membro,
            fotoPerfil: membro.fotoPerfil || membroVazio.fotoPerfil,
            endereco: membro.endereco || membroVazio.endereco,
            saude: membro.saude || membroVazio.saude,
            documentos: membro.documentos || {}
        };
    });

    const [reprovingItem, setReprovingItem] = useState<string | null>(null);
    const [reprovalReason, setReprovalReason] = useState("");

    const isNew = !membro;

    const handleSave = () => {
        onSave(formData);
    };

    const handleStatusChange = (type: 'foto' | 'doc', itemKey: string, status: DocumentoStatus, reason?: string) => {
        if (type === 'foto') {
            setFormData(prev => ({
                ...prev,
                fotoPerfil: { ...(prev.fotoPerfil || { status: 'faltante' }), status, motivoReprovacao: reason || undefined }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                documentos: {
                    ...prev.documentos,
                    [itemKey]: { ...(prev.documentos?.[itemKey] || { status: 'faltante' }), status, motivoReprovacao: reason || undefined }
                }
            }));
        }
        setReprovingItem(null);
        setReprovalReason("");
    };

    // Helpers seguros para renderização
    const foto = formData.fotoPerfil || { status: 'faltante', url: null, motivoReprovacao: '' };
    const endereco = formData.endereco || { cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "" };
    const saude = formData.saude || { tipoSanguineo: "", alergias: "", problemasSaude: "", possuiConvenio: "nao", nomeConvenio: "" };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6 border-b">
                <Button variant="outline" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4"/></Button>
                <div>
                    <CardTitle>{isNew ? "Novo Membro" : `Editar: ${formData.nome}`}</CardTitle>
                    <CardDescription>{isNew ? "Preencha os dados." : `Código SGC: ${formData.codigo_sgc}`}</CardDescription>
                </div>
                <div className="ml-auto flex gap-2">
                    {!isNew && <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2"/> Excluir</Button>}
                    <Button onClick={handleSave}>Salvar Alterações</Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">

                {/* --- 1. FOTO DE PERFIL --- */}
                <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                    <div className="flex flex-col items-center gap-2">
                        <div className={`relative h-32 w-32 rounded-full overflow-hidden border-4 ${foto.status === 'aprovado' ? 'border-green-500' : foto.status === 'reprovado' ? 'border-red-500' : 'border-yellow-500'}`}>
                            {foto.url ? (
                                <img src={foto.url} alt="Foto Perfil" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200"><User className="h-12 w-12 text-gray-400"/></div>
                            )}
                        </div>
                        <Badge variant={foto.status === 'aprovado' ? 'default' : foto.status === 'reprovado' ? 'destructive' : 'secondary'}>
                            {foto.status ? foto.status.toUpperCase() : 'FALTANTE'}
                        </Badge>
                    </div>

                    <div className="flex-1 space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">Foto de Perfil</h3>
                        <p className="text-sm text-muted-foreground">Verifique se a foto segue os padrões (fundo claro, rosto visível).</p>

                        <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                    onClick={() => handleStatusChange('foto', 'foto', 'aprovado')}>
                                <Check className="h-4 w-4 mr-2"/> Aprovar Foto
                            </Button>
                            <Button size="sm" variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                                    onClick={() => setReprovingItem('foto')}>
                                <X className="h-4 w-4 mr-2"/> Reprovar
                            </Button>
                        </div>

                        {reprovingItem === 'foto' && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-md animate-in slide-in-from-top-2">
                                <Label className="text-red-800">Motivo da Reprovação</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input value={reprovalReason} onChange={e => setReprovalReason(e.target.value)} placeholder="Ex: Foto escura..." className="bg-white" />
                                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange('foto', 'foto', 'reprovado', reprovalReason)}>Confirmar</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setReprovingItem(null)}>Cancelar</Button>
                                </div>
                            </div>
                        )}
                        {foto.status === 'reprovado' && foto.motivoReprovacao && !reprovingItem && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">Motivo atual: {foto.motivoReprovacao}</p>
                        )}
                    </div>
                </div>

                {/* --- 2. DADOS CADASTRAIS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-semibold border-b pb-2 flex items-center gap-2"><UserCheck className="h-4 w-4"/> Dados Pessoais</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2"><Label>Nome Completo</Label><Input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})}/></div>
                            <div><Label>CPF</Label><Input value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})}/></div>
                            <div><Label>Nascimento</Label><Input type="date" value={formData.nascimento} onChange={e => setFormData({...formData, nascimento: e.target.value})}/></div>
                            <div><Label>SGC</Label><Input value={formData.codigo_sgc} onChange={e => setFormData({...formData, codigo_sgc: e.target.value})}/></div>
                            <div><Label>Telefone</Label><Input value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})}/></div>
                            <div>
                                <Label>Unidade</Label>
                                <Select value={formData.unidade} onValueChange={v => setFormData({...formData, unidade: v})}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent><SelectItem value="Jaguar">Jaguar</SelectItem><SelectItem value="Gato do Mato">Gato do Mato</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Cargo</Label>
                                <Select value={formData.cargo} onValueChange={v => setFormData({...formData, cargo: v})}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent><SelectItem value="Desbravador">Desbravador</SelectItem><SelectItem value="Conselheiro">Conselheiro</SelectItem><SelectItem value="Diretoria">Diretoria</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold border-b pb-2 flex items-center gap-2"><MapPin className="h-4 w-4"/> Endereço</h4>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="col-span-2"><Label>CEP</Label><Input value={endereco.cep} onChange={e => setFormData({...formData, endereco: {...endereco, cep: e.target.value}})}/></div>
                            <div className="col-span-2"><Label>Cidade/UF</Label><Input value={`${endereco.cidade}/${endereco.uf}`} readOnly className="bg-muted"/></div>
                            <div className="col-span-3"><Label>Logradouro</Label><Input value={endereco.logradouro} onChange={e => setFormData({...formData, endereco: {...endereco, logradouro: e.target.value}})}/></div>
                            <div className="col-span-1"><Label>Número</Label><Input value={endereco.numero} onChange={e => setFormData({...formData, endereco: {...endereco, numero: e.target.value}})}/></div>
                            <div className="col-span-4"><Label>Bairro</Label><Input value={endereco.bairro} onChange={e => setFormData({...formData, endereco: {...endereco, bairro: e.target.value}})}/></div>
                        </div>
                    </div>
                </div>

                {/* --- 3. FICHA DE SAÚDE --- */}
                <div className="space-y-4">
                    <h4 className="font-semibold border-b pb-2 flex items-center gap-2"><HeartPulse className="h-4 w-4"/> Ficha de Saúde</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
                        <div>
                            <Label>Tipo Sanguíneo</Label>
                            <Input value={saude.tipoSanguineo} onChange={e => setFormData({...formData, saude: {...saude, tipoSanguineo: e.target.value}})} />
                        </div>
                        <div>
                            <Label>Convênio?</Label>
                            <Select value={saude.possuiConvenio} onValueChange={v => setFormData({...formData, saude: {...saude, possuiConvenio: v}})}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent><SelectItem value="sim">Sim</SelectItem><SelectItem value="nao">Não</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Nome do Convênio</Label>
                            <Input value={saude.nomeConvenio} disabled={saude.possuiConvenio !== 'sim'} onChange={e => setFormData({...formData, saude: {...saude, nomeConvenio: e.target.value}})} />
                        </div>
                        <div className="md:col-span-2">
                            <Label className={saude.alergias ? "text-red-600 font-bold" : ""}>Alergias</Label>
                            <Textarea rows={2} value={saude.alergias} onChange={e => setFormData({...formData, saude: {...saude, alergias: e.target.value}})} />
                        </div>
                        <div className="md:col-span-2">
                            <Label className={saude.problemasSaude ? "text-red-600 font-bold" : ""}>Problemas de Saúde</Label>
                            <Textarea rows={2} value={saude.problemasSaude} onChange={e => setFormData({...formData, saude: {...saude, problemasSaude: e.target.value}})} />
                        </div>
                    </div>
                </div>

                {/* --- 4. DOCUMENTOS --- */}
                <div className="space-y-4 pt-4">
                    <h4 className="font-semibold border-b pb-2 flex items-center gap-2"><FileCheck2 className="h-4 w-4"/> Documentos Anexados</h4>
                    <div className="space-y-2">
                        {todosDocumentos.map(doc => {
                            const docInfo = formData.documentos?.[doc];
                            const status = docInfo?.status;

                            return (
                                <div key={doc} className="p-3 border rounded-md flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${status === 'aprovado' ? 'bg-green-100' : status === 'reprovado' ? 'bg-red-100' : 'bg-gray-100'}`}>
                                            <FileCheck2 className={`h-4 w-4 ${status === 'aprovado' ? 'text-green-600' : status === 'reprovado' ? 'text-red-600' : 'text-gray-500'}`}/>
                                        </div>
                                        <div>
                                            <p className="font-medium">{doc}</p>
                                            <Badge variant={status === 'aprovado' ? 'default' : status === 'reprovado' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                {status ? status.toUpperCase().replace('-', ' ') : 'FALTANTE'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {status === 'aguardando-avaliacao' && (
                                            <>
                                                <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1"/> Ver</Button>
                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange('doc', doc, 'aprovado')}>
                                                    <Check className="h-4 w-4"/>
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setReprovingItem(doc)}>
                                                    <X className="h-4 w-4"/>
                                                </Button>
                                            </>
                                        )}
                                        {status === 'aprovado' && <Button size="sm" variant="ghost" className="text-muted-foreground"><Download className="h-4 w-4 mr-2"/>Baixar</Button>}
                                    </div>

                                    {reprovingItem === doc && (
                                        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 items-center bg-red-50 p-2 rounded animate-in fade-in">
                                            <Input size={30} value={reprovalReason} onChange={e => setReprovalReason(e.target.value)} placeholder="Motivo..." className="h-8 bg-white"/>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="destructive" className="h-8" onClick={() => handleStatusChange('doc', doc, 'reprovado', reprovalReason)}>Confirmar</Button>
                                                <Button size="sm" variant="ghost" className="h-8" onClick={() => setReprovingItem(null)}>Cancelar</Button>
                                            </div>
                                        </div>
                                    )}

                                    {status === 'reprovado' && docInfo?.motivoReprovacao && !reprovingItem && (
                                        <div className="text-sm text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                                            <AlertCircle className="h-3 w-3"/> {docInfo.motivoReprovacao}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

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
                    <div><CardTitle>Pendências</CardTitle><CardDescription>Membros com documentos ou fotos pendentes.</CardDescription></div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {membros.filter(m =>
                    // Uso de optional chaining (?.) para evitar crash se dados estiverem incompletos
                    !todosDocumentos.every(doc => m.documentos?.[doc]?.status === 'aprovado') || m.fotoPerfil?.status !== 'aprovado'
                ).map(membro => {
                    const docsNaoAprovados = todosDocumentos.filter(doc => membro.documentos?.[doc]?.status !== 'aprovado');
                    const fotoPendente = membro.fotoPerfil?.status !== 'aprovado';
                    const fotoUrl = membro.fotoPerfil?.url;
                    const fotoStatus = membro.fotoPerfil?.status || 'Faltante';

                    return(
                        <Card key={membro.id} className="p-4 bg-amber-50/50 border-amber-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                        {fotoUrl ? <img src={fotoUrl} className="h-full w-full object-cover"/> : <User className="h-full w-full p-2 text-gray-500"/>}
                                    </div>
                                    <h4 className="font-semibold">{membro.nome}</h4>
                                </div>
                                <Button size="sm" onClick={() => onEdit(membro)}>Resolver</Button>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {fotoPendente && <Badge variant="destructive" className="bg-amber-600">Foto de Perfil: {fotoStatus}</Badge>}
                                {docsNaoAprovados.map(doc => (
                                    <Badge key={doc} variant="outline" className="bg-white border-amber-300 text-amber-800">
                                        {doc}: {membro.documentos?.[doc]?.status || 'Faltante'}
                                    </Badge>
                                ))}
                            </div>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    )
}

function RematriculasView({ membros, onBack, onEdit }: { membros: Membro[]; onBack: () => void; onEdit: (membro: Membro) => void; }) {
    const [membrosAtivos, setMembrosAtivos] = useState<number[]>(membros.filter(m => m.status === 'ativo').map(m => m.id));

    const handleAtivarChange = (memberId: number, isChecked: boolean) => {
        if (isChecked) {
            setMembrosAtivos(prev => [...prev, memberId]);
        } else {
            setMembrosAtivos(prev => prev.filter(id => id !== memberId));
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4"/></Button>
                    <div><CardTitle>Rematrículas Recebidas</CardTitle><CardDescription>Revise os dados e ative os membros para o ano vigente.</CardDescription></div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {membros.filter(m => m.rematricula_preenchida).map(membro => {
                    const fotoUrl = membro.fotoPerfil?.url;
                    return (
                        <Card key={membro.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                        {fotoUrl ? <img src={fotoUrl} className="h-full w-full object-cover"/> : <User className="h-full w-full p-2 text-gray-500"/>}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{membro.nome}</h4>
                                        <p className="text-sm text-muted-foreground">{membro.cargo} • {membro.unidade}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button size="sm" variant="outline" onClick={() => onEdit(membro)}>Revisar Dados Completos</Button>
                                    <div className="flex items-center space-x-2 border-l pl-4">
                                        <Checkbox
                                            id={`ativo-${membro.id}`}
                                            checked={membrosAtivos.includes(membro.id)}
                                            onCheckedChange={(checked) => handleAtivarChange(membro.id, !!checked)}
                                        />
                                        <Label htmlFor={`ativo-${membro.id}`} className="cursor-pointer">Confirmar Ativação</Label>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default function MembrosTab() {
    const [membros, setMembros] = useState<Membro[]>(membrosMock);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroUnidade, setFiltroUnidade] = useState("todas");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [viewMode, setViewMode] = useState<'list' | 'edit' | 'new' | 'missingDocs' | 'rematriculas'>('list');
    const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(null);

    const handleEditClick = (membro: Membro) => { setMembroSelecionado(membro); setViewMode('edit'); };
    const handleNewClick = () => { setMembroSelecionado(null); setViewMode('new'); };
    const handleBack = () => { setViewMode('list'); setMembroSelecionado(null); };

    const handleSaveMembro = (membroData: Partial<Membro>) => {
        if (membroData.id && membroData.id > 0) {
            setMembros(prev => prev.map(m => m.id === membroData.id ? {...m, ...membroData} as Membro : m));
        } else {
            const newId = Math.max(...membros.map(m => m.id), 0) + 1;
            setMembros(prev => [...prev, { ...membroData, id: newId } as Membro]);
        }
        handleBack();
    };

    const getDocumentStatusForMember = (membro: Membro) => {
        // Uso de ?. para evitar crash em dados antigos
        const docsAprovados = todosDocumentos.filter(doc => membro.documentos?.[doc]?.status === 'aprovado').length;
        const totalDocs = todosDocumentos.length;
        const fotoAprovada = membro.fotoPerfil?.status === 'aprovado';

        if (docsAprovados === totalDocs && fotoAprovada)
            return { text: "Completo", icon: <FileCheck2 className="h-4 w-4 text-green-600"/>, color: "text-green-600" };

        const temPendente = todosDocumentos.some(doc => membro.documentos?.[doc]?.status === 'aguardando-avaliacao' || membro.documentos?.[doc]?.status === 'reprovado' || !membro.documentos?.[doc]) || membro.fotoPerfil?.status !== 'aprovado';

        if (temPendente) return { text: "Pendente", icon: <AlertCircle className="h-4 w-4 text-amber-600"/>, color: "text-amber-600" };

        return { text: "Incompleto", icon: <FileX2 className="h-4 w-4 text-gray-500"/>, color: "text-gray-500" };
    }

    const membrosFiltrados = membros.filter((membro) => {
        const matchesSearch = membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) || membro.cpf.includes(searchTerm) || membro.codigo_sgc.includes(searchTerm);
        const matchesUnidade = filtroUnidade === "todas" || membro.unidade === filtroUnidade;
        const matchesTipo = filtroTipo === "todos" || membro.cargo === filtroTipo;
        return matchesSearch && matchesUnidade && matchesTipo;
    });

    // Cálculo seguro dos cards de resumo
    const docsCompletos = membros.filter(m =>
        todosDocumentos.every(doc => m.documentos?.[doc]?.status === 'aprovado') &&
        m.fotoPerfil?.status === 'aprovado'
    ).length;

    const docsFaltantes = membros.length - docsCompletos;
    const rematriculasFeitas = membros.filter(m => m.rematricula_preenchida).length;

    if (viewMode === 'missingDocs') return <DocumentosFaltantesView membros={membros} onBack={handleBack} onEdit={handleEditClick} />;
    if (viewMode === 'rematriculas') return <RematriculasView membros={membros} onBack={handleBack} onEdit={handleEditClick} />;
    if (viewMode === 'edit' || viewMode === 'new') return <MembroForm membro={membroSelecionado} onBack={handleBack} onSave={handleSaveMembro as any} />;

    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users /> Gerenciar Membros</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4 text-center"><Users className="h-6 w-6 mx-auto mb-2 text-blue-600"/><p className="text-2xl font-bold">{membros.length}</p><p className="text-sm text-muted-foreground">Total de Membros</p></Card>
                    <Card className="p-4 text-center"><FileCheck2 className="h-6 w-6 mx-auto mb-2 text-green-600"/><p className="text-2xl font-bold">{docsCompletos}</p><p className="text-sm text-muted-foreground">100% Regularizados</p></Card>
                    <Card className="p-4 text-center hover:bg-amber-50 cursor-pointer transition-colors" onClick={() => setViewMode('missingDocs')}><AlertCircle className="h-6 w-6 mx-auto mb-2 text-amber-600"/><p className="text-2xl font-bold">{docsFaltantes}</p><p className="text-sm text-muted-foreground">Com Pendências</p></Card>
                    <Card className="p-4 text-center hover:bg-indigo-50 cursor-pointer transition-colors" onClick={() => setViewMode('rematriculas')}><UserCheck className="h-6 w-6 mx-auto mb-2 text-indigo-600"/><p className="text-2xl font-bold">{rematriculasFeitas}</p><p className="text-sm text-muted-foreground">Rematrículas</p></Card>
                </div>

                <div className="flex flex-col md:flex-row gap-2 pt-4 border-t">
                    <Button onClick={handleNewClick}><Plus className="h-4 w-4 mr-2" />Novo Membro</Button>
                    <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Importar CSV</Button>
                    <div className="flex-1"></div>
                    <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por nome, CPF ou SGC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full md:w-64" /></div>
                    <Select value={filtroUnidade} onValueChange={setFiltroUnidade}><SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todas">Todas Unidades</SelectItem><SelectItem value="Jaguar">Jaguar</SelectItem><SelectItem value="Gato do Mato">Gato do Mato</SelectItem></SelectContent></Select>
                    <Select value={filtroTipo} onValueChange={setFiltroTipo}><SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos Cargos</SelectItem><SelectItem value="Desbravador">Desbravador</SelectItem><SelectItem value="Conselheiro">Conselheiro</SelectItem></SelectContent></Select>
                    <Button variant="ghost" size="icon" onClick={() => { setSearchTerm(""); setFiltroUnidade("todas"); setFiltroTipo("todos"); }} title="Limpar Filtros"><Filter className="h-4 w-4" /></Button>
                </div>

                <div className="space-y-3">
                    {membrosFiltrados.map((membro) => {
                        const docStatus = getDocumentStatusForMember(membro);
                        const fotoUrl = membro.fotoPerfil?.url;
                        const fotoStatus = membro.fotoPerfil?.status;

                        return (
                            <Card key={membro.id} className="p-4 hover:border-slate-300 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border">
                                                {fotoUrl ? <img src={fotoUrl} className="h-full w-full object-cover"/> : <User className="h-full w-full p-2 text-gray-400"/>}
                                            </div>
                                            {fotoStatus !== 'aprovado' && <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white"></div>}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-lg leading-none">{membro.nome}</p>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                                <span>SGC: {membro.codigo_sgc}</span>
                                                <span>•</span>
                                                <span>{membro.unidade}</span>
                                                <Badge variant="secondary" className="text-xs">{membro.cargo}</Badge>
                                                <Badge variant={membro.status === 'ativo' ? 'outline' : 'destructive'} className="text-xs">{membro.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                                        <span className={`flex items-center gap-1 font-semibold text-sm ${docStatus.color} bg-slate-50 px-2 py-1 rounded`}>
                                            {docStatus.icon} {docStatus.text}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEditClick(membro)}>Gerenciar</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}