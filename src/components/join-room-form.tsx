"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { addRecentRoom } from "@/lib/recent-rooms";

const joinRoomSchema = z.object({
  code: z.string().min(1, {
    message: "Room code is required.",
  }),
  pin: z.string().optional(),
});

export function JoinRoomForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof joinRoomSchema>>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      code: "",
      pin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof joinRoomSchema>) => {
    const c = values.code.trim().toUpperCase();
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${c}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: values.pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join room");

      // Track this room as joined
      if (data.room?.name) {
        addRecentRoom(c, data.room.name, "joined");
      }

      router.push(`/room/${c}`);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error joining room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-left"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter the 6-digit room code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room PIN (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter PIN if required"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Joining..." : "Join Room"}
        </Button>
      </form>
    </Form>
  );
}
