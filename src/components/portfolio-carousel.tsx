"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { projects } from "@/lib/projects";

function getOffset(index: number, active: number) {
  let offset = (index - active + projects.length) % projects.length;
  if (offset > projects.length / 2) offset -= projects.length;
  return offset;
}

export function PortfolioCarousel({ onActiveChange }: { onActiveChange?: (index: number) => void }) {
  const [active, setActive] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(-1);
  const [cardSpread, setCardSpread] = useState(300);
  const [autoProgress, setAutoProgress] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const pointerProgressStart = useRef(0);
  const autoProgressRef = useRef(0);
  const pressedPanel = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const dragStep = Math.max(170, cardSpread * 0.72);
  const isAutoSliding = autoplay && !isFocused && !isDragging && inView;
  const dragProgress = isDragging
    ? pointerProgressStart.current + dragOffset / dragStep
    : autoProgress;

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  useEffect(() => {
    const updateCardSpread = () => {
      const viewportWidth = window.innerWidth;
      const spread = viewportWidth <= 700
        ? Math.min(225, Math.max(145, viewportWidth * 0.32))
        : Math.min(310, Math.max(270, viewportWidth * 0.24));
      setCardSpread(spread);
    };
    updateCardSpread();
    window.addEventListener("resize", updateCardSpread);
    return () => window.removeEventListener("resize", updateCardSpread);
  }, []);

  useEffect(() => {
    const prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoplay(!prefersLessMotion);
  }, []);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoSliding) return;
    let frame = 0;
    let previousTime: number | null = null;
    const slideDuration = 6200;

    const advance = (time: number) => {
      if (previousTime === null) previousTime = time;
      const elapsed = Math.min(time - previousTime, 80);
      previousTime = time;

      let nextProgress = autoProgressRef.current + elapsed / slideDuration;
      if (nextProgress >= 1) {
        const slides = Math.floor(nextProgress);
        nextProgress -= slides;
        setSlideDirection(-1);
        setActive((current) => (current - slides + projects.length) % projects.length);
      }

      autoProgressRef.current = nextProgress;
      setAutoProgress(nextProgress);
      frame = window.requestAnimationFrame(advance);
    };

    frame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(frame);
  }, [isAutoSliding]);

  function resetAutoProgress() {
    autoProgressRef.current = 0;
    setAutoProgress(0);
  }

  function selectProject(index: number) {
    const forwardDistance = (index - active + projects.length) % projects.length;
    if (forwardDistance === 0) return;
    resetAutoProgress();
    setSlideDirection(forwardDistance <= projects.length / 2 ? 1 : -1);
    setActive(index);
  }

  function move(amount: number) {
    resetAutoProgress();
    setSlideDirection(amount < 0 ? -1 : 1);
    setActive((current) => (current + amount + projects.length) % projects.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart.current = event.clientX;
    const panel = event.target instanceof HTMLElement ? event.target.closest<HTMLButtonElement>(".case-panel") : null;
    pressedPanel.current = panel ? Number(panel.dataset.projectIndex) : null;
    pointerProgressStart.current = autoProgressRef.current;
    const target = panel ?? event.currentTarget;
    target.setPointerCapture(event.pointerId);
    setDragOffset(0);
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return;
    setDragOffset(event.clientX - pointerStart.current);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) {
      pressedPanel.current = null;
      setDragOffset(0);
      setIsDragging(false);
      return;
    }
    const distance = event.clientX - pointerStart.current;
    const tappedPanel = pressedPanel.current;
    const totalProgress = pointerProgressStart.current + distance / dragStep;
    pointerStart.current = null;
    pressedPanel.current = null;
    setIsDragging(false);
    setDragOffset(0);
    if (Math.abs(distance) > 42) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 250);
      const slideCount = Math.min(projects.length - 1, Math.max(1, Math.round(Math.abs(totalProgress))));
      move(totalProgress < 0 ? slideCount : totalProgress > 0 ? -slideCount : distance < 0 ? slideCount : -slideCount);
    } else if (tappedPanel !== null) {
      selectProject(tappedPanel);
    }
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }

  return (
    <div
      className="carousel-wrap"
      ref={carouselRef}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="carousel-canopy" aria-hidden="true">
        <svg viewBox="0 0 420 120" preserveAspectRatio="none">
          <path d="M210 8 18 101h384L210 8Z" fill="#f7c9d0" />
          <path d="M210 8 82 101h78L210 8Zm0 0 62 93h78L210 8Z" fill="#fff1e6" />
          <path d="M210 8 18 101h384L210 8Z" fill="none" stroke="#c9973f" strokeWidth="3" />
          <path d="M18 101h384" stroke="#c9973f" strokeWidth="5" />
          {Array.from({ length: 11 }, (_, index) => (
            <circle key={index} cx={25 + index * 37} cy="105" r="9" fill="#fff1e6" stroke="#c9973f" strokeWidth="2" />
          ))}
          {Array.from({ length: 11 }, (_, index) => (
            <circle key={index} cx={25 + index * 37} cy="104" r="2.5" fill="#c9973f" />
          ))}
        </svg>
      </div>

      <div className="carousel-stage">
        <span className="carousel-pole" aria-hidden="true" />
        <div
          className={`carousel-scene${isDragging ? " is-dragging" : ""}${
            isAutoSliding ? " is-auto-sliding" : ""
          }`}
          role="region"
          aria-label="Selected project carousel"
          tabIndex={0}
          style={{ "--card-spread": `${cardSpread}px` } as CSSProperties}
          onKeyDown={handleKeyDown}
          onClickCapture={handleClickCapture}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStart.current = null; pressedPanel.current = null; setDragOffset(0); setIsDragging(false); }}
          onDragStartCapture={(event) => event.preventDefault()}
        >
          <div className="carousel-ring">
            {projects.map((item, index) => {
              const offset = getOffset(index, active);
              const orbitOffset = offset + dragProgress;
              const angle = orbitOffset * ((Math.PI * 2) / projects.length);
              const facing = Math.cos(angle);
              const nearestSlot = Math.round(orbitOffset);
              const movementDirection = isAutoSliding
                ? -1
                : isDragging && dragOffset !== 0
                  ? dragOffset < 0 ? 1 : -1
                  : slideDirection;
              const isFrontSlot = offset === 0 || offset === movementDirection;
              const opacity = isFrontSlot ? 1 : 0.1;
              const position = nearestSlot === 0
                ? "front"
                : nearestSlot === -1
                  ? "left"
                  : nearestSlot === 1
                    ? "right"
                    : slideDirection > 0 ? "away-right" : "away-left";
              const isAway = !isFrontSlot;
              const panelX = Math.sin(angle) * cardSpread * 0.86;
              const panelY = Math.sin(angle) * 12;
              const panelZ = 55 + facing * 55;
              const panelYaw = -Math.sin(angle) * (Math.PI / 4);
              const panelScale = 0.8 + Math.max(0, facing) * 0.2;
              const cardStyle = {
                "--case-color": item.color,
                transform: `translateX(calc(-50% + ${panelX}px)) translateY(${panelY}px) translateZ(${panelZ}px) rotateY(${panelYaw}rad) scale(${panelScale})`,
                opacity,
                zIndex: Math.round(50 + facing * 50),
                pointerEvents: isAway ? "none" : "auto",
              } as CSSProperties;
              return (
                <button
                  className={`case-panel case-panel--${position}`}
                  key={item.name}
                  style={cardStyle}
                  type="button"
                  data-project-index={index}
                  aria-label={`Show ${item.name} case study`}
                  aria-pressed={index === active}
                  aria-hidden={isAway}
                  tabIndex={isAway ? -1 : 0}
                  onClick={() => selectProject(index)}
                >
                  <span className="case-tag">{item.category}</span>
                  <span className="case-art">
                    <Image
                      src={item.image}
                      alt=""
                      draggable={false}
                      width={item.imageWidth}
                      height={item.imageHeight}
                      sizes="(max-width: 700px) 56vw, 240px"
                    />
                  </span>
                  <span className="case-name">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="carousel-floor" aria-hidden="true"><span /></div>
      </div>

      <div className="carousel-controls" role="group" aria-label="Carousel controls">
        <button className="round-control" type="button" onClick={() => move(-1)} aria-label="Previous case study">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <div className="carousel-dots" role="group" aria-label="Choose a case study">
          {projects.map((item, index) => (
            <button
              className="carousel-dot"
              key={item.name}
              type="button"
              aria-label={`Show ${item.name}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => selectProject(index)}
            />
          ))}
        </div>
        <button className="round-control" type="button" onClick={() => move(1)} aria-label="Next case study">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>

      <p className="eyebrow ticket-label" aria-live="polite">
        Case study {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
      </p>
    </div>
  );
}

export function PortfolioProjectTicket({ projectIndex }: { projectIndex: number }) {
  const active = Math.min(projects.length - 1, Math.max(0, projectIndex));
  const project = projects[active];

  return (
    <article className="project-ticket" data-reveal="ticket" aria-live="polite" key={project.name}>
      <div className="ticket-main">
        <p className="ticket-meta">{project.category}</p>
        <h3>{project.name}</h3>
        <p className="ticket-summary">{project.summary}</p>
        <ul className="ticket-highlights">
          {project.highlights.map((highlight) => <li key={highlight}><strong>{highlight}</strong></li>)}
        </ul>
        <a className="ticket-link" href="#contact">Ask about this project <span aria-hidden="true">↗</span></a>
      </div>
      <aside className="ticket-stub" aria-label={`${project.name} project details`}>
        <div className="admit-row"><span>Admit one</span><span>No. {String(active + 1).padStart(3, "0")}</span></div>
        <dl>
          <div><dt>Role</dt><dd>UI/UX Designer</dd></div>
          <div><dt>Focus</dt><dd>{project.focus}</dd></div>
          <div><dt>Tools and methods</dt><dd><ul className="tool-chips">{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></dd></div>
        </dl>
        <div className="ticket-barcode" aria-hidden="true" />
      </aside>
    </article>
  );
}
