"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, RotateCcw, Trash2 } from "lucide-react"

// --- Dados Mockados ---
const membrosMock = [
    { id: 1, nome: "João Silva", codigo_sgc: "12345" },
    { id: 2, nome: "Maria Santos", codigo_sgc: "54321" },
    { id: 3, nome: "Pedro Costa", codigo_sgc: "67890" },
    { id: 4, nome: "Ana Oliveira", codigo_sgc: "11111" },
]

const classesMock = [
    { id: 1, nome: "Amigo", codigo: "AM-001" },
    { id: 2, nome: "Companheiro", codigo: "CP-002" },
]

const especialidadesMock = [
    { id: 1, nome: "Internet", codigo: "AP-034" },
    { id: 2, nome: "Primeiros Socorros", codigo: "PS-001" },
]

const initialUserClasses = [
    { codigo_sgc: "12345", codigo_classe: "AM-001", status: "Avaliação" },
    { codigo_sgc: "54321", codigo_classe: "AM-001", status: "Refazer" },
    { codigo_sgc: "67890", codigo_classe: "CP-002", status: "Aprovado" },
]

const initialUserEspecialidades = [
    { codigo_sgc: "11111", codigo_especialidade: "AP-034", status: "Avaliação" },
    { codigo_sgc: "67890", codigo_especialidade: "PS-001", status: "Refazer" },
]
// --- Fim dos Dados Mockados ---

export default function SentinelasDaColina() {
    const [tipoFiltro, setTipoFiltro] = useState("classe");
    const [idSelecionado, setIdSelecionado] = useState<string | undefined>();

    // Estados locais para simular as alterações
    const [userClasses, setUserClasses] = useState(initialUserClasses);
    const [userEspecialidades, setUserEspecialidades] = useState(initialUserEspecialidades);

    const handleStatusChange = (sgc: string, novoStatus: string) => {
        if (tipoFiltro === 'classe') {
            setUserClasses(prev => prev.map(uc => uc.codigo_sgc === sgc && uc.codigo_classe === idSelecionado ? { ...uc, status: novoStatus } : uc));
        } else {
            setUserEspecialidades(prev => prev.map(ue => ue.codigo_sgc === sgc && ue.codigo_especialidade === idSelecionado ? { ...ue, status: novoStatus } : ue));
        }
    };

    const handleRemove = (sgc: string) => {
        if (tipoFiltro === 'classe') {
            // Simula a remoção revertendo para um status que não aparece na lista
            setUserClasses(prev => prev.map(uc => uc.codigo_sgc === sgc && uc.codigo_classe === idSelecionado ? { ...uc, status: "Pendente" } : uc));
        } else {
            setUserEspecialidades(prev => prev.map(ue => ue.codigo_sgc === sgc && ue.codigo_especialidade === idSelecionado ? { ...ue, status: "Pendente" } : ue));
        }
    }

    const getMembrosFiltrados = (statusList: string[]) => {
        if (!idSelecionado) return [];
        let data, key;
        if (tipoFiltro === 'classe') {
            data = userClasses;
            key = 'codigo_classe';
        } else {
            data = userEspecialidades;
            key = 'codigo_especialidade';
        }

        const sgcs = data
            .filter(item => item[key] === idSelecionado && statusList.includes(item.status))
            .map(item => item.codigo_sgc);

        return membrosMock.filter(m => sgcs.includes(m.codigo_sgc));
    }

    const membrosParaAvaliar = getMembrosFiltrados(['Avaliação', 'Refazer']);
    const membrosAprovados = getMembrosFiltrados(['Aprovado']);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sentinelas da Colina</CardTitle>
                <CardDescription>
                    Aprove ou solicite refação para membros em classes ou especialidades.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Select value={tipoFiltro} onValueChange={(value) => { setTipoFiltro(value); setIdSelecionado(undefined); }}>
                        <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="classe">Classe</SelectItem><SelectItem value="especialidade">Especialidade</SelectItem></SelectContent>
                    </Select>
                    {tipoFiltro === "classe" ? (
                        <Select onValueChange={setIdSelecionado}><SelectTrigger><SelectValue placeholder="Selecione uma classe..." /></SelectTrigger><SelectContent>{classesMock.map(c => <SelectItem key={c.codigo} value={c.codigo}>{c.nome}</SelectItem>)}</SelectContent></Select>
                    ) : (
                        <Select onValueChange={setIdSelecionado}><SelectTrigger><SelectValue placeholder="Selecione uma especialidade..." /></SelectTrigger><SelectContent>{especialidadesMock.map(e => <SelectItem key={e.codigo} value={e.codigo}>{e.nome}</SelectItem>)}</SelectContent></Select>
                    )}
                </div>

                <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Para Avaliar / Refazer</h3>
                    <div className="space-y-2">
                        {idSelecionado && membrosParaAvaliar.length > 0 ? membrosParaAvaliar.map(membro => (
                            <div key={membro.id} className="flex justify-between items-center p-3 border rounded-md">
                                <p className="font-medium">{membro.nome}</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                        {tipoFiltro === 'classe' ? userClasses.find(uc => uc.codigo_sgc === membro.codigo_sgc && uc.codigo_classe === idSelecionado)?.status : userEspecialidades.find(ue => ue.codigo_sgc === membro.codigo_sgc && ue.codigo_especialidade === idSelecionado)?.status}
                                    </Badge>
                                    <Button size="sm" onClick={() => handleStatusChange(membro.codigo_sgc, 'Aprovado')}><Check className="h-4 w-4 mr-2"/> Aprovar</Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(membro.codigo_sgc, 'Refazer')}><RotateCcw className="h-4 w-4 mr-2"/> Refazer</Button>
                                </div>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">Nenhum membro para avaliar neste item.</p>}
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Aprovados</h3>
                    <div className="space-y-2">
                        {idSelecionado && membrosAprovados.length > 0 ? membrosAprovados.map(membro => (
                            <div key={membro.id} className="flex justify-between items-center p-3 border rounded-md bg-green-50">
                                <p className="font-medium">{membro.nome}</p>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleRemove(membro.codigo_sgc)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">Nenhum membro aprovado neste item.</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}