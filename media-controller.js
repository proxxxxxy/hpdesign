// Visibility and user preferences govern loading as well as playback.
export class VideoManager {
  constructor(entries, { page = document, Observer = IntersectionObserver, baseUrl = location.href, paused = false, saveData = false, onState = () => {} } = {}) {
    this.page = page;
    this.paused = paused;
    this.saveData = saveData;
    this.onState = onState;
    this.items = entries.map(entry => ({ ...entry, visible: false, manualPaused: false, explicitPlay: false, loading: false, failed: false, state: 'poster' }));
    for (const item of this.items) {
      try {
        const url = new URL(item.source, baseUrl);
        if (!item.source || url.origin !== new URL(baseUrl).origin || !['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid video source');
        item.url = url.href;
      } catch { item.failed = true; }
      item.video.muted = true;
      item.video.addEventListener('playing', () => {
        if (!this.canPlay(item)) { item.video.pause(); return; }
        item.video.hidden = false;
        this.render(item, 'playing');
      });
      item.video.addEventListener('pause', () => {
        if (!item.failed && item.state === 'playing') this.render(item, 'paused');
      });
      item.video.addEventListener('error', () => {
        item.failed = true;
        item.video.hidden = true;
        this.render(item, 'error');
      });
      this.render(item, item.failed ? 'error' : 'poster');
    }
    this.observer = new Observer(entries => {
      for (const entry of entries) {
        const item = this.items.find(candidate => candidate.host === entry.target);
        if (!item) continue;
        item.visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        this.sync(item);
      }
    }, { threshold: [0, 0.15] });
    this.items.forEach(item => this.observer.observe(item.host));
    this.onVisibilityChange = () => this.syncAll();
    page.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  render(item, state) {
    item.state = state;
    this.onState(item, state);
  }

  canPlay(item) {
    return item.visible && !this.page.hidden && !this.paused && !item.manualPaused && !item.failed && (!this.saveData || item.explicitPlay);
  }

  sync(item) {
    if (!this.canPlay(item)) {
      item.video.pause();
      if (item.state === 'loading') this.render(item, 'poster');
      return;
    }
    if (item.loading || (!item.video.paused && item.state === 'playing')) return;
    if (!item.video.src) item.video.src = item.url;
    item.loading = true;
    this.render(item, 'loading');
    Promise.resolve().then(() => {
      if (this.canPlay(item)) return item.video.play();
    }).then(() => {
      // A play request may finish after the user scrolls away or presses pause.
      if (!this.canPlay(item)) item.video.pause();
    }).catch(() => {
      if (this.canPlay(item) && !item.failed) {
        item.video.hidden = true;
        this.render(item, 'blocked');
      }
    }).finally(() => {
      item.loading = false;
      // A visibility change can arrive while an earlier play request is pending.
      if (this.canPlay(item) && item.state === 'poster') this.sync(item);
    });
  }

  syncAll() { this.items.forEach(item => this.sync(item)); }

  setPaused(value) {
    this.paused = value;
    this.syncAll();
  }

  allowPlayback() {
    this.saveData = false;
    this.syncAll();
  }

  toggle(key, forcePlay = false) {
    const item = this.items.find(candidate => candidate.key === key);
    if (!item || item.failed) return;
    const isActive = ['playing', 'loading'].includes(item.state);
    item.manualPaused = forcePlay ? false : isActive;
    if (!item.manualPaused) item.explicitPlay = true;
    this.sync(item);
  }

  destroy() {
    this.observer.disconnect();
    this.page.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.paused = true;
    this.syncAll();
  }
}
