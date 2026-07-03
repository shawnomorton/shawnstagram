/* Shared helpers, icons, story viewer + lightbox used by both pages */

const ICONS = {
  verified: `<svg class="verified" viewBox="0 0 40 40" aria-label="Verified"><path fill="#0095f6" d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"/></svg>`,
  reel: `<svg viewBox="0 0 24 24" fill="#fff" aria-label="Video"><path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"/></svg>`,
  photos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" stroke-width="2" aria-label="Like"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" stroke-width="2" aria-label="Comment"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" stroke-width="2" aria-label="Share"><path d="M22 3 9.218 10.083M11.698 20.334 22 3.001H2l9.218 7.084 .48 10.249Z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`
};

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

function escapeHTML(str) {
  return String(str ?? "").replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[s]));
}

function totalPosts(cfg) {
  return cfg.brands.reduce((n, b) => n + (b.posts?.length || 0), 0);
}

/* ============================================================
   STORY VIEWER
   ============================================================ */
const StoryViewer = (() => {
  const IMAGE_DURATION = 5000; // ms per image story
  let stories = [], index = 0, timer = null, raf = null, startTime = 0;
  let root, frame, progress, headImg, headName;

  function build() {
    root = el("div", "story-viewer");
    root.innerHTML = `
      <div class="story-frame">
        <div class="story-progress"></div>
        <div class="story-head">
          <img alt="" />
          <span class="handle"></span>
          <button class="close" aria-label="Close stories">&times;</button>
        </div>
        <div class="story-media"></div>
        <button class="story-tap left" aria-label="Previous story"></button>
        <button class="story-tap right" aria-label="Next story"></button>
      </div>`;
    document.body.appendChild(root);
    frame = root.querySelector(".story-media");
    progress = root.querySelector(".story-progress");
    headImg = root.querySelector(".story-head img");
    headName = root.querySelector(".story-head .handle");
    root.querySelector(".close").addEventListener("click", close);
    root.querySelector(".story-tap.left").addEventListener("click", () => go(-1));
    root.querySelector(".story-tap.right").addEventListener("click", () => go(1));
    document.addEventListener("keydown", (e) => {
      if (!root.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
  }

  function open(storyList, meta) {
    if (!root) build();
    if (!storyList || !storyList.length) return;
    stories = storyList;
    index = 0;
    headImg.src = meta.avatar || "";
    headName.textContent = meta.name || "";
    progress.innerHTML = stories.map(() => `<span class="seg"><span class="fill"></span></span>`).join("");
    root.classList.add("open");
    document.body.style.overflow = "hidden";
    show();
  }

  function close() {
    clearTimers();
    frame.innerHTML = "";
    root.classList.remove("open");
    document.body.style.overflow = "";
  }

  function clearTimers() {
    if (timer) clearTimeout(timer);
    if (raf) cancelAnimationFrame(raf);
    timer = raf = null;
  }

  function setFill(i, pct) {
    const seg = progress.children[i];
    if (seg) seg.firstElementChild.style.width = pct + "%";
  }

  function show() {
    clearTimers();
    // mark previous segments full, later ones empty
    stories.forEach((_, i) => setFill(i, i < index ? 100 : 0));
    frame.innerHTML = "";
    const s = stories[index];

    if (s.type === "video") {
      const v = document.createElement("video");
      v.src = s.src;
      v.autoplay = true;
      v.playsInline = true;
      v.addEventListener("ended", () => go(1));
      v.addEventListener("timeupdate", () => {
        if (v.duration) setFill(index, (v.currentTime / v.duration) * 100);
      });
      frame.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = s.src;
      img.alt = "";
      frame.appendChild(img);
      startTime = performance.now();
      const tick = (t) => {
        const pct = Math.min(100, ((t - startTime) / IMAGE_DURATION) * 100);
        setFill(index, pct);
        if (pct < 100) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      timer = setTimeout(() => go(1), IMAGE_DURATION);
    }
  }

  function go(dir) {
    const next = index + dir;
    if (next < 0) { index = 0; show(); return; }
    if (next >= stories.length) { close(); return; }
    index = next;
    show();
  }

  return { open };
})();

/* ============================================================
   LIGHTBOX (post viewer)
   ============================================================ */
const Lightbox = (() => {
  let posts = [], index = 0, meta = {}, carouselIndex = 0;
  let root, mediaBox, captionBox, headImg, headName;

  function build() {
    root = el("div", "lightbox");
    root.innerHTML = `
      <button class="lightbox-close" aria-label="Close post">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous post">&#8249;</button>
      <button class="lightbox-nav lightbox-next" aria-label="Next post">&#8250;</button>
      <div class="lightbox-card">
        <div class="lightbox-media"></div>
        <div class="lightbox-side">
          <div class="lightbox-head"><img alt="" /><span class="handle"></span></div>
          <div class="lightbox-caption"></div>
          <div class="lightbox-carousel-dots"></div>
          <div class="lightbox-actions">${ICONS.heart}${ICONS.comment}${ICONS.send}</div>
        </div>
      </div>`;
    document.body.appendChild(root);
    mediaBox = root.querySelector(".lightbox-media");
    captionBox = root.querySelector(".lightbox-caption");
    headImg = root.querySelector(".lightbox-head img");
    headName = root.querySelector(".lightbox-head .handle");
    root.querySelector(".lightbox-close").addEventListener("click", close);
    root.querySelector(".lightbox-prev").addEventListener("click", () => go(-1));
    root.querySelector(".lightbox-next").addEventListener("click", () => go(1));
    root.addEventListener("click", (e) => { if (e.target === root) close(); });
    document.addEventListener("keydown", (e) => {
      if (!root.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goCarousel(-1);
      if (e.key === "ArrowRight") goCarousel(1);
    });
    // Touch/swipe support for carousels
    let touchStartX = 0;
    mediaBox.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });
    mediaBox.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {  // minimum swipe distance
        goCarousel(diff > 0 ? 1 : -1);
      }
    });
  }

  function open(postList, i, brandMeta) {
    if (!root) build();
    posts = postList;
    index = i;
    meta = brandMeta;
    carouselIndex = 0;
    headImg.src = meta.avatar || "";
    headName.textContent = meta.handle || meta.name || "";
    root.classList.add("open");
    document.body.style.overflow = "hidden";
    show();
  }

  function close() {
    mediaBox.innerHTML = "";
    root.classList.remove("open");
    document.body.style.overflow = "";
  }

  function show() {
    mediaBox.innerHTML = "";
    const p = posts[index];
    
    // Get images array (carousel) or single src
    const images = p.images ? p.images : [{ src: p.src, type: p.type }];
    const current = images[carouselIndex];
    
    if (current.type === "video") {
      const v = document.createElement("video");
      v.src = current.src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      mediaBox.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = current.src;
      img.alt = p.caption || "";
      mediaBox.appendChild(img);
    }
    
    // Show caption
    captionBox.innerHTML = p.caption
      ? `<span class="handle">${escapeHTML(meta.handle || meta.name || "")}</span>${escapeHTML(p.caption)}`
      : `<span style="color:var(--text-secondary)">No caption</span>`;
    
    // Show carousel dots if multiple images
    const dotsBox = root.querySelector(".lightbox-carousel-dots");
    if (images.length > 1) {
      dotsBox.innerHTML = images.map((_, i) => 
        `<span class="dot ${i === carouselIndex ? "active" : ""}" data-index="${i}"></span>`
      ).join("");
      
      // Add click handlers to dots
      Array.from(dotsBox.querySelectorAll(".dot")).forEach((dot, i) => {
        dot.addEventListener("click", () => {
          carouselIndex = i;
          show();
        });
      });
    } else {
      dotsBox.innerHTML = "";
    }
  }

  function go(dir) {
    carouselIndex = 0;
    index = (index + dir + posts.length) % posts.length;
    show();
  }

  function goCarousel(dir) {
    const p = posts[index];
    const images = p.images ? p.images : [{ src: p.src, type: p.type }];
    carouselIndex = (carouselIndex + dir + images.length) % images.length;
    show();
  }

  return { open };
})();