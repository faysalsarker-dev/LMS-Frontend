import { Play, Headphones, FileText, HelpCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LESSON_TYPE_CONFIG, type LessonType } from '@/interface/lesson.type';

interface TypeSelectorProps {
  value: LessonType;
  onChange: (type: LessonType) => void;
}

const iconMap = {
  Play,
  Headphones,
  FileText,
  HelpCircle,
  ClipboardList,
};

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const types = Object.entries(LESSON_TYPE_CONFIG) as [LessonType, typeof LESSON_TYPE_CONFIG[LessonType]][];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Lesson Type</label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {types.map(([type, config]) => {
          const Icon = iconMap[config.icon as keyof typeof iconMap];
          const isSelected = value === type;
          
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={cn(
                'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
                'hover:border-primary/50 hover:shadow-md',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-border bg-card'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full transition-colors',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                'text-sm font-medium',
                isSelected ? 'text-primary' : 'text-foreground'
              )}>
                {config.label}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-scale-in">
                  <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
