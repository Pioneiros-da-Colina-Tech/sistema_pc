"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Edit, Trash2, Save, Loader2 } from "lucide-react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import type { Reuniao } from "../page"

interface EditarReuniaoTabProps {
  reunioes: Reuniao[]
  setReunioes: React.Dispatch<React.SetStateAction<Reuniao[]>>
}

export default function EditarReuniaoTab({ reunioes, setReunioes }: EditarReuniaoTabProps) {
  const [editandoReuniao, setEditandoReuniao] = useState<Reuniao | null>(null)
  const [selectedReuniaoId, setSelectedReuniaoId] = useState<string>("")
  const [salvando, setSalvando] = useState(false)

  const reuniaoOptions: ComboboxOption[] = useMemo(() =>
    reunioes.map((r) => ({
      value: r.id,
      label: r.nome,
      description: r.data,
    })),
    [reunioes]
  )

  const handleSelectReuniao = (value: string) => {
    setSelectedReuniaoId(value)
    const reuniao = reunioes.find((r) => r.id === value)
    setEditandoReuniao(reuniao ? { ...reuniao } : null)
  }

  const removerReuniao = (id: string) => {
    setReunioes(reunioes.filter((r) => r.id !== id))
    setEditandoReuniao(null)
    setSelectedReuniaoId("")
  }

  const salvarEdicao = async () => {
    if (!editandoReuniao) return
    setSalvando(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setReunioes(reunioes.map((r) => (r.id === editandoReuniao.id ? editandoReuniao : r)))
    setEditandoReuniao(null)
    setSelectedReuniaoId("")
    setSalvando(false)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Edit className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Editar Reuniao</CardTitle>
            <CardDescription>Selecione uma reuniao para editar ou remover</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selecione a reuniao</Label>
          <Combobox
            options={reuniaoOptions}
            value={selectedReuniaoId}
            onValueChange={handleSelectReuniao}
            placeholder="Buscar reuniao..."
            searchPlaceholder="Digite para buscar..."
            emptyMessage="Nenhuma reuniao encontrada."
          />
        </div>

        {editandoReuniao && (
          <div className="space-y-6 pt-4 border-t">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nome da Reuniao</Label>
                <Input
                  value={editandoReuniao.nome}
                  onChange={(e) => setEditandoReuniao({ ...editandoReuniao, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data</Label>
                <Input
                  type="date"
                  value={editandoReuniao.data}
                  onChange={(e) => setEditandoReuniao({ ...editandoReuniao, data: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button onClick={salvarEdicao} disabled={salvando}>
                {salvando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alteracoes
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={() => removerReuniao(editandoReuniao.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Reuniao
              </Button>
            </div>
          </div>
        )}

        {reunioes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma reuniao cadastrada ainda.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
