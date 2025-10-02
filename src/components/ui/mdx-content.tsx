"use client";

interface ProseContentProps {
  children: React.ReactNode;
}

export function ProseContent({ children }: Readonly<ProseContentProps>) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-li:text-foreground prose-ul:space-y-1">
      {children}
    </div>
  );
}
