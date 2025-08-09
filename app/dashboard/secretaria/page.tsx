"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Plus, Upload, Trash2, Search, Filter, BookOpen, Award } from "lucide-react"

// --- Dados Mockados ---
const membrosMock = [
  { id: 1, nome: "João Silva", cpf: "123.456.789-00", codigo_sgc: "12345", unidade: "Jaguar", cargo: "Desbravador" },
  { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", codigo_sgc: "54321", unidade: "Jaguar", cargo: "Conselheiro" },
  { id: 3, nome: "Pedro Costa", cpf: "111.222.333-44", codigo_sgc: "67890", unidade: "Gato do Mato", cargo: "Desbravador" },
]

const classesMock = [
  { id: 1, nome: "Amigo", codigo: "AM-001" },
  { id: 2, nome: "Companheiro", codigo: "CP-002" },
  { id: 3, nome: "Pesquisador", codigo: "PE-003" },
]

const especialidadesMock = [
  { id: 1, nome: "Internet", codigo: "AP-034", area: "ADRA" },
  { id: 2, nome: "Primeiros Socorros", codigo: "PS-001", area: "Saúde" },
  { id: 3, nome: "Nós e Amarras", codigo: "NA-001", area: "Artes Manuais" },
]

const userClassesMockData = [
  { codigo_sgc: "12345", codigo_classe: "AM-001", status: "Pendente" },
]

const userEspecialidadesMockData = [
  { codigo_sgc: "12345", codigo_especialidade: "AP-034", status: "Pendente" },
  { codigo_sgc: "12345", codigo_especialidade: "PS-001", status: "Investidura" },
]
// --- Fim dos Dados Mockados ---

function GerenciarAssociacoes() {
  const [selectedUserSgc, setSelectedUserSgc] = useState(membrosMock[0].codigo_sgc);
  const [userClasses, setUserClasses] = useState(userClassesMockData);
  const [userEspecialidades, setUserEspecialidades] = useState(userEspecialidadesMockData);
  const [novaEspecialidade, setNovaEspecialidade] = useState<string | undefined>();

  const handleClassStatusChange = (codigo_classe: string, novo_status: string) => {
    setUserClasses(prev => {
      const existing = prev.find(uc => uc.codigo_sgc === selectedUserSgc && uc.codigo_classe === codigo_classe);
      if (novo_status === "Nenhum") return prev.filter(uc => !(uc.codigo_sgc === selectedUserSgc && uc.codigo_classe === codigo_classe));
      if (existing) return prev.map(uc => uc.codigo_sgc === selectedUserSgc && uc.codigo_classe === codigo_classe ? { ...uc, status: novo_status } : uc);
      return [...prev, { codigo_sgc: selectedUserSgc, codigo_classe, status: novo_status }];
    });
  };

  const handleEspecialidadeStatusChange = (codigo_especialidade: string, novo_status: string) => {
    setUserEspecialidades(prev => prev.map(ue => ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === codigo_especialidade ? { ...ue, status: novo_status } : ue));
  };

  const handleRemoveEspecialidade = (codigo_especialidade: string) => {
    setUserEspecialidades(prev => prev.filter(ue => !(ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === codigo_especialidade)));
  };

  const handleAddEspecialidade = () => {
    if (novaEspecialidade && !userEspecialidades.some(ue => ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === novaEspecialidade)) {
      setUserEspecialidades(prev => [...prev, { codigo_sgc: selectedUserSgc, codigo_especialidade: novaEspecialidade, status: "Pendente" }]);
      setNovaEspecialidade(undefined); // Reset dropdown
    }
  };

  const especialidadesDisponiveis = especialidadesMock.filter(
      (esp) => !userEspecialidades.some(ue => ue.codigo_sgc === selectedUserSgc && ue.codigo_especialidade === esp.codigo)
  );

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Associações</CardTitle>
            <CardDescription>Selecione um usuário para gerenciar suas classes e especialidades.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full md:w-1/3">
              <Label>Selecione um Usuário</Label>
              <Select onValueChange={setSelectedUserSgc} defaultValue={selectedUserSgc}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {membrosMock.map(m => (<SelectItem key={m.codigo_sgc} value={m.codigo_sgc}>{m.nome}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Classes do Usuário</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Especialidades do Usuário</CardTitle></CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>
  )
}


export default function SecretariaPage() {
  const [membros] = useState(membrosMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroUnidade, setFiltroUnidade] = useState("todas")
  const [filtroTipo, setFiltroTipo] = useState("todos")

  const membrosFiltrados = membros.filter((membro) => {
    const matchesSearch =
        membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membro.cpf.includes(searchTerm) ||
        membro.codigo_sgc.includes(searchTerm)

    const matchesUnidade = filtroUnidade === "todas" || membro.unidade === filtroUnidade
    const matchesTipo = filtroTipo === "todos" || membro.cargo === filtroTipo

    return matchesSearch && matchesUnidade && matchesTipo
  })

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Secretaria</h1>
          <p className="text-muted-foreground">Gerencie membros, classes e especialidades</p>
        </div>

        <Tabs defaultValue="membros" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="membros">Membros</TabsTrigger>
            <TabsTrigger value="atas">Atas e Atos</TabsTrigger>
            <TabsTrigger value="classes-especialidades">Classes e Especialidades</TabsTrigger>
            <TabsTrigger value="sentinelas">Sentinelas</TabsTrigger>
          </TabsList>

          <TabsContent value="membros" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Gerenciar Membros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button><Plus className="h-4 w-4 mr-2" />Novo Membro</Button>
                  <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Importar</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome, CPF ou SGC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                  <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
                    <SelectTrigger><SelectValue placeholder="Unidade" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as Unidades</SelectItem>
                      <SelectItem value="Jaguar">Jaguar</SelectItem>
                      <SelectItem value="Gato do Mato">Gato do Mato</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger><SelectValue placeholder="Cargo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Cargos</SelectItem>
                      <SelectItem value="Desbravador">Desbravador</SelectItem>
                      <SelectItem value="Conselheiro">Conselheiro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => { setSearchTerm(""); setFiltroUnidade("todas"); setFiltroTipo("todos"); }}>
                    <Filter className="h-4 w-4 mr-2" /> Limpar
                  </Button>
                </div>
                <div className="space-y-3">
                  {membrosFiltrados.map((membro) => (
                      <Card key={membro.id} className="p-4"><div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{membro.nome}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>CPF: {membro.cpf}</span><span>SGC: {membro.codigo_sgc}</span><span>Unidade: {membro.unidade}</span><Badge variant="secondary">{membro.cargo}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2"><Button size="sm" variant="outline">Editar</Button><Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button></div>
                      </div></Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="atas" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText /> Atas e Atos</CardTitle></CardHeader>
              <CardContent>
                {/* Conteúdo existente da aba de Atas */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes-especialidades" className="space-y-4">
            <GerenciarAssociacoes />

            <div className="grid gap-4 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Cadastrar Nova Classe</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Nome da classe</Label><Input placeholder="Ex: Amigo" /></div>
                  <div className="space-y-2"><Label>Código da classe</Label><Input placeholder="Ex: AM-001" /></div>
                  <Button>Cadastrar Classe</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Award /> Cadastrar Nova Especialidade</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Nome da especialidade</Label><Input placeholder="Ex: Internet" /></div>
                  <div className="space-y-2"><Label>Código</Label><Input placeholder="Ex: AP-034" /></div>
                  <Button>Cadastrar Especialidade</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sentinelas" className="space-y-4">
            <Card><CardHeader><CardTitle>Sentinelas</CardTitle></CardHeader><CardContent><p>Em breve.</p></CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}