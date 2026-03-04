(function () {
  // Scale: 0..4
  // Each question belongs to one axis, with a weight.
  // We'll compute:
  // - axisScore = sum(answer * weight) per axis
  // - totalScore = sum(axisScore)
  // Convert totalScore to "hours lost/day" via mapping (0..MAX -> 0.5..6.0)
  // Then distribute lost hours across axes by axisScore proportion.

  const QUESTIONS = [
    // TIME
    { id: "q1", axis: "time", weight: 1.2, ar: "أبدأ يومي بدون خطة واضحة، فأضيّع أول ساعة بسهولة.", en: "I start my day without a clear plan, and the first hour disappears easily." },
    { id: "q2", axis: "time", weight: 1.1, ar: "أقاطع نفسي كثيرًا (تنقل بين مهام/فتح تطبيقات) دون إنجاز فعلي.", en: "I constantly switch tasks/apps without real progress." },
    { id: "q3", axis: "time", weight: 1.0, ar: "أؤجل الأعمال المهمة وأستبدلها بأشياء أسهل.", en: "I procrastinate on important work and replace it with easier tasks." },
    { id: "q4", axis: "time", weight: 1.0, ar: "اجتماعات/مكالمات كثيرة بدون نتيجة واضحة.", en: "Too many meetings/calls with unclear outcomes." },

    // ENERGY
    { id: "q5", axis: "energy", weight: 1.2, ar: "نومي غير منتظم ويؤثر على تركيزي.", en: "My sleep is inconsistent and it hurts my focus." },
    { id: "q6", axis: "energy", weight: 1.1, ar: "أشعر بإرهاق ذهني يمنعني من البدء حتى لو كان الوقت متاحًا.", en: "Mental fatigue stops me from starting even when I have time." },
    { id: "q7", axis: "energy", weight: 1.0, ar: "استهلك طاقتي في جدال/قلق/تفكير زائد أكثر مما يجب.", en: "I burn energy on worry/overthinking/arguments more than I should." },
    { id: "q8", axis: "energy", weight: 0.9, ar: "أهمل الحركة/الرياضة فتقل طاقتي العامة.", en: "I neglect movement/exercise and my overall energy drops." },

    // MONEY
    { id: "q9", axis: "money", weight: 1.1, ar: "أصرف على أشياء لا تضيف قيمة ثم أندم.", en: "I spend on low-value things and regret it." },
    { id: "q10", axis: "money", weight: 1.0, ar: "قراراتي المالية عشوائية (بدون ميزانية/متابعة).", en: "My financial decisions are random (no budget/track)." },
    { id: "q11", axis: "money", weight: 0.9, ar: "أضيع وقتًا طويلًا بسبب سوء تنظيم المصاريف/الالتزامات.", en: "I lose a lot of time due to poor organization of expenses/commitments." },

    // OPPORTUNITY
    { id: "q12", axis: "opportunity", weight: 1.2, ar: "أترك فرصًا لأنني لا أتابع أو لا أتحرك في الوقت المناسب.", en: "I miss opportunities because I don’t follow up or move in time." },
    { id: "q13", axis: "opportunity", weight: 1.1, ar: "لا أستثمر وقتًا ثابتًا لتطوير مهارة/تعلم يزيد دخلي أو قيمتي.", en: "I don’t invest consistent time in skills/learning that grow my value." },
    { id: "q14", axis: "opportunity", weight: 1.0, ar: "شبكتي وعلاقاتي لا أتعامل معها بذكاء (تواصل/متابعة/عرض قيمة).", en: "I don’t manage my network smartly (reach out, follow up, add value)." },
    { id: "q15", axis: "opportunity", weight: 0.9, ar: "أُفرّط في وقت الذروة (أفضل ساعات اليوم) على أمور تافهة.", en: "I waste my peak hours (best hours of the day) on trivial stuff." }
  ];

  const AXES = {
    time: { ar: "الوقت", en: "Time" },
    energy: { ar: "الطاقة", en: "Energy" },
    money: { ar: "المال", en: "Money" },
    opportunity: { ar: "الفرص", en: "Opportunities" }
  };

  function axisOrder() { return ["time", "energy", "money", "opportunity"]; }

  function getLang() { return window.I18N?.getLang?.() || "ar"; }

  function renderQuestions() {
    const wrap = document.getElementById("questions");
    wrap.innerHTML = "";

    const lang = getLang();
    QUESTIONS.forEach((q, idx) => {
      const div = document.createElement("div");
      div.className = "q";

      const head = document.createElement("div");
      head.className = "qHead";

      const title = document.createElement("div");
      title.className = "qTitle";
      title.textContent = `${idx + 1}. ${lang === "en" ? q.en : q.ar}`;

      const meta = document.createElement("div");
      meta.className = "qMeta";
      meta.textContent = (lang === "en")
        ? `Axis: ${AXES[q.axis].en}`
        : `المحور: ${AXES[q.axis].ar}`;

      head.appendChild(title);
      head.appendChild(meta);

      const scale = document.createElement("div");
      scale.className = "scale";

      for (let v = 0; v <= 4; v++) {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = q.id;
        input.value = String(v);

        // load saved answer if exists
        const saved = localStorage.getItem(`ans_${q.id}`);
        if (saved !== null && saved === String(v)) input.checked = true;
        if (saved === null && v === 0) input.checked = true;

        const txt = document.createElement("span");
        txt.textContent = String(v);

        label.appendChild(input);
        label.appendChild(txt);
        scale.appendChild(label);
      }

      div.appendChild(head);
      div.appendChild(scale);
      wrap.appendChild(div);
    });
  }

  function readAnswers() {
    const answers = {};
    QUESTIONS.forEach((q) => {
      const picked = document.querySelector(`input[name="${q.id}"]:checked`);
      const val = picked ? Number(picked.value) : 0;
      answers[q.id] = val;
    });
    return answers;
  }

  function compute(answers) {
    const axisScore = { time: 0, energy: 0, money: 0, opportunity: 0 };
    QUESTIONS.forEach((q) => {
      axisScore[q.axis] += (answers[q.id] || 0) * q.weight;
    });

    const totalScore = axisOrder().reduce((s, a) => s + axisScore[a], 0);

    // Max possible score
    const maxScore = QUESTIONS.reduce((s, q) => s + 4 * q.weight, 0);

    // Map score -> hours lost/day:
    // min 0.5h, max 6.0h
    const minH = 0.5;
    const maxH = 6.0;
    const ratio = (maxScore === 0) ? 0 : (totalScore / maxScore);
    const lostDaily = minH + ratio * (maxH - minH);

    // Distribute by axis proportion
    const sumAxes = axisOrder().reduce((s, a) => s + axisScore[a], 0) || 1;
    const axisPct = {};
    const axisHours = {};
    axisOrder().forEach((a) => {
      axisPct[a] = axisScore[a] / sumAxes;           // 0..1
      axisHours[a] = lostDaily * axisPct[a];         // hours/day per axis
    });

    return { axisScore, totalScore, maxScore, lostDaily, axisPct, axisHours };
  }

  function saveAnswers(answers) {
    Object.entries(answers).forEach(([k, v]) => {
      localStorage.setItem(`ans_${k}`, String(v));
    });
  }

  function incrementCompletedCount() {
    const key = "completedCount";
    const current = Number(localStorage.getItem(key) || "0");
    localStorage.setItem(key, String(current + 1));
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.I18N?.apply?.();

    renderQuestions();

    const form = document.getElementById("surveyForm");
    const resetBtn = document.getElementById("resetBtn");

    // re-render questions when language changes
    const langBtn = document.getElementById("langBtn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        setTimeout(renderQuestions, 0);
      });
    }

    resetBtn.addEventListener("click", () => {
      QUESTIONS.forEach((q) => localStorage.removeItem(`ans_${q.id}`));
      renderQuestions();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const answers = readAnswers();
      saveAnswers(answers);

      const result = compute(answers);

      // Save result payload for results page
      localStorage.setItem("lastResult", JSON.stringify({
        at: new Date().toISOString(),
        answers,
        ...result
      }));

      // Increment "completed analyses" counter (MVP local only)
      incrementCompletedCount();

      window.location.href = "results.html";
    });
  });
})();
