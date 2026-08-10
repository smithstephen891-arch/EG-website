"use client";

import { useCallback, useState } from "react";
import { VAN_SHARE_URL, canNativeShare, nativeShare } from "@/lib/van-share";

/**
 * The copy/share behaviour behind every share control on the van page, in one
 * place for the same reason the URLs are: the compact row under the hero video
 * and the full section at the bottom of the page must never disagree about what
 * "share" actually does.
 */
export function useShareLink(url: string = VAN_SHARE_URL) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, [url]);

  // Never gated on navigator.share at render time: it is undefined during the
  // server render and would mismatch on hydration. Desktop browsers without a
  // share sheet fall back to copying the link.
  const shareOrCopy = useCallback(async () => {
    if (canNativeShare()) {
      await nativeShare(url);
      return;
    }
    await copyLink();
  }, [url, copyLink]);

  return { url, copied, copyLink, shareOrCopy };
}
