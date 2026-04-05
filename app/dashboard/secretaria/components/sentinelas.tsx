"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Shield, Award, UserPlus, Save, Loader2 } from "lucide-react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"

// Mock data - would come from API
const membrosMock = [
  { id: 1, nome: "Joao Silva", unidade: "Jaguar" },
  { id: 2, nome: "Maria Santos", unidade: "Gato do Mato" },
  { id: 3, nome: "Pedro Costa", unidade: "Jaguar" },
  { id: 4, nome: "Ana Pereira", unidade: "Gato do Mato" },
  { id: 5, nome: "Lucas Oliveira", unidade: "Jaguar" },
  { id: 6, nome: "Julia Souza", unidade: "Gato do Mato" },
]

const classesMock = [
  { id: 1, nome: "Amigo" },
  { id: 2, nome: "Companheiro" },
  { id: 3, nome: "Pesquisador" },
  { id: 4, nome: "Pioneiro" },
  { id: 5, nome: "Excursionista" },
  { id: 6, nome: "Guia" },
]

const especialidadesMock = [
  { id: 1, nome: "Internet", area: "Tecnologia" },
  { id: 2, nome: "Primeiros Socorros", area: "Saude" },
  { id: 3, nome: "Acampamento", area: "Atividades ao Ar Livre" },
  { id: 4, nome: "Culinaria", area: "Artes Domesticas" },
]

export default function SentinelasTab() {
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string>("")
  const [selectedClasse, setSelectedClasse] = useState<string>("")
  const [sentinelasEspecialidade, setSentinelasEspecialidade] = useState<number[]>([])
  const [sentinelasClasse, setSentinelasClasse] = useState<number[]>([])
  const [selectedMembroEsp, setSelectedMembroEsp] = useState<string>("")
  const [selectedMembroCls, setSelectedMembroCls] = useState<string>("")
  const [salvandoEsp, setSalvandoEsp] = useState(false)
  const [salvandoCls, setSalvandoCls] = useState(false)

  // Convert mocks to Combobox options
  const especialidadeOptions: ComboboxOption[] = especialidadesMock.map((esp) => ({
    value: esp.id.toString(),
    label: esp.nome,
    description: esp.area,
  }))

  const classeOptions: ComboboxOption[] = classesMock.map((c) => ({
    value: c.id.toString(),
    label: c.nome,
  }))

  const membrosDisponiveisEspecialidade = useMemo(() => {
    return membrosMock
      .filter((m) => !sentinelasEspecialidade.includes(m.id))
      .map((m) => ({
        value: m.id.toString(),
        label: m.nome,
        description: m.unidade,
      }))
  }, [sentinelasEspecialidade])

  const membrosDisponiveisClasse = useMemo(() => {
    return membrosMock
      .filter((m) => !sentinelasClasse.includes(m.id))
      .map((m) => ({
        value: m.id.toString(),
        label: m.nome,
        description: m.unidade,
      }))
  }, [sentinelasClasse])

  const handleAddSentinela = (type: "classe" | "especialidade") => {
    if (type === "classe" && selectedMembroCls) {
      const memberId = parseInt(selectedMembroCls)
      if (!sentinelasClasse.includes(memberId)) {
        setSentinelasClasse((prev) => [...prev, memberId])
      }
      setSelectedMembroCls("")
    } else if (type === "especialidade" && selectedMembroEsp) {
      const memberId = parseInt(selectedMembroEsp)
      if (!sentinelasEspecialidade.includes(memberId)) {
        setSentinelasEspecialidade((prev) => [...prev, memberId])
      }
      setSelectedMembroEsp("")
    }
  }

  const handleRemoveSentinela = (type: "classe" | "especialidade", memberId: number) => {
    if (type === "classe") {
      setSentinelasClasse((prev) => prev.filter((id) => id !== memberId))
    } else {
      setSentinelasEspecialidade((prev) => prev.filter((id) => id !== memberId))
    }
  }

  const handleSave = async (type: "classe" | "especialidade") => {
    if (type === "classe") {
      setSalvandoCls(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSalvandoCls(false)
    } else {
      setSalvandoEsp(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSalvandoEsp(false)
    }
  }

  const selectedEspName = especialidadesMock.find((e) => e.id.toString() === selectedEspecialidade)?.nome
  const selectedClsName = classesMock.find((c) => c.id.toString() === selectedClasse)?.nome

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sentinelas de Especialidade */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Sentinelas de Especialidade</CardTitle>
              <CardDescription>Defina os instrutores para cada especialidade</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Especialidade</Label>
            <Combobox
              options={especialidadeOptions}
              value={selectedEspecialidade}
              onValueChange={setSelectedEspecialidade}
              placeholder="Buscar especialidade..."
              searchPlaceholder="Digite para buscar..."
              emptyMessage="Nenhuma especialidade encontrada."
            />
          </div>

          {selectedEspecialidade && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Adicionar Sentinela</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Combobox
                      options={membrosDisponiveisEspecialidade}
                      value={selectedMembroEsp}
                      onValueChange={setSelectedMembroEsp}
                      placeholder="Buscar membro..."
                      searchPlaceholder="Digite o nome do membro..."
                      emptyMessage="Nenhum membro disponivel."
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddSentinela("especialidade")}
                    disabled={!selectedMembroEsp}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Sentinelas de {selectedEspName}
                </Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg bg-muted/50">
                  {sentinelasEspecialidade.length === 0 ? (
                    <span className="text-sm text-muted-foreground">Nenhum sentinela adicionado</span>
                  ) : (
                    sentinelasEspecialidade.map((id) => {
                      const membro = membrosMock.find((m) => m.id === id)
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                        >
                          {membro?.nome}
                          <button
                            onClick={() => handleRemoveSentinela("especialidade", id)}
                            className="ml-1 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleSave("especialidade")}
                disabled={salvandoEsp}
              >
                {salvandoEsp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Sentinelas
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentinelas de Classe */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Sentinelas de Classe</CardTitle>
              <CardDescription>Defina os instrutores para cada classe</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Classe</Label>
            <Combobox
              options={classeOptions}
              value={selectedClasse}
              onValueChange={setSelectedClasse}
              placeholder="Buscar classe..."
              searchPlaceholder="Digite para buscar..."
              emptyMessage="Nenhuma classe encontrada."
            />
          </div>

          {selectedClasse && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Adicionar Sentinela</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Combobox
                      options={membrosDisponiveisClasse}
                      value={selectedMembroCls}
                      onValueChange={setSelectedMembroCls}
                      placeholder="Buscar membro..."
                      searchPlaceholder="Digite o nome do membro..."
                      emptyMessage="Nenhum membro disponivel."
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddSentinela("classe")}
                    disabled={!selectedMembroCls}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Sentinelas de {selectedClsName}
                </Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg bg-muted/50">
                  {sentinelasClasse.length === 0 ? (
                    <span className="text-sm text-muted-foreground">Nenhum sentinela adicionado</span>
                  ) : (
                    sentinelasClasse.map((id) => {
                      const membro = membrosMock.find((m) => m.id === id)
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                        >
                          {membro?.nome}
                          <button
                            onClick={() => handleRemoveSentinela("classe", id)}
                            className="ml-1 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleSave("classe")}
                disabled={salvandoCls}
              >
                {salvandoCls ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Sentinelas
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
