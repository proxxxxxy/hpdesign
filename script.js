const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const config = window.IROHA_CONFIG || {};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let videoAllowed = !navigator.connection?.saveData;
let framePending = false;
const root = document.documentElement;
const header = $('#header');
const hero = $('.hero');
const media = $('.hero-media');
const video = $('.hero-video');
const toggle = $('.motion-toggle');

if (!paused) root.classList.add('js-motion');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.09 });
$$('.reveal').forEach(element => observer.observe(element));

function updateScroll() {
  framePending = false;
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 100);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $('.reading-progress').style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  media.style.transform = !paused && y < hero.offsetHeight ? `translateY(${y * 0.23}px)` : '';
  const interlude = $('.interlude');
  if (interlude && !paused && innerWidth > 800) {
    const bounds = interlude.getBoundingClientRect();
    if (bounds.top < innerHeight && bounds.bottom > 0) {
      const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / innerHeight));
      $('.interlude-frame').style.clipPath = `inset(0 ${4.7 * (1 - progress)}%)`;
      $('.interlude-frame > img').style.transform = `scale(1.08) translateY(${(progress - 0.5) * 22}px)`;
    }
  }
}
window.addEventListener('scroll', () => {
  if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('resize', updateScroll, { passive: true });
updateScroll();

function setPaused(next) {
  paused = next;
  root.classList.toggle('motion-paused', paused);
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'アニメーションを再開' : 'アニメーションを停止');
  $('.motion-label').textContent = paused ? 'PLAY' : 'PAUSE';
  $('.pause-symbol').textContent = paused ? '▷' : 'Ⅱ';
  if (video.src) { if (paused) video.pause(); else video.play().catch(() => {}); }
  updateScroll();
}
toggle.addEventListener('click', () => { if (paused) videoAllowed = true; setPaused(!paused); });
reducedMotion.addEventListener('change', event => setPaused(event.matches));
setPaused(paused);

const menuButton = $('.menu-toggle');
const menu = $('#mobile-menu');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  menu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  $('main').inert = open;
  if (open) $('a', menu).focus();
}
menuButton.addEventListener('click', () => setMenu(menu.hidden));
$$('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
$$('a', header).forEach(link => link.addEventListener('click', () => { if (!menu.hidden) setMenu(false); }));
document.addEventListener('keydown', event => {
  if (menu.hidden) return;
  if (event.key === 'Escape') { setMenu(false); menuButton.focus(); }
  if (event.key === 'Tab') {
    const items = [...$$('a, button', header).filter(el => el.getClientRects().length), ...$$('a', menu)];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.matchMedia('(min-width:801px)').addEventListener('change', event => { if (event.matches && !menu.hidden) setMenu(false); });

if (config.heroVideo) {
  const source = new URL(config.heroVideo, location.href);
  if (source.origin === location.origin) {
    video.src = source.href;
    video.addEventListener('error', () => { video.hidden = true; });
    video.addEventListener('playing', () => { video.hidden = false; });
    if (!paused && videoAllowed) video.play().catch(() => {});
  }
}
const heroObserver = new IntersectionObserver(([entry]) => {
  if (!video.src) return;
  if (!entry.isIntersecting || paused || document.hidden || !videoAllowed) video.pause();
  else video.play().catch(() => {});
});
heroObserver.observe(hero);
document.addEventListener('visibilitychange', () => {
  if (!video.src) return;
  if (document.hidden) video.pause();
  else if (!paused && videoAllowed && hero.getBoundingClientRect().bottom > 0) video.play().catch(() => {});
});

// Concept content is intentionally separate from actual built-work claims.
const projects = {
  ridge: { title: '稜線の家', type: '01 / RESIDENCE — CONCEPT STUDY', image: 'architecture', lead: '風景の、その一部に。', description: '森の輪郭を遮らない、低く水平に伸びる屋根。大きな開口の内側に、家族の時間が静かに灯ります。\n\nこの設計案が探るのは、自然に向かって開きながら、安心してこもれる住まい。木々の重なりや水面の揺らぎを、日々の風景として取り込むことです。', materials: '低い軒 / 森への開口 / 石と木 / 内外をつなぐ水庭' },
  light: { title: '光の井戸', type: '02 / RESIDENCE — CONCEPT STUDY', image: 'interior', lead: '光を、暮らしの真ん中に。', description: '庭の緑を眺めながら、本をひらく。床に落ちる木漏れ日で、時の流れに気づく。\n\nひとつの庭と、そこへ向かう開口を軸に考えた住まいのコンセプトです。明るさを均一にするのではなく、光と陰のある場所をつくることで、過ごし方の選択肢が生まれます。', materials: '中庭 / 木の床と天井 / 左官壁 / うつろう木漏れ日' },
  coffee: { title: '珈琲と本の間', type: '03 / SHOP & CULTURE — CONCEPT STUDY', image: 'atelier', lead: '立ち寄る場所から、居たくなる場所へ。', description: '珈琲を待つあいだに、一冊を手に取る。読み進めるうちに、もう一杯を頼みたくなる。\n\n本棚とカウンター、その奥に見える小さな庭。別々の目的を持って来た人が、自分のペースで居場所を見つけられる店舗を思い描きました。', materials: '長い木のカウンター / 本棚 / 奥庭 / 古材の梁' },
  doma: { title: '土間のある工房', type: '04 / ATELIER — CONCEPT STUDY', image: 'atelier', lead: 'つくる手と、暮らす時間がつながる。', description: '作業のための場所と、人を迎える場所。その間に、使い方を決めすぎない土間を置く。\n\n大きな机を囲んで手を動かす日も、扉を開けて展示をする日も。働くことと地域とのつながりを、一つの連続した空間として考える設計案です。', materials: '土間 / 大きな作業台 / 可変の居場所 / 外へ開く建具' },
  roof: { title: '二重屋根の家', type: '05 / RESIDENCE — CONCEPT STUDY', image: 'interior', lead: '屋根と屋根のあいだに、風の通り道を。', description: '家を覆う屋根と、居場所に寄り添う天井。そのあいだの高さや隙間から、光と風を招く。\n\n空間の大小を細かな壁で分けるのではなく、屋根の重なりでゆるやかに区切る住まいの研究です。見上げる方向にも、暮らしの豊かさを探します。', materials: '重なり合う屋根 / 高窓 / 木の天井 / 緩やかなつながり' },
  kura: { title: '郡上の蔵改修', type: '06 / RENOVATION — CONCEPT STUDY', image: 'atelier', lead: '残すものと、手渡すもの。', description: '古い梁に残る手仕事の跡。使われてきた素材が持つ、時間の厚み。\n\n元デザインの架空の蔵改修案を引き継ぎ、残せる部分と新しく加える部分の対話を考えました。場所の記憶を尊重しながら、次の使い方へとつなぐコンセプトです。', materials: '既存の梁 / 左官壁 / 新旧の接点 / 庭への視線' }
};

$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const cards = $$('[data-category]');
  cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  $('#works').classList.toggle('filtered', filter !== 'all');
  $('.work-count').textContent = `${String(cards.filter(card => !card.hidden).length).padStart(2, '0')} CONCEPTS`;
  updateScroll();
}));

const projectDialog = $('#project-dialog');
const contactDialog = $('#contact-dialog');
let dialogTrigger = null;
function openDialog(dialog, trigger) {
  dialogTrigger = trigger || document.activeElement;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('dialog-open');
  $('.cursor-label').classList.remove('active');
  $('[data-close]', dialog).focus({ preventScroll: true });
}
$$('dialog').forEach(dialog => {
  $('[data-close]', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) {
      document.body.classList.remove('dialog-open');
      dialogTrigger?.focus({ preventScroll: true });
    }
  });
});
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#project-title').textContent = project.title;
  $('#project-type').textContent = project.type;
  $('#project-lead').textContent = project.lead;
  $('#project-description').textContent = project.description;
  $('#project-materials').textContent = project.materials;
  $('#project-image').src = `./assets/${project.image}.webp`;
  $('#project-image').alt = `${project.title}の方向性を伝える参考AIイメージ。実際の建築・図面ではありません。`;
  openDialog(projectDialog, button);
}));

$$('.process-steps details').forEach(detail => detail.addEventListener('toggle', () => {
  if (detail.open) $$('.process-steps details').forEach(other => { if (other !== detail) other.open = false; });
}));

$$('[data-contact]').forEach(button => button.addEventListener('click', () => openDialog(contactDialog, button)));
$('[data-project-contact]').addEventListener('click', () => {
  const trigger = dialogTrigger;
  projectDialog.close();
  openDialog(contactDialog, trigger);
});
$$('[data-business]').forEach(element => {
  const value = config[element.dataset.business];
  if (value) element.textContent = value;
});
if (config.contactEmail) {
  $('#contact-mode-note').textContent = '入力内容をまとめてから、ご自身のメールアプリで送信できます。このサイト上で入力内容を送信・保存することはありません。';
}

const contactForm = $('#contact-form');
let draft = '';
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  draft = `イロハデザイン ご担当者様\n\n以下の内容について相談を希望します。\n\nお名前：${data.get('name').trim()}\nメールアドレス：${data.get('email').trim()}\nご相談：${data.get('type')}\n\n${data.get('message').trim()}\n\nどうぞよろしくお願いいたします。`;
  $('#contact-draft').textContent = draft;
  contactForm.hidden = true;
  $('#contact-result').hidden = false;
  $('#copy-status').textContent = '';
  if (config.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail)) {
    const email = $('#email-draft');
    email.href = `mailto:${encodeURIComponent(config.contactEmail)}?subject=${encodeURIComponent('家づくりのご相談')}&body=${encodeURIComponent(draft)}`;
    email.hidden = false;
  }
  $('.result-title').focus({ preventScroll: true });
  contactDialog.scrollTop = 0;
});
$('#edit-draft').addEventListener('click', () => {
  $('#contact-result').hidden = true;
  contactForm.hidden = false;
  $('input', contactForm).focus();
});
$('#copy-draft').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(draft);
    $('#copy-status').textContent = '相談メモをコピーしました。送信はされていません。';
  } catch {
    $('#copy-status').textContent = 'コピーできませんでした。「メモを保存」をお使いください。';
  }
});
$('#download-draft').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob(['\uFEFF' + draft], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'イロハデザイン_ご相談メモ.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#copy-status').textContent = '相談メモの保存を開始しました。送信はされていません。';
});
$('#year').textContent = new Date().getFullYear();

const finePointer = window.matchMedia('(pointer:fine)');
const cursor = $('.cursor-label');
$$('.work-image-wrap').forEach(frame => {
  frame.addEventListener('pointerenter', () => { if (finePointer.matches && !paused) cursor.classList.add('active'); });
  frame.addEventListener('pointerleave', () => cursor.classList.remove('active'));
  frame.addEventListener('pointermove', event => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
});
window.addEventListener('blur', () => cursor.classList.remove('active'));

