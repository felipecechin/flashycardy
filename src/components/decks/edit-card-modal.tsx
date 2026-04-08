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
import { updateCardAction } from "@/actions/cards";
import { updateCardSchema, type UpdateCardInput } from "@/lib/schemas/cards";

interface EditCardModalProps {
  cardId: number;
  deckId: number;
  currentFront: string;
  currentBack: string;
}

export function EditCardModal({
  cardId,
  deckId,
  currentFront,
  currentBack,
}: EditCardModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCardInput>({
    resolver: zodResolver(updateCardSchema),
    defaultValues: { front: currentFront, back: currentBack },
  });

  async function onSubmit(data: UpdateCardInput) {
    try {
      await updateCardAction(cardId, deckId, data);
      setOpen(false);
      toast.success("Card updated successfully!");
    } catch {
      toast.error("Failed to update card. Please try again.");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset({ front: currentFront, back: currentBack });
    setOpen(nextOpen);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer h-7 w-7"
        onClick={() => setOpen(true)}
        aria-label="Edit card"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit card</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="front">Front</Label>
              <Input
                id="front"
                placeholder="Question or term…"
                aria-invalid={!!errors.front}
                {...register("front")}
              />
              {errors.front && (
                <p className="text-xs text-destructive">
                  {errors.front.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="back">Back</Label>
              <Textarea
                id="back"
                placeholder="Answer or definition…"
                rows={4}
                className="resize-none"
                aria-invalid={!!errors.back}
                {...register("back")}
              />
              {errors.back && (
                <p className="text-xs text-destructive">
                  {errors.back.message}
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
