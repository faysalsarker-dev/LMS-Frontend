import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router'
import { useRef, useState } from 'react'
import { format } from 'date-fns'
import {
  Layers,
  Music,
  TrendingUp,
  Pause,
  Plus,
  Settings,
  Volume2,
  MoreVertical,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useGetSinglePracticeQuery } from '@/redux/features/practice/practice.api'

import { PracticeItemDialog } from '@/components/modules/practice/PracticeItemDialog'
import { UpdatePracticeDialog } from '@/components/modules/practice/UpdatePracticeDialog'
import { PracticeItemUpdateDialog } from '@/components/modules/practice/PracticeItemUpdateDialog'
import { PracticeItemDeleteDialog } from '@/components/modules/practice/PracticeItemDeleteDialog'
import type { PracticeItem } from '@/components/modules/practice'

const ViewPracticePage = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, refetch } = useGetSinglePracticeQuery(id!, {
    skip: !id,
  })

  const practice = data?.data

  /* -------------------- Dialog State -------------------- */
  const [openAdd, setOpenAdd] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  const [editItem, setEditItem] = useState<PracticeItem | null>(null)
  const [openEdit, setOpenEdit] = useState(false)

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [openDelete, setOpenDelete] = useState(false)

  /* -------------------- Audio State -------------------- */
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayAudio = (audioUrl: string, itemId: string) => {
    if (playingId === itemId) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }

    audioRef.current?.pause()
    audioRef.current = new Audio(audioUrl)
    audioRef.current.onended = () => setPlayingId(null)
    audioRef.current.play()

    setPlayingId(itemId)
  }

  /* -------------------- Loading / Empty -------------------- */
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!practice) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Practice not found</h2>
        <Button asChild className="mt-4">
          <Link to="/admin/practices">Back to List</Link>
        </Button>
      </div>
    )
  }

  /* -------------------- Render -------------------- */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-10"
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{practice.title}</h1>
              <Badge variant={practice.isActive ? 'default' : 'destructive'}>
                {practice.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {practice.description}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpenSettings(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button onClick={() => setOpenAdd(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<Layers className="text-primary" />}
            label="Total Items"
            value={practice.items?.length || 0}
          />
          <StatCard
            icon={<TrendingUp className="text-blue-500" />}
            label="Usage Count"
            value={practice.usageCount}
          />
          <StatCard
            icon={<Music className="text-orange-500" />}
            label="Course"
            value={practice.course?.title || 'N/A'}
            isSmall
          />
        </div>

        {/* Items */}
        <Card className="border-none shadow-sm bg-card/50">
          <CardHeader className="flex-row items-center justify-between border-b">
            <CardTitle>Practice Content</CardTitle>
            <span className="text-xs text-muted-foreground italic">
              Click to play pronunciation
            </span>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {practice.items?.map((item:PracticeItem, i:number) => {
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="relative group"
                  >
                    {/* Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-2 top-2 z-10 p-1 rounded-full bg-background shadow opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditItem(item)
                            setOpenEdit(true)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setDeleteItemId(item._id)
                            setOpenDelete(true)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Card */}
                    <div
                      onClick={() =>
                        item.audioUrl &&
                        handlePlayAudio(item.audioUrl, item._id)
                      }
                      className="cursor-pointer aspect-square rounded-2xl border bg-muted/30 hover:bg-muted/60 p-4 flex flex-col items-center justify-center text-center"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          className="h-16 w-16 rounded-xl object-cover mb-2 bg-white"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                          <span className="text-3xl font-bold text-primary">
                            {item.pronunciation}
                          </span>
                        </div>
                      )}

                      <h3 className="text-2xl font-extrabold">{item.content}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.content}
                      </p>

                      {item.audioUrl && (
                        <div className="mt-2">
                          {playingId === item._id ? (
                            <Pause className="h-4 w-4 text-primary" />
                          ) : (
                            <Volume2 className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {!practice.items?.length && (
                <div className="col-span-full py-20 text-center">
                  <Plus className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No items yet. Add your first one.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date(practice.updatedAt), 'PPP p')}
        </div>
      </div>

      {/* Dialogs */}
      <PracticeItemDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        defaultPracticeId={practice._id}
        onSuccess={refetch}
      />

      <UpdatePracticeDialog
        open={openSettings}
        onOpenChange={setOpenSettings}
        practice={practice}
        onSuccess={refetch}
      />

      <PracticeItemUpdateDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        practiceId={practice._id}
        item={editItem}
        onSuccess={refetch}
      />

      <PracticeItemDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        practiceId={practice._id}
        itemId={deleteItemId}
        onSuccess={refetch}
      />
    </motion.div>
  )
}

/* -------------------- Stat Card -------------------- */
interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  isSmall?: boolean
}

const StatCard = ({ icon, label, value, isSmall }: StatCardProps) => (
  <Card>
    <CardContent className="pt-6 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-muted">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p
          className={
            isSmall
              ? 'text-lg font-semibold truncate max-w-[150px]'
              : 'text-2xl font-bold'
          }
        >
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
)

export default ViewPracticePage
