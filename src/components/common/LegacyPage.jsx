import { useEffect, useMemo, useRef } from 'react';

const localPageMap = new Map([
  ['index.html', '/'],
  ['./index.html', '/'],
  ['brand.html', '/brand'],
  ['./brand.html', '/brand'],
  ['form.html', '/form'],
  ['./form.html', '/form'],
  ['termsandconditions.html', '/terms'],
  ['./termsandconditions.html', '/terms'],
]);

function extractTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'NexUp';
}

function extractHeadStyles(html) {
  return [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
}

function extractBody(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
  return body
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<div\b[^>]*class="mobile-menu[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div\b[^>]*class="mobile-menu-backdrop[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
}

function extractScripts(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((m) => ({
    attrs: m[1],
    code: m[2],
    src: m[1].match(/\bsrc=["']([^"']+)["']/i)?.[1],
  }));
}

function normalizeHtml(html) {
  return html
    .replaceAll('./Public/photos/', '/photos/')
    .replaceAll('Public/photos/', '/photos/')
    .replace(/\bhref=["']([^"']+)["']/gi, (match, href) => {
      const normalized = localPageMap.get(href);
      return normalized ? `href="${normalized}"` : match;
    });
}

function appendScript(script) {
  return new Promise((resolve, reject) => {
    if (script.src && document.querySelector(`script[src="${script.src}"]`)) {
      resolve();
      return;
    }

    const node = document.createElement('script');
    node.dataset.legacyPageScript = 'true';

    if (script.src) {
      node.src = script.src;
      node.async = false;
      node.onload = resolve;
      node.onerror = reject;
    } else {
      node.textContent = script.code;
      resolve();
    }

    document.body.appendChild(node);
  });
}

async function ensureLenis() {
  if (window.Lenis) return;
  await appendScript({ src: 'https://unpkg.com/lenis@1.1.16/dist/lenis.min.js' });
}

function isAnalyticsScript(script) {
  return script.src?.includes('googletagmanager.com') || script.code.includes("gtag('config'");
}

function isLenisBootScript(script) {
  return script.src?.includes('lenis') || script.code.includes('new Lenis');
}

export default function HtmlPage({ html, css = '', onNavigate }) {
  const hostRef = useRef(null);

  const page = useMemo(() => {
    const normalized = normalizeHtml(html);
    return {
      body: normalizeHtml(extractBody(html)),
      scripts: extractScripts(normalized),
      styles: `${css}\n${extractHeadStyles(html)}`,
      title: extractTitle(html),
    };
  }, [html, css]);

  useEffect(() => {
    document.title = page.title;
    document.body.className = '';
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');

    const style = document.createElement('style');
    style.dataset.legacyPageStyle = 'true';
    style.textContent = page.styles;
    document.head.appendChild(style);

    let lenis;
    let rafId;
    let cancelled = false;

    const run = async () => {
      try {
        if (page.scripts.some(isLenisBootScript)) {
          try {
            await ensureLenis();
          } catch (error) {
            console.warn('Lenis failed to load; continuing without smooth scroll.', error);
          }

          if (!cancelled && window.Lenis) {
            window.lenis = lenis = new window.Lenis({
              duration: 1.1,
              smoothWheel: true,
              touchMultiplier: 1,
            });

            const raf = (time) => {
              lenis?.raf(time);
              rafId = requestAnimationFrame(raf);
            };
            rafId = requestAnimationFrame(raf);

            // Handle initial load hash scroll
            const hash = window.location.hash;
            if (hash) {
              const el = document.querySelector(hash);
              if (el) {
                setTimeout(() => {
                  const navHeight = document.querySelector('nav')?.offsetHeight || 64;
                  lenis.scrollTo(el, {
                    offset: -navHeight,
                    immediate: true,
                  });
                }, 200);
              }
            }
          }
        }

        const inlineScripts = [];

        for (const script of page.scripts) {
          if (cancelled || isAnalyticsScript(script) || isLenisBootScript(script)) continue;
          if (script.src) {
            await appendScript(script);
          } else if (script.code.trim()) {
            inlineScripts.push(script.code);
          }
        }

        if (!cancelled && inlineScripts.length) {
          await appendScript({
            code: `(function(){\n${inlineScripts.join('\n')}\n})();`,
          });
          document.dispatchEvent(new Event('DOMContentLoaded'));
        }
      } catch (error) {
        console.error('Legacy page script failed:', error);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy?.();
      if (window.lenis === lenis) {
        window.lenis = null;
      }
      style.remove();
      document.body.className = '';
      document.querySelectorAll('script[data-legacy-page-script="true"]').forEach((script) => {
        if (!script.src.includes('firebase') && !script.src.includes('lenis')) script.remove();
      });
    };
  }, [page]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const onClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link || !host.contains(link)) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      if (!href.startsWith('/')) return;

      event.preventDefault();
      onNavigate?.(href);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    host.addEventListener('click', onClick);
    return () => host.removeEventListener('click', onClick);
  }, [onNavigate]);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('nav')?.offsetHeight || 64;
        if (window.lenis) {
          window.lenis.scrollTo(target, {
            offset: -navHeight,
            duration: 1.1,
          });
        } else {
          const rect = target.getBoundingClientRect();
          const targetY = rect.top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return <div className="public-landing" ref={hostRef} dangerouslySetInnerHTML={{ __html: page.body }} />;
}
