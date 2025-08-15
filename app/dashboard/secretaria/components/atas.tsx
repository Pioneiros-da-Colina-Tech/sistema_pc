"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

export default function AtasTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Atas e Atos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="titulo-ata">Título da Ata</Label><Input id="titulo-ata" placeholder="Digite o título da ata" /></div>
                    <div className="space-y-2"><Label>Reunião</Label><Select><SelectTrigger><SelectValue placeholder="Selecione a reunião" /></SelectTrigger><SelectContent><SelectItem value="reuniao1">Reunião Geral</SelectItem><SelectItem value="reuniao2">Treinamento</SelectItem></SelectContent></Select></div>
                </div>
                <div className="space-y-2"><Label htmlFor="descricao">Descrição</Label><Textarea id="descricao" placeholder="Descrição da ata" rows={4} /></div>
                <Button>Salvar ata</Button>
                <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold">Atos Registrados</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded"><div><span className="font-medium">Jaguar</span> -<span className="ml-2">Especialidade concluída</span></div><span className="text-sm text-muted-foreground">Internet - João Silva</span></div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded"><div><span className="font-medium">Gato do Mato</span> -<span className="ml-2">Classe investida</span></div><span className="text-sm text-muted-foreground">Amigo - Maria Santos</span></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}