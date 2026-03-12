import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { handleApiError } from '@/utils/errorHandler'
import { useDeletePracticeItemMutation } from '@/redux/features/practice/practice.api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  practiceId: string
  itemId: string | null
  onSuccess?: () => void
}

export const PracticeItemDeleteDialog = ({
  open,
  onOpenChange,
  practiceId,
  itemId,
  onSuccess,
}: Props) => {
  const [deleteItem, { isLoading }] = useDeletePracticeItemMutation()

  const handleDelete = async () => {
    if (!itemId) return

    try {
      await deleteItem({ practiceId, itemId }).unwrap()
      toast.success('Item deleted successfully')
      onOpenChange(false)
      onSuccess?.()
    } catch (e) {
      handleApiError(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Item
          </DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deleting
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
