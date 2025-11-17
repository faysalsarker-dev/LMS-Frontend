import { Badge } from "@/components/ui/badge";
import type { SubmissionType } from "@/data/mockData";
import { FileText, Link as LinkIcon, Type } from "lucide-react";

interface TypeBadgeProps {
  type: SubmissionType;
}

const TypeBadge = ({ type }: TypeBadgeProps) => {
  const typeConfig = {
    file: {
      label: "File",
      icon: FileText,
      className: "bg-secondary text-secondary-foreground",
    },
    link: {
      label: "Link",
      icon: LinkIcon,
      className: "bg-secondary text-secondary-foreground",
    },
    text: {
      label: "Text",
      icon: Type,
      className: "bg-secondary text-secondary-foreground",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default TypeBadge;