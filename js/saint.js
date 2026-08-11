// js/saint.js
// -----------------------------------------------------------------------
// Drives the whole learning flow on saint.html:
//   video (must finish) -> "اختبر نفسك" -> quiz (locked answers, one at
//   a time) -> summary -> next video, or completion screen + PDF download
//   on the last video. Progress is persisted to localStorage after every
//   quiz so the user can leave and resume later.
// -----------------------------------------------------------------------

const PHASE = { VIDEO: "video", QUIZ: "quiz", COMPLETION: "completion" };

const state = {
  saint: null,
  videoIndex: 0,
  phase: PHASE.VIDEO,
  videoWatched: false,
  resumeNotice: null,
  storageWarning: false,
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const saint = getSaintById(id);

  if (!saint) {
    window.location.href = "index.html";
    return;
  }

  state.saint = saint;
  highlightActiveNavLink(id);

  if (!isStorageAvailable()) {
    state.storageWarning = true;
  }

  const progress = getSaintProgress(saint.id);
  if (progress.completed) {
    state.phase = PHASE.COMPLETION;
  } else if (progress.completedVideos.length > 0) {
    state.videoIndex = Math.min(progress.lastVideoIndex, saint.videos.length - 1);
    state.resumeNotice = `أنت وصلت إلى الفيديو ${state.videoIndex + 1}`;
  }

  renderHeader();
  renderMain();
}

function highlightActiveNavLink(id) {
  document.querySelectorAll("[data-saint-id]").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("data-saint-id") === id);
  });
}

/* =========================================================
   HEADER
   ========================================================= */
function renderHeader() {
  const { saint, phase, videoIndex } = state;
  const totalVideos = saint.videos.length;
  const percent = getProgressPercent(saint.id, totalVideos);
  const root = document.getElementById("saint-header-root");

  root.innerHTML = `
    <header class="saint-header">
      <svg class="saint-header__ornament" width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <path d="M4 4 C 30 4, 40 4, 40 4 M4 4 C 4 30, 4 40, 4 40" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" />
        <circle cx="4" cy="4" r="3.2" fill="var(--color-red)" />
        <path d="M14 4 C 20 14, 14 20, 4 14" stroke="var(--color-gold)" stroke-width="1.4" fill="none" />
      </svg>

      <div class="container">
        <a href="index.html" class="saint-header__back">→ الرئيسية</a>

        <div class="saint-header__content">
          <div class="saint-header__portrait">
            <img src="${saint.image}" alt="${saint.name}" />
            <div class="saint-header__portrait-fallback" aria-hidden="true">☨</div>
          </div>
          <div>
            <h1 class="saint-header__name">${saint.name}</h1>
            <p class="saint-header__description">${saint.description}</p>
          </div>
        </div>

        ${
          phase === PHASE.COMPLETION
            ? ""
            : `
          <div class="saint-header__progress">
            <span class="saint-header__progress-label">رحلتك: ${videoIndex + 1} / ${totalVideos}</span>
            <div class="progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${percent}%">
              <div class="progress-bar__track"><div class="progress-bar__fill" style="width:${percent}%"></div></div>
            </div>
          </div>`
        }
      </div>
    </header>
  `;

  const portraitImg = root.querySelector(".saint-header__portrait img");
  const portraitFallback = root.querySelector(".saint-header__portrait-fallback");
  portraitImg.addEventListener("error", () => {
    portraitImg.style.display = "none";
    portraitFallback.style.display = "flex";
  });
}

/* =========================================================
   MAIN CONTENT
   ========================================================= */
function renderMain() {
  const main = document.getElementById("saint-main-content");
  main.innerHTML = "";

  if (state.storageWarning) {
    main.appendChild(
      buildNotice(
        "تعذّر حفظ تقدمك على هذا الجهاز (التخزين المحلي غير متاح)، لكن يمكنك متابعة الرحلة عاديًا.",
        "warning"
      )
    );
  }

  if (state.phase === PHASE.COMPLETION) {
    main.appendChild(buildCompletionScreen(state.saint));
    return;
  }

  if (state.resumeNotice) {
    main.appendChild(buildNotice(state.resumeNotice, "info"));
  }

  const flow = document.createElement("div");
  flow.className = "saint-flow";
  flow.appendChild(buildSteps());

  if (state.phase === PHASE.VIDEO) {
    const video = state.saint.videos[state.videoIndex];
    flow.appendChild(buildVideoPlayer(video, state.videoIndex, state.saint.videos.length));

    if (state.videoWatched) {
      const quizBtn = document.createElement("button");
      quizBtn.className = "btn btn-primary saint-flow__quiz-cta animate-fade-in";
      quizBtn.textContent = "اختبر نفسك";
      quizBtn.addEventListener("click", () => {
        state.phase = PHASE.QUIZ;
        renderMain();
      });
      flow.appendChild(quizBtn);
    }
  }

  if (state.phase === PHASE.QUIZ) {
    const video = state.saint.videos[state.videoIndex];
    const isLastVideo = state.videoIndex === state.saint.videos.length - 1;
    flow.appendChild(buildQuiz(video.questions, isLastVideo, handleQuizFinish));
  }

  main.appendChild(flow);
}

function buildNotice(text, kind) {
  const div = document.createElement("div");
  div.className = kind === "warning" ? "saint-notice saint-notice--warning" : "saint-notice";
  div.setAttribute("role", "status");
  div.textContent = text;
  return div;
}

function buildSteps() {
  const ol = document.createElement("ol");
  ol.className = "saint-steps";
  ol.setAttribute("aria-label", "خطوات الفيديوهات");

  state.saint.videos.forEach((video, i) => {
    const li = document.createElement("li");
    const isCurrent = i === state.videoIndex;
    const isDone = i < state.videoIndex;
    li.className = `saint-steps__item ${isCurrent ? "is-current" : ""} ${isDone ? "is-done" : ""}`.trim();
    li.innerHTML = `
      <span class="saint-steps__dot">${isDone ? "✓" : i + 1}</span>
      <span class="saint-steps__label">${video.title}</span>
    `;
    ol.appendChild(li);
  });

  return ol;
}

/* =========================================================
   VIDEO PLAYER
   ========================================================= */
function buildVideoPlayer(video, videoIndex, totalVideos) {
  const wrap = document.createElement("div");
  wrap.className = "video-player animate-fade-in";
  const isFirstVideo = videoIndex === 0;
  const isLastVideo = videoIndex === totalVideos - 1;

  wrap.innerHTML = `
    <div class="video-player__frame">
      <video class="video-player__video" src="${video.videoUrl}" controls controlsList="nodownload">
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
    </div>
    <div class="video-player__info">
      <h3 class="video-player__title">${video.title}</h3>
      <p class="video-player__description">${video.description}</p>
      <p class="video-player__hint" data-hint>أكمل مشاهدة الفيديو حتى النهاية لفتح الأسئلة.</p>
      <div class="video-player__actions">
        <button class="btn btn-secondary video-player__nav" type="button" data-prev ${isFirstVideo ? "disabled" : ""}>الفيديو السابق</button>
        <button class="btn btn-primary video-player__nav" type="button" data-next ${isLastVideo ? "disabled" : ""}>الفيديو التالي</button>
      </div>
    </div>
  `;

  const videoEl = wrap.querySelector(".video-player__video");
  const frame = wrap.querySelector(".video-player__frame");
  const hint = wrap.querySelector("[data-hint]");
  const prevBtn = wrap.querySelector("[data-prev]");
  const nextBtn = wrap.querySelector("[data-next]");

  function goToVideo(nextIndex) {
    if (nextIndex < 0 || nextIndex >= totalVideos) return;
    state.videoIndex = nextIndex;
    state.phase = PHASE.VIDEO;
    state.videoWatched = false;
    state.resumeNotice = null;
    renderHeader();
    renderMain();
  }

  prevBtn.addEventListener("click", () => goToVideo(videoIndex - 1));
  nextBtn.addEventListener("click", () => goToVideo(videoIndex + 1));

  videoEl.addEventListener("ended", () => {
    state.videoWatched = true;
    if (hint) hint.remove();
    renderMain();
  });

  videoEl.addEventListener("error", () => {
    frame.innerHTML = `
      <div class="video-player__error" role="alert">
        <span class="video-player__error-icon" aria-hidden="true">⚠</span>
        <p>تعذّر تحميل الفيديو.</p>
        <p class="video-player__error-hint">تأكد من وجود ملف الفيديو في المسار الصحيح: <code>${video.videoUrl}</code></p>
      </div>
    `;
  });

  return wrap;
}

/* =========================================================
   QUIZ
   ========================================================= */
function buildQuiz(questions, isLastVideo, onFinish) {
  const container = document.createElement("div");
  container.className = "quiz";

  if (!questions || questions.length === 0) {
    container.classList.add("quiz--empty");
    container.innerHTML = `<p>لا توجد أسئلة لهذا الفيديو بعد. أضف أسئلتك في ملف البيانات (js/data.js).</p>`;
    return container;
  }

  // Local quiz-session state, reset every time this quiz is built.
  let currentIndex = 0;
  let correctCount = 0;
  const total = questions.length;

  function renderQuestionStep() {
    container.innerHTML = "";

    const progressRow = document.createElement("div");
    progressRow.className = "quiz__progress";
    progressRow.innerHTML = `
      <span>سؤال ${currentIndex + 1} من ${total}</span>
      <div class="quiz__dots" aria-hidden="true">
        ${questions.map((_, i) => `<span class="quiz__dot ${i <= currentIndex ? "is-filled" : ""}"></span>`).join("")}
      </div>
    `;
    container.appendChild(progressRow);

    const questionEl = buildQuestion(questions[currentIndex], (isCorrect) => {
      if (isCorrect) correctCount += 1;
      const nextBtn = document.createElement("button");
      nextBtn.className = "btn btn-primary quiz__next animate-fade-in";
      nextBtn.textContent = "التالي";
      nextBtn.addEventListener("click", () => {
        if (currentIndex + 1 < total) {
          currentIndex += 1;
          renderQuestionStep();
        } else {
          renderSummary();
        }
      });
      container.appendChild(nextBtn);
    });

    container.appendChild(questionEl);
  }

  function renderSummary() {
    container.innerHTML = `
      <div class="quiz__summary animate-fade-in">
        <h3 class="quiz__summary-title">أحسنت!</h3>
        <p class="quiz__summary-score">${correctCount} / ${total} إجابات صحيحة</p>
        <p class="quiz__summary-sub">${isLastVideo ? "خلصت آخر جزء من الرحلة!" : "جاهز للجزء التالي؟"}</p>
        <button class="btn btn-primary" data-finish>
          ${isLastVideo ? "عرض شاشة الإنجاز" : "الفيديو التالي"}
        </button>
      </div>
    `;
    container.querySelector("[data-finish]").addEventListener("click", () => {
      onFinish(correctCount, total);
    });
  }

  renderQuestionStep();
  return container;
}

/**
 * Builds one quiz question. Once an option is picked it's locked — the
 * user cannot change their answer, and the correct answer is only
 * revealed after a choice is made.
 */
function buildQuestion(question, onAnswered) {
  const wrap = document.createElement("div");
  wrap.className = "question animate-slide-up";

  const optionsHtml = question.options
    .map(
      (option, index) => `
      <button type="button" role="radio" aria-checked="false" class="question__option question__option--idle" data-index="${index}">
        <span class="question__option-marker" aria-hidden="true"></span>
        ${option}
      </button>`
    )
    .join("");

  wrap.innerHTML = `
    <p class="question__text">${question.question}</p>
    <div class="question__options" role="radiogroup" aria-label="${question.question}">
      ${optionsHtml}
    </div>
  `;

  const optionButtons = Array.from(wrap.querySelectorAll(".question__option"));
  let answered = false;

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      const selectedIndex = Number(btn.dataset.index);
      const isCorrect = selectedIndex === question.correctAnswer;

      optionButtons.forEach((otherBtn) => {
        const otherIndex = Number(otherBtn.dataset.index);
        otherBtn.disabled = true;

        if (otherIndex === question.correctAnswer) {
          otherBtn.classList.remove("question__option--idle");
          otherBtn.classList.add("question__option--correct");
          otherBtn.querySelector(".question__option-marker").textContent = "✓";
        } else if (otherIndex === selectedIndex) {
          otherBtn.classList.remove("question__option--idle");
          otherBtn.classList.add("question__option--wrong");
          otherBtn.querySelector(".question__option-marker").textContent = "✕";
        } else {
          otherBtn.classList.remove("question__option--idle");
          otherBtn.classList.add("question__option--disabled");
        }
      });

      const feedback = document.createElement("div");
      feedback.className = `question__feedback question__feedback--${isCorrect ? "correct" : "wrong"} animate-fade-in`;
      feedback.innerHTML = isCorrect
        ? `<p>شاطر! واضح إنك كنت مركز.</p>`
        : `<p>الإجابة مش صحيحة.</p>
           <p>الإجابة الصحيحة هي: ${question.options[question.correctAnswer]}</p>
           <p>ولا يهمك، الجاية هتفتكر!</p>`;
      wrap.appendChild(feedback);

      onAnswered(isCorrect);
    });
  });

  return wrap;
}

function handleQuizFinish(correctCount, total) {
  const { saint, videoIndex } = state;
  const totalVideos = saint.videos.length;
  const isLastVideo = videoIndex === totalVideos - 1;

  recordQuizResult(saint.id, videoIndex, correctCount, total, totalVideos);

  if (isLastVideo) {
    state.phase = PHASE.COMPLETION;
  } else {
    state.videoIndex += 1;
    state.phase = PHASE.VIDEO;
    state.videoWatched = false;
    state.resumeNotice = null;
  }

  renderHeader();
  renderMain();
}

/* =========================================================
   COMPLETION SCREEN
   ========================================================= */
function buildCompletionScreen(saint) {
  const wrap = document.createElement("div");
  wrap.className = "completion animate-fade-in";

  wrap.innerHTML = `
    <svg class="completion__ornament completion__ornament--right" width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
      <path d="M4 4 C 30 4, 40 4, 40 4 M4 4 C 4 30, 4 40, 4 40" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" />
      <circle cx="4" cy="4" r="3.2" fill="var(--color-red)" />
    </svg>
    <svg class="completion__ornament completion__ornament--left" width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true" style="transform: scaleX(-1)">
      <path d="M4 4 C 30 4, 40 4, 40 4 M4 4 C 4 30, 4 40, 4 40" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" />
      <circle cx="4" cy="4" r="3.2" fill="var(--color-red)" />
    </svg>

    <span class="completion__emoji" aria-hidden="true">🎉</span>
    <h2 class="completion__title">مبروك! أكملت رحلتك مع ${saint.shortName}</h2>
    <p class="completion__text">أنت الآن تعرف المزيد عن حياته وخدمته.</p>
    <p class="completion__keepsake">احتفظ بالرحلة معك!</p>

    <a href="${saint.pdf}" download class="btn btn-primary completion__download" data-download-link>
      📖 تحميل الـ Comic Book
    </a>
    <p class="completion__error" role="alert" data-pdf-error hidden></p>
  `;

  const downloadLink = wrap.querySelector("[data-download-link]");
  const errorMsg = wrap.querySelector("[data-pdf-error]");

  downloadLink.addEventListener("click", () => {
    // If the PDF hasn't been placed on disk yet, show a clear message
    // instead of letting the browser silently fail the download.
    fetch(saint.pdf, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) throw new Error("missing");
      })
      .catch(() => {
        errorMsg.hidden = false;
        errorMsg.innerHTML = `ملف الـ Comic Book غير موجود بعد في المسار: <code>${saint.pdf}</code>`;
      });
  });

  return wrap;
}
