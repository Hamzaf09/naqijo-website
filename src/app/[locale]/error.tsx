"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/report-error";

/**
 * Route-level error boundary for the public site. Keeps the chrome (header +
 * footer from the layout) and shows a calm recovery screen with a retry.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { digest: error.digest });
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1240px] flex-col items-center justify-center px-5 py-24 text-center">
      <span className="font-display text-6xl font-extrabold text-gold">!</span>
      <h1 className="mt-6 font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-fg">
        حدث خطأ ما · Something went wrong
      </h1>
      <p className="mt-4 max-w-[46ch] text-fg-muted">
        نعتذر، حدث خطأ غير متوقع. حاول مرة أخرى.
        <br />
        Sorry — an unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-primary px-7 font-semibold text-primary-fg transition-colors hover:bg-[var(--primary-hover)]"
      >
        إعادة المحاولة · Try again
      </button>
    </section>
  );
}
