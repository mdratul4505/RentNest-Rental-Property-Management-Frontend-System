import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  /** Large status code or short label shown at the top, e.g. "404" or "500" */
  code?: string;
  /** Main heading */
  title?: string;
  /** Supporting description text */
  description?: string;
  /** Optional icon override */
  icon?: ReactNode;
  /** Called when the user clicks the retry button. If omitted, the retry button is hidden. */
  onRetry?: () => void;
  /** Destination for the primary "back home" action */
  homeHref?: string;
}

export function ErrorPage({
  code = "500",
  title = "Something went wrong",
  description = "An unexpected error occurred while processing your request. You can try again, or head back to safety.",
  icon,
  onRetry,
  homeHref = "/",
}: ErrorPageProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm">
          {icon ?? <AlertTriangle className="size-7" aria-hidden="true" />}
        </div>

        {code ? (
          <p className="mb-3 font-mono text-sm font-medium tracking-widest text-muted-foreground">
            ERROR {code}
          </p>
        ) : null}

        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {onRetry ? (
            <Button onClick={onRetry} className="w-full sm:w-auto">
              <RotateCcw className="size-4" aria-hidden="true" />
              Try again
            </Button>
          ) : null}

          <Button
            asChild
            variant={onRetry ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            <Link href={homeHref}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
