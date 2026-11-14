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

export function PortfolioCarousel() {
  const [active, setActive] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [autoplay, setAutoplay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const pressedPanel = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const project = projects[active];

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
    if (!autoplay || isHovered || isFocused || isDragging || !inView) return;
    const timer = window.setInterval(() => {
      setSlideDirection(1);
      setActive((current) => (current + 1) % projects.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [autoplay, isHovered, isFocused, isDragging, inView]);

  function selectProject(index: number) {
    const forwardDistance = (index - active + projects.length) % projects.length;
    if (forwardDistance === 0) return;
    setSlideDirection(forwardDistance <= projects.length / 2 ? 1 : -1);
    setActive(index);
  }

  function move(amount: number) {
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
    pointerStart.current = null;
    pressedPanel.current = null;
    setIsDragging(false);
    setDragOffset(0);
    if (Math.abs(distance) > 42) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 250);
      const slideCount = Math.min(projects.length - 1, Math.max(1, Math.round(Math.abs(distance) / 210)));
      move(distance < 0 ? slideCount : -slideCount);
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
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
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
          className={`carousel-scene${isDragging ? " is-dragging" : ""}`}
          role="region"
          aria-label="Selected project carousel"
          tabIndex={0}
          style={{ "--drag-offset": `${dragOffset}px` } as CSSProperties}
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
              const position = offset === 0
                ? "front"
                : offset === -1
                  ? "left"
                  : offset === 1
                    ? "right"
                    : slideDirection > 0 ? "away-right" : "away-left";
              const isAway = position.startsWith("away");
              const cardStyle = { "--case-color": item.color } as CSSProperties;
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
    </div>
  );
}
