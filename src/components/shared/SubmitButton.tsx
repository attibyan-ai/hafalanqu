"use client";

import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends ButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ children, isLoading, disabled, ...props }: SubmitButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
