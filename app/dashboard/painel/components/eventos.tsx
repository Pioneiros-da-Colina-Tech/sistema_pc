"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const eventosMock = [
    { id: 1, nome: "Acampamento de Verão", valorDesbravador: 150.00, valorDiretoria: 75.00, data: "2025-03-10" },
    { id: 2, nome: "Caminhada Ecológica", valorDesbravador: 25.00, valorDiretoria: 10.00, data: "2025-04-05" },
]

export default function EventosTab() {
    return (
        <Card>
            <CardHeader><CardTitle>Eventos Disponíveis</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {eventosMock.map(evento => (
                    <Card key={evento.id} className="p-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div><h3 className="font-semibold text-lg">{evento.nome}</h3><p className="text-sm text-muted-foreground">{evento.data}</p></div>
                            <div className="flex gap-4 mt-2 md:mt-0">
                                <div><p className="text-sm">Desbravador</p><p className="font-bold text-lg">R$ {evento.valorDesbravador.toFixed(2)}</p></div>
                                <div><p className="text-sm">Diretoria</p><p className="font-bold text-lg">R$ {evento.valorDiretoria.toFixed(2)}</p></div>
                            </div>
                            <Button className="mt-4 md:mt-0">Inscrever-se</Button>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}