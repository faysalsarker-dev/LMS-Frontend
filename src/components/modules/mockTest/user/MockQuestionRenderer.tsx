import type { IMockQuestion } from "@/interface/mockTest.types";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockQuestionRendererProps {
    question: IMockQuestion;
    index: number;
    total: number;
    value: any;
    onChange: (val: any) => void;
}

export const MockQuestionRenderer = ({
    question,
    index,
    value,
    onChange
}: MockQuestionRendererProps) => {

    const renderListeningMCQ = () => (
        <div className="space-y-8">
            {question.audioUrl && (
                <div className="flex justify-center p-8 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20">
                    <Button
                        size="lg"
                        className="h-20 w-20 rounded-full shadow-xl shadow-primary/20 group"
                        onClick={() => {
                            const audio = new Audio(question.audioUrl);
                            audio.play();
                        }}
                    >
                        <Volume2 className="h-10 w-10 group-hover:scale-110 transition-transform" />
                    </Button>
                </div>
            )}

            <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options?.map((option) => (
                    <Label
                        key={option.optionId}
                        className={`flex flex-col gap-4 p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:border-primary/50 ${value === option.optionId ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-muted bg-card"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value={option.optionId} id={option.optionId} />
                            <span className="font-bold text-lg">{option.text}</span>
                        </div>
                        {option.imageUrl && (
                            <div className="aspect-square rounded-2xl overflow-hidden border">
                                <img src={option.imageUrl} alt={option.text} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </Label>
                ))}
            </RadioGroup>
        </div>
    );

    const renderReadingMCQ = () => (
        <div className="space-y-8">
            <div className="p-8 bg-card rounded-3xl border shadow-sm prose prose-neutral max-w-none">
                <h3 className="text-2xl font-black mb-4 tracking-tight">Read the following:</h3>
                <p className="text-xl leading-relaxed whitespace-pre-wrap">{question.passage || question.questionText}</p>
            </div>

            <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
                {question.options?.map((option) => (
                    <Label
                        key={option.optionId}
                        className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${value === option.optionId ? "border-primary bg-primary/5" : "border-muted bg-card"
                            }`}
                    >
                        <RadioGroupItem value={option.optionId} id={option.optionId} />
                        <span className="text-lg font-medium">{option.text}</span>
                    </Label>
                ))}
            </RadioGroup>
        </div>
    );

    const renderWritingInput = () => (
        <div className="space-y-8">
            <div className="flex flex-col items-center gap-6">
                {question.images?.[0]?.url && (
                    <div className="max-w-md rounded-3xl overflow-hidden border-8 border-card shadow-2xl">
                        <img src={question.images[0].url} alt="Reference" className="w-full h-auto" />
                    </div>
                )}
                {question.pinyin && (
                    <div className="text-center">
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Pinyin</span>
                        <h2 className="text-4xl font-black">{question.pinyin}</h2>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <Label className="text-xl font-bold">Your Answer:</Label>
                <textarea
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full min-h-[150px] p-6 rounded-3xl border-2 border-muted bg-card text-2xl font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                />
            </div>
        </div>
    );

    const renderContent = () => {
        switch (question.type) {
            case "L_AUDIO_MCQ":
            case "L_PICTURE_MATCHING":
            case "L_LONG_DIALOGUE_MATCHING":
                return renderListeningMCQ();

            case "R_PASSAGE_MCQ":
            case "R_SENTENCE_TO_PICTURE":
                return renderReadingMCQ();

            case "W_PICTURE_TO_WORD":
            case "W_PINYIN_TO_CHARACTER":
            case "W_WORD_TO_SENTENCE":
            case "W_COMPOSITION_TOPIC":
            case "W_COMPOSITION_PICTURES":
                return renderWritingInput();

            default:
                return (
                    <div className="p-10 text-center bg-muted/20 rounded-3xl border-2 border-dashed">
                        <h3 className="text-xl font-bold mb-2">Question Type Under Development</h3>
                        <p className="text-muted-foreground">{question.type} renderer is being implemented.</p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary border-none text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                        Question {index + 1}
                    </Badge>
                    <span className="text-sm font-bold text-muted-foreground uppercase opacity-50">
                        {question.marks} Marks
                    </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight leading-tight">
                    {question.instruction || "Follow the instructions carefully."}
                </h1>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-[2rem] border p-1 border-primary/5">
                <div className="p-8 md:p-12">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
