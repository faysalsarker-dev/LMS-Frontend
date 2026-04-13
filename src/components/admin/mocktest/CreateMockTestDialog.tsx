import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, X, ImagePlus } from "lucide-react";
import {
    useCreateMockTestMutation,
} from "@/redux/features/mockTest/mockTest.api";
import {
    useCreateSectionMutation,
} from "@/redux/features/mockTest/mockTestSection.api";
import {
    useGetCourseForSelectQuery,
} from "@/redux/features/course/course.api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SECTION_NAMES = ["listening", "reading", "writing", "speaking"] as const;

interface CreateMockTestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface FormValues {
    title: string;
    courseId: string;
    thumbnail: File | null;
    preview: string | null;
}

export const CreateMockTestDialog = ({
    open,
    onOpenChange,
    onSuccess,
}: CreateMockTestDialogProps) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            courseId: "",
            thumbnail: null,
            preview: null,
        },
    });
    const preview = watch("preview");
    const [isInternational, setIsInternational] = useState(true);
    const [createMockTest, { isLoading: isCreating }] = useCreateMockTestMutation();
    const [createSection] = useCreateSectionMutation();
    const { data: coursesData } = useGetCourseForSelectQuery({});

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview as string);
            }
        };
    }, [preview]);

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("thumbnail", file, { shouldDirty: true });
        setValue("preview", URL.createObjectURL(file));
    };

    const handleClose = () => {
        reset();
        setIsInternational(true);
        onOpenChange(false);
    };

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        formData.append("title", data.title.trim());
        formData.append("course", data.courseId);
        formData.append("isInternational", String(isInternational));
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

        await toast.promise(
            (async () => {
                const result = await createMockTest(formData).unwrap();
                const mockTestId: string = result?.data?._id;

                await Promise.allSettled(
                    SECTION_NAMES.map((name) =>
                        createSection({ mockTest: mockTestId, name }).unwrap()
                    )
                );

                handleClose();
                onSuccess?.();
            })(),
            {
                loading: "Creating mock test…",
                success: "Mock test created with all 4 sections!",
                error: "Failed to create mock test. Please try again.",
            }
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courses: any[] = coursesData?.data ?? [];

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            Create Mock Test
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            All 4 sections (Listening, Reading, Writing, Speaking) will be
                            created automatically.
                        </p>
                    </DialogHeader>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="mt-title">
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="mt-title"
                            placeholder="e.g. HSK Level 3 Mock Test"
                            className="rounded-xl"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Course */}
                    <div className="space-y-2">
                        <Label htmlFor="mt-course">
                            Course <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="courseId"
                            control={control}
                            rules={{ required: "Please select a course" }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger id="mt-course" className="rounded-xl">
                                        <SelectValue placeholder="Select a course…" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {courses.map((c) => (
                                            <SelectItem key={c._id} value={c._id}>
                                                {c.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.courseId && (
                            <p className="text-xs text-destructive">{errors.courseId.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/20 bg-muted p-4">
                        <div>
                            <Label className="text-sm font-medium">International Storage</Label>
                            <p className="text-xs text-muted-foreground">
                                Use the international provider for mock test uploads.
                            </p>
                        </div>
                        <Switch checked={isInternational} onCheckedChange={setIsInternational} />
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-2">
                        <Label>Thumbnail</Label>
                        <label
                            htmlFor="mt-thumbnail"
                            className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
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
                                            setValue("thumbnail", null);
                                            setValue("preview", null);
                                        }}
                                        className="absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full text-white"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImagePlus className="h-8 w-8" />
                                    <span className="text-sm">Click to upload thumbnail</span>
                                </div>
                            )}
                            <input
                                id="mt-thumbnail"
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
                        <Button type="submit" disabled={isCreating} className="flex-1 rounded-xl">
                            {isCreating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                "Create Mock Test"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
