"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Users, Plus, Trash2, Search, Filter, ArrowLeft, FileCheck2, FileX2, 
  Check, X, Download, Eye, AlertCircle, UserCheck, Upload, Loader2,
  MoreHorizontal, Pencil
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { usersApi, authApi, unitsApi, type UserAPI, type UnitAPI } from "@/lib/api"

// --- Local enrichment types (fields not yet in the backend) ---

type DocumentoStatus = "aprovado" | "aguardando-avaliacao" | "reprovado"
type Documentos = { [key: string]: { status: DocumentoStatus; url?: string; motivoReprovacao?: string } }

type MembroEnriquecido = UserAPI & {
  cargo: string
  documentos: Documentos
  rematricula_preenchida: boolean
}

const todosDocumentos = ["RG", "CPF", "Comprovante de Residencia", "Cartao do Sus", "Carteirinha do convenio"]

function enrich(user: UserAPI): MembroEnriquecido {
  return {
    ...user,
    cargo: "Desbravador",
    documentos: {},
    rematricula_preenchida: false,
  }
}

// --- Form ---

function cargoToUnitRole(cargo: string): string {
  if (cargo === "Desbravador") return "membro"
  return "lider"
}

function MembroForm({
  membro,
  onSave,
  onBack,
}: {
  membro?: MembroEnriquecido | null
  onSave: (data: Partial<MembroEnriquecido>) => void
  onBack: () => void
}) {
  const [formData, setFormData] = useState<Partial<MembroEnriquecido>>(
    membro || { name: "", document: "", birth_date: "", codigo_sgc: "", unit_name: "", cargo: "Desbravador", documentos: {} }
  )
  const [units, setUnits] = useState<UnitAPI[]>([])
  const [selectedUnitId, setSelectedUnitId] = useState<string>(membro?.unit_id ?? "")
  const [reprovingDoc, setReprovingDoc] = useState<string | null>(null)
  const [reprovalReason, setReprovalReason] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const isNew = !membro

  useEffect(() => {
    unitsApi.list().then((res) => setUnits(res.data)).catch(console.error)
  }, [])

  const unitOptions: ComboboxOption[] = useMemo(() => 
    units.map((u) => ({ value: u.id_, label: u.name })),
    [units]
  )

  const handleSave = async () => {
    if (!formData.document || !formData.birth_date || !formData.name) {
      setErro("Nome, CPF e data de nascimento sao obrigatorios.")
      return
    }
    setErro("")
    setSalvando(true)
    try {
      if (isNew) {
        await authApi.register(formData.document, formData.birth_date, formData.name)
      } else {
        await usersApi.update(membro!.id_, { name: formData.name ?? membro!.name ?? "", codigo_sgc: formData.codigo_sgc ?? null })
        if (selectedUnitId && selectedUnitId !== membro!.unit_id) {
          const clubYear = new Date().getFullYear().toString()
          await unitsApi.addMember(selectedUnitId, membro!.id_, clubYear, cargoToUnitRole(formData.cargo ?? "Desbravador"))
        }
      }
      onSave({ ...formData, unit_id: selectedUnitId || undefined, unit_name: units.find((u) => u.id_ === selectedUnitId)?.name })
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar membro.")
    } finally {
      setSalvando(false)
    }
  }

  const handleDocStatusChange = (docName: string, status: DocumentoStatus, reason?: string) => {
    setFormData((prev) => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        [docName]: { ...prev.documentos?.[docName], status, motivoReprovacao: reason || undefined },
      },
    }))
    setReprovingDoc(null)
    setReprovalReason("")
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>{isNew ? "Novo Membro" : "Editar Membro"}</CardTitle>
            <CardDescription>
              {isNew ? "Preencha os dados para criar um novo membro." : `Editando dados de ${membro?.name ?? membro?.document}.`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nome</Label>
            <Input
              value={formData.name ?? ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">CPF</Label>
            <Input
              value={formData.document ?? ""}
              onChange={(e) => setFormData({ ...formData, document: e.target.value })}
              disabled={!isNew}
              placeholder="00000000000"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">SGC</Label>
            <Input 
              value={formData.codigo_sgc ?? ""} 
              onChange={(e) => setFormData({ ...formData, codigo_sgc: e.target.value })} 
              placeholder="Codigo SGC"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data de Nascimento</Label>
            <Input
              type="date"
              value={formData.birth_date ?? ""}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              disabled={!isNew}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Unidade</Label>
            <Combobox
              options={unitOptions}
              value={selectedUnitId}
              onValueChange={setSelectedUnitId}
              placeholder="Selecionar unidade..."
              searchPlaceholder="Buscar unidade..."
              emptyMessage="Nenhuma unidade encontrada."
              disabled={isNew}
            />
            {isNew && <p className="text-xs text-muted-foreground">Vincule a unidade apos criar o membro.</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cargo</Label>
            <Select value={formData.cargo} onValueChange={(value) => setFormData({ ...formData, cargo: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Desbravador">Desbravador</SelectItem>
                <SelectItem value="Conselheiro">Conselheiro</SelectItem>
                <SelectItem value="Diretoria">Diretoria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-4">Documentos</h4>
          <div className="space-y-3 mb-4">
            {todosDocumentos.map((doc) => {
              const docInfo = formData.documentos?.[doc]
              const status = docInfo?.status
              return (
                <div key={doc} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{doc}</p>
                      {status && (
                        <Badge variant={status === "aprovado" ? "default" : status === "reprovado" ? "destructive" : "secondary"}>
                          {status.replace("-", " ")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {status === "aguardando-avaliacao" && (
                        <>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />Ver
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600 hover:bg-green-50" 
                            onClick={() => handleDocStatusChange(doc, "aprovado")}
                          >
                            <Check className="h-4 w-4 mr-2" />Aprovar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive/10" 
                            onClick={() => setReprovingDoc(doc)}
                          >
                            <X className="h-4 w-4 mr-2" />Reprovar
                          </Button>
                        </>
                      )}
                      {status === "aprovado" && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />Baixar
                        </Button>
                      )}
                    </div>
                  </div>
                  {docInfo?.motivoReprovacao && (
                    <p className="text-sm text-destructive mt-2">Motivo: {docInfo.motivoReprovacao}</p>
                  )}
                  {reprovingDoc === doc && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <Label className="text-sm font-medium">Motivo da Reprovacao</Label>
                      <Input 
                        value={reprovalReason} 
                        onChange={(e) => setReprovalReason(e.target.value)} 
                        placeholder="Descreva o motivo..." 
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleDocStatusChange(doc, "reprovado", reprovalReason)}>
                          Confirmar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setReprovingDoc(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="font-medium">Upload de documento</p>
              <p className="text-sm text-muted-foreground">Arraste ou clique para selecionar.</p>
            </div>
            <Select>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                {todosDocumentos.map((doc) => (
                  <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="file" className="hidden" id="file-upload" />
            <Button asChild>
              <Label htmlFor="file-upload" className="cursor-pointer">Selecionar</Label>
            </Button>
          </div>
        </div>

        {erro && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">{erro}</p>
          </div>
        )}
        
        <div className="flex justify-start gap-2 pt-6 border-t">
          <Button onClick={handleSave} disabled={salvando}>
            {salvando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Membro"
            )}
          </Button>
          <Button variant="outline" onClick={onBack}>Cancelar</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentosFaltantesView({
  membros,
  onBack,
  onEdit,
}: {
  membros: MembroEnriquecido[]
  onBack: () => void
  onEdit: (m: MembroEnriquecido) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Membros com Documentos Pendentes</CardTitle>
            <CardDescription>Lista de documentos faltantes, reprovados ou aguardando avaliacao.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {membros
          .filter((m) => !todosDocumentos.every((doc) => m.documentos[doc]?.status === "aprovado"))
          .map((membro) => {
            const docsNaoAprovados = todosDocumentos.filter((doc) => membro.documentos[doc]?.status !== "aprovado")
            return (
              <Card key={membro.id_} className="p-4 bg-warning/5 border-warning/20">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{membro.name ?? membro.document}</h4>
                  <Button size="sm" variant="outline" onClick={() => onEdit(membro)}>
                    Ver / Avaliar
                  </Button>
                </div>
                <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                  {docsNaoAprovados.map((doc) => {
                    const status = membro.documentos[doc]?.status
                    return (
                      <li key={doc}>
                        {doc}{" "}
                        <Badge variant="outline" className="ml-2">
                          {status ? status.replace("-", " ") : "Faltante"}
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            )
          })}
      </CardContent>
    </Card>
  )
}

function RematriculasView({
  membros,
  onBack,
  onEdit,
}: {
  membros: MembroEnriquecido[]
  onBack: () => void
  onEdit: (m: MembroEnriquecido) => void
}) {
  const [membrosAtivos, setMembrosAtivos] = useState<string[]>(membros.map((m) => m.id_))

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Rematriculas</CardTitle>
            <CardDescription>Ative os membros para o ano atual apos revisar as informacoes.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {membros.map((membro) => (
          <Card key={membro.id_} className="p-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h4 className="font-semibold">{membro.name ?? membro.document}</h4>
              <div className="flex items-center gap-4">
                <Button size="sm" variant="outline" onClick={() => onEdit(membro)}>
                  Revisar Dados
                </Button>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`ativo-${membro.id_}`}
                    checked={membrosAtivos.includes(membro.id_)}
                    onCheckedChange={(checked) =>
                      setMembrosAtivos((prev) =>
                        checked ? [...prev, membro.id_] : prev.filter((id) => id !== membro.id_)
                      )
                    }
                  />
                  <Label htmlFor={`ativo-${membro.id_}`} className="text-sm">Ativo para o ano</Label>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default function MembrosTab() {
  const [membros, setMembros] = useState<MembroEnriquecido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregar, setErroCarregar] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroUnidade, setFiltroUnidade] = useState("todas")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [viewMode, setViewMode] = useState<"list" | "edit" | "new" | "missingDocs" | "rematriculas">("list")
  const [membroSelecionado, setMembroSelecionado] = useState<MembroEnriquecido | null>(null)

  useEffect(() => {
    usersApi
      .list()
      .then((res) => setMembros(res.data.items.map(enrich)))
      .catch((err) => setErroCarregar(err instanceof Error ? err.message : "Erro ao carregar membros."))
      .finally(() => setCarregando(false))
  }, [])

  const handleEditClick = (membro: MembroEnriquecido) => { setMembroSelecionado(membro); setViewMode("edit") }
  const handleNewClick = () => { setMembroSelecionado(null); setViewMode("new") }
  const handleBack = () => { setViewMode("list"); setMembroSelecionado(null) }

  const handleSaveMembro = (data: Partial<MembroEnriquecido>) => {
    if (data.id_) {
      setMembros((prev) => prev.map((m) => (m.id_ === data.id_ ? { ...m, ...data } as MembroEnriquecido : m)))
    } else {
      usersApi.list().then((res) => setMembros(res.data.items.map(enrich))).catch(console.error)
    }
    handleBack()
  }

  const getDocumentStatus = (membro: MembroEnriquecido) => {
    const docsAprovados = todosDocumentos.filter((doc) => membro.documentos[doc]?.status === "aprovado").length
    if (docsAprovados === todosDocumentos.length) return { text: "Completo", icon: <FileCheck2 className="h-4 w-4 text-success" />, color: "text-success" }
    return { text: "Pendente", icon: <AlertCircle className="h-4 w-4 text-warning" />, color: "text-warning" }
  }

  const membrosFiltrados = membros.filter((membro) => {
    const matchesSearch =
      (membro.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      membro.document.includes(searchTerm) ||
      (membro.codigo_sgc ?? "").includes(searchTerm)
    const matchesUnidade = filtroUnidade === "todas" || membro.unit_name === filtroUnidade
    const matchesTipo = filtroTipo === "todos" || membro.cargo === filtroTipo
    return matchesSearch && matchesUnidade && matchesTipo
  })

  const docsCompletos = membros.filter((m) => todosDocumentos.every((doc) => m.documentos[doc]?.status === "aprovado")).length
  const docsFaltantes = membros.length - docsCompletos
  const rematriculasFeitas = membros.filter((m) => m.rematricula_preenchida).length

  // Get unique units for filter
  const unidades = [...new Set(membros.map(m => m.unit_name).filter(Boolean))]

  if (viewMode === "missingDocs") return <DocumentosFaltantesView membros={membros} onBack={handleBack} onEdit={handleEditClick} />
  if (viewMode === "rematriculas") return <RematriculasView membros={membros} onBack={handleBack} onEdit={handleEditClick} />
  if (viewMode === "edit" || viewMode === "new") return <MembroForm membro={membroSelecionado} onBack={handleBack} onSave={handleSaveMembro} />

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{membros.length}</p>
              <p className="text-sm text-muted-foreground">Total de Membros</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <FileCheck2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{docsCompletos}</p>
              <p className="text-sm text-muted-foreground">Docs Completos</p>
            </div>
          </div>
        </Card>
        <Card 
          className="p-5 cursor-pointer hover:bg-warning/5 transition-colors" 
          onClick={() => setViewMode("missingDocs")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <FileX2 className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{docsFaltantes}</p>
              <p className="text-sm text-muted-foreground">Docs Pendentes</p>
            </div>
          </div>
        </Card>
        <Card 
          className="p-5 cursor-pointer hover:bg-primary/5 transition-colors" 
          onClick={() => setViewMode("rematriculas")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rematriculasFeitas}</p>
              <p className="text-sm text-muted-foreground">Rematriculas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciar Membros
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleNewClick}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Membro
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {carregando && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando membros...</span>
            </div>
          )}
          
          {erroCarregar && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">{erroCarregar}</p>
            </div>
          )}
          
          {!carregando && !erroCarregar && (
            <>
              {/* Filters */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por nome ou CPF..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
                <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas Unidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas Unidades</SelectItem>
                    {unidades.map((u) => (
                      <SelectItem key={u} value={u!}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos Cargos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Cargos</SelectItem>
                    <SelectItem value="Desbravador">Desbravador</SelectItem>
                    <SelectItem value="Conselheiro">Conselheiro</SelectItem>
                    <SelectItem value="Diretoria">Diretoria</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchTerm(""); setFiltroUnidade("todas"); setFiltroTipo("todos") }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {membrosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum membro encontrado com os filtros selecionados.
                  </div>
                ) : (
                  membrosFiltrados.map((membro) => {
                    const docStatus = getDocumentStatus(membro)
                    return (
                      <Card key={membro.id_} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1.5">
                            <p className="font-semibold">{membro.name ?? membro.document}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                              <span>CPF: {membro.document}</span>
                              <span>Nascimento: {membro.birth_date}</span>
                              {membro.unit_name ? (
                                <Badge variant="outline">{membro.unit_name}</Badge>
                              ) : (
                                <span className="text-xs italic">Sem unidade</span>
                              )}
                              {membro.cargo && <Badge variant="secondary">{membro.cargo}</Badge>}
                              <span className={`flex items-center gap-1.5 font-medium ${docStatus.color}`}>
                                {docStatus.icon} {docStatus.text}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditClick(membro)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
