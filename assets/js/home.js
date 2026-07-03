/* Home page: your profile + a grid where every tile is a brand */

(function () {
  const cfg = SITE_CONFIG;
  const p = cfg.profile;

  document.title = `${p.username} · brand portfolio`;

  /* ---- Profile header ---- */
  const header = document.getElementById("profile-header");
  header.innerHTML = `
    <div class="avatar-wrap">
      <img class="avatar" src="${p.avatar}" alt="${escapeHTML(p.name)}" />
    </div>
    <div class="profile-main">
      <div class="profile-top">
        <span class="profile-username">${escapeHTML(p.username)} ${ICONS.verified}</span>
        ${p.websiteUrl ? `<a class="btn btn-primary" href="${p.websiteUrl}" target="_blank" rel="noopener">Work with me</a>` : ""}
      </div>
      <div class="profile-stats">
        <span><b>${cfg.brands.length}</b> brands</span>
        <span><b>${totalPosts(cfg)}</b> deliverables</span>
        ${p.customStat ? `<span><b>${escapeHTML(p.customStat.value)}</b> ${escapeHTML(p.customStat.label)}</span>` : ""}
      </div>
      <div class="profile-bio">
        <div class="bio-name">${escapeHTML(p.name)}</div>
        ${p.tagline ? `<div class="bio-tagline">${escapeHTML(p.tagline)}</div>` : ""}
        ${(p.bio || []).map(line => `<div>${escapeHTML(line)}</div>`).join("")}
        ${p.website ? `<a href="${p.websiteUrl || "#"}" target="_blank" rel="noopener">${escapeHTML(p.website)}</a>` : ""}
      </div>
    </div>`;

  /* ---- Highlights row: one bubble per brand (jumps to its page) ---- */
  const highlights = document.getElementById("highlights");
  cfg.brands.forEach((b) => {
    const h = el("a", "highlight");
    h.href = `brand.html?b=${encodeURIComponent(b.slug)}`;
    h.setAttribute("aria-label", `View ${b.name}`);
    h.innerHTML = `
      <span class="highlight-ring"><span class="highlight-ring-inner">
        <img src="${b.logo}" alt="" />
      </span></span>
      <span class="highlight-label">${escapeHTML(b.name)}</span>`;
    highlights.appendChild(h);
  });

  /* ---- Brand grid ---- */
  const grid = document.getElementById("grid");
  if (!cfg.brands.length) {
    grid.appendChild(el("div", "empty", "Add your first brand in <b>config.js</b> to get started."));
    return;
  }
  cfg.brands.forEach((b) => {
    const tile = el("a", "tile tile-brand");
    tile.href = `brand.html?b=${encodeURIComponent(b.slug)}`;
    tile.setAttribute("aria-label", `${b.name} — ${b.deliverables || "view content"}`);
    tile.innerHTML = `
      <img src="${b.cover}" alt="${escapeHTML(b.name)}" loading="lazy" />
      <div class="tile-brand-meta">
        <img class="tile-brand-logo" src="${b.logo}" alt="" />
        <div class="tile-brand-text">
          <div class="tile-brand-name">${escapeHTML(b.name)}</div>
          <div class="tile-brand-sub">${escapeHTML(b.deliverables || b.location || "")}</div>
        </div>
      </div>`;
    grid.appendChild(tile);
  });
})();
