"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const eventosMock = [ { id: 1, nome: "Acampamento de Verão" } ];

const financasMock = {
    eventos: [{ id: 1, eventoId: 1, status: "em-aberto" }],
    mensalidades: [ { id: 1, mes: "Janeiro 2025", status: "pago" }, { id: 2, mes: "Fevereiro 2025", status: "em-aberto" }, { id: 3, mes: "Março 2025", status: "isento" }]
}

export default function FinanceiroTab() {
    const [financeiro, setFinanceiro] = useState(financasMock)

    const handleUpdateStatus = (type: 'eventos' | 'mensalidades', id: number, newStatus: string) => {
        setFinanceiro(prev => ({
            ...prev,
            [type]: prev[type].map(item => item.id === id ? { ...item, status: newStatus } : item)
        }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Pagamento de Mensalidades</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {financeiro.mensalidades.map(mensalidade => (
                        <Card key={mensalidade.id} className="p-4">
                            <div className="flex justify-between items-center"><p className="font-semibold">{mensalidade.mes}</p><Badge variant={mensalidade.status === 'pago' ? 'default' : mensalidade.status === 'isento' ? 'secondary' : 'destructive'}>{mensalidade.status.replace(/-/g, ' ')}</Badge></div>
                            {(mensalidade.status === 'em-aberto' || mensalidade.status.startsWith('aguardando')) && (
                                <div className="mt-4 pt-4 border-t space-y-4">
                                    <p className="text-sm text-muted-foreground">Selecione o método:</p>
                                    <div className="flex gap-2"><Button size="sm" onClick={() => handleUpdateStatus('mensalidades', mensalidade.id, 'aguardando-cartao')}>Cartão/Dinheiro</Button><Button size="sm" variant="outline" onClick={() => handleUpdateStatus('mensalidades', mensalidade.id, 'aguardando-pix')}>Pix</Button></div>
                                </div>
                            )}
                            {mensalidade.status === 'aguardando-cartao' && (<div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">Status: Aguardando. Contate a tesouraria.</div>)}
                            {mensalidade.status === 'aguardando-pix' && (<div className="mt-3 space-y-2"><Label htmlFor={`pix-upload-${mensalidade.id}`}>Anexar Comprovante</Label><div className="flex gap-2"><Input id={`pix-upload-${mensalidade.id}`} type="file" className="flex-1"/><Button size="sm">Enviar</Button></div></div>)}
                        </Card>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Inscrições em Eventos</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {financeiro.eventos.map(inscricao => {
                        const evento = eventosMock.find(e => e.id === inscricao.eventoId);
                        return (
                            <Card key={inscricao.id} className="p-4">
                                <div className="flex justify-between items-center"><p className="font-semibold">{evento?.nome}</p><Badge variant={inscricao.status === 'pago' ? 'default' : inscricao.status === 'isento' ? 'secondary' : 'destructive'}>{inscricao.status.replace(/-/g, ' ')}</Badge></div>
                                {(inscricao.status === 'em-aberto' || inscricao.status.startsWith('aguardando')) && (<div className="mt-4 pt-4 border-t space-y-4"><p className="text-sm text-muted-foreground">Selecione o método:</p><div className="flex gap-2"><Button size="sm" onClick={() => handleUpdateStatus('eventos', inscricao.id, 'aguardando-cartao')}>Cartão/Dinheiro</Button><Button size="sm" variant="outline" onClick={() => handleUpdateStatus('eventos', inscricao.id, 'aguardando-pix')}>Pix</Button></div></div>)}
                                {inscricao.status === 'aguardando-cartao' && (<div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">Status: Aguardando. Contate a tesouraria.</div>)}
                                {inscricao.status === 'aguardando-pix' && (<div className="mt-3 space-y-2"><Label htmlFor={`pix-upload-evento-${inscricao.id}`}>Anexar Comprovante</Label><div className="flex gap-2"><Input id={`pix-upload-evento-${inscricao.id}`} type="file" className="flex-1"/><Button size="sm">Enviar</Button></div></div>)}
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    )
}