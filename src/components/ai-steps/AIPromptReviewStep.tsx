import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAIWorkflow } from '@/contexts/AIWorkflowContext';
import { Copy, Check, Edit2, Save, Eye, Code, ArrowRight } from 'lucide-react';

export function AIPromptReviewStep() {
    const { generatedPrompt, nextStep, prevStep } = useAIWorkflow();
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedPrompt, setEditedPrompt] = useState('');
    const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

    if (!generatedPrompt) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Aucun prompt généré. Veuillez répondre aux questions d'abord.</p>
            </div>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt.fullPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEdit = () => {
        setEditedPrompt(generatedPrompt.fullPrompt);
        setEditing(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Prompt Généré</h2>
                <p className="text-muted-foreground mt-1">
                    Voici le prompt parfait construit par l'IA à partir de vos réponses. Vous pouvez le modifier si nécessaire.
                </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
                <Button
                    variant={viewMode === 'formatted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('formatted')}
                    className="gap-2"
                >
                    <Eye className="w-4 h-4" />
                    Vue formatée
                </Button>
                <Button
                    variant={viewMode === 'raw' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('raw')}
                    className="gap-2"
                >
                    <Code className="w-4 h-4" />
                    Vue brute
                </Button>
            </div>

            {viewMode === 'formatted' ? (
                <div className="space-y-4">
                    {/* System Prompt */}
                    <Card className="border-blue-500/20 bg-blue-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                                System Prompt
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground leading-relaxed">
                                {generatedPrompt.systemPrompt}
                            </p>
                        </CardContent>
                    </Card>

                    {/* User Prompt */}
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
                                User Prompt
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                                {generatedPrompt.userPrompt}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                /* Raw view */
                <Card>
                    <CardContent className="p-0">
                        {editing ? (
                            <div className="relative">
                                <Textarea
                                    value={editedPrompt}
                                    onChange={(e) => setEditedPrompt(e.target.value)}
                                    className="min-h-[300px] font-mono text-sm border-0 focus-visible:ring-0 p-4"
                                />
                                <Button
                                    size="sm"
                                    className="absolute top-3 right-3 gap-2"
                                    onClick={() => setEditing(false)}
                                >
                                    <Save className="w-3 h-3" />
                                    Sauvegarder
                                </Button>
                            </div>
                        ) : (
                            <div className="relative">
                                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed p-4 max-h-[400px] overflow-y-auto">
                                    {generatedPrompt.fullPrompt}
                                </pre>
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <Button size="sm" variant="outline" onClick={handleEdit} className="gap-2">
                                        <Edit2 className="w-3 h-3" />
                                        Modifier
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCopy} className="gap-2">
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copié' : 'Copier'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                    Retour
                </Button>
                <Button onClick={nextStep} className="gap-2">
                    Optimiser le contenu
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
