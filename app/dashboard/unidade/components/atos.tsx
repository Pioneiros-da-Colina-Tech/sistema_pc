"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AtosTab() {
    return (
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
    )
}