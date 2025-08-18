"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, PlusCircle, Trash2 } from "lucide-react"

// --- Tipos e Dados Mockados ---
interface Responsavel {
    id: number;
    nome: string;
    telefone: string;
    grau: string;
}

const membroMock = {
    nomeCompleto: "João Silva de Oliveira",
    codigoSGC: "12345",
    cpf: "123.456.789-00",
    endereco: "Rua das Flores, 123, Bairro Feliz",
    telefone: "(11) 98765-4321",
    dataNascimento: "2010-05-15", // Menor de 18
    responsaveis: [
        { id: 1, nome: "Maria Silva", telefone: "(11) 91234-5678", grau: "Mãe" }
    ]
}
// --- Fim dos Dados Mockados ---

export default function RematriculaTab() {
    const [dados, setDados] = useState(membroMock);
    const [responsaveis, setResponsaveis] = useState<Responsavel[]>(membroMock.responsaveis)

    // Lógica para verificar se o membro é menor de 18 anos
    const hoje = new Date();
    const nascimento = new Date(dados.dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const isMenorDeIdade = idade < 18;

    const adicionarResponsavel = () => {
        if (responsaveis.length < 4) {
            setResponsaveis([...responsaveis, { id: Date.now(), nome: "", telefone: "", grau: "" }]);
        }
    };

    const removerResponsavel = (id: number) => {
        setResponsaveis(responsaveis.filter(r => r.id !== id));
    };

    const handleResponsavelChange = (id: number, field: keyof Omit<Responsavel, 'id'>, value: string) => {
        setResponsaveis(responsaveis.map(r => r.id === id ? { ...r, [field]: value } : r));
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User /> Rematrícula</CardTitle>
                <CardDescription>Confirme seus dados e atualize as informações necessárias para o novo ano.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* --- DADOS FIXOS --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Nome Completo</Label>
                            <Input value={dados.nomeCompleto} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Código SGC</Label>
                            <Input value={dados.codigoSGC} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>CPF</Label>
                            <Input value={dados.cpf} disabled />
                        </div>
                    </div>
                </div>

                {/* --- DADOS EDITÁVEIS --- */}
                <div className="pt-6 border-t space-y-4">
                    <h3 className="font-semibold">Informações de Contato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input id="endereco" value={dados.endereco} onChange={(e) => setDados({...dados, endereco: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input id="telefone" value={dados.telefone} onChange={(e) => setDados({...dados, telefone: e.target.value})}/>
                        </div>
                    </div>
                </div>

                {/* --- DADOS DOS RESPONSÁVEIS (CONDICIONAL) --- */}
                {isMenorDeIdade && (
                    <div className="pt-6 border-t space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Responsáveis</h3>
                            <Button variant="outline" size="sm" onClick={adicionarResponsavel} disabled={responsaveis.length >= 4}>
                                <PlusCircle className="h-4 w-4 mr-2"/> Adicionar Responsável
                            </Button>
                        </div>
                        {responsaveis.map((resp, index) => (
                            <Card key={resp.id} className="p-4 bg-muted/50">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor={`resp-nome-${index}`}>Nome do Responsável</Label>
                                        <Input id={`resp-nome-${index}`} value={resp.nome} onChange={e => handleResponsavelChange(resp.id, 'nome', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`resp-tel-${index}`}>Telefone</Label>
                                        <Input id={`resp-tel-${index}`} value={resp.telefone} onChange={e => handleResponsavelChange(resp.id, 'telefone', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`resp-grau-${index}`}>Grau</Label>
                                        <Input id={`resp-grau-${index}`} value={resp.grau} onChange={e => handleResponsavelChange(resp.id, 'grau', e.target.value)} />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removerResponsavel(resp.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="flex justify-end pt-6 border-t">
                    <Button>Salvar e Enviar Rematrícula</Button>
                </div>
            </CardContent>
        </Card>
    );
}