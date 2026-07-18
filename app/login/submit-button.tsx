"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({
  formAction,
  className,
  variant = "default",
  children,
}: {
  formAction: any;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      formAction={formAction}
      className={className}
      variant={variant}
      disabled={pending}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}
