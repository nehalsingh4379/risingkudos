"use client";

const items = [
  {
    label: "Google",
    href: "https://google.com",
    svg: (
      <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
      </svg>
    ),
  },
  {
    label: "Slack",
    href: "https://slack.com",
    svg: (
      <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path fill="#E01E5A" d="M18 6a4 4 0 1 0 0 8h4V10a4 4 0 0 0-4-4zm0 10H6a4 4 0 0 0 0 8h12V16z"/>
        <path fill="#36C5F0" d="M42 20a4 4 0 1 0-8 0v4h4a4 4 0 0 0 4-4zm-10 0V8a4 4 0 1 0-8 0v12h8z"/>
        <path fill="#2EB67D" d="M30 42a4 4 0 1 0 0-8h-4v4a4 4 0 0 0 4 4zm0-10h12a4 4 0 0 0 0-8H30v8z"/>
        <path fill="#ECB22E" d="M6 28a4 4 0 1 0 8 0v-4H10a4 4 0 0 0-4 4zm10 0v12a4 4 0 1 0 8 0V28h-8z"/>
      </svg>
    ),
  },
  {
    label: "Figma",
    href: "https://figma.com",
    svg: (
      <svg viewBox="0 0 38 57" className="h-5 w-4 shrink-0" aria-hidden="true">
        <path fill="#1ABCFE" d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z"/>
        <path fill="#0ACF83" d="M9.5 57A9.5 9.5 0 0 1 9.5 38H19v9.5A9.5 9.5 0 0 1 9.5 57z"/>
        <path fill="#FF7262" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"/>
        <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z"/>
        <path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19V0z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02 0 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.com",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="#5865F2" aria-hidden="true">
        <path d="M20.32 4.37A19.8 19.8 0 0 0 15.36 3c-.22.4-.48.93-.65 1.35a18.3 18.3 0 0 0-5.41 0C9.12 3.93 8.85 3.4 8.63 3A19.74 19.74 0 0 0 3.67 4.37C.53 9.19-.32 13.88.1 18.5a19.9 19.9 0 0 0 6.07 3.08 15 15 0 0 0 1.3-2.12 13 13 0 0 1-2.04-.98c.17-.12.34-.25.5-.38a14.17 14.17 0 0 0 12.13 0c.16.13.33.26.5.38-.65.39-1.33.72-2.05.98a15 15 0 0 0 1.3 2.12 19.85 19.85 0 0 0 6.07-3.08c.5-5.28-.85-9.87-3.56-13.13zM8.01 15.64c-1.16 0-2.12-1.07-2.12-2.38s.93-2.38 2.12-2.38c1.18 0 2.14 1.07 2.12 2.38 0 1.31-.94 2.38-2.12 2.38zm7.98 0c-1.16 0-2.12-1.07-2.12-2.38s.93-2.38 2.12-2.38c1.18 0 2.14 1.07 2.12 2.38 0 1.31-.93 2.38-2.12 2.38z"/>
      </svg>
    ),
  },
];

export default function LogoTicker() {
  return (
    <div className="mx-auto mt-12 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/40 bg-white/30 py-4 backdrop-blur-md shadow-sm">
      <div className="flex w-max animate-marquee items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {items.map(({ svg, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-10 text-ink-soft transition-opacity hover:opacity-70"
              >
                {svg}
                <span className="font-sans text-[13px] font-bold uppercase tracking-[0.12em]">
                  {label}
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
