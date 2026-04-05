"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarPlus, Loader2 } from "lucide-react"
import { meetingsApi } from "@/lib/api"
import type { Reuniao } from "../page"

interface NovaReuniaoTabProps {
  reunioes: Reuniao[]
  setReunioes: React.Dispatch<React.SetStateAction<Reuniao[]>>
}

export default function NovaReuniaoTab({ reunioes, setReunioes }: NovaReuniaoTabProps) {
  const [novaReuniao, setNovaReuniao] = useState({ nome: "", data: "" })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  const adicionarReuniao = async () => {
    if (!novaReuniao.nome || !novaReuniao.data) return
    setErro("")
    setSucesso("")
    setSalvando(true)
    try {
      const res = await meetingsApi.create(novaReuniao.nome, novaReuniao.data)
      setReunioes([
        ...reunioes,
        { id: res.data.id_, nome: res.data.name, data: res.data.date },
      ])
      setNovaReuniao({ nome: "", data: "" })
      setSucesso("Reuniao criada com sucesso!")
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar reuniao.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <CalendarPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Nova Reuniao</CardTitle>
            <CardDescription>Cadastre uma nova reuniao para o clube</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">Nome da Reuniao</Label>
            <Input
              id="nome"
              value={novaReuniao.nome}
              onChange={(e) => setNovaReuniao({ ...novaReuniao, nome: e.target.value })}
              placeholder="Ex: Reuniao Semanal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data" className="text-sm font-medium">Data</Label>
            <Input
              id="data"
              type="date"
              value={novaReuniao.data}
              onChange={(e) => setNovaReuniao({ ...novaReuniao, data: e.target.value })}
            />
          </div>
        </div>
        
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
        
        <Button onClick={adicionarReuniao} disabled={salvando || !novaReuniao.nome || !novaReuniao.data}>
          {salvando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            <>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Cadastrar Reuniao
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
