(function () {
  function getLang() { return window.I18N?.getLang?.() || "ar"; }

  function format1(n) { return (Math.round(n * 10) / 10).toFixed(1); }

  function shareText() {
    const lang = getLang();
    const base = window.location.origin + window.location.pathname.replace(/results\.html$/, "");
    if (lang === "en") return `I just ran a quick time-leak analysis. Try it:\n${base}`;
    return `سويت تحليل سريع لنزيف الوقت. جرّبه هنا:\n${base}`;
  }

  async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
  }

  function openWhatsApp(text) {
    const u = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(u, "_blank");
  }

  function axisLabel(axis) {
    const lang = getLang();
    const map = {
      time: { ar: "الوقت", en: "Time" },
      energy: { ar: "الطاقة", en: "Energy" },
      money: { ar: "المال", en: "Money" },
      opportunity: { ar: "الفرص", en: "Opportunities" }
    };
    return map[axis]?.[lang] || axis;
  }

  function renderAxes(axisPct, axisHours) {
    const wrap = document.getElementById("axes");
    wrap.innerHTML = "";

    const axes = ["time", "energy", "money", "opportunity"];
    axes.forEach((a) => {
      const pct = axisPct[a] || 0;
      const hrs = axisHours[a] || 0;

      const box = document.createElement("div");
      box.className = "axis";

      const top = document.createElement("div");
      top.className = "axisTop";

      const name = document.createElement("div");
      name.className = "axisName";
      name.textContent = axisLabel(a);

      const pctEl = document.createElement("div");
      pctEl.className = "axisPct";
      pctEl.textContent = `${Math.round(pct * 100)}% • ${format1(hrs)}h/day`;

      top.appendChild(name);
      top.appendChild(pctEl);

      const bar = document.createElement("div");
      bar.className = "bar";
      const fill = document.createElement("div");
      fill.style.width = `${Math.round(pct * 100)}%`;
      fill.style.background = "rgba(110,168,254,.55)";
      bar.appendChild(fill);

      box.appendChild(top);
      box.appendChild(bar);
      wrap.appendChild(box);
    });
  }

  function buildCSV(payload) {
    const lang = getLang();
    const lines = [];

    // header
    lines.push(["metric", "value"].join(","));

    const lostDaily = payload.lostDaily;
    const lostYearlyH = lostDaily * 365;
    const lostYearlyD = lostYearlyH / 24;
    const lost10Y = (lostYearlyH * 10) / (24 * 365);

    lines.push(["lost_hours_per_day", format1(lostDaily)].join(","));
    lines.push(["lost_hours_per_year", format1(lostYearlyH)].join(","));
    lines.push(["lost_days_per_year", format1(lostYearlyD)].join(","));
    lines.push(["lost_years_over_10_years", format1(lost10Y)].join(","));

    lines.push(["", ""].join(","));
    lines.push(["axis", "percent"].join(","));
    ["time", "energy", "money", "opportunity"].forEach((a) => {
      lines.push([axisLabel(a), Math.round((payload.axisPct?.[a] || 0) * 100)].join(","));
    });

    // Add timestamp
    lines.push(["", ""].join(","));
    lines.push(["generated_at", payload.at || ""].join(","));

    const csv = lines.join("\n");
    return "\uFEFF" + csv; // BOM for Excel Arabic
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function renderNumbers(payload) {
    const lostDaily = payload.lostDaily;
    const lostYearlyH = lostDaily * 365;
    const lostYearlyD = lostYearlyH / 24;
    const lost10Y = (lostYearlyH * 10) / (24 * 365);

    document.getElementById("lostDaily").textContent = format1(lostDaily);
    document.getElementById("lostYearlyH").textContent = format1(lostYearlyH);
    document.getElementById("lostYearlyD").textContent = format1(lostYearlyD);
    document.getElementById("lost10Y").textContent = format1(lost10Y);
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.I18N?.apply?.();

    const raw = localStorage.getItem("lastResult");
    if (!raw) {
      alert(getLang() === "en" ? "No results found. Please complete the survey first." : "لا توجد نتيجة. أكمل الاستبيان أولًا.");
      window.location.href = "survey.html";
      return;
    }
    const payload = JSON.parse(raw);

    renderNumbers(payload);
    renderAxes(payload.axisPct || {}, payload.axisHours || {});

    // Buttons
    const csvBtn = document.getElementById("downloadCsv");
    csvBtn.addEventListener("click", () => {
      const csv = buildCSV(payload);
      download("time_leak_result.csv", csv);
    });

    const shareBtn = document.getElementById("shareWhatsApp");
    const copyBtn = document.getElementById("copyLink");
    const copyStatus = document.getElementById("copyStatus");

    shareBtn.addEventListener("click", () => openWhatsApp(shareText()));
    copyBtn.addEventListener("click", async () => {
      try {
        const base = window.location.origin + window.location.pathname.replace(/results\.html$/, "");
        await copyToClipboard(base);
        copyStatus.textContent = (getLang() === "en") ? "Link copied." : "تم نسخ الرابط.";
      } catch {
        copyStatus.textContent = (getLang() === "en") ? "Copy failed." : "فشل النسخ.";
      }
    });

    // Re-render on language toggle (for axis labels)
    const langBtn = document.getElementById("langBtn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        setTimeout(() => {
          renderNumbers(payload);
          renderAxes(payload.axisPct || {}, payload.axisHours || {});
        }, 0);
      });
    }
  });
})();
