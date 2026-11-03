
(() => {
  const popup = document.querySelector('#review-offer-popup');
  if (!popup || typeof popup.showModal !== 'function') return;
  const shownKey = 'usk-review-popup-shown-v3';
  const startKey = 'usk-review-popup-start-v3';
  const delay = 30000;
  function read(key) { try { return sessionStorage.getItem(key); } catch { return null; } }
  function write(key, value) { try { sessionStorage.setItem(key, value); } catch {} }
  if (read(shownKey) === '1') return;
  const savedStart = Number(read(startKey));
  const startedAt = savedStart > 0 && savedStart <= Date.now() ? savedStart : Date.now();
  write(startKey, String(startedAt));
  let timer;
  let displayed = false;
  let previousFocus;
  function attempt() {
    if (displayed || read(shownKey) === '1') return;
    // Do not cover another popup, interrupt a review, or open in a background tab.
    const busy = document.hidden || document.querySelector('dialog[open]') ||
      Array.from(document.querySelectorAll('audio, video')).some(media => !media.paused && !media.ended);
    if (busy) { timer = setTimeout(attempt, 1000); return; }
    previousFocus = document.activeElement;
    popup.showModal();
    displayed = true;
    write(shownKey, '1');
  }
  popup.querySelector('.review-popup-close').addEventListener('click', () => popup.close());
  popup.querySelector('.review-popup-later').addEventListener('click', () => popup.close());
  popup.addEventListener('click', event => {
    if (event.target !== popup) return;
    const rect = popup.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) popup.close();
  });
  popup.addEventListener('close', () => {
    if (previousFocus && previousFocus.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus();
  });
  timer = setTimeout(attempt, Math.max(0, delay - (Date.now() - startedAt)));
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', event => {
    if (event.persisted && !displayed && read(shownKey) !== '1') timer = setTimeout(attempt, Math.max(0, delay - (Date.now() - startedAt)));
  });
})();
