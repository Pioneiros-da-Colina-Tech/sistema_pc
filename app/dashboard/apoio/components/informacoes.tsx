"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, Calendar, Download, Inbox } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// --- Dados Mockados ---
const postsRegionais = [
    { id: 1, titulo: "Ajustes no Calendário de Eventos", autor: "Pastor Regional", data: "2025-08-10", conteudo: "Atenção, diretoria! O Camporee Regional foi adiantado em uma semana. Por favor, ajustem seus planejamentos." },
    { id: 2, titulo: "Novo Regulamento de Uniformes", autor: "Coordenador de Atividades", data: "2025-08-05", conteudo: "O novo manual de uniformes já está disponível para download na seção de arquivos. A implementação é imediata." },
]

const datasAvaliacoes = [
    { id: 1, nome: "Avaliação de Classes Regulares", data: "2025-09-15" },
    { id: 2, nome: "Avaliação de Especialidades (Artes Manuais)", data: "2025-09-22" },
]

const arquivosManuais = [
    { id: 1, nome: "Manual do Desbravador Atualizado", tipo: "PDF", tamanho: "3.1MB" },
    { id: 2, nome: "Regulamento de Uniformes 2025", tipo: "PDF", tamanho: "1.8MB" },
]

const minhasMensagensMock = [
    { id: 1, assunto: "Dúvida sobre o Camporee", dataEnvio: "2025-08-11", mensagem: "Olá, Pastor! Gostaríamos de confirmar se o local do Camporee permanece o mesmo.", resposta: "Sim, o local está confirmado! Abraços.", dataResposta: "2025-08-12", autorResposta: "Pastor Regional" },
    { id: 2, assunto: "Inscrição de novo membro", dataEnvio: "2025-08-14", mensagem: "Bom dia! Estamos com um novo membro que precisa ser cadastrado. Qual o procedimento?", resposta: null },
]
// --- Fim dos Dados Mockados ---

export default function InformacoesTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Coluna da Esquerda */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> Posts da Regional</CardTitle>
                        <CardDescription>Comunicados importantes da coordenação para a diretoria.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {postsRegionais.map(post => (
                            <div key={post.id} className="p-4 border rounded-lg bg-secondary/50">
                                <h3 className="font-semibold">{post.titulo}</h3>
                                <p className="text-sm text-muted-foreground">Por {post.autor} em {new Date(post.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                <p className="mt-2 text-sm">{post.conteudo}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar /> Datas das Avaliações</CardTitle>
                        <CardDescription>Fique atento aos prazos e datas importantes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {datasAvaliacoes.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                                <span className="font-medium">{item.nome}</span>
                                <Badge>{new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Coluna da Direita */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Mensagem para a Regional</CardTitle>
                        <CardDescription>Canal direto para enviar dúvidas ou comunicados.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="assunto">Assunto</Label>
                            <Input id="assunto" placeholder="Ex: Dúvida sobre o Camporee"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mensagem">Mensagem</Label>
                            <Textarea id="mensagem" placeholder="Digite sua mensagem aqui..." rows={5}/>
                        </div>
                        <Button>Enviar Mensagem</Button>
                    </CardContent>
                </Card>

                {/* Novo Card de Minhas Mensagens */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Inbox/> Minhas Mensagens Enviadas</CardTitle>
                        <CardDescription>Acompanhe suas conversas com a regional.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {minhasMensagensMock.map(msg => (
                            <div key={msg.id} className="p-4 border rounded-lg">
                                <h4 className="font-semibold">{msg.assunto}</h4>
                                <p className="text-xs text-muted-foreground">Enviado em {new Date(msg.dataEnvio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                <p className="text-sm mt-2 italic">"{msg.mensagem}"</p>

                                <div className="mt-3 pt-3 border-t">
                                    {msg.resposta ? (
                                        <div className="bg-green-50 p-3 rounded-md">
                                            <p className="text-sm font-semibold text-green-800">Resposta de {msg.autorResposta}:</p>
                                            <p className="text-xs text-muted-foreground">Respondido em {new Date(msg.dataResposta!).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                            <p className="text-sm mt-1 text-green-700">{msg.resposta}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Aguardando resposta...</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Arquivos e Manuais</CardTitle>
                        <CardDescription>Faça o download de recursos importantes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {arquivosManuais.map(arquivo => (
                            <div key={arquivo.id} className="flex items-center justify-between p-3 border rounded-md">
                                <div>
                                    <p className="font-semibold">{arquivo.nome}</p>
                                    <p className="text-xs text-muted-foreground">{arquivo.tipo} - {arquivo.tamanho}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2"/>
                                    Baixar
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}