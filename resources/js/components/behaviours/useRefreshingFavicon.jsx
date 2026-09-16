import { useEffect } from "react";

/**
 * Keeps the browser-tab icon pointed at the supplied image and refreshes it
 * at the requested interval. A changing query parameter bypasses favicon
 * caching in Chrome, Edge, Firefox, and Safari.
 */
export default function useRefreshingFavicon(
  iconUrl,
  refreshInterval = 5_000,
) {
  useEffect(() => {
    if (typeof document === "undefined" || !iconUrl) return undefined;

    const head = document.head;
    const selectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="alternate icon"]',
    ];
    const existingIcons = selectors.flatMap((selector) =>
      Array.from(head.querySelectorAll(selector)),
    );
    const previousIcons = existingIcons.map((node) => ({
      node,
      parent: node.parentNode,
      nextSibling: node.nextSibling,
    }));

    // Avoid competing favicon declarations while this component is mounted.
    existingIcons.forEach((node) => node.remove());

    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.dataset.raymochFavicon = "true";
    head.appendChild(icon);

    // `shortcut icon` helps older browser engines that still prefer it.
    const shortcutIcon = document.createElement("link");
    shortcutIcon.rel = "shortcut icon";
    shortcutIcon.type = "image/svg+xml";
    shortcutIcon.dataset.raymochFavicon = "true";
    head.appendChild(shortcutIcon);

    const refresh = () => {
      const separator = iconUrl.includes("?") ? "&" : "?";
      const refreshedUrl = `${iconUrl}${separator}faviconRevision=${Date.now()}`;
      icon.href = refreshedUrl;
      shortcutIcon.href = refreshedUrl;
    };

    refresh();
    const intervalId = window.setInterval(refresh, refreshInterval);

    return () => {
      window.clearInterval(intervalId);
      icon.remove();
      shortcutIcon.remove();

      // Restore favicon declarations owned by the page before this hook ran.
      previousIcons.forEach(({ node, parent, nextSibling }) => {
        if (!parent) return;
        if (nextSibling?.parentNode === parent) {
          parent.insertBefore(node, nextSibling);
        } else {
          parent.appendChild(node);
        }
      });
    };
  }, [iconUrl, refreshInterval]);
}
