/* ============================================================
   NAPOLI NO KAMA THAILAND — main.js
   外部URL・連絡先はここに集約（HTMLへのハードコード禁止）
   ============================================================ */

const LINKS = {
  // サイト全体のLINE導線は廃止。LINEは店舗ごとのため storeLine で管理する（2026-08-26）
  phone: '0952235750',   // パタヤ店（2026-08-25 入力シートより）
  // 店舗別デリバリー。URLを入れたサービスだけボタンが表示される
  storeDelivery: {
    onnut:    { grab: '', lineman: 'https://lin.ee/nWHoOV5A?openExternalBrowser=1', shopee: '' },
    thonglor: { grab: '', lineman: '', shopee: '' },
    rangsit:  { grab: 'https://r.grab.com/o/yMnQjqye', lineman: '', shopee: '' },
    sriracha: { grab: '', lineman: 'https://lin.ee/64mq930B?openExternalBrowser=1', shopee: '' },
    pattaya:  {
      grab:    'https://r.grab.com/o/6zaEfYNv',
      lineman: 'https://lin.ee/7YFpoeP?openExternalBrowser=1',
      shopee:  'https://shopee.co.th/universal-link/now-food/shop/10301301?deep_and_deferred=1&shareChannel=line'
    }
  },
  // 店舗別「LINEで注文」ボタン。URLを入れた店舗だけボタンが表示される
  storeLine: {
    onnut: '',
    thonglor: '',
    rangsit: 'https://line.me/R/ti/p/@napolirangsit', // 入力シートのID @napolirangsit から標準URL形式で構成（2026-08-26）
    sriracha: '',
    pattaya: 'https://lin.ee/nh0QTBv' // NAPOLI NO KAMA พัทยา（@558tvsea）
  }
};

document.addEventListener('DOMContentLoaded', () => {
  applyLinks();
  initFadeUp();
});

/* --- LINKS定数をDOMへ反映 --- */
function applyLinks() {
  document.querySelectorAll('[data-link="phone"]').forEach((el) => {
    el.href = 'tel:' + LINKS.phone.replace(/[^0-9+]/g, '');
    const num = el.querySelector('[data-phone-number]');
    if (num) num.textContent = LINKS.phone;
  });
  // 店舗別デリバリー：URLがあるサービスのボタンだけ表示する
  document.querySelectorAll('[data-delivery-store]').forEach((box) => {
    const links = (LINKS.storeDelivery || {})[box.getAttribute('data-delivery-store')] || {};
    box.querySelectorAll('[data-delivery]').forEach((el) => {
      const url = links[el.getAttribute('data-delivery')];
      if (url) { el.href = url; el.hidden = false; }
    });
  });
  // 店舗別LINEボタン：URLが設定されている店舗だけ表示する
  document.querySelectorAll('[data-line-store]').forEach((el) => {
    const url = (LINKS.storeLine || {})[el.getAttribute('data-line-store')];
    if (url) {
      el.href = url;
      el.hidden = false;
    }
  });
  // 注文グループ：表示中のボタンが1つもなければ見出しごと隠す
  document.querySelectorAll('[data-order-group]').forEach((group) => {
    group.hidden = !Array.from(group.querySelectorAll('.btn')).some((b) => !b.hidden);
  });
}

/* --- 到達フェードイン ---
   IntersectionObserverは発火しない環境があり本文が不可視のまま残るため使わない
   （K2サイトで実際に発生・2026-07-30の教訓）。判定は「上端が画面に入ったか」のみ。 */
function initFadeUp() {
  let pending = Array.from(document.querySelectorAll('.fade-up'));
  if (!pending.length) return;
  function check() {
    if (!pending.length) return;
    const vh = window.innerHeight;
    if (!vh) { pending.forEach((t) => t.classList.add('is-visible')); pending = []; return; }
    pending = pending.filter((t) => {
      if (t.getBoundingClientRect().top < vh * 0.92) {
        t.classList.add('is-visible');
        return false;
      }
      return true;
    });
  }
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  const iv = setInterval(() => { check(); if (!pending.length) clearInterval(iv); }, 700);
  check();
}
