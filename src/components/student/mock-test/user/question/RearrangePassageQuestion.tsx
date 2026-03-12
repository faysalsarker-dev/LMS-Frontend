import { useState, useEffect, useMemo } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface SortableItemProps {
  id: string;
  text: string;
}

const SortableItem = ({ id, text }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-2xl bg-card border-2 border-muted hover:border-primary/30 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <span className="text-base font-medium">{text}</span>
    </div>
  );
};

export const RearrangePassageQuestion = ({ question, answer, onChange }: Props) => {
  const initialOrder = useMemo(() => {
    if (answer?.segmentOrder && answer.segmentOrder.length > 0) {
      return answer.segmentOrder;
    }
    const segments = question.segments ?? [];
    return shuffle(segments).map((s) => s.segmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question._id]);

  const [order, setOrder] = useState<string[]>(initialOrder);

  useEffect(() => {
    if (answer?.segmentOrder && answer.segmentOrder.length > 0) {
      setOrder(answer.segmentOrder);
    }
  }, [question._id]);

  const segmentMap = useMemo(() => {
    const map: Record<string, string> = {};
    (question.segments ?? []).forEach((s) => { map[s.segmentId] = s.text; });
    return map;
  }, [question.segments]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = order.indexOf(active.id as string);
      const newIdx = order.indexOf(over.id as string);
      const newOrder = arrayMove(order, oldIdx, newIdx);
      setOrder(newOrder);
      onChange({ questionId: question._id!, questionType: question.type, segmentOrder: newOrder });
    }
  };

  return (
    <div className="space-y-6">
      <p className="font-semibold text-muted-foreground text-center">
        {question.instruction ?? "Drag the sentences into the correct order:"}
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {order.map((segId) => (
              <SortableItem key={segId} id={segId} text={segmentMap[segId] ?? segId} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
