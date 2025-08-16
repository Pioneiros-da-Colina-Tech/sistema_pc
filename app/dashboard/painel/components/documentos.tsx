"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileCheck2, FileClock, FileX2, FileQuestion, Upload, AlertCircle } from "lucide-react"

// --- Dados Mockados Atualizados ---
const todosDocumentos = ["RG", "CPF", "Comprovante de Residência", "Cartão do Sus", "Carteirinha do convênio"];

const meusDocumentosMock: { [key: string]: { status: string; motivo?: string } } = {
    "RG": { status: "aprovado" },
    "CPF": { status: "aprovado" },
    "Comprovante de Residência": { status: "aguardando-avaliacao" },
    "Cartão do Sus": { status: "reprovado", motivo: "Documento ilegível. Por favor, envie uma imagem mais nítida." }
};
// --- Fim dos Dados Mockados ---


export default function DocumentosTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Meus Documentos</CardTitle>
                <CardDescription>Acompanhe o status de envio e aprovação dos seus documentos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {todosDocumentos.map(doc => {
                    const docInfo = meusDocumentosMock[doc];
                    const status = docInfo?.status || "faltante";

                    const getIcon = () => {
                        switch(status) {
                            case 'aprovado':
                                return <FileCheck2 className="h-5 w-5 text-green-600"/>;
                            case 'aguardando-avaliacao':
                                return <FileClock className="h-5 w-5 text-yellow-600"/>;
                            case 'reprovado':
                                return <FileX2 className="h-5 w-5 text-red-600"/>;
                            default:
                                return <FileQuestion className="h-5 w-5 text-gray-500"/>;
                        }
                    }

                    return (
                        <Card key={doc} className="p-4">
                            <div className="flex flex-col md:flex-row justify-between md:items-center">
                                <div className="flex items-center gap-3">
                                    {getIcon()}
                                    <span className="font-medium">{doc}</span>
                                </div>
                                <Badge variant={status === 'aprovado' ? 'default' : status === 'faltante' ? 'outline' : status === 'reprovado' ? 'destructive' : 'secondary'}>
                                    {status.replace('-', ' ')}
                                </Badge>
                            </div>

                            {status === 'reprovado' && docInfo.motivo && (
                                <div className="mt-3 pt-3 border-t text-sm text-red-600 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4"/>
                                    <div>
                                        <span className="font-semibold">Motivo da reprovação:</span> {docInfo.motivo}
                                    </div>
                                </div>
                            )}

                            {(status === 'faltante' || status === 'reprovado') && (
                                <div className="mt-4 pt-4 border-t space-y-2">
                                    <Label htmlFor={`upload-${doc.replace(/\s+/g, '-')}`} className="text-sm font-medium">
                                        {status === 'faltante' ? "Anexar documento:" : "Anexar novo documento:"}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input id={`upload-${doc.replace(/\s+/g, '-')}`} type="file" className="flex-1"/>
                                        <Button size="sm" variant="secondary">
                                            <Upload className="h-4 w-4 mr-2"/>
                                            Enviar Arquivo
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    )
}