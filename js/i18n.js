(function () {
  const STRINGS = {
    ar: {
      "app.title": "خريطة حياتك + أين يضيع عمرك",
      "app.subtitle": "تصور بصري لعمرِك بالأسبوع + تحليل نزيف الوقت",

      "nav.home": "الرئيسية",
      "nav.startSurvey": "ابدأ التحليل",
      "nav.backSurvey": "رجوع للاستبيان",

      "landing.h1": "اعرف أين تقف الآن… بالأسبوع.",
      "landing.lead": "أدخل تاريخ ميلادك واختر متوسط العمر الافتراضي، ثم شاهد خريطة حياتك كشبكة من 4160 أسبوعًا.",
      "landing.dobLabel": "تاريخ الميلاد",
      "landing.dobHint": "لن يتم إرسال أي بيانات — كل شيء يعمل محليًا.",
      "landing.lifeLabel": "متوسط العمر الافتراضي (سنة)",
      "landing.lifeHint": "الافتراضي 80 سنة (يمكن تغييره).",
      "landing.generate": "توليد خريطة الحياة",
      "landing.startSurvey": "ابدأ تحليل \"أين يضيع عمرك\"",

      "stats.age": "عمرك الحالي",
      "stats.livedWeeks": "الأسابيع التي عشتها",
      "stats.leftWeeks": "الأسابيع المتبقية",
      "stats.completed": "عدد من أكملوا التحليل",

      "map.h2": "خريطة الحياة (كل مربع = أسبوع)",
      "map.legendLived": "أسابيع عشتها",
      "map.legendLeft": "أسابيع متبقية",
      "map.note": "ملاحظة: الخريطة تقديرية بالأسبوع (52 أسبوع لكل سنة). الهدف ليس الدقة الطبية، بل وضوح الصورة.",

      "share.h2": "شاركها",
      "share.lead": "شارك رابط الموقع مع نص جاهز. (واتساب + نسخ الرابط)",
      "share.whatsapp": "مشاركة واتساب",
      "share.copy": "نسخ الرابط",

      "footer.note": "نسخة MVP — بدون باك-إند. بياناتك تبقى على جهازك.",

      "survey.title": "استبيان: أين يضيع عمرك",
      "survey.subtitle": "15 سؤال — دقائق قليلة — نتيجة واضحة",
      "survey.h1": "أجب بصراحة. هذا القياس لن يفيد إلا إذا كان واقعيًا.",
      "survey.lead": "اختر تقييمك لكل بند من 0 إلى 4. (0 = لا ينطبق، 4 = ينطبق بقوة)",
      "survey.submit": "احسب النتيجة",
      "survey.reset": "إعادة الضبط",
      "survey.privacy": "كل الإجابات تُحفظ محليًا على جهازك فقط (localStorage).",

      "results.title": "نتيجتك",
      "results.subtitle": "أرقام صريحة + توزيع النزيف",
      "results.h1": "هذا تقدير عملي لنزيف وقتك — ليس حكمًا عليك.",
      "results.lostDaily": "ساعات ضائعة يوميًا",
      "results.lostYearlyH": "ساعات سنويًا",
      "results.lostYearlyD": "أيام سنويًا",
      "results.lost10Y": "سنوات خلال 10 سنوات",
      "results.bleedTitle": "توزيع النزيف على 4 محاور",
      "results.csv": "تصدير CSV",
      "results.nextTitle": "الخطوة التالية (بسيطة)",
      "results.next1": "اختر محورًا واحدًا فقط وقلّل نزيفه 20% لمدة أسبوع.",
      "results.next2": "راقب الفرق، ثم كرر. التحسن التراكمي يربح."
    },

    en: {
      "app.title": "Your Life Map + Where Your Time Leaks",
      "app.subtitle": "A weekly life grid + a clear time-leak assessment",

      "nav.home": "Home",
      "nav.startSurvey": "Start analysis",
      "nav.backSurvey": "Back to survey",

      "landing.h1": "See where you stand… in weeks.",
      "landing.lead": "Enter your date of birth and choose life expectancy to generate a 4,160-week life map.",
      "landing.dobLabel": "Date of birth",
      "landing.dobHint": "Nothing is uploaded — everything runs locally.",
      "landing.lifeLabel": "Life expectancy (years)",
      "landing.lifeHint": "Default is 80 years (editable).",
      "landing.generate": "Generate life map",
      "landing.startSurvey": "Start “Where your time leaks”",

      "stats.age": "Current age",
      "stats.livedWeeks": "Weeks lived",
      "stats.leftWeeks": "Weeks left",
      "stats.completed": "Completed analyses",

      "map.h2": "Life map (each square = 1 week)",
      "map.legendLived": "Weeks lived",
      "map.legendLeft": "Weeks left",
      "map.note": "Note: This is a weekly estimate (52 weeks/year). The point is clarity, not medical precision.",

      "share.h2": "Share it",
      "share.lead": "Share the site link with a ready text. (WhatsApp + Copy link)",
      "share.whatsapp": "Share on WhatsApp",
      "share.copy": "Copy link",

      "footer.note": "MVP — no backend. Your data stays on your device.",

      "survey.title": "Survey: Where your time leaks",
      "survey.subtitle": "15 questions — a few minutes — clear numbers",
      "survey.h1": "Be honest. This only works if it’s real.",
      "survey.lead": "Rate each item from 0 to 4. (0 = not true, 4 = strongly true)",
      "survey.submit": "Calculate results",
      "survey.reset": "Reset",
      "survey.privacy": "All answers are stored locally on your device (localStorage).",

      "results.title": "Your results",
      "results.subtitle": "Hard numbers + leak distribution",
      "results.h1": "This is a practical estimate of your time leak — not a judgment.",
      "results.lostDaily": "Hours lost per day",
      "results.lostYearlyH": "Hours per year",
      "results.lostYearlyD": "Days per year",
      "results.lost10Y": "Years over 10 years",
      "results.bleedTitle": "Leak distribution across 4 axes",
      "results.csv": "Export CSV",
      "results.nextTitle": "Next step (simple)",
      "results.next1": "Pick ONE axis and cut it by 20% for a week.",
      "results.next2": "Measure the change, repeat. Compounding wins."
    }
  };

  function setDir(lang) {
    document.documentElement.lang = lang;
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }

  function applyI18n(lang) {
    setDir(lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = STRINGS[lang]?.[key];
      if (value) el.textContent = value;
    });

    const langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.textContent = (lang === "ar") ? "EN" : "AR";
  }

  window.I18N = {
    getLang() {
      return localStorage.getItem("lang") || "ar";
    },
    setLang(lang) {
      localStorage.setItem("lang", lang);
      applyI18n(lang);
    },
    toggle() {
      const current = window.I18N.getLang();
      window.I18N.setLang(current === "ar" ? "en" : "ar");
    },
    apply() {
      applyI18n(window.I18N.getLang());
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.I18N.apply();
    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", window.I18N.toggle);
  });
})();
