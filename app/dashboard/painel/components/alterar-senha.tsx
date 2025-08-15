"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

const usuarioMock = {
    usuario: "joao.silva",
    senha: "******",
}

export default function AlterarSenhaTab() {
    const [usuario] = useState(usuarioMock);

    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Alterar Usuário e Senha</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="usuario">Usuário</Label><Input id="usuario" value={usuario.usuario} /></div>
                <div className="space-y-2"><Label htmlFor="senha">Senha</Label><Input id="senha" type="password" value={usuario.senha} /></div>
                <Button>Salvar alterações</Button>
            </CardContent>
        </Card>
    )
}