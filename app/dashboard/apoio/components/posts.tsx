"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MessageSquare, Calendar, Send } from "lucide-react"

// --- Dados Mockados ---
const initialPosts = [
    { id: 1, titulo: "Ajustes no Calendário de Eventos", autor: "Pastor Regional", data: "2025-08-10", conteudo: "Atenção, diretoria! O Camporee Regional foi adiantado em uma semana. Por favor, ajustem seus planejamentos." },
    { id: 2, titulo: "Novo Regulamento de Uniformes", autor: "Coordenador de Atividades", data: "2025-08-05", conteudo: "O novo manual de uniformes já está disponível para download na seção de arquivos. A implementação é imediata." },
];

const initialDatasAvaliacoes = [
    { id: 1, nome: "Avaliação de Classes Regulares", data: "2025-09-15" },
    { id: 2, nome: "Avaliação Final de Classes Avançadas", data: "2025-10-01" },
];

const mensagensRecebidas = [
    { id: 1, assunto: "Dúvida sobre o Camporee", autor: "Maria Santos (Diretora Jaguar)", data: "2025-08-11", mensagem: "Olá, Pastor! Gostaríamos de confirmar se o local do Camporee permanece o mesmo após a alteração da data. Obrigado!" },
    { id: 2, assunto: "Inscrição de novo membro", autor: "Ana Oliveira (Diretora Gato do Mato)", data: "2025-08-09", mensagem: "Bom dia! Estamos com um novo membro que precisa ser cadastrado no sistema para o seguro. Qual o procedimento?" },
]
// --- Fim dos Dados Mockados ---

export default function PostsTab() {
    const [posts, setPosts] = useState(initialPosts);
    const [datasAvaliacoes, setDatasAvaliacoes] = useState(initialDatasAvaliacoes);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Coluna da Esquerda */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Plus/> Criar/Editar Post</CardTitle>
                        <CardDescription>Escreva ou edite um comunicado para a diretoria dos clubes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="titulo-post">Título</Label><Input id="titulo-post" placeholder="Título do comunicado"/></div>
                        <div className="space-y-2"><Label htmlFor="conteudo-post">Conteúdo</Label><Textarea id="conteudo-post" placeholder="Escreva a mensagem aqui..." rows={4}/></div>
                        <Button>Publicar / Salvar</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar/> Gerenciar Datas de Avaliação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {datasAvaliacoes.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-2 border rounded-md">
                                    <span className="font-medium text-sm">{item.nome}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge>{new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Badge>
                                        <Button size="icon" variant="ghost" className="h-6 w-6"><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end gap-2 pt-4 border-t">
                            <div className="flex-1 space-y-2"><Label>Nome</Label><Input placeholder="Ex: Avaliação de Especialidades"/></div>
                            <div className="space-y-2"><Label>Data</Label><Input type="date"/></div>
                            <Button><Plus className="h-4 w-4"/> Adicionar</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Coluna da Direita */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Caixa de Entrada</CardTitle>
                        <CardDescription>Leia e responda as mensagens enviadas pela diretoria.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mensagensRecebidas.map(msg => (
                            <div key={msg.id} className="p-4 border rounded-lg bg-blue-50">
                                <h3 className="font-semibold">{msg.assunto}</h3>
                                <p className="text-sm text-muted-foreground">De: {msg.autor} em {new Date(msg.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                <p className="mt-2 text-sm">{msg.mensagem}</p>
                                <div className="mt-4 pt-4 border-t">
                                    <Label htmlFor={`resposta-${msg.id}`} className="text-xs font-semibold">Sua Resposta:</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Textarea id={`resposta-${msg.id}`} placeholder="Digite sua resposta aqui..." rows={1} className="text-sm"/>
                                        <Button size="sm"><Send className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}