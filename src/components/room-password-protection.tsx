"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const pinSchema = z.object({
  pin: z.string().min(1, {
    message: "PIN is required.",
  }),
});

interface RoomPasswordProtectionProps {
  roomCode: string;
  roomName: string;
  hasPin: boolean;
  children: React.ReactNode;
}

export function RoomPasswordProtection({
  roomCode,
  roomName,
  hasPin,
  children,
}: Readonly<RoomPasswordProtectionProps>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    // Check if user already has access cookie
    const checkAccess = async () => {
      try {
        // If room doesn't have a PIN, allow immediate access
        if (!hasPin) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check if user has valid access cookie
        const response = await fetch(`/api/rooms/${roomCode}/check-access`, {
          method: "GET",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [roomCode, hasPin]);

  const onSubmit = async (values: z.infer<typeof pinSchema>) => {
    try {
      const response = await fetch(`/api/rooms/${roomCode}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: values.pin.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        toast.success("Access granted!");
        router.refresh(); // Refresh to update the room data
      } else {
        toast.error(data.error || "Invalid PIN");
        form.reset(); // Clear the form on error
        form.setFocus("pin"); // Refocus the PIN input
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("Failed to verify PIN");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="container mx-auto max-w-md p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      </main>
    );
  }

  // Show PIN entry dialog if not authenticated
  if (!isAuthenticated && hasPin) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl">Protected Room</DialogTitle>
            <DialogDescription className="break-all">
              <strong>{roomName}</strong>
              <br />
              Room Code: {roomCode}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Room PIN</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPin ? "text" : "password"}
                          placeholder="Room PIN"
                          className="pr-10"
                          autoFocus
                          disabled={form.formState.isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPin(!showPin)}
                          disabled={form.formState.isSubmitting}
                        >
                          {showPin ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={
                  form.formState.isSubmitting || !form.watch("pin")?.trim()
                }
              >
                {form.formState.isSubmitting ? "Verifying..." : "Enter Room"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="text-sm"
            >
              Back to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render the room content if authenticated or room has no PIN
  return <>{children}</>;
}
