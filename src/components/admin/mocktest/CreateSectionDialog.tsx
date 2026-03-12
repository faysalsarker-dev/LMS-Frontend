import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useCreateSectionMutation } from "@/redux/features/mockTest/mockTestSection.api";
import { useGetAllMockTestsQuery } from "@/redux/features/mockTest/mockTest.api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CreateSectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface FormValues {
    mockTest: string;
    name: "listening" | "reading" | "writing" | "speaking";
}

const SECTION_OPTIONS = [
    { label: "Listening", value: "listening" },
    { label: "Reading", value: "reading" },
    { label: "Writing", value: "writing" },
    { label: "Speaking", value: "speaking" },
];

export const CreateSectionDialog = ({
    open,
    onOpenChange,
    onSuccess,
}: CreateSectionDialogProps) => {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            mockTest: "",
            name: "listening",
        },
    });

    const { data: mockTestsData } = useGetAllMockTestsQuery({ limit: 100 });
    const [createSection, { isLoading: isCreating }] = useCreateSectionMutation();

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    const onSubmit = async (data: FormValues) => {
        try {
            await createSection(data).unwrap();
            toast.success("Section created successfully!");
            handleClose();
            onSuccess?.();
        } catch {
            toast.error("Failed to create section. Does it already exist for this test?");
        }
    };

    const mockTests = mockTestsData?.data.data ?? [];

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Add Manual Section</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create a standalone section for a Mock Test.
                        </p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    {/* Mock Test Selection */}
                    <div className="space-y-2">
                        <Label>Select Mock Test</Label>
                        <Controller
                            name="mockTest"
                            control={control}
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select test..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {mockTests.map((mt: any) => (
                                            <SelectItem key={mt._id} value={mt._id}>
                                                {mt.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.mockTest && <p className="text-xs text-destructive">{errors.mockTest.message}</p>}
                    </div>

                    {/* Section Type Selection */}
                    <div className="space-y-2">
                        <Label>Section Type</Label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {SECTION_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={handleClose} className="flex-1 rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating} className="flex-1 rounded-xl">
                            {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Create Section
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
