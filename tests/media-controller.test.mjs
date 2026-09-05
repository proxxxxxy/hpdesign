import test from 'node:test';
import assert from 'node:assert/strict';
import { VideoManager } from '../media-controller.js';

const settle = () => new Promise(resolve => setImmediate(resolve));
function setup(options = {}) {
  class Video extends EventTarget {
    src = ''; hidden = true; paused = true; calls = 0;
    play() {
      this.calls++;
      if (this.reject) return Promise.reject(new Error('Autoplay blocked'));
      if (this.pending) return this.pending;
      this.paused = false;
      this.dispatchEvent(new Event('playing'));
      return Promise.resolve();
    }
    pause() {
      if (this.paused) return;
      this.paused = true;
      this.dispatchEvent(new Event('pause'));
    }
  }
  class Observer {
    constructor(callback) { this.callback = callback; }
    observe() {}
    disconnect() {}
  }
  const page = new EventTarget(); page.hidden = false;
  const host = {}, video = new Video();
  const manager = new VideoManager([{ key: 'film', host, video, source: './assets/film.mp4' }], {
    page, Observer, baseUrl: 'https://example.com/', ...options
  });
  const visible = value => manager.observer.callback([{ target: host, isIntersecting: value, intersectionRatio: value ? 1 : 0 }]);
  return { manager, page, video, visible };
}

test('loads only in view, pauses offscreen, resumes on return', async () => {
  const { manager, video, visible } = setup();
  assert.equal(video.src, '');
  visible(true); await settle();
  assert.equal(video.src, 'https://example.com/assets/film.mp4');
  assert.equal(video.hidden, false); assert.equal(video.paused, false);
  visible(false); assert.equal(video.paused, true);
  visible(true); await settle(); assert.equal(video.paused, false);
  manager.destroy(); assert.equal(video.paused, true);
});
test('reduced motion/global pause prevents loading until explicitly resumed', async () => {
  const { manager, video, visible } = setup({ paused: true });
  visible(true); await settle(); assert.equal(video.src, '');
  manager.setPaused(false); await settle(); assert.equal(video.paused, false);
  manager.setPaused(true); assert.equal(video.paused, true);
});
test('save-data prevents download; local play overrides it', async () => {
  const { manager, video, visible } = setup({ saveData: true });
  visible(true); await settle(); assert.equal(video.src, '');
  manager.toggle('film'); await settle(); assert.equal(video.paused, false);
});
test('local pause persists across leaving and reentering view', async () => {
  const { manager, video, visible } = setup();
  visible(true); await settle(); manager.toggle('film');
  visible(false); visible(true); await settle(); assert.equal(video.paused, true);
  manager.toggle('film'); await settle(); assert.equal(video.paused, false);
});
test('hidden tab pauses; returning respects global pause', async () => {
  const { manager, page, video, visible } = setup();
  visible(true); await settle();
  page.hidden = true; page.dispatchEvent(new Event('visibilitychange'));
  assert.equal(video.paused, true);
  manager.setPaused(true);
  page.hidden = false; page.dispatchEvent(new Event('visibilitychange'));
  await settle(); assert.equal(video.paused, true);
});
test('late play completion cannot override a user pause', async () => {
  const { manager, video, visible } = setup();
  let finish; video.pending = new Promise(resolve => { finish = resolve; });
  visible(true); await settle(); manager.setPaused(true);
  video.paused = false; video.dispatchEvent(new Event('playing')); finish();
  await settle(); assert.equal(video.paused, true); assert.equal(video.hidden, true);
});
test('autoplay rejection leaves poster and allows explicit retry', async () => {
  const { manager, video, visible } = setup();
  video.reject = true; visible(true); await settle();
  assert.equal(manager.items[0].state, 'blocked'); assert.equal(video.hidden, true);
  video.reject = false; manager.toggle('film'); await settle();
  assert.equal(video.paused, false); assert.equal(video.hidden, false);
});
test('media error keeps poster and does not retry a broken source', async () => {
  const { manager, video, visible } = setup();
  visible(true); await settle(); video.dispatchEvent(new Event('error'));
  assert.equal(manager.items[0].state, 'error'); assert.equal(video.hidden, true);
  const calls = video.calls; manager.toggle('film'); await settle();
  assert.equal(video.calls, calls);
});
