import Image from "next/image";
import { BackToTop } from "@/components/back-to-top";
import { PortfolioCarousel } from "@/components/portfolio-carousel";
import { ScrollRevealObserver } from "@/components/scroll-reveal-observer";
import { NeonCarouselHeroArt } from "@/components/neon-carousel-hero-art";
import { ThemeToggle } from "@/components/theme-toggle";

const processSteps = [
  { title: "Listen", description: "Understand the people, product goals, and real conditions around the problem.", artifact: "Research notes" },
  { title: "Define", description: "Turn what we learn into clear journeys, priorities, and a useful design direction.", artifact: "Flow and scope" },
  { title: "Explore", description: "Try ideas through wireframes, interface studies, and interactive prototypes.", artifact: "Testable prototype" },
  { title: "Validate", description: "Check the experience against feedback, accessibility needs, and product constraints.", artifact: "Refined journeys" },
  { title: "Deliver", description: "Document the details and work with developers through handoff and implementation.", artifact: "Ready-to-build UI" },
];

const skillGroups = [
  { title: "Research & strategy", items: ["User research", "UX strategy", "Journey mapping", "Information architecture", "Accessibility"] },
  { title: "Product design", items: ["Interaction design", "Wireframing", "Prototyping", "Design systems", "Responsive UI", "Developer handoff"] },
  { title: "Tools", items: ["Figma", "FigJam", "Photoshop", "Illustrator", "Cursor AI", "ChatGPT", "Claude AI", "Lovable"] },
];

const experience = [
  { date: "2025 — Present", company: "Develop X", role: "UI/UX Designer", place: "Ho Chi Minh City" },
  { date: "2021 — 2025", company: "360 Digital", role: "UI/UX Designer", place: "Product design · travel and hospitality" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hswele-ehin-tse-587b17258/" },
  { label: "Telegram", href: "https://t.me/hswele18" },
];

function Spark() {
  return <svg className="spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1.8 7.1 4.9 10.2 12 12-7.1 1.8-10.2 4.9-12 12C10.2 16.9 7.1 13.8 0 12 7.1 10.2 10.2 7.1 12 0Z" /></svg>;
}

export default function Home() {
  return (
    <>
      <ScrollRevealObserver />
      <header className="site-header" id="top">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="Hswele Ehin Tse home">
            <Spark />
            <span>Hswele Ehin Tse</span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-work" href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#about">About</a>
            <a className="talk-link" href="#contact">Let&apos;s talk <span aria-hidden="true">↗</span></a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-stars" aria-hidden="true" />
          <div className="page-wrap hero-grid">
            <div className="hero-copy" data-reveal="left">
              <Image className="orbit-art" src="/images/golden-star-orbit-arc.png" alt="" width={1484} height={1060} priority aria-hidden="true" />
              <p className="eyebrow hero-kicker"><span className="availability-dot" /> UI/UX &amp; product designer <span>· Bangkok, Thailand</span></p>
              <h1 id="hero-title">I make complex digital products feel <em>clear.</em></h1>
              <p className="hero-lead">Thoughtful, production-ready experiences across retail, fitness, social, SaaS, travel, and hospitality.</p>
              <div className="hero-actions">
                <a className="button button-outline" href="#work">Explore my work <span aria-hidden="true">↗</span></a>
                <a className="cv-link" href="/cv.pdf" download>Download CV <span aria-hidden="true">↓</span></a>
              </div>
              <div className="hero-stats" aria-label="Experience highlights">
                <div><strong>4+</strong><span>years in product design</span></div>
                <div><strong>80+</strong><span>production screens</span></div>
                <div><strong>120+</strong><span>design components</span></div>
              </div>
            </div>
            <div className="hero-art" data-reveal="right">
              <NeonCarouselHeroArt />
            </div>
          </div>
          <div className="hero-bottom-line" aria-hidden="true"><span /><span /><span /></div>
        </section>

        <div className="scallop" aria-hidden="true" />
        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="page-wrap">
            <div className="section-heading work-heading" data-reveal="up">
              <div>
                <p className="eyebrow section-kicker"><span>01</span> Selected work</p>
                <h2 id="work-title">Pick a <em>project.</em></h2>
              </div>
              <p className="section-intro">A few stops across product design: from retail tools and fitness to social experiences and travel platforms.</p>
            </div>
            <div data-reveal="up"><PortfolioCarousel /></div>
          </div>
        </section>

        <section className="process-section section-space" id="process" aria-labelledby="process-title">
          <div className="page-wrap">
            <div className="section-heading process-heading" data-reveal="up">
              <div>
                <p className="eyebrow section-kicker"><span>02</span> The process</p>
                <h2 id="process-title">From first question to <em>launch.</em></h2>
              </div>
              <p className="section-intro">A clear path keeps the work grounded in people, product goals, and what the team can build.</p>
            </div>
            <ol className="process-list">
              {processSteps.map((step, index) => (
                <li className="process-step" data-reveal="up" data-reveal-order={index + 1} key={step.title}>
                  <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="step-copy"><h3>{step.title}</h3><p>{step.description}</p></div>
                  <span className="step-artifact">{step.artifact}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="about-section section-space" id="about" aria-labelledby="about-title">
          <div className="page-wrap">
            <div className="about-grid">
              <div className="about-intro" data-reveal="left">
                <p className="eyebrow section-kicker"><span>03</span> About</p>
                <h2 id="about-title">Good experiences begin with <em>understanding.</em></h2>
                <div className="about-prose">
                  <p>I&apos;m Hswele Ehin Tse, a UI/UX and product designer based in Bangkok. I design digital products for teams working across retail, fitness, social, travel, and hospitality.</p>
                  <p>My work moves from user journeys and information architecture into interface design, prototypes, and reusable systems. I partner closely with developers so each experience stays clear from the first sketch through implementation.</p>
                </div>
              </div>
              <div className="toolkit" data-reveal="right">
                <p className="eyebrow panel-kicker">Tools of the trade</p>
                {skillGroups.map((group) => (
                  <div className="toolkit-row" key={group.title}>
                    <h3>{group.title}</h3>
                    <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="experience" data-reveal="up">
              <p className="eyebrow panel-kicker">Experience</p>
              <div className="experience-list">
                {experience.map((item) => (
                  <article className="experience-item" key={item.company}>
                    <span className="experience-dot" aria-hidden="true" />
                    <p className="experience-date">{item.date}</p>
                    <div className="experience-role"><h3>{item.role}</h3><p>{item.company} <span>· {item.place}</span></p></div>
                    <span className="experience-arrow" aria-hidden="true">↗</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-stars" aria-hidden="true"><Spark /><Spark /><Spark /></div>
          <div className="page-wrap contact-wrap">
            <div className="contact-kicker" data-reveal="up"><span className="availability-dot" /> Bangkok, Thailand <span>·</span> Open to a conversation</div>
            <div className="contact-main" data-reveal="up">
              <div>
                <p className="eyebrow section-kicker"><span>04</span> Ticket booth</p>
                <h2 id="contact-title">Have a good problem? <em>Let&apos;s talk.</em></h2>
              </div>
              <a className="contact-email" href="mailto:hsweeleehintse@gmail.com">hsweeleehintse@gmail.com <span aria-hidden="true">↗</span></a>
            </div>
            <div className="contact-bottom" data-reveal="up">
              <p>For product design, collaboration, or a thoughtful introduction.</p>
              <div className="social-links">
                {socialLinks.map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}
                <a href="/cv.pdf" download>Download CV <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-wrap footer-inner">
          <a className="footer-brand" href="#top">Hswele Ehin Tse <span>© 2026</span></a>
          <p>Thoughtful design, from first sketch to shipped product.</p>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}
