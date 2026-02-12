import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIWorkflow } from '@/contexts/AIWorkflowContext';
import {
    Check,
    X,
    ArrowRight,
    Lightbulb,
    ImageIcon,
    Type,
    LayoutGrid,
    Sparkles
} from 'lucide-react';

export function AIOptimizationStep() {
    const { suggestions, acceptSuggestion, rejectSuggestion, nextStep, prevStep } = useAIWorkflow();

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'content': return <Type className="w-4 h-4" />;
            case 'image': return <ImageIcon className="w-4 h-4" />;
            case 'structure': return <LayoutGrid className="w-4 h-4" />;
            default: return <Lightbulb className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'content': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'image': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'structure': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const accepted = suggestions.filter(s => s.accepted === true).length;
    const rejected = suggestions.filter(s => s.accepted === false).length;
    const pending = suggestions.filter(s => s.accepted === null).length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Optimisations suggérées</h2>
                <p className="text-muted-foreground mt-1">
                    L'IA a analysé votre contenu et propose les améliorations suivantes.
                </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
                <Badge variant="outline" className="gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <Check className="w-3 h-3" /> {accepted} acceptées
                </Badge>
                <Badge variant="outline" className="gap-1 px-3 py-1.5 bg-destructive/10 text-destructive border-destructive/20">
                    <X className="w-3 h-3" /> {rejected} rejetées
                </Badge>
                <Badge variant="outline" className="gap-1 px-3 py-1.5">
                    <Sparkles className="w-3 h-3" /> {pending} en attente
                </Badge>
            </div>

            {/* Suggestions */}
            <div className="space-y-4">
                {suggestions.map((suggestion) => (
                    <Card
                        key={suggestion.id}
                        className={`transition-all ${suggestion.accepted === true
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : suggestion.accepted === false
                                    ? 'border-destructive/20 bg-destructive/5 opacity-60'
                                    : 'hover:border-primary/30'
                            }`}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getTypeColor(suggestion.type)}`}>
                                        {getTypeIcon(suggestion.type)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{suggestion.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">{suggestion.description}</p>
                                    </div>
                                </div>
                                {suggestion.accepted === null ? (
                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                                            onClick={() => acceptSuggestion(suggestion.id)}
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Accepter
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                            onClick={() => rejectSuggestion(suggestion.id)}
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Rejeter
                                        </Button>
                                    </div>
                                ) : (
                                    <Badge
                                        variant={suggestion.accepted ? 'default' : 'destructive'}
                                        className={suggestion.accepted ? 'bg-emerald-500' : ''}
                                    >
                                        {suggestion.accepted ? 'Acceptée' : 'Rejetée'}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <p className="text-xs font-medium text-destructive uppercase tracking-wider">Avant</p>
                                    <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-sm">
                                        {suggestion.before}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Après</p>
                                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-sm">
                                        {suggestion.after}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                    Retour
                </Button>
                <Button onClick={nextStep} className="gap-2">
                    Exporter
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
