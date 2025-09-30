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

const uploadSchema = z.object({
  file: z
    .instanceof(File, {
      message: "Please choose an image.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image.",
    }),
});

export function UploadForm({ code }: Readonly<{ code: string }>) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof uploadSchema>) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", values.file);
      fd.append("code", code.toUpperCase());
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast("Uploaded!");
      router.refresh();
      form.reset();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Add a photo</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading || !form.watch("file")}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </Form>
  );
}
