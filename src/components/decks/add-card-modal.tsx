"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
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
import { createCardAction } from "@/actions/cards";
import {
  createCardSchema,
  type CreateCardInput,
} from "@/lib/schemas/cards";

interface AddCardModalProps {
  deckId: number;
  variant?: "default" | "empty-state";
}

export function AddCardModal({ deckId, variant = "default" }: AddCardModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCardInput>({
    resolver: zodResolver(createCardSchema),
    defaultValues: { front: "", back: "" },
  });

  async function onSubmit(data: CreateCardInput) {
    try {
      await createCardAction(deckId, data);
      reset();
      setOpen(false);
      toast.success("Card added successfully!");
    } catch {
      // keep modal open so user can retry
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    setOpen(nextOpen);
  }

  return (
    <>
      {variant === "empty-state" ? (
        <Button
          className="mt-6 cursor-pointer gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add your first card
        </Button>
      ) : (
        <Button className="cursor-pointer gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add new card</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Front */}
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

            {/* Back */}
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
                  <Plus className="h-4 w-4" />
                )}
                {isSubmitting ? "Adding…" : "Add card"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
