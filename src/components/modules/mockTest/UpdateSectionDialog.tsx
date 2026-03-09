import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUpdateSectionMutation } from "@/redux/features/mockTest/mockTestSection.api";
import type { IMockTestSection } from "@/interface/mockTest.types";

interface UpdateSectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    section: IMockTestSection | null;
    onSuccess?: () => void;
}

export const UpdateSectionDialog = ({
    open,
    onOpenChange,
    section,
    onSuccess,
}: UpdateSectionDialogProps) => {
    const [timeLimit, setTimeLimit] = useState<number>(0);
    const [updateSection, { isLoading }] = useUpdateSectionMutation();

    useEffect(() => {
        if (section) {
            setTimeLimit(section.timeLimit);
        }
    }, [section]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!section) return;

        try {
            await updateSection({
                id: section._id,
                data: { timeLimit },
            }).unwrap();
            toast.success("Section settings updated!");
            onOpenChange(false);
            onSuccess?.();
        } catch {
            toast.error("Failed to update section settings");
        }
    };

    if (!section) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold capitalize">
                            {section.name} Section Settings
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                        <Input
                            id="timeLimit"
                            type="number"
                            min={1}
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 rounded-xl"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
