import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAIWorkflow } from '@/contexts/AIWorkflowContext';
import {
    Rocket,
    Check,
    Loader2,
    RefreshCw,
    ExternalLink,
    PartyPopper
} from 'lucide-react';
import { ExportPlatform } from '@/types/ai-workflow';

export function AIExportStep() {
    const {
        exportPlatform,
        setExportPlatform,
        exportStatus,
        startExport,
        prevStep,
        resetWorkflow,
    } = useAIWorkflow();

    const platforms: { id: ExportPlatform; name: string; description: string }[] = [
        { id: 'sfmc', name: 'Salesforce Marketing Cloud', description: 'Content Builder → Email Studio' },
        { id: 'bsft', name: 'Blueshift', description: 'Creative Studio → Campaigns' },
        { id: 'both', name: 'Les deux plateformes', description: 'Export simultané SFMC + BSFT' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Export automatique</h2>
                <p className="text-muted-foreground mt-1">
                    Sélectionnez votre plateforme d'envoi pour l'import automatique.
                </p>
            </div>

            {exportStatus === 'idle' && (
                <>
                    {/* Platform Selection */}
                    <div className="grid grid-cols-1 gap-4">
                        {platforms.map((p) => (
                            <Card
                                key={p.id}
                                className={`cursor-pointer transition-all ${exportPlatform === p.id
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                        : 'hover:border-primary/30'
                                    }`}
                                onClick={() => setExportPlatform(p.id)}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${exportPlatform === p.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        <Rocket className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">{p.name}</p>
                                        <p className="text-sm text-muted-foreground">{p.description}</p>
                                    </div>
                                    {exportPlatform === p.id && (
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                            Retour
                        </Button>
                        <Button
                            onClick={startExport}
                            disabled={!exportPlatform}
                            className="gap-2"
                        >
                            <Rocket className="w-4 h-4" />
                            Lancer l'export
                        </Button>
                    </div>
                </>
            )}

            {exportStatus === 'exporting' && (
                <Card className="border-primary/20">
                    <CardContent className="py-16">
                        <div className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-foreground">Export en cours...</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Import automatique vers {exportPlatform === 'both' ? 'SFMC et BSFT' : exportPlatform?.toUpperCase()}
                                </p>
                            </div>
                            <div className="w-full space-y-2">
                                <Progress value={65} className="h-2" />
                                <p className="text-xs text-muted-foreground">Création du template email...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {exportStatus === 'success' && (
                <Card className="border-emerald-500/30 bg-emerald-500/5">
                    <CardContent className="py-16">
                        <div className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <PartyPopper className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-foreground">Export réussi ! 🎉</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Votre email a été importé avec succès dans{' '}
                                    {exportPlatform === 'both' ? 'SFMC et BSFT' : exportPlatform?.toUpperCase()}.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Voir dans la plateforme
                                </Button>
                                <Button onClick={resetWorkflow} className="gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Nouvel email
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
