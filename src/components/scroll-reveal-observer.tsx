"use client";

import { useEffect } from "react";

export function ScrollRevealObserver() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const observeTree = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches("[data-reveal]")) observer.observe(node);
      node.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.observe(element));
    };

    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.observe(element));
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach(observeTree);
      }
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
