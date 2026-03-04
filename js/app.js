(function () {
  const TOTAL_YEARS_DEFAULT = 80;
  const WEEKS_PER_YEAR = 52;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function weeksBetween(d1, d2) {
    const ms = d2.getTime() - d1.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
  }

  function ageYears(dob, now) {
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  }

  function renderMap(livedWeeks, totalWeeks) {
    const map = document.getElementById("lifeMap");
    map.innerHTML = "";
    // 4160 cell default, but allow custom totalWeeks based on life expectancy
    const cells = totalWeeks;
    for (let i = 0; i < cells; i++) {
      const div = document.createElement("div");
      div.className = "cell" + (i < livedWeeks ? " lived" : "");
      map.appendChild(div);
    }
  }

  function updateStats({ age, livedWeeks, leftWeeks }) {
    document.getElementById("ageVal").textContent = (age >= 0 ? `${age}` : "—");
    document.getElementById("livedWeeksVal").textContent = (livedWeeks >= 0 ? `${livedWeeks}` : "—");
    document.getElementById("leftWeeksVal").textContent = (leftWeeks >= 0 ? `${leftWeeks}` : "—");
  }

  function getCompletedCount() {
    return Number(localStorage.getItem("completedCount") || "0");
  }

  function refreshCompletedCountUI() {
    const el = document.getElementById("completedCount");
    if (el) el.textContent = String(getCompletedCount());
  }

  function shareText() {
    const lang = window.I18N?.getLang?.() || "ar";
    const url = window.location.origin + window.location.pathname.replace(/index\.html$/, "");
    if (lang === "en") {
      return `Try this: a 4,160-week life map + a quick time-leak analysis.\n${url}`;
    }
    return `جرّب هذا: خريطة حياتك بالأسبوع + تحليل سريع لنزيف الوقت.\n${url}`;
  }

  async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
  }

  function openWhatsApp(text) {
    const u = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(u, "_blank");
  }

  document.addEventListener("DOMContentLoaded", () => {
    refreshCompletedCountUI();

    const dobInput = document.getElementById("dob");
    const lifeInput = document.getElementById("lifeExpectancy");
    const generateBtn = document.getElementById("generateBtn");

    // Load saved values
    const savedDob = localStorage.getItem("dob");
    const savedLife = localStorage.getItem("lifeExpectancy");
    if (savedDob) dobInput.value = savedDob;
    if (savedLife) lifeInput.value = savedLife;

    // Auto-generate if exists
    if (savedDob) {
      try {
        const now = new Date();
        const dob = new Date(savedDob);
        const lifeYears = Number(lifeInput.value || TOTAL_YEARS_DEFAULT);
        const totalWeeks = clamp(Math.floor(lifeYears * WEEKS_PER_YEAR), 1, 120 * WEEKS_PER_YEAR);
        const lived = clamp(weeksBetween(dob, now), 0, totalWeeks);
        const left = clamp(totalWeeks - lived, 0, totalWeeks);
        updateStats({ age: ageYears(dob, now), livedWeeks: lived, leftWeeks: left });
        renderMap(lived, totalWeeks);
      } catch {}
    }

    generateBtn.addEventListener("click", () => {
      const dobVal = dobInput.value;
      if (!dobVal) {
        alert((window.I18N.getLang() === "en") ? "Please enter your date of birth." : "أدخل تاريخ ميلادك.");
        return;
      }
      const now = new Date();
      const dob = new Date(dobVal);

      const lifeYears = Number(lifeInput.value || TOTAL_YEARS_DEFAULT);
      const totalWeeks = clamp(Math.floor(lifeYears * WEEKS_PER_YEAR), 1, 120 * WEEKS_PER_YEAR);

      const lived = clamp(weeksBetween(dob, now), 0, totalWeeks);
      const left = clamp(totalWeeks - lived, 0, totalWeeks);

      localStorage.setItem("dob", dobVal);
      localStorage.setItem("lifeExpectancy", String(lifeYears));

      updateStats({ age: ageYears(dob, now), livedWeeks: lived, leftWeeks: left });
      renderMap(lived, totalWeeks);
    });

    // Share buttons
    const shareBtn = document.getElementById("shareWhatsApp");
    const copyBtn = document.getElementById("copyLink");
    const copyStatus = document.getElementById("copyStatus");

    if (shareBtn) {
      shareBtn.addEventListener("click", () => openWhatsApp(shareText()));
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          const url = window.location.href.replace(/index\.html$/, "");
          await copyToClipboard(url);
          copyStatus.textContent = (window.I18N.getLang() === "en") ? "Link copied." : "تم نسخ الرابط.";
        } catch {
          copyStatus.textContent = (window.I18N.getLang() === "en") ? "Copy failed." : "فشل النسخ.";
        }
      });
    }
  });
})();
