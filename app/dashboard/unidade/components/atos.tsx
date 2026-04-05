"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, FileText } from "lucide-react"

interface Ato {
    id: string
    titulo: string
    descricao: string
    data: string
}

export default function AtosTab() {
    const [atos, setAtos] = useState<Ato[]>([])
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [erro, setErro] = useState("")

    const handleSalvar = () => {
        if (!titulo.trim()) {
            setErro("O título é obrigatório.")
            return
        }
        setErro("")
        const novoAto: Ato = {
            id: crypto.randomUUID(),
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            data: new Date().toLocaleDateString("pt-BR"),
        }
        setAtos((prev) => [novoAto, ...prev])
        setTitulo("")
        setDescricao("")
    }

    const handleRemover = (id: string) => {
        setAtos((prev) => prev.filter((a) => a.id !== id))
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Registrar Ato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="titulo-ato">Título</Label>
                        <Input
                            id="titulo-ato"
                            placeholder="Ex: Ata da reunião de 05/04/2026"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descricao-ato">Descrição</Label>
                        <Textarea
                            id="descricao-ato"
                            placeholder="Descreva o ato, deliberações, observações..."
                            rows={5}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                    {erro && <p className="text-sm text-red-600">{erro}</p>}
                    <Button onClick={handleSalvar}>Salvar Ato</Button>
                </CardContent>
            </Card>

            {atos.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" /> Atos Registrados
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {atos.map((ato) => (
                            <div key={ato.id} className="flex items-start justify-between p-4 border rounded-md gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold">{ato.titulo}</p>
                                        <Badge variant="outline" className="text-xs">{ato.data}</Badge>
                                    </div>
                                    {ato.descricao && (
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ato.descricao}</p>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleRemover(ato.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
