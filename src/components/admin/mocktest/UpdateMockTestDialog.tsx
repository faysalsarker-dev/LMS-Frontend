import { useEffect, useState } from "react";
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
import { Loader2, X, ImagePlus } from "lucide-react";
import { useUpdateMockTestMutation } from "@/redux/features/mockTest/mockTest.api";
import type { IMockTest } from "@/interface/mockTest.types";

interface UpdateMockTestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mockTest: IMockTest | null;
    onSuccess?: () => void;
}

export const UpdateMockTestDialog = ({
    open,
    onOpenChange,
    mockTest,
    onSuccess,
}: UpdateMockTestDialogProps) => {
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [updateMockTest, { isLoading }] = useUpdateMockTestMutation();

    // Sync form with incoming mockTest
    useEffect(() => {
        if (mockTest) {
            setTitle(mockTest.title);
            setPreview(mockTest.thumbnail ?? null);
        }
    }, [mockTest]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnail(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleClose = () => {
        setThumbnail(null);
        onOpenChange(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mockTest) return;
        if (!title.trim()) return toast.error("Title is required");

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            if (thumbnail) formData.append("thumbnail", thumbnail);

            await updateMockTest({ id: mockTest._id, data: formData }).unwrap();
            toast.success("Mock test updated!");
            handleClose();
            onSuccess?.();
        } catch {
            toast.error("Update failed. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Edit Mock Test</DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="umt-title">Title</Label>
                        <Input
                            id="umt-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-xl"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-2">
                        <Label>Thumbnail</Label>
                        <label
                            htmlFor="umt-thumbnail"
                            className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
                        >
                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setThumbnail(null);
                                            setPreview(null);
                                        }}
                                        className="absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full text-white"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImagePlus className="h-6 w-6" />
                                    <span className="text-sm">Replace thumbnail</span>
                                </div>
                            )}
                            <input
                                id="umt-thumbnail"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailChange}
                            />
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={handleClose} className="flex-1 rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving…
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
