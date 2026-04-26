"use client";

import { FourDotsLoader } from "./FourDotsLoader";

export function AdminLoadingState({ message }: { message?: string }) {
  return (
    <div className="flex w-full min-h-[min(280px,45vh)] flex-col items-center justify-center gap-4 py-16">
      <FourDotsLoader />
      {message ? <p className="text-center text-sm text-neutral-500">{message}</p> : null}
    </div>
  );
}
