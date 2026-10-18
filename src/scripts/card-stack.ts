const sign = (depth: number) => (depth === 0 ? 0 : depth % 2 ? 1 : -1);

const readDuration = (el: HTMLElement) => {
  const value = getComputedStyle(el).getPropertyValue('--stack-duration').trim();
  return value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000;
};

export function initCardStack(root: HTMLElement) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-card]'));
  const total = cards.length;
  if (total < 2) return;

  const stack = root.querySelector<HTMLElement>('[data-stack]') ?? root;
  const status = root.querySelector<HTMLElement>('[data-stack-status]');
  const interval = Number(root.dataset.interval ?? 0);

  let active = Number(root.dataset.index ?? 0);
  let busy = false;
  let timer: number | undefined;
  let inView = true;
  let hovering = false;
  let touching = false;
  let focusWithin = false;

  const render = () => {
    cards.forEach((card, i) => {
      const depth = (i - active + total) % total;
      card.style.setProperty('--d', String(depth));
      card.style.setProperty('--k', String(sign(depth)));
      card.toggleAttribute('data-active', depth === 0);
      card.setAttribute('aria-hidden', String(depth !== 0));
    });
    root.dataset.index = String(active);
  };

  const stop = () => window.clearTimeout(timer);

  const schedule = () => {
    stop();
    const canRun = interval > 0 && inView && !document.hidden && !hovering && !touching && !focusWithin;
    if (canRun) timer = window.setTimeout(() => go(1, false), interval);
  };

  const go = (dir: 1 | -1, announce: boolean) => {
    if (busy) return;
    const previous = active;
    const next = (active + dir + total) % total;
    // Al avanzar sale la tarjeta activa; al retroceder entra la que está al fondo.
    const moving = cards[dir === 1 ? previous : next];
    const fromDepth = (cards.indexOf(moving) - previous + total) % total;

    moving.style.setProperty('--d0', String(fromDepth));
    moving.style.setProperty('--k0', String(sign(fromDepth)));

    active = next;
    render();

    const cls = dir === 1 ? 'is-leaving' : 'is-entering';
    busy = true;
    root.classList.add('is-animating');
    moving.classList.add(cls);
    window.setTimeout(() => {
      moving.classList.remove(cls);
      root.classList.remove('is-animating');
      busy = false;
    }, readDuration(root));

    if (announce && status) {
      status.textContent = `Imagen ${active + 1} de ${total}: ${cards[active].querySelector('img')?.alt ?? ''}`;
    }
    schedule();
  };

  root.querySelector('[data-stack-prev]')?.addEventListener('click', () => go(-1, true));
  root.querySelector('[data-stack-next]')?.addEventListener('click', () => go(1, true));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1, true);
    }
  });

  let startX = 0;
  let startY = 0;
  stack.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    startY = event.clientY;
    if (event.pointerType === 'touch') {
      touching = true;
      schedule();
    }
  });
  const endPointer = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      touching = false;
      schedule();
    }
  };
  stack.addEventListener('pointerup', (event) => {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1, true);
    endPointer(event);
  });
  stack.addEventListener('pointercancel', endPointer);

  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      hovering = true;
      schedule();
    }
  });
  root.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      hovering = false;
      schedule();
    }
  });
  // Solo el foco de teclado pausa; tras un clic el foco queda en el botón y no debe detener el avance.
  root.addEventListener('focusin', (event) => {
    focusWithin = (event.target as HTMLElement).matches(':focus-visible');
    schedule();
  });
  root.addEventListener('focusout', () => {
    focusWithin = false;
    schedule();
  });

  document.addEventListener('visibilitychange', schedule);

  if ('IntersectionObserver' in window) {
    inView = false;
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.25 }
    ).observe(root);
  } else {
    schedule();
  }

  render();
}
