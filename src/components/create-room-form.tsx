"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addRecentRoom } from "@/lib/recent-rooms";

const createRoomSchema = z.object({
  name: z.string().min(1, {
    message: "Room name is required.",
  }),
  pin: z.string().optional(),
  expiresInMinutes: z.number().min(1).max(1440),
});

export function CreateRoomForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      pin: "",
      expiresInMinutes: 120,
    },
  });

  const onSubmit = async (values: z.infer<typeof createRoomSchema>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create room");

      // Immediately join to set cookie if there is a pin
      await fetch(`/api/rooms/${data.code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: values.pin }),
      });

      // Track this room as created
      addRecentRoom(data.code, values.name, "created");

      router.push(`/room/${data.code}`);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error creating room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter a name for your room" {...field} />
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
                  placeholder="Set a PIN for additional security"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresInMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Time (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Duration in minutes (1-1440)"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Room"}
        </Button>
      </form>
    </Form>
  );
}
