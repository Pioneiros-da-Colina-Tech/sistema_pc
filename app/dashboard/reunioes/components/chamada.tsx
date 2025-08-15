"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MinusCircle, PlusCircle } from "lucide-react"

interface Reuniao {
    id: number;
    nome: string;
    data: string;
}

interface Membro {
    id: number;
    nome: string;
    unidade: string;
    cargo: string;
}

interface ChamadaTabProps {
    reunioes: Reuniao[];
    membros: Membro[];
}

interface Pontuacao {
    presenca: number;
    pontualidade: number;
    uniforme: number;
    modestia: number;
}

export default function ChamadaTab({ reunioes, membros }: ChamadaTabProps) {
    const [reuniaoSelecionada, setReuniaoSelecionada] = useState<string | null>(null)
    const [chamada, setChamada] = useState<Record<number, Pontuacao>>({})
    const [faltasJustificadas, setFaltasJustificadas] = useState<number[]>([]);

    const handlePresencaChange = (memberId: number, isPresent: boolean) => {
        setChamada(prev => {
            const newState = { ...prev };
            if (isPresent) {
                // Se estava com falta justificada, remove
                setFaltasJustificadas(f => f.filter(id => id !== memberId));
                newState[memberId] = { presenca: 10, pontualidade: 10, uniforme: 10, modestia: 10 };
            } else {
                delete newState[memberId];
            }
            return newState;
        });
    };

    const handleJustificadaChange = (memberId: number, isJustified: boolean) => {
        if (isJustified) {
            // Remove da lista de presença se estiver lá
            setChamada(prev => {
                const newState = { ...prev };
                delete newState[memberId];
                return newState;
            });
            setFaltasJustificadas(prev => [...prev, memberId]);
        } else {
            setFaltasJustificadas(prev => prev.filter(id => id !== memberId));
        }
    }

    const handleScoreChange = (memberId: number, field: keyof Omit<Pontuacao, 'presenca'>, operation: 'add' | 'subtract') => {
        setChamada(prev => {
            const currentScore = prev[memberId][field];
            let newScore;
            if (operation === 'add') {
                newScore = Math.min(10, currentScore + 5);
            } else {
                newScore = Math.max(0, currentScore - 5);
            }
            return {
                ...prev,
                [memberId]: {
                    ...prev[memberId],
                    [field]: newScore,
                }
            }
        })
    }

    const getPresencaFinal = (memberId: number) => {
        if (chamada[memberId]) return chamada[memberId].presenca;
        if (faltasJustificadas.includes(memberId)) return 5;
        return 0;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chamada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jaguar">Jaguar</SelectItem>
                                <SelectItem value="gato-mato">Gato do Mato</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Reunião</Label>
                        <Select onValueChange={(value) => setReuniaoSelecionada(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a reunião" />
                            </SelectTrigger>
                            <SelectContent>
                                {reunioes.map((reuniao) => (
                                    <SelectItem key={reuniao.id} value={reuniao.id.toString()}>
                                        {reuniao.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {reuniaoSelecionada && (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Lista de Presença</h3>
                        <div className="space-y-3">
                            {membros.map((membro) => {
                                const isPresent = !!chamada[membro.id];
                                const isJustified = faltasJustificadas.includes(membro.id);

                                return (
                                    <Card key={membro.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{membro.nome}</p>
                                                <p className="text-sm text-muted-foreground">{membro.cargo}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`presenca-${membro.id}`}
                                                        checked={isPresent}
                                                        onCheckedChange={(checked) => handlePresencaChange(membro.id, !!checked)}
                                                    />
                                                    <Label htmlFor={`presenca-${membro.id}`}>Presença</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`justificada-${membro.id}`}
                                                        checked={isJustified}
                                                        onCheckedChange={(checked) => handleJustificadaChange(membro.id, !!checked)}
                                                    />
                                                    <Label htmlFor={`justificada-${membro.id}`}>Falta Justificada</Label>
                                                </div>
                                            </div>
                                        </div>

                                        {isPresent && (
                                            <div className="flex gap-4 pt-4 mt-4 border-t">
                                                <div className="flex items-center space-x-2">
                                                    <Label>Pontualidade:</Label>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleScoreChange(membro.id, 'pontualidade', 'add')}><PlusCircle className="h-4 w-4"/></Button>
                                                    <Badge>{chamada[membro.id].pontualidade}</Badge>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleScoreChange(membro.id, 'pontualidade', 'subtract')}><MinusCircle className="h-4 w-4"/></Button>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Label>Uniforme:</Label>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleScoreChange(membro.id, 'uniforme', 'add')}><PlusCircle className="h-4 w-4"/></Button>
                                                    <Badge>{chamada[membro.id].uniforme}</Badge>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleScoreChange(membro.id, 'uniforme', 'subtract')}><MinusCircle className="h-4 w-4"/></Button>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Label>Modéstia:</Label>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleScoreChange(membro.id, 'modestia', 'add')}><PlusCircle className="h-4 w-4"/></Button>
                                                    <Badge>{chamada[membro.id].modestia}</Badge>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleScoreChange(membro.id, 'modestia', 'subtract')}><MinusCircle className="h-4 w-4"/></Button>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                        <Button>Salvar chamada</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}