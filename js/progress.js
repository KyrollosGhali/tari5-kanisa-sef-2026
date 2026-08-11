// js/progress.js
// -----------------------------------------------------------------------
// Handles reading and writing the user's journey progress to localStorage.
// Shape stored per saint:
//   {
//     [saintId]: {
//       lastVideoIndex: 0,           // 0-based index of the video the user reached
//       completedVideos: [0, 1],     // indices of videos whose quiz was finished
//       scores: { 0: { correct: 4, total: 5 } },
//       completed: false             // true once all 3 videos + quizzes are done
//     }
//   }
// -----------------------------------------------------------------------

const PROGRESS_STORAGE_KEY = "coptic-journey-progress";

/** Safely checks whether localStorage is available (private browsing, etc. can block it). */
function isStorageAvailable() {
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readAllProgress() {
  if (!isStorageAvailable()) return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    // Corrupted data — start fresh rather than crashing the app.
    return {};
  }
}

function writeAllProgress(data) {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/** Returns the progress object for one saint, with sensible defaults. */
function getSaintProgress(saintId) {
  const all = readAllProgress();
  return (
    all[saintId] || {
      lastVideoIndex: 0,
      completedVideos: [],
      scores: {},
      completed: false,
    }
  );
}

/** Marks a video's quiz as completed and stores its score. Returns the updated progress. */
function recordQuizResult(saintId, videoIndex, correctCount, totalCount, totalVideos) {
  const all = readAllProgress();
  const current = all[saintId] || {
    lastVideoIndex: 0,
    completedVideos: [],
    scores: {},
    completed: false,
  };

  const completedVideos = current.completedVideos.includes(videoIndex)
    ? current.completedVideos
    : [...current.completedVideos, videoIndex];

  const nextIndex = Math.min(videoIndex + 1, totalVideos - 1);

  const updated = {
    ...current,
    completedVideos,
    scores: { ...current.scores, [videoIndex]: { correct: correctCount, total: totalCount } },
    lastVideoIndex: Math.max(current.lastVideoIndex, nextIndex),
    completed: completedVideos.length >= totalVideos,
  };

  all[saintId] = updated;
  writeAllProgress(all);
  return updated;
}

/** Percentage (0-100) of a saint's journey completed, based on finished quizzes. */
function getProgressPercent(saintId, totalVideos) {
  const progress = getSaintProgress(saintId);
  if (!totalVideos) return 0;
  return Math.round((progress.completedVideos.length / totalVideos) * 100);
}

/** Clears all stored progress — handy during testing. */
function resetAllProgress() {
  writeAllProgress({});
}
