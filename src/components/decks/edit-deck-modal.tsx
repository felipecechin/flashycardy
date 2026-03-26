"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateDeckAction } from "@/actions/decks";
import { updateDeckSchema, type UpdateDeckInput } from "@/lib/schemas/decks";

interface EditDeckModalProps {
  deckId: number;
  currentName: string;
  currentDescription?: string | null;
}

export function EditDeckModal({
  deckId,
  currentName,
  currentDescription,
}: EditDeckModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateDeckInput>({
    resolver: zodResolver(updateDeckSchema),
    defaultValues: {
      name: currentName,
      description: currentDescription ?? "",
    },
  });

  async function onSubmit(data: UpdateDeckInput) {
    try {
      await updateDeckAction(deckId, data);
      setOpen(false);
      toast.success("Deck updated successfully!");
    } catch {
      toast.error("Failed to update deck. Please try again.");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset({ name: currentName, description: currentDescription ?? "" });
    }
    setOpen(nextOpen);
  }

  return (
    <>
      <Button
        variant="outline"
        className="cursor-pointer gap-2"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit deck</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                placeholder="Deck title…"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description…"
                rows={3}
                className="resize-none"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <DialogFooter showCloseButton>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
