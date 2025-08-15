"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2 } from "lucide-react"

interface Reuniao {
    id: number;
    nome: string;
    data: string;
}

interface EditarReuniaoTabProps {
    reunioes: Reuniao[];
    setReunioes: React.Dispatch<React.SetStateAction<Reuniao[]>>;
}

export default function EditarReuniaoTab({ reunioes, setReunioes }: EditarReuniaoTabProps) {
    const [editandoReuniao, setEditandoReuniao] = useState<Reuniao | null>(null)

    const removerReuniao = (id: number) => {
        setReunioes(reunioes.filter((r) => r.id !== id))
        setEditandoReuniao(null)
    }

    const salvarEdicao = () => {
        if(editandoReuniao){
            setReunioes(reunioes.map(r => r.id === editandoReuniao.id ? editandoReuniao : r));
            setEditandoReuniao(null);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Editar Reunião
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Selecione a reunião</Label>
                    <Select
                        onValueChange={(value) => setEditandoReuniao(reunioes.find((r) => r.id === Number.parseInt(value)) || null)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha uma reunião" />
                        </SelectTrigger>
                        <SelectContent>
                            {reunioes.map((reuniao) => (
                                <SelectItem key={reuniao.id} value={reuniao.id.toString()}>
                                    {reuniao.nome} - {reuniao.data}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {editandoReuniao && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Novo nome</Label>
                            <Input
                                value={editandoReuniao.nome}
                                onChange={(e) => setEditandoReuniao({ ...editandoReuniao, nome: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Nova data</Label>
                            <Input
                                type="date"
                                value={editandoReuniao.data}
                                onChange={(e) => setEditandoReuniao({ ...editandoReuniao, data: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button onClick={salvarEdicao} disabled={!editandoReuniao}>Salvar edição</Button>
                    <Button variant="destructive" onClick={() => editandoReuniao && removerReuniao(editandoReuniao.id)} disabled={!editandoReuniao}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover reunião
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}