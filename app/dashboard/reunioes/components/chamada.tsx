"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MinusCircle, PlusCircle, ClipboardList, Save, Loader2, Users, CheckCircle2 } from "lucide-react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { unitsApi, scoresApi, type UnitAPI, type UnitMemberAPI } from "@/lib/api"
import type { Reuniao } from "../page"

interface ChamadaTabProps {
  reunioes: Reuniao[]
}

interface Pontuacao {
  presenca: number
  pontualidade: number
  uniforme: number
  modestia: number
}

type ChamadaMap = Record<string, Pontuacao>

const SCORE_STEP = 5
const clamp = (v: number) => Math.min(10, Math.max(0, v))

export default function ChamadaTab({ reunioes }: ChamadaTabProps) {
  const [unidades, setUnidades] = useState<UnitAPI[]>([])
  const [membros, setMembros] = useState<UnitMemberAPI[]>([])
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("")
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<string>("")
  const [chamada, setChamada] = useState<ChamadaMap>({})
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
    unitsApi.list().then((res) => setUnidades(res.data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (!unidadeSelecionada) return
    setMembros([])
    setChamada({})
    unitsApi
      .getMembers(unidadeSelecionada)
      .then((res) => setMembros(res.data))
      .catch(console.error)
  }, [unidadeSelecionada])

  const unidadeOptions: ComboboxOption[] = useMemo(() =>
    unidades.map((u) => ({ value: u.id_, label: u.name })),
    [unidades]
  )

  const reuniaoOptions: ComboboxOption[] = useMemo(() =>
    reunioes.map((r) => ({
      value: r.id,
      label: r.nome,
      description: r.data,
    })),
    [reunioes]
  )

  const handlePresente = (userId: string, isPresent: boolean) => {
    setChamada((prev) => {
      const next = { ...prev }
      if (isPresent) {
        next[userId] = { presenca: 10, pontualidade: 10, uniforme: 10, modestia: 10 }
      } else {
        delete next[userId]
      }
      return next
    })
  }

  const handleJustificado = (userId: string, isJustified: boolean) => {
    setChamada((prev) => {
      const next = { ...prev }
      if (isJustified) {
        next[userId] = { presenca: 5, pontualidade: 10, uniforme: 10, modestia: 10 }
      } else {
        delete next[userId]
      }
      return next
    })
  }

  const adjustScore = (
    userId: string,
    field: "pontualidade" | "uniforme" | "modestia",
    delta: number
  ) => {
    setChamada((prev) => {
      if (!prev[userId]) return prev
      return {
        ...prev,
        [userId]: { ...prev[userId], [field]: clamp(prev[userId][field] + delta) },
      }
    })
  }

  const salvarChamada = async () => {
    if (!reuniaoSelecionada || membros.length === 0) return
    setErro("")
    setSucesso("")
    setSalvando(true)
    try {
      const scores = membros.map((m) => {
        const p = chamada[m.user_id]
        return {
          user_id: m.user_id,
          presenca: p ? p.presenca : 0,
          pontualidade: p ? p.pontualidade : 0,
          uniforme: p ? p.uniforme : 0,
          modestia: p ? p.modestia : 0,
        }
      })
      await scoresApi.submitMeetingScores(reuniaoSelecionada, scores)
      setSucesso("Chamada salva com sucesso!")
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar chamada.")
    } finally {
      setSalvando(false)
    }
  }

  const statusOf = (userId: string): "presente" | "justificado" | "ausente" => {
    const p = chamada[userId]
    if (!p) return "ausente"
    return p.presenca >= 10 ? "presente" : "justificado"
  }

  const badgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
    presente: "default",
    justificado: "secondary",
    ausente: "destructive",
  }

  const presentes = Object.values(chamada).filter(p => p.presenca >= 10).length
  const justificados = Object.values(chamada).filter(p => p.presenca > 0 && p.presenca < 10).length
  const ausentes = membros.length - presentes - justificados

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Chamada</CardTitle>
            <CardDescription>Registre a presenca dos membros na reuniao</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Unidade</Label>
            <Combobox
              options={unidadeOptions}
              value={unidadeSelecionada}
              onValueChange={setUnidadeSelecionada}
              placeholder="Buscar unidade..."
              searchPlaceholder="Digite para buscar..."
              emptyMessage="Nenhuma unidade encontrada."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Reuniao</Label>
            <Combobox
              options={reuniaoOptions}
              value={reuniaoSelecionada}
              onValueChange={setReuniaoSelecionada}
              placeholder="Buscar reuniao..."
              searchPlaceholder="Digite para buscar..."
              emptyMessage="Nenhuma reuniao encontrada."
            />
          </div>
        </div>

        {unidadeSelecionada && reuniaoSelecionada && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4 bg-success/5 border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-lg font-bold">{presentes}</p>
                    <p className="text-xs text-muted-foreground">Presentes</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-warning/5 border-warning/20">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-lg font-bold">{justificados}</p>
                    <p className="text-xs text-muted-foreground">Justificados</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-destructive/5 border-destructive/20">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-lg font-bold">{ausentes}</p>
                    <p className="text-xs text-muted-foreground">Ausentes</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Lista de Presenca ({membros.length} membros)
              </h3>

              {membros.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhum membro nesta unidade.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {membros.map((membro) => {
                    const status = statusOf(membro.user_id)
                    const p = chamada[membro.user_id]
                    const isPresente = status === "presente"
                    const isJustificado = status === "justificado"

                    return (
                      <Card key={membro.user_id} className="p-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <p className="font-medium">{membro.user_name ?? membro.user_document}</p>
                            <p className="text-sm text-muted-foreground capitalize">{membro.role}</p>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <Badge variant={badgeVariant[status]}>
                              {status === "presente" ? "Presente" : status === "justificado" ? "Justificado" : "Ausente"}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`presente-${membro.user_id}`}
                                checked={isPresente}
                                onCheckedChange={(v) => handlePresente(membro.user_id, !!v)}
                              />
                              <Label htmlFor={`presente-${membro.user_id}`} className="text-sm cursor-pointer">
                                Presente
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`justi-${membro.user_id}`}
                                checked={isJustificado}
                                onCheckedChange={(v) => handleJustificado(membro.user_id, !!v)}
                              />
                              <Label htmlFor={`justi-${membro.user_id}`} className="text-sm cursor-pointer">
                                Justificado
                              </Label>
                            </div>
                          </div>
                        </div>

                        {p && p.presenca > 0 && (
                          <div className="flex flex-wrap gap-6 pt-4 mt-4 border-t">
                            {(["pontualidade", "uniforme", "modestia"] as const).map((field) => (
                              <div key={field} className="flex items-center gap-2">
                                <Label className="capitalize text-sm text-muted-foreground w-24">{field}:</Label>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => adjustScore(membro.user_id, field, -SCORE_STEP)}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <Badge variant="outline" className="min-w-[40px] justify-center">
                                  {p[field]}
                                </Badge>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => adjustScore(membro.user_id, field, SCORE_STEP)}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Feedback messages */}
            {erro && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{erro}</p>
              </div>
            )}
            {sucesso && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-success font-medium">{sucesso}</p>
              </div>
            )}

            <Button
              onClick={salvarChamada}
              disabled={salvando || membros.length === 0}
              className="w-full sm:w-auto"
            >
              {salvando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Chamada
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
