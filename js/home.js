// js/home.js
// -----------------------------------------------------------------------
// Renders the "رحلتك التعليمية" dashboard cards on index.html, reading
// content from SAINTS (data.js) and saved progress (progress.js).
// -----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("dashboard-grid");
  if (!grid) return;

  SAINTS.forEach((saint, index) => {
    grid.appendChild(buildSaintCard(saint, index));
  });
});

function buildSaintCard(saint, index) {
  const totalVideos = saint.videos.length;
  const progress = getSaintProgress(saint.id);
  const completedCount = progress.completedVideos.length;
  const percent = getProgressPercent(saint.id, totalVideos);
  const isDone = completedCount === totalVideos;
  const isStarted = completedCount > 0;

  const card = document.createElement("article");
  card.className = "saint-card animate-slide-up";
  card.style.animationDelay = `${index * 0.06}s`;

  card.innerHTML = `
    <div class="saint-card__image-wrap">
      <img class="saint-card__image" src="${saint.image}" alt="${saint.name}" />
      <div class="saint-card__image-fallback" aria-hidden="true">☨</div>
      ${isDone ? `<span class="saint-card__badge">مكتملة</span>` : ""}
    </div>
    <div class="saint-card__body">
      <h3 class="saint-card__name">${saint.shortName}</h3>
      <p class="saint-card__title">${saint.title}</p>
      <div class="progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${percent}%">
        <div class="progress-bar__track"><div class="progress-bar__fill" style="width:${percent}%"></div></div>
        <span class="progress-bar__label">${percent}%</span>
      </div>
      <p class="saint-card__meta">${completedCount} من ${totalVideos} فيديوهات مكتملة</p>
      <a href="saint.html?id=${saint.id}" class="btn btn-secondary saint-card__cta">
        ${isStarted ? "تابع الرحلة" : "ابدأ الرحلة"}
      </a>
    </div>
  `;

  // Graceful fallback when the illustration hasn't been added yet.
  const img = card.querySelector(".saint-card__image");
  const fallback = card.querySelector(".saint-card__image-fallback");
  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "flex";
  });

  return card;
}
