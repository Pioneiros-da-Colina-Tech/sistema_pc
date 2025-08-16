"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const requisitosClassesMock = [
    { id: 101, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "AM-001" },
    { id: 102, secao: "Descoberta Espiritual", texto: "Memorizar Voto e Lei.", codigo_classe: "AM-001" },
    { id: 201, secao: "Geral", texto: "Requisito avançado de Amigo.", codigo_classe: "AM-A-001" },
    { id: 301, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "CP-002" },
]

const avaliacaoClassesInitialMock = [
    { id: 1, id_requisito: 101, codigo_sgc: "12345", status: "Aprovado" },
]

export default function ProgressoClasseTab({ membrosDaUnidade, unidadeAtual }: any) {
    const [avaliacaoClasses, setAvaliacaoClasses] = useState(avaliacaoClassesInitialMock)
    const [requisitoPendente, setRequisitoPendente] = useState<string | undefined>()

    const codigosClasse = [unidadeAtual?.codigo_classe_regular, unidadeAtual?.codigo_classe_avancada].filter(Boolean)
    const requisitosDaUnidade = requisitosClassesMock.filter(req => codigosClasse.includes(req.codigo_classe))

    const handleAdicionarRequisitoPendente = () => {
        if (!requisitoPendente) {
            alert("Por favor, selecione um requisito.");
            return;
        }
        const requisitoId = parseInt(requisitoPendente);
        let novasAvaliacoes = [...avaliacaoClasses];
        membrosDaUnidade.forEach((membro: any) => {
            if (!novasAvaliacoes.some(a => a.codigo_sgc === membro.codigo_sgc && a.id_requisito === requisitoId)) {
                novasAvaliacoes.push({ id: Date.now() + Math.random(), id_requisito: requisitoId, codigo_sgc: membro.codigo_sgc, status: "Pendente" });
            }
        });
        setAvaliacaoClasses(novasAvaliacoes);
        alert("Requisito adicionado como pendente para todos os membros da unidade!");
    };

    return (
        <>
            <Card>
                <CardHeader><CardTitle>Adicionar Requisito para a Unidade</CardTitle><CardDescription>Selecione um requisito para marcar como "Pendente" para todos os membros da unidade.</CardDescription></CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Select onValueChange={setRequisitoPendente}>
                        <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione um requisito..." /></SelectTrigger>
                        <SelectContent>{requisitosDaUnidade.map(req => (<SelectItem key={req.id} value={req.id.toString()}>{req.texto}</SelectItem>))}</SelectContent>
                    </Select>
                    <Button onClick={handleAdicionarRequisitoPendente}>Adicionar Pendência</Button>
                </CardContent>
            </Card>
            <div className="space-y-4">
                {membrosDaUnidade.map((membro: any) => {
                    const avaliacoesDoMembro = avaliacaoClasses.filter(a => a.codigo_sgc === membro.codigo_sgc);
                    const aprovadosCount = requisitosDaUnidade.filter(req => avaliacoesDoMembro.some(a => a.id_requisito === req.id && a.status === 'Aprovado')).length;
                    const progresso = requisitosDaUnidade.length > 0 ? (aprovadosCount / requisitosDaUnidade.length) * 100 : 0;
                    return (
                        <Card key={membro.id}>
                            <CardHeader><div className="flex justify-between items-center"><CardTitle>{membro.nome}</CardTitle><div className="text-sm text-muted-foreground">{aprovadosCount} de {requisitosDaUnidade.length} requisitos aprovados</div></div><Progress value={progresso} className="mt-2" /></CardHeader>
                            <CardContent className="space-y-2">
                                {requisitosDaUnidade.map(req => {
                                    const avaliacao = avaliacoesDoMembro.find(a => a.id_requisito === req.id);
                                    const status = avaliacao?.status || 'Não Iniciado';
                                    const isRegular = req.codigo_classe === unidadeAtual?.codigo_classe_regular;
                                    return (<div key={req.id} className="flex items-center justify-between p-2 border rounded-md"><div><span className={`mr-2 text-xs font-semibold ${isRegular ? 'text-blue-600' : 'text-purple-600'}`}>{isRegular ? 'REGULAR' : 'AVANÇADO'}</span><span>{req.texto}</span></div><Badge variant={status === "Aprovado" ? "default" : status === "Avaliação" ? "secondary" : status === "Refazer" ? "destructive" : "outline"}>{status}</Badge></div>)
                                })}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </>
    )
}