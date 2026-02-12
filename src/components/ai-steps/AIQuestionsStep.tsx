import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAIWorkflow } from '@/contexts/AIWorkflowContext';
import { Bot, User, ArrowRight, Send, Sparkles } from 'lucide-react';

export function AIQuestionsStep() {
    const { questions, updateAnswer, nextStep, prevStep, generatePrompt } = useAIWorkflow();
    const [activeIndex, setActiveIndex] = useState(0);

    const allAnswered = questions.every(q => q.answer.trim() !== '');
    const currentQ = questions[activeIndex];

    const handleSubmitAnswer = () => {
        if (activeIndex < questions.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleFinish = () => {
        generatePrompt();
        nextStep();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Questions IA</h2>
                <p className="text-muted-foreground mt-1">
                    Répondez à quelques questions pour que l'IA construise le prompt parfait.
                </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
                {questions.map((q, i) => (
                    <button
                        key={q.id}
                        onClick={() => setActiveIndex(i)}
                        className={`h-2 flex-1 rounded-full transition-all ${i <= activeIndex
                            ? q.answer.trim()
                                ? 'bg-emerald-500'
                                : 'bg-primary'
                            : 'bg-muted'
                            }`}
                    />
                ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Question {activeIndex + 1} / {questions.length}
            </p>

            {/* Chat-like messages */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto">
                {questions.slice(0, activeIndex + 1).map((q, i) => (
                    <div key={q.id} className="space-y-3">
                        {/* AI Question */}
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                            <Card className="flex-1 bg-primary/5 border-primary/20">
                                <CardContent className="p-4">
                                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                                    {q.options && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {q.options.map((opt) => (
                                                <Badge
                                                    key={opt}
                                                    variant={q.answer === opt ? 'default' : 'outline'}
                                                    className={`cursor-pointer transition-all ${q.answer === opt
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-primary/10'
                                                        }`}
                                                    onClick={() => {
                                                        updateAnswer(q.id, opt);
                                                        // Auto-advance for select questions after a brief delay
                                                        if (i === activeIndex && activeIndex < questions.length - 1) {
                                                            setTimeout(() => setActiveIndex(prev => prev + 1), 500);
                                                        }
                                                    }}
                                                >
                                                    {opt}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* User Answer */}
                        {q.answer && (
                            <div className="flex gap-3 justify-end">
                                <Card className="max-w-[70%] bg-emerald-500/10 border-emerald-500/20">
                                    <CardContent className="p-4">
                                        <p className="text-sm text-foreground">{q.answer}</p>
                                    </CardContent>
                                </Card>
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                    <User className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input area */}
            <Card className="border-primary/20">
                <CardContent className="p-4">
                    {currentQ.type === 'text' ? (
                        <div className="flex gap-3">
                            <Input
                                placeholder={currentQ.placeholder || 'Votre réponse...'}
                                value={currentQ.answer}
                                onChange={(e) => updateAnswer(currentQ.id, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && currentQ.answer.trim()) {
                                        handleSubmitAnswer();
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                size="icon"
                                onClick={handleSubmitAnswer}
                                disabled={!currentQ.answer.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center">
                            ↑ Sélectionnez une option ci-dessus
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                    Retour
                </Button>
                <Button
                    onClick={handleFinish}
                    disabled={!allAnswered}
                    className="gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    Générer le prompt
                </Button>
            </div>
        </div>
    );
}
