"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Award, Trash2 } from "lucide-react"

// Dados importados ou definidos no escopo do componente
const membrosMock = [
    { id: 1, nome: "João Silva", codigo_sgc: "12345" },
    { id: 2, nome: "Maria Santos", codigo_sgc: "54321" },
    { id: 3, nome: "Pedro Costa", codigo_sgc: "67890" },
    { id: 4, nome: "Ana Pereira", codigo_sgc: "11122" },
];
const classesMock = [ { id: 1, nome: "Amigo", codigo: "AM-001" }, { id: 2, nome: "Companheiro", codigo: "CP-002" }];
const especialidadesMock = [{ id: 1, nome: "Internet", codigo: "AP-034" }, { id: 2, nome: "Primeiros Socorros", codigo: "PS-001" }];
const userClassesMockData = [{ codigo_sgc: "12345", codigo_classe: "AM-001", status: "Pendente" }];
const userEspecialidadesMockData = [{ codigo_sgc: "12345", codigo_especialidade: "AP-034", status: "Pendente" }];

export default function AssociacoesTab() {
    const [selectedUserSgc, setSelectedUserSgc] = useState(membrosMock[0].codigo_sgc);
    const [userClasses, setUserClasses] = useState(userClassesMockData);
    const [userEspecialidades, setUserEspecialidades] = useState(userEspecialidadesMockData);
    const [novaEspecialidade, setNovaEspecialidade] = useState<string | undefined>();
    const [searchTerm, setSearchTerm] = useState(membrosMock[0].nome);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const handleClassStatusChange = (codigo_classe: string, novo_status: string) => { setUserClasses(prev => { const existing = prev.find(uc => uc.codigo_sgc === selectedUserSgc && uc.codigo_classe === codigo_classe); if (novo_status === "Nenhum") return prev.filter(uc => !(uc.codigo_sgc === selectedUserSgc && uc.codigo_classe === codigo_classe)); if (existing) return prev.map(uc => uc.codigo_sgc === selectedUserSgc && uc.codigo_classe === codigo_classe ? { ...uc, status: novo_status } : uc); return [...prev, { codigo_sgc: selectedUserSgc, codigo_classe, status: novo_status }]; }); };
    const handleEspecialidadeStatusChange = (codigo_especialidade: string, novo_status: string) => { setUserEspecialidades(prev => prev.map(ue => ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === codigo_especialidade ? { ...ue, status: novo_status } : ue)); };
    const handleRemoveEspecialidade = (codigo_especialidade: string) => { setUserEspecialidades(prev => prev.filter(ue => !(ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === codigo_especialidade))); };
    const handleAddEspecialidade = () => { if (novaEspecialidade && !userEspecialidades.some(ue => ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === novaEspecialidade)) { setUserEspecialidades(prev => [...prev, { codigo_sgc: selectedUserSgc, codigo_especialidade: novaEspecialidade, status: "Pendente" }]); setNovaEspecialidade(undefined); } };

    const especialidadesDisponiveis = especialidadesMock.filter((esp) => !userEspecialidades.some(ue => ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === esp.codigo));
    const membrosFiltrados = membrosMock.filter(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelectUser = (sgc: string, nome: string) => {
        setSelectedUserSgc(sgc);
        setSearchTerm(nome);
        setIsDropdownOpen(false);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Associações</CardTitle>
                    <CardDescription>Selecione um usuário para gerenciar suas classes e especialidades.</CardDescription>
                </CardHeader>
                <CardContent className="w-full md:w-1/3 space-y-1 relative">
                    <Label>Buscar Usuário</Label>
                    <Input
                        placeholder="Digite para buscar..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            if (!isDropdownOpen) {
                                setIsDropdownOpen(true);
                            }
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)} // Delay para permitir o clique no dropdown
                    />
                    {isDropdownOpen && membrosFiltrados.length > 0 && (
                        <Card className="absolute z-10 w-full mt-1">
                            <CardContent className="p-1 max-h-60 overflow-y-auto">
                                {membrosFiltrados.map(m => (
                                    <Button
                                        variant="ghost"
                                        key={m.codigo_sgc}
                                        className="w-full justify-start"
                                        onClick={() => handleSelectUser(m.codigo_sgc, m.nome)}
                                    >
                                        {m.nome}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Informações de {membrosMock.find(m => m.codigo_sgc === selectedUserSgc)?.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Classes do Usuário</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {classesMock.map(classe => {
                                const userClass = userClasses.find(uc => uc.codigo_sgc === selectedUserSgc && uc.codigo_classe === classe.codigo);
                                const statusAtual = userClass?.status || "Nenhum";
                                return (
                                    <div key={classe.codigo} className="space-y-2">
                                        <Label>{classe.nome}</Label>
                                        <Select value={statusAtual} onValueChange={(newStatus) => handleClassStatusChange(classe.codigo, newStatus)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Nenhum">Nenhum</SelectItem>
                                                <SelectItem value="Pendente">Pendente</SelectItem>
                                                <SelectItem value="Investidura">Investidura</SelectItem>
                                                <SelectItem value="Entregue">Entregue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Especialidades do Usuário</h3>
                        <div className="space-y-2">
                            {userEspecialidades.filter(ue => ue.codigo_sgc === selectedUserSgc).map(esp => (
                                <div key={esp.codigo_especialidade} className="flex items-center justify-between p-2 border rounded-md">
                                    <span className="font-medium">{especialidadesMock.find(e => e.codigo === esp.codigo_especialidade)?.nome}</span>
                                    <div className="flex items-center gap-2">
                                        <Select value={esp.status} onValueChange={(newStatus) => handleEspecialidadeStatusChange(esp.codigo_especialidade, newStatus)}>
                                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pendente">Pendente</SelectItem>
                                                <SelectItem value="Investidura">Investidura</SelectItem>
                                                <SelectItem value="Entregue">Entregue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button size="sm" variant="ghost" onClick={() => handleRemoveEspecialidade(esp.codigo_especialidade)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t">
                            <Label>Adicionar Nova Especialidade</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <Select onValueChange={setNovaEspecialidade}>
                                    <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione uma especialidade" /></SelectTrigger>
                                    <SelectContent>
                                        {especialidadesDisponiveis.map(esp => (
                                            <SelectItem key={esp.codigo} value={esp.codigo}>{esp.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAddEspecialidade}>Adicionar</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Cadastrar Classe</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Nome</Label><Input placeholder="Ex: Amigo" /></div><div className="space-y-2"><Label>Código</Label><Input placeholder="Ex: AM-001" /></div><Button>Cadastrar</Button></CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award /> Cadastrar Especialidade</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Nome</Label><Input placeholder="Ex: Internet" /></div><div className="space-y-2"><Label>Código</Label><Input placeholder="Ex: AP-034" /></div><Button>Cadastrar</Button></CardContent></Card>
            </div>
        </div>
    )
}