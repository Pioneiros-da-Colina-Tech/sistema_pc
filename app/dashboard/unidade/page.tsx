"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BarChart3, Users, Award, BookOpen, Trash2 } from "lucide-react"

// --- Dados Mockados ---
const unidadesMock = [
  { id: "jaguar", nome: "Jaguar", pontuacao: 85, codigo_classe_regular: "AM-001", codigo_classe_avancada: "AM-A-001" },
  { id: "gato-mato", nome: "Gato do Mato", pontuacao: 72, codigo_classe_regular: "CP-002", codigo_classe_avancada: "CP-A-002" },
]

const membrosMock = [
  { id: 1, codigo_sgc: "12345", nome: "João Silva", cargo: "Desbravador", id_unidade: "jaguar" },
  { id: 2, codigo_sgc: "54321", nome: "Maria Santos", cargo: "Conselheiro", id_unidade: "jaguar" },
  { id: 3, codigo_sgc: "67890", nome: "Pedro Costa", cargo: "Desbravador", id_unidade: "gato-mato" },
]

const pontuacoesDetalhadasMock = [
  { codigo_sgc: "12345", presenca: 40, pontualidade: 50, uniforme: 35, modestia: 40 },
  { codigo_sgc: "54321", presenca: 48, pontualidade: 50, uniforme: 50, modestia: 50 },
  { codigo_sgc: "67890", presenca: 45, pontualidade: 40, uniforme: 50, modestia: 50 },
]

const requisitosClassesMock = [
  { id: 101, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "AM-001" },
  { id: 102, secao: "Descoberta Espiritual", texto: "Memorizar Voto e Lei.", codigo_classe: "AM-001" },
  { id: 201, secao: "Geral", texto: "Requisito avançado de Amigo.", codigo_classe: "AM-A-001" },
  { id: 301, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "CP-002" },
]

const avaliacaoClassesInitialMock = [
  { id: 1, id_requisito: 101, codigo_sgc: "12345", status: "Aprovado" },
]

const especialidadesMock = [
  { id: 1, nome: "Internet", membros: ["João Silva", "Pedro Costa"], status: "aprovado" },
  { id: 2, nome: "Primeiros Socorros", membros: ["Maria Santos"], status: "avaliacao" },
]

const reunioesMock = [
  { id: 1, nome: "Reunião Geral", data: "2025-01-25" },
  { id: 2, nome: "Treinamento", data: "2025-01-28" },
]
// --- Fim dos Dados Mockados ---

export default function UnidadePage() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("jaguar")
  const [avaliacaoClasses, setAvaliacaoClasses] = useState(avaliacaoClassesInitialMock)
  const [requisitoPendente, setRequisitoPendente] = useState<string | undefined>()

  // State para o planejamento
  const [planejamentos, setPlanejamentos] = useState<{ id: number, reuniaoId: number, requisitoId: number }[]>([])
  const [planejamentoReuniao, setPlanejamentoReuniao] = useState<string | undefined>()
  const [planejamentoRequisito, setPlanejamentoRequisito] = useState<string | undefined>()

  const unidadeAtual = unidadesMock.find((u) => u.id === unidadeSelecionada)
  const membrosDaUnidade = membrosMock.filter((m) => m.id_unidade === unidadeSelecionada)

  const codigosClasse = [unidadeAtual?.codigo_classe_regular, unidadeAtual?.codigo_classe_avancada].filter(Boolean)
  const requisitosDaUnidade = requisitosClassesMock.filter(req => codigosClasse.includes(req.codigo_classe))

  const handleAdicionarRequisitoPendente = () => {
    if (!requisitoPendente) {
      alert("Por favor, selecione um requisito.");
      return;
    }
    const requisitoId = parseInt(requisitoPendente);
    let novasAvaliacoes = [...avaliacaoClasses];
    membrosDaUnidade.forEach(membro => {
      if (!novasAvaliacoes.some(a => a.codigo_sgc === membro.codigo_sgc && a.id_requisito === requisitoId)) {
        novasAvaliacoes.push({ id: Date.now() + Math.random(), id_requisito: requisitoId, codigo_sgc: membro.codigo_sgc, status: "Pendente" });
      }
    });
    setAvaliacaoClasses(novasAvaliacoes);
    alert("Requisito adicionado como pendente para todos os membros da unidade!");
  };

  const handleSavePlanejamento = () => {
    if (!planejamentoReuniao || !planejamentoRequisito) {
      alert("Por favor, selecione a reunião e o requisito.");
      return;
    }
    const novoPlanejamento = {
      id: Date.now(),
      reuniaoId: parseInt(planejamentoReuniao),
      requisitoId: parseInt(planejamentoRequisito)
    };
    setPlanejamentos([...planejamentos, novoPlanejamento]);
    alert("Planejamento salvo com sucesso!");
  };

  const handleRemovePlanejamento = (id: number) => {
    setPlanejamentos(planejamentos.filter(p => p.id !== id));
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Unidade</h1>
            <p className="text-muted-foreground">Gerencie sua unidade e acompanhe o progresso</p>
          </div>
          <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {unidadesMock.map((unidade) => (<SelectItem key={unidade.id} value={unidade.id}>{unidade.nome}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pontuação</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{unidadeAtual?.pontuacao}</div><Progress value={unidadeAtual?.pontuacao} className="mt-2" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Membros</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{membrosDaUnidade.length}</div><p className="text-xs text-muted-foreground">Ativos na unidade</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Especialidades</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{especialidadesMock.length}</div><p className="text-xs text-muted-foreground">Em andamento</p></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progresso-classe" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pontuacao">Pontuação</TabsTrigger>
            <TabsTrigger value="membros">Membros</TabsTrigger>
            <TabsTrigger value="progresso-classe">Progresso de Classe</TabsTrigger>
            <TabsTrigger value="progresso-especialidade">Especialidades</TabsTrigger>
            <TabsTrigger value="atos">Atos</TabsTrigger>
            <TabsTrigger value="planejamento">Planejamento</TabsTrigger>
          </TabsList>

          <TabsContent value="pontuacao" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Pontuação Detalhada da Unidade: {unidadeAtual?.nome}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left">Membro</th>
                      <th className="px-6 py-3 text-center">Presença</th>
                      <th className="px-6 py-3 text-center">Pontualidade</th>
                      <th className="px-6 py-3 text-center">Uniforme</th>
                      <th className="px-6 py-3 text-center">Modéstia</th>
                      <th className="px-6 py-3 text-center">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {membrosDaUnidade.map(membro => {
                      const pontuacao = pontuacoesDetalhadasMock.find(p => p.codigo_sgc === membro.codigo_sgc);
                      const total = pontuacao ? pontuacao.presenca + pontuacao.pontualidade + pontuacao.uniforme + pontuacao.modestia : 0;
                      return (
                          <tr key={membro.id} className="border-b">
                            <td className="px-6 py-4 font-medium">{membro.nome}</td>
                            <td className="px-6 py-4 text-center">{pontuacao?.presenca || 0}</td>
                            <td className="px-6 py-4 text-center">{pontuacao?.pontualidade || 0}</td>
                            <td className="px-6 py-4 text-center">{pontuacao?.uniforme || 0}</td>
                            <td className="px-6 py-4 text-center">{pontuacao?.modestia || 0}</td>
                            <td className="px-6 py-4 text-center font-bold text-primary">{total}</td>
                          </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membros" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Membros da Unidade</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membrosDaUnidade.map((membro) => (
                    <Card key={membro.id} className="p-4">
                      <p className="font-semibold">{membro.nome}</p>
                      <div className="text-sm text-muted-foreground">
                        <span>{membro.cargo}</span> | <span>SGC: {membro.sgc}</span>
                      </div>
                    </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progresso-classe" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Adicionar Requisito para a Unidade</CardTitle><CardDescription>Selecione um requisito para marcar como "Pendente" para todos os membros da unidade.</CardDescription></CardHeader>
              <CardContent className="flex items-center gap-2">
                <Select onValueChange={setRequisitoPendente}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione um requisito..." /></SelectTrigger>
                  <SelectContent>{requisitosDaUnidade.map(req => (<SelectItem key={req.id} value={req.id.toString()}>{req.texto}</SelectItem>))}</SelectContent>
                </Select>
                <Button onClick={handleAdicionarRequisitoPendente}>Adicionar Pendência</Button>
              </CardContent>
            </Card>
            <div className="space-y-4">
              {membrosDaUnidade.map(membro => {
                const avaliacoesDoMembro = avaliacaoClasses.filter(a => a.codigo_sgc === membro.codigo_sgc);
                const aprovadosCount = requisitosDaUnidade.filter(req => avaliacoesDoMembro.some(a => a.id_requisito === req.id && a.status === 'Aprovado')).length;
                const progresso = requisitosDaUnidade.length > 0 ? (aprovadosCount / requisitosDaUnidade.length) * 100 : 0;
                return (
                    <Card key={membro.id}>
                      <CardHeader><div className="flex justify-between items-center"><CardTitle>{membro.nome}</CardTitle><div className="text-sm text-muted-foreground">{aprovadosCount} de {requisitosDaUnidade.length} requisitos aprovados</div></div><Progress value={progresso} className="mt-2" /></CardHeader>
                      <CardContent className="space-y-2">
                        {requisitosDaUnidade.map(req => {
                          const avaliacao = avaliacoesDoMembro.find(a => a.id_requisito === req.id);
                          const status = avaliacao?.status || 'Não Iniciado';
                          const isRegular = req.codigo_classe === unidadeAtual?.codigo_classe_regular;
                          return (<div key={req.id} className="flex items-center justify-between p-2 border rounded-md"><div><span className={`mr-2 text-xs font-semibold ${isRegular ? 'text-blue-600' : 'text-purple-600'}`}>{isRegular ? 'REGULAR' : 'AVANÇADO'}</span><span>{req.texto}</span></div><Badge variant={status === "Aprovado" ? "default" : status === "Avaliação" ? "secondary" : status === "Refazer" ? "destructive" : "outline"}>{status}</Badge></div>)
                        })}
                      </CardContent>
                    </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="progresso-especialidade" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progresso de Especialidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Especialidades em Andamento</h4>
                  {especialidadesMock.map((esp) => (
                      <div key={esp.id} className="border rounded p-4 mb-2">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">{esp.nome}</h5>
                          <Badge variant={esp.status === "aprovado" ? "default" : "secondary"}>
                            {esp.status === "aprovado" ? "Aprovado" : "Em Avaliação"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          <p className="font-semibold">Membros:</p>
                          <ul className="list-disc pl-5">
                            {esp.membros.map((membro, index) => <li key={index}>{membro}</li>)}
                          </ul>
                        </div>
                      </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Registrar Nova Especialidade</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Membros</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Selecione os membros" /></SelectTrigger>
                        <SelectContent>
                          {membrosDaUnidade.map((membro) => (
                              <SelectItem key={membro.id} value={membro.id.toString()}>{membro.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Especialidade</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Selecione a especialidade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internet">Internet</SelectItem>
                          <SelectItem value="primeiros-socorros">Primeiros Socorros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="mt-4">Registrar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="atos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Atos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo-ato">Título do Ato</Label>
                  <Input id="titulo-ato" placeholder="Digite o título do ato" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao-ato">Descrição</Label>
                  <Textarea id="descricao-ato" placeholder="Descrição do ato" rows={4} />
                </div>
                <Button>Salvar ato</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planejamento" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen/> Planejamento de Reunião</CardTitle><CardDescription>Vincule um requisito de classe a uma reunião específica.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Reunião</Label><Select onValueChange={setPlanejamentoReuniao}><SelectTrigger><SelectValue placeholder="Selecione a reunião" /></SelectTrigger><SelectContent>{reunioesMock.map((reuniao) => (<SelectItem key={reuniao.id} value={reuniao.id.toString()}>{reuniao.nome} ({reuniao.data})</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Requisito de Classe</Label><Select onValueChange={setPlanejamentoRequisito}><SelectTrigger><SelectValue placeholder="Selecione o requisito" /></SelectTrigger><SelectContent>{requisitosClassesMock.map((req) => (<SelectItem key={req.id} value={req.id.toString()}>{req.texto}</SelectItem>))}</SelectContent></Select></div>
                </div>
                <Button onClick={handleSavePlanejamento}>Salvar Planejamento</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Planejamentos Salvos</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {planejamentos.length === 0 ? (<p className="text-sm text-muted-foreground">Nenhum planejamento salvo para esta unidade.</p>) :
                    (planejamentos.map(p => {
                      const reuniao = reunioesMock.find(r => r.id === p.reuniaoId);
                      const requisito = requisitosClassesMock.find(r => r.id === p.requisitoId);
                      return (
                          <div key={p.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-semibold">{reuniao?.nome} - {reuniao?.data}</p>
                              <p className="text-sm text-muted-foreground">{requisito?.texto}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemovePlanejamento(p.id)}><Trash2 className="h-4 w-4"/></Button>
                          </div>
                      )
                    }))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}