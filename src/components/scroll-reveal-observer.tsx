"use client";

import { useEffect } from "react";

export function ScrollRevealObserver() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const stage = root.querySelector<HTMLElement>(".hero-scroll-stage");
    const hero = stage?.querySelector<HTMLElement>(".hero");
    const workSection = stage?.querySelector<HTMLElement>(".work-section");
    const scrollDistanceProbe = stage?.querySelector<HTMLElement>(".hero-scroll-distance-probe");
    let scrollFrame = 0;
    let stageTop = 0;
    let heroHeight = 0;
    let scrollDistance = 1;
    let releaseAt = 0;

    const measureHeroTransition = () => {
      if (!stage || !hero || !workSection) return;
      stageTop = stage.getBoundingClientRect().top + window.scrollY;
      heroHeight = hero.offsetHeight;
      scrollDistance = Math.max(1, scrollDistanceProbe?.offsetHeight || 0, heroHeight);
      stage.style.setProperty("--hero-scroll-distance", `${scrollDistance}px`);

      const headerHeight = Number.parseFloat(getComputedStyle(stage).getPropertyValue("--header-height")) || 0;
      releaseAt = stageTop + stage.offsetHeight - workSection.offsetHeight - headerHeight;
    };

    const updateHeroTransition = () => {
      if (!stage || !hero || !workSection) return;
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        const scrollY = window.scrollY;
        const scrolledIntoStage = Math.max(0, scrollY - stageTop);
        if (reducedMotion.matches) {
          stage.style.removeProperty("--hero-scroll-offset");
        } else {
          const progress = Math.min(1, scrolledIntoStage / scrollDistance);
          const offset = scrolledIntoStage - heroHeight * progress;
          stage.style.setProperty("--hero-scroll-offset", `${offset}px`);
        }

        if (reducedMotion.matches) {
          workSection.classList.toggle("is-released", scrollY >= releaseAt);
        } else {
          workSection.classList.remove("is-released");
        }
      });
    };

    const syncLayout = () => {
      measureHeroTransition();
      updateHeroTransition();
    };

    window.addEventListener("scroll", updateHeroTransition, { passive: true });
    window.addEventListener("resize", syncLayout);
    reducedMotion.addEventListener("change", syncLayout);
    const heroResizeObserver = hero && "ResizeObserver" in window ? new ResizeObserver(syncLayout) : null;
    if (hero) heroResizeObserver?.observe(hero);
    syncLayout();

    let observer: IntersectionObserver | null = null;
    let mutations: MutationObserver | null = null;
    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      root.classList.add("reveal-ready");
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );

      const observeTree = (node: Node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches("[data-reveal]")) observer?.observe(node);
        node.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer?.observe(element));
      };

      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer?.observe(element));
      mutations = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach(observeTree);
        }
      });
      mutations.observe(root, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener("scroll", updateHeroTransition);
      window.removeEventListener("resize", syncLayout);
      reducedMotion.removeEventListener("change", syncLayout);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      heroResizeObserver?.disconnect();
      mutations?.disconnect();
      observer?.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
