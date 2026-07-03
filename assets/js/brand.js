/* Brand page: reads ?b=<slug> and renders that brand's profile + content */

(function () {
  const cfg = SITE_CONFIG;
  const slug = new URLSearchParams(location.search).get("b");
  const brand = cfg.brands.find((b) => b.slug === slug) || cfg.brands[0];

  if (!brand) {
    document.getElementById("profile-header").innerHTML =
      `<div class="empty">Brand not found. <a href="index.html" style="color:var(--accent)">Back to portfolio</a></div>`;
    return;
  }

  document.title = `${brand.name} · ${cfg.profile.username}`;

  const meta = { name: brand.name, handle: brand.handle, avatar: brand.logo };

  /* ---- Brand header ---- */
  const header = document.getElementById("profile-header");
  header.innerHTML = `
    <div class="avatar-wrap">
      <img class="avatar" src="${brand.logo}" alt="${escapeHTML(brand.name)}" />
    </div>
    <div class="profile-main">
      <div class="profile-top">
        <span class="profile-username">${escapeHTML(brand.handle || brand.name)} ${ICONS.verified}</span>
        ${brand.link ? `<a class="btn" href="${brand.link}" target="_blank" rel="noopener">Visit brand</a>` : ""}
      </div>
      <div class="profile-stats">
        <span><b>${brand.posts?.length || 0}</b> posts</span>
        <span><b>${brand.stories?.length || 0}</b> stories</span>
      </div>
      <div class="profile-bio">
        <div class="bio-name">${escapeHTML(brand.name)}</div>
        ${brand.description ? `<div>${escapeHTML(brand.description)}</div>` : ""}
        ${brand.location ? `<div class="brand-meta-line">${ICONS.pin}${escapeHTML(brand.location)}</div>` : ""}
      </div>
    </div>`;

  /* ---- Story highlight bubble ---- */
  const highlights = document.getElementById("highlights");
  if (brand.stories && brand.stories.length) {
    const first = brand.stories[0];
    const thumb = first.type === "video" ? brand.logo : first.src;
    const h = el("button", "highlight");
    h.setAttribute("aria-label", `Play ${brand.name} stories`);
    h.innerHTML = `
      <span class="highlight-ring"><span class="highlight-ring-inner">
        <img src="${thumb}" alt="" />
      </span></span>
      <span class="highlight-label">Stories</span>`;
    h.addEventListener("click", () => StoryViewer.open(brand.stories, meta));
    highlights.appendChild(h);
  } else {
    highlights.style.display = "none";
  }

  /* ---- Post grid ---- */
  const grid = document.getElementById("grid");
  if (!brand.posts || !brand.posts.length) {
    grid.appendChild(el("div", "empty", "No posts yet for this brand — add some in <b>config.js</b>."));
    return;
  }
  brand.posts.forEach((post, i) => {
    const tile = el("button", "tile");
    tile.setAttribute("aria-label", post.caption ? post.caption : `Post ${i + 1}`);
    const thumbSrc = post.thumb ? post.thumb : (post.type === "video" ? (post.thumb || "") : post.src);
    tile.innerHTML = `
      ${thumbSrc
        ? `<img src="${thumbSrc}" alt="" loading="lazy" />`
        : `<video src="${post.src}" muted playsinline preload="metadata"
             style="width:100%;height:100%;object-fit:cover;"></video>`}
      ${post.type === "video" ? `<span class="tile-type-icon">${ICONS.reel}</span>` : ""}
      <div class="tile-hover">${post.type === "video" ? "▶ Play" : "View"}</div>`;
    tile.addEventListener("click", () => Lightbox.open(brand.posts, i, meta));
    grid.appendChild(tile);
  });
})();
