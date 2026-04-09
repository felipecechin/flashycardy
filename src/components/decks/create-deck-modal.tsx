"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
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
import { createDeckAction } from "@/actions/decks";
import { createDeckSchema, type CreateDeckInput } from "@/lib/schemas/decks";

interface CreateDeckModalProps {
  trigger?: React.ReactNode;
  deckCount?: number;
}

export function CreateDeckModal({ trigger, deckCount = 0 }: CreateDeckModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDeckInput>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(data: CreateDeckInput) {
    try {
      await createDeckAction(data);
      setOpen(false);
      reset();
      toast.success("Deck created!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "DECK_LIMIT_REACHED") {
        toast.error("You've reached the 3-deck limit. Upgrade to Pro for unlimited decks.");
      } else {
        toast.error("Failed to create deck. Please try again.");
      }
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    setOpen(nextOpen);
  }

  const upgradeButton = trigger ? (
    <Link href="/pricing">{trigger}</Link>
  ) : (
    <Link href="/pricing">
      <Button className="cursor-pointer gap-2" variant="outline">
        <Lock className="h-4 w-4" />
        Upgrade to Pro
      </Button>
    </Link>
  );

  const createButton = trigger ? (
    <span onClick={() => setOpen(true)}>{trigger}</span>
  ) : (
    <Button className="cursor-pointer gap-2" onClick={() => setOpen(true)}>
      <Plus className="h-4 w-4" />
      New Deck
    </Button>
  );

  return (
    <>
      <Show
        when={{ feature: "3_deck_limit" }}
        fallback={createButton}
      >
        {deckCount >= 3 ? upgradeButton : createButton}
      </Show>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new deck</DialogTitle>
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
                  <Plus className="h-4 w-4" />
                )}
                {isSubmitting ? "Creating…" : "Create deck"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
