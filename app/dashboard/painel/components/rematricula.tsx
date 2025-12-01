"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    User,
    PlusCircle,
    Trash2,
    HeartPulse,
    FileSignature,
    Camera,
    Search,
    ShieldCheck,
    AlertCircle
} from "lucide-react"

// --- Interfaces e Tipos ---
interface Responsavel {
    id: number;
    nome: string;
    telefone: string;
    grau: string;
}

interface MembroData {
    fotoPerfilUrl: string | null;
    nomeCompleto: string;
    codigoSGC: string;
    cpf: string;
    // --- Novos Campos de Documentação ---
    rg: string;
    orgaoExpedidor: string;
    dataEmissaoRg: string;
    // ------------------------------------
    dataNascimento: string;
    telefone: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    tipoSanguineo: string;
    alergias: string;
    problemasSaude: string;
    possuiConvenio: string;
    nomeConvenio: string;
}

// --- Dados Iniciais (Mock) ---
const membroMock: MembroData & { responsaveis: Responsavel[] } = {
    // Foto
    fotoPerfilUrl: null,
    // Dados Pessoais
    nomeCompleto: "João Silva de Oliveira",
    codigoSGC: "12345",
    cpf: "123.456.789-00",
    rg: "12.345.678-X",
    orgaoExpedidor: "SSP/SP",
    dataEmissaoRg: "2018-05-20",
    // Datas
    dataNascimento: "2010-05-15",
    telefone: "(11) 98765-4321",
    // Endereço
    cep: "01234-567",
    logradouro: "Rua das Flores",
    numero: "123",
    complemento: "Apto 42",
    bairro: "Jardim Primavera",
    cidade: "São Paulo",
    uf: "SP",
    // Saúde
    tipoSanguineo: "",
    alergias: "",
    problemasSaude: "",
    possuiConvenio: "nao",
    nomeConvenio: "",
    // Responsáveis
    responsaveis: [
        { id: 1, nome: "Maria Silva", telefone: "(11) 91234-5678", grau: "Mãe" }
    ]
}

export default function RematriculaTab() {
    // --- States ---
    const [dados, setDados] = useState(membroMock);
    const [responsaveis, setResponsaveis] = useState<Responsavel[]>(membroMock.responsaveis);
    const [aceiteTermos, setAceiteTermos] = useState(false);
    const [aceiteLgpd, setAceiteLgpd] = useState(false);

    // --- Lógica de Negócio ---

    // 1. Lógica do Preview da Foto
    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Cria uma URL temporária para exibir a imagem imediatamente
            const previewUrl = URL.createObjectURL(file);
            setDados(prev => ({ ...prev, fotoPerfilUrl: previewUrl }));
        }
    };

    // 2. Calcular idade
    const hoje = new Date();
    const nascimento = new Date(dados.dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    const idadeExata = (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) ? idade - 1 : idade;

    const isMenorDeIdade = idadeExata < 18;

    // 3. Manipulação de Responsáveis
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

    // 4. Simulação de busca de CEP
    const handleBuscaCep = () => {
        if(dados.cep.length >= 8) {
            alert(`Buscando dados para o CEP: ${dados.cep}...`);
        } else {
            alert("Digite um CEP válido");
        }
    }

    // 5. Simulação de Envio
    const handleSubmit = () => {
        // Nota: O campo 'dados.fotoPerfilUrl' aqui contém apenas o preview (blob:).
        // Em um envio real, você enviaria o objeto 'file' via FormData.
        console.log("Enviando dados:", { ...dados, responsaveis, aceiteTermos, aceiteLgpd });
        alert("Rematrícula enviada com sucesso!");
    }

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><User className="text-primary"/> Rematrícula Anual</CardTitle>
                <CardDescription>Confirme seus dados, atualize sua ficha de saúde e renove seu vínculo.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">

                {/* ----------------------------------------------------------------
                   1. FOTO DE PERFIL (Com Preview Funcional)
                ---------------------------------------------------------------- */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="relative group cursor-pointer">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-sm bg-slate-200 flex items-center justify-center">
                            {dados.fotoPerfilUrl ? (
                                <img src={dados.fotoPerfilUrl} alt="Foto de Perfil" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-16 w-16 text-slate-400" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                            <Camera className="h-5 w-5" />
                            <Input
                                type="file"
                                className="hidden"
                                id="foto-upload"
                                accept="image/*"
                                onChange={handleFotoChange} // <--- Evento Adicionado
                            />
                        </div>
                    </div>
                    <Label htmlFor="foto-upload" className="mt-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                        Alterar foto de perfil
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Foto de rosto, fundo claro (padrão 3x4)</p>
                </div>

                {/* ----------------------------------------------------------------
                   2. DADOS PESSOAIS
                ---------------------------------------------------------------- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Dados Pessoais</h3>

                    {/* Linha 1: Dados fixos/vazados do sistema */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Nome Completo</Label>
                            <Input value={dados.nomeCompleto} disabled className="bg-muted text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <Label>Código SGC</Label>
                            <Input value={dados.codigoSGC} disabled className="bg-muted text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <Label>CPF</Label>
                            <Input value={dados.cpf} disabled className="bg-muted text-muted-foreground" />
                        </div>
                    </div>

                    {/* Linha 2: Dados editáveis do RG */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rg">RG</Label>
                            <Input
                                id="rg"
                                value={dados.rg}
                                onChange={(e) => setDados({...dados, rg: e.target.value})}
                                placeholder="00.000.000-0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orgao">Órgão Expedidor</Label>
                            <Input
                                id="orgao"
                                value={dados.orgaoExpedidor}
                                onChange={(e) => setDados({...dados, orgaoExpedidor: e.target.value})}
                                placeholder="Ex: SSP/SP"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="data_emissao_rg">Data de Emissão (RG)</Label>
                            <Input
                                id="data_emissao_rg"
                                type="date"
                                value={dados.dataEmissaoRg}
                                onChange={(e) => setDados({...dados, dataEmissaoRg: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------
                   3. ENDEREÇO E CONTATO
                ---------------------------------------------------------------- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Endereço e Contato</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Celular / WhatsApp (Principal)</Label>
                            <Input id="telefone" value={dados.telefone} onChange={(e) => setDados({...dados, telefone: e.target.value})}/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                        <div className="md:col-span-3 space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <div className="flex gap-2">
                                <Input id="cep" value={dados.cep} onChange={(e) => setDados({...dados, cep: e.target.value})} maxLength={9}/>
                                <Button size="icon" variant="outline" onClick={handleBuscaCep} title="Buscar CEP" type="button">
                                    <Search className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                        <div className="md:col-span-7 space-y-2">
                            <Label htmlFor="logradouro">Rua / Logradouro</Label>
                            <Input id="logradouro" value={dados.logradouro} onChange={(e) => setDados({...dados, logradouro: e.target.value})}/>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="numero">Número</Label>
                            <Input id="numero" value={dados.numero} onChange={(e) => setDados({...dados, numero: e.target.value})}/>
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <Label htmlFor="complemento">Complemento</Label>
                            <Input id="complemento" placeholder="Apto, Bloco..." value={dados.complemento} onChange={(e) => setDados({...dados, complemento: e.target.value})}/>
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <Label htmlFor="bairro">Bairro</Label>
                            <Input id="bairro" value={dados.bairro} onChange={(e) => setDados({...dados, bairro: e.target.value})}/>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <Label htmlFor="cidade">Cidade</Label>
                            <Input id="cidade" value={dados.cidade} disabled className="bg-muted"/>
                        </div>
                        <div className="md:col-span-1 space-y-2">
                            <Label htmlFor="uf">UF</Label>
                            <Input id="uf" value={dados.uf} disabled className="bg-muted"/>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------
                   4. DADOS DE SAÚDE
                ---------------------------------------------------------------- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <HeartPulse className="h-5 w-5"/> Ficha de Saúde
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo Sanguíneo</Label>
                            <Select value={dados.tipoSanguineo} onValueChange={(v) => setDados({...dados, tipoSanguineo: v})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                    <SelectItem value="nao_sei">Não sei</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label>Possui Convênio Médico?</Label>
                            <Select
                                value={dados.possuiConvenio}
                                onValueChange={(v) => setDados({...dados, possuiConvenio: v})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nao">Não, utilizo SUS</SelectItem>
                                    <SelectItem value="sim">Sim, possuo convênio</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {dados.possuiConvenio === "sim" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-100 dark:border-blue-900">
                            <Label className="text-blue-700 dark:text-blue-300">Nome do Convênio e Número da Carteirinha</Label>
                            <Input
                                value={dados.nomeConvenio}
                                onChange={(e) => setDados({...dados, nomeConvenio: e.target.value})}
                                placeholder="Ex: Unimed - 000.000.000"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Alergias (Medicamentos/Alimentos)</Label>
                            <Textarea
                                className="min-h-[80px]"
                                placeholder="Liste as alergias ou digite 'Nenhuma'..."
                                value={dados.alergias}
                                onChange={(e) => setDados({...dados, alergias: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Problemas de Saúde / Medicamentos Contínuos</Label>
                            <Textarea
                                className="min-h-[80px]"
                                placeholder="Descreva problemas crônicos ou medicamentos em uso..."
                                value={dados.problemasSaude}
                                onChange={(e) => setDados({...dados, problemasSaude: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------
                   5. RESPONSÁVEIS
                ---------------------------------------------------------------- */}
                {isMenorDeIdade && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-semibold text-lg">Responsáveis Legais</h3>
                            <Button variant="outline" size="sm" onClick={adicionarResponsavel} disabled={responsaveis.length >= 4} type="button">
                                <PlusCircle className="h-4 w-4 mr-2"/> Adicionar
                            </Button>
                        </div>
                        {responsaveis.length === 0 && <p className="text-sm text-red-500">Adicione ao menos um responsável.</p>}

                        {responsaveis.map((resp, index) => (
                            <Card key={resp.id} className="p-4 bg-slate-50 dark:bg-slate-900 border shadow-none relative">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="space-y-2 md:col-span-5">
                                        <Label htmlFor={`resp-nome-${index}`}>Nome Completo</Label>
                                        <Input id={`resp-nome-${index}`} value={resp.nome} onChange={e => handleResponsavelChange(resp.id, 'nome', e.target.value)} />
                                    </div>
                                    <div className="space-y-2 md:col-span-3">
                                        <Label htmlFor={`resp-tel-${index}`}>Telefone</Label>
                                        <Input id={`resp-tel-${index}`} value={resp.telefone} onChange={e => handleResponsavelChange(resp.id, 'telefone', e.target.value)} />
                                    </div>
                                    <div className="space-y-2 md:col-span-3">
                                        <Label htmlFor={`resp-grau-${index}`}>Grau de Parentesco</Label>
                                        <Input id={`resp-grau-${index}`} placeholder="Ex: Pai, Mãe, Avó" value={resp.grau} onChange={e => handleResponsavelChange(resp.id, 'grau', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => removerResponsavel(resp.id)} className="text-red-500 hover:text-red-700 hover:bg-red-100" type="button">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ----------------------------------------------------------------
                   6. LGPD E TERMOS
                ---------------------------------------------------------------- */}
                <div className="pt-6 border-t space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-900 border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
                            <ShieldCheck className="h-5 w-5" />
                            <h4 className="font-semibold text-sm">Privacidade e Proteção de Dados (LGPD)</h4>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                            Em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>:
                            <br/><br/>
                            1. <strong>Finalidade:</strong> Os dados coletados serão utilizados exclusivamente para gestão administrativa do clube, inscrição no seguro anual obrigatório e atendimento de emergência médica.
                            <br/>
                            2. <strong>Dados Sensíveis:</strong> Autorizo explicitamente o tratamento de dados de saúde fornecidos para fins de preservação da vida e tutela da saúde.
                            <br/>
                            3. <strong>Uso de Imagem:</strong> Autorizo o uso da foto de perfil e imagens captadas durante as atividades para fins de identificação interna e divulgação institucional do clube, sem fins comerciais.
                        </p>
                    </div>

                    <div className="space-y-4 p-2">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="termos_veracidade"
                                checked={aceiteTermos}
                                onCheckedChange={(checked) => setAceiteTermos(checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="termos_veracidade" className="text-sm font-medium cursor-pointer">
                                    Declaro que as informações acima são verdadeiras
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Assumo inteira responsabilidade pela veracidade dos dados inseridos nesta ficha.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="termos_lgpd"
                                checked={aceiteLgpd}
                                onCheckedChange={(checked) => setAceiteLgpd(checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="termos_lgpd" className="text-sm font-medium cursor-pointer">
                                    Li e concordo com o tratamento de dados pessoais e uso de imagem
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Concordo com os termos de privacidade e autorizo o uso dos dados para fins do clube.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------
                   7. BOTÃO DE ENVIO
                ---------------------------------------------------------------- */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t mt-4">
                    {(!aceiteTermos || !aceiteLgpd) && (
                        <p className="text-xs text-red-500 flex items-center self-center animate-pulse">
                            <AlertCircle className="w-3 h-3 mr-1"/>
                            Necessário aceitar todos os termos para prosseguir
                        </p>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={!aceiteTermos || !aceiteLgpd}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                        size="lg"
                    >
                        <FileSignature className="w-4 h-4 mr-2"/>
                        Confirmar e Enviar Rematrícula
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}