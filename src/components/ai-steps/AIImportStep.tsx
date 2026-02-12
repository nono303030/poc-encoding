import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAIWorkflow } from '@/contexts/AIWorkflowContext';
import { FileText, Upload, Loader2, Check, ExternalLink } from 'lucide-react';

export function AIImportStep() {
    const { gdocUrl, setGdocUrl, importGdoc, gdocContent, gdocLoading, nextStep } = useAIWorkflow();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Import Google Doc</h2>
                <p className="text-muted-foreground mt-1">
                    Collez le lien de votre Google Doc pour importer automatiquement le contenu.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        Lien du document
                    </CardTitle>
                    <CardDescription>
                        Le document sera analysé par l'IA pour extraire le contenu et la structure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="https://docs.google.com/document/d/..."
                            value={gdocUrl}
                            onChange={(e) => setGdocUrl(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            onClick={importGdoc}
                            disabled={!gdocUrl.trim() || gdocLoading}
                        >
                            {gdocLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyse...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Importer
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Content Preview */}
            {gdocContent && (
                <Card className="border-emerald-500/30 bg-emerald-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-emerald-600">
                            <Check className="w-5 h-5" />
                            Contenu importé avec succès
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-background rounded-lg border p-4 max-h-64 overflow-y-auto">
                            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                                {gdocContent}
                            </pre>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={nextStep}>
                                Continuer vers les questions IA
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading skeleton */}
            {gdocLoading && (
                <Card className="border-primary/20">
                    <CardContent className="py-12">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Analyse du document en cours...</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    L'IA extrait le contenu, les images et la structure de votre document.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
