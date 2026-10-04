"use client";

import { useState } from "react";

export function Avatar({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-line-strong bg-surface-2 sm:size-20">
      {src && !failed ? (
        // External avatar hosts vary (S3, CDN, aliyun); a plain <img> avoids
        // maintaining an allowlist for next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-brand/30 to-brand-2/20 font-mono text-lg font-semibold text-ink">
          {initials}
        </div>
      )}
    </div>
  );
}
