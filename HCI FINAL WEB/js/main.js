// Close the top banner 
var closeBanner = document.getElementById("closeBanner");
var banner = document.getElementById("banner");

if (closeBanner && banner) {
  closeBanner.addEventListener("click", function () {
    banner.hidden = true;
  });
}

//  Mobile navigation
var menu = document.getElementById("menu");
var nav = document.getElementById("nav");

if (menu && nav) {
  menu.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }
  });
}

//Highlight the active navigation link
var links = document.querySelectorAll("nav a");
var sections = document.querySelectorAll("main section");

if ("IntersectionObserver" in window) {
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (link) {
          link.classList.toggle(
            "on",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  }, {
    rootMargin: "-40% 0px -55% 0px"
  });

  sections.forEach(function (section) {
    spy.observe(section);
  });
}

//Animate skill bars
var bars = document.querySelectorAll(".bar i");

if ("IntersectionObserver" in window) {
  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width =
          entry.target.dataset.level + "%";

        barObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4
  });

  bars.forEach(function (bar) {
    barObserver.observe(bar);
  });
} else {
  bars.forEach(function (bar) {
    bar.style.width = bar.dataset.level + "%";
  });
}

// Automatically update the footer year
var year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Theme toggle
var root = document.documentElement;
var themeBtn = document.getElementById("theme");

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    var currentTheme = root.dataset.theme || "dark";
    var nextTheme = currentTheme === "dark" ? "light" : "dark";

    root.dataset.theme = nextTheme;
  });
}

// Scroll progress and back-to-top button 
var progress = document.getElementById("progress");
var toTop = document.getElementById("toTop");

window.addEventListener("scroll", function () {
  var pageHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (progress) {
    var percentage = pageHeight > 0
      ? (window.scrollY / pageHeight) * 100
      : 0;

    progress.style.width = percentage + "%";
  }

  if (toTop) {
    toTop.hidden = window.scrollY < 600;
  }
}, {
  passive: true
});

if (toTop) {
  toTop.addEventListener("click", function () {
    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
}

// Typewriter effect
const words = [
  "discovering myself",
  "learning new things",
  "gaming and dancing",
  "loving cats",
  "being Finn's human",
  "chasing little dreams",
  "finding my own path"
];

var typed = document.getElementById("typed");
var reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (typed && !reduceMotion) {
  var wordIndex = 0;
  var charIndex = words[0].length;
  var deleting = true;

  function typeWriter() {
    var word = words[wordIndex];

    charIndex += deleting ? -1 : 1;
    typed.textContent = word.slice(0, charIndex);

    var delay = 90;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }

    window.setTimeout(typeWriter, delay);
  }

  typeWriter();
}

//Hobby "Tell me more" buttons
document.querySelectorAll(".hobby .more").forEach(function (button) {
  button.addEventListener("click", function () {
    var details = button.nextElementSibling;
    var isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "Tell me more" : "Show less";

    if (details) {
      details.hidden = isOpen;
    }
  });
});

// ---------- Interest filters and search ----------
var chips = document.querySelectorAll(".chip");
var interestItems = document.querySelectorAll(".interests li");
var search = document.getElementById("search");
var empty = document.getElementById("empty");
var activeCategory = "all";

function applyInterestFilter() {
  var query = search ? search.value.trim().toLowerCase() : "";
  var visibleCount = 0;

  interestItems.forEach(function (item) {
    var categoryMatches =
      activeCategory === "all" ||
      item.dataset.cat === activeCategory;

    var textMatches =
      item.textContent.toLowerCase().includes(query);

    var visible = categoryMatches && textMatches;

    item.hidden = !visible;

    if (visible) {
      visibleCount++;
    }
  });

  if (empty) {
    empty.hidden = visibleCount > 0;
  }
}

chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    chips.forEach(function (item) {
      item.classList.remove("on");
    });

    chip.classList.add("on");
    activeCategory = chip.dataset.filter;

    applyInterestFilter();
  });
});

if (search) {
  search.addEventListener("input", applyInterestFilter);
}


 // ---------- Contact form validation and success popup ----------
var form = document.getElementById("form");
var errorMessage = document.getElementById("err");
var successMessage = document.getElementById("ok");

var popup = document.getElementById("successPopup");
var popupClose = document.getElementById("popupClose");

function closePopup() {
  if (popup) {
    popup.hidden = true;
  }
}

if (popupClose) {
  popupClose.addEventListener("click", closePopup);
}

if (popup) {
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      closePopup();
    }
  });
}

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var messageInput = document.getElementById("msg");
    var message = "";

    [nameInput, emailInput, messageInput].forEach(function (input) {
      if (input) {
        input.removeAttribute("aria-invalid");
      }
    });

    if (!nameInput || !nameInput.value.trim()) {
      message = "Please enter your name.";
      if (nameInput) nameInput.setAttribute("aria-invalid", "true");

    } else if (
      !emailInput ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
    ) {
      message = "Please enter a valid email address.";
      if (emailInput) emailInput.setAttribute("aria-invalid", "true");

    } else if (!messageInput || messageInput.value.trim().length < 10) {
      message = "Your message needs at least 10 characters.";
      if (messageInput) messageInput.setAttribute("aria-invalid", "true");
    }

    if (errorMessage) {
      errorMessage.textContent = message;
    }

    if (successMessage) {
      successMessage.hidden = true;
    }

    if (message) {
      return;
    }

    // Demo only: this displays a confirmation but does not send an email.
    form.reset();

    if (errorMessage) {
      errorMessage.textContent = "";
    }

    if (popup) {
      popup.hidden = false;
      popupClose.focus();
    } else if (successMessage) {
      successMessage.textContent =
        "Thank you! Your message was submitted successfully.";
      successMessage.hidden = false;
    }
  });
}


// ---------- Opening screen ----------
var intro = document.getElementById("intro");
var site = document.getElementById("site");
var openBtn = document.getElementById("openBtn");

function openSite(instant) {
  if (!intro || !site) {
    return;
  }

  site.removeAttribute("inert");
  document.body.classList.remove("locked");
  window.scrollTo(0, 0);

  if (instant) {
    intro.hidden = true;
    return;
  }

  intro.classList.add("opening");

  window.setTimeout(function () {
    intro.hidden = true;

    var heroHeading = document.querySelector(".hero h1");

    if (heroHeading) {
      heroHeading.setAttribute("tabindex", "-1");
      heroHeading.focus({
        preventScroll: true
      });
    }
  }, 1050);
}

if (openBtn) {
  openBtn.addEventListener("click", function () {
    openSite(false);
  });
}

// Skip the opening screen if the URL links directly to a section.
if (window.location.hash) {
  openSite(true);
}


const musicFilters = document.querySelectorAll(".music-filter");
const songCards = document.querySelectorAll(".song-card");

musicFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const mood = filter.dataset.mood;

    musicFilters.forEach((button) => {
      button.classList.toggle("active", button === filter);
    });

    songCards.forEach((song) => {
      song.hidden =
        mood !== "all" && song.dataset.mood !== mood;
    });
  });
});


/* ================= CAT LOVER ADDITIONS ================= */
(function () {
  var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  // ----- Eyes follow the cursor -----
  var pupils = document.getElementById("pupils");
  var catSvg = document.getElementById("catSvg");

  function lookAt(x, y) {
    if (!pupils || !catSvg) return;
    var r = catSvg.getBoundingClientRect();
    var dx = x - (r.left + r.width / 2);
    var dy = y - (r.top + r.height * 0.42);
    var dist = Math.hypot(dx, dy) || 1;
    var move = Math.min(7, dist / 25);
    pupils.style.transform =
      "translate(" + (dx / dist) * move + "px," + (dy / dist) * move * 0.8 + "px)";
  }

  document.addEventListener("pointermove", function (e) { lookAt(e.clientX, e.clientY); });

  // ----- Blinking -----
  var eyes = document.querySelector(".eyes");
  if (eyes && !noMotion) {
    setInterval(function () {
      eyes.classList.add("blink");
      setTimeout(function () { eyes.classList.remove("blink"); }, 200);
    }, 3200);
  }

  // ----- Petting the cat -----
  var stage = document.getElementById("catStage");
  var bubble = document.getElementById("catBubble");
  var petCountEl = document.getElementById("petCount");
  var moodEl = document.getElementById("catMood");
  var meter = document.getElementById("meterFill");
  var pets = 0;

  var talk = [
    "Purrrr… 😽", "Mrrp! 🐾", "More chin scratches, please.", "You're my favorite human! 💗",
    "Prrrt?", "Don't stop. Don't you dare stop.", "*slow blink* 😌", "Neira says hi! ♡"
  ];

  function mood(n) {
    if (n < 3) return "Curious 👀";
    if (n < 7) return "Happy 😺";
    if (n < 12) return "Purring loudly 😻";
    return "Completely melted 🫠";
  }

  function spawnHeart(x, y) {
    var h = document.createElement("span");
    h.className = "heart";
    h.textContent = pick(["💗", "🐾", "💕", "✨"]);
    h.style.left = x + (Math.random() * 40 - 20) + "px";
    h.style.top = y + "px";
    document.body.appendChild(h);
    setTimeout(function () { h.remove(); }, 1000);
  }

  if (stage) {
    stage.addEventListener("click", function (e) {
      pets++;
      petCountEl.textContent = pets;
      moodEl.textContent = mood(pets);
      meter.style.width = Math.min(100, pets * 8) + "%";
      bubble.textContent = pets === 15 ? "Okay okay, you've officially made a friend for life. 💞" : pick(talk);

      var rect = stage.getBoundingClientRect();
      var x = e.clientX || rect.left + rect.width / 2;
      var y = e.clientY || rect.top + rect.height / 3;
      spawnHeart(x, y);

      stage.classList.remove("petted");
      void stage.offsetWidth;
      stage.classList.add("petted");
    });
  }

  // ----- Cat facts -----
  var facts = [
    "Cats sleep around 12–16 hours a day. Professional nappers!",
    "A cat's purr vibrates at roughly 25–150 Hz.",
    "Each cat nose has a unique ridge pattern, like a fingerprint.",
    "Cats mostly meow to talk to humans, not to other cats.",
    "A cat's ears have about 32 muscles each and can rotate toward sounds.",
    "Whiskers help cats sense nearby objects and judge gaps.",
    "A slow blink from a cat is often a sign of trust and affection.",
    "Kneading (\"making biscuits\") is a habit that starts in kittenhood."
  ];
  var factText = document.getElementById("factText");
  var factBtn = document.getElementById("factBtn");
  var lastFact = -1;

  if (factBtn && factText) {
    factBtn.addEventListener("click", function () {
      var i;
      do { i = Math.floor(Math.random() * facts.length); } while (i === lastFact);
      lastFact = i;
      factText.textContent = "🐾 " + facts[i];
      factBtn.textContent = "Another one! ♡";
    });
  }

  // ----- Flip cards -----
  document.querySelectorAll(".flip").forEach(function (card) {
    card.addEventListener("click", function () {
      var on = card.classList.toggle("on");
      card.setAttribute("aria-pressed", String(on));
    });
  });

  // ----- Which cat are you? quiz -----
  var questions = [
    { q: "Your perfect Saturday?", a: [["Blanket + movie", "cozy"], ["Doing everything at once", "chaos"], ["Late-night wandering", "mystic"]] },
    { q: "Pick a snack:", a: [["Warm cookies", "cozy"], ["Whatever's closest", "chaos"], ["Dark chocolate", "mystic"]] },
    { q: "Your friends describe you as…", a: [["Sweet and caring", "cozy"], ["Loud and fun", "chaos"], ["Calm and mysterious", "mystic"]] }
  ];
  var results = {
    cozy: { e: "😽", t: "The Cozy Cuddler", d: "Soft, warm and loyal. You're everyone's favorite lap and comfort." },
    chaos: { e: "😸", t: "The Zoomie Goblin", d: "Pure energy. You sprint at 3 AM and make life way more fun." },
    mystic: { e: "🐈‍⬛", t: "The Midnight Mystic", d: "Calm, cool and a little mysterious, just like a black cat with blue eyes." }
  };

  var qEl = document.getElementById("quizQ");
  var optsEl = document.getElementById("quizOpts");
  var stepEl = document.getElementById("quizStep");
  var resBox = document.getElementById("quizResult");
  var restart = document.getElementById("quizRestart");
  var step = 0, score = {};

  function showQuestion() {
    resBox.hidden = true;
    qEl.hidden = false; optsEl.hidden = false; stepEl.hidden = false;
    var item = questions[step];
    qEl.textContent = item.q;
    stepEl.textContent = "Question " + (step + 1) + " of " + questions.length;
    optsEl.innerHTML = "";
    item.a.forEach(function (opt) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = opt[0];
      b.addEventListener("click", function () {
        score[opt[1]] = (score[opt[1]] || 0) + 1;
        step++;
        step < questions.length ? showQuestion() : showResult();
      });
      optsEl.appendChild(b);
    });
  }

  function showResult() {
    var best = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; })[0];
    var r = results[best];
    document.getElementById("resEmoji").textContent = r.e;
    document.getElementById("resTitle").textContent = "You're " + r.t + "!";
    document.getElementById("resText").textContent = r.d;
    qEl.hidden = true; optsEl.hidden = true; stepEl.hidden = true;
    resBox.hidden = false;
  }

  if (qEl && optsEl) {
    restart.addEventListener("click", function () { step = 0; score = {}; showQuestion(); });
    showQuestion();
  }

  // ----- Floating cat buddy -----
  var buddyBtn = document.getElementById("buddyBtn");
  var buddyBubble = document.getElementById("buddyBubble");
  var buddyTimer;
  var buddyLines = [
    "Hi! I'm Neira's cat buddy. 🐾",
    "Neira loves cats. A LOT. 💗",
    "Scroll down, there's a cat quiz!",
    "Have you met Finn yet? He's the star! 🐈",
    "Have you petted the big cat yet?",
    "Try typing 'meow'. Just saying. 😼",
    "Check out Neira's music corner 🎧"
  ];

  function buddySay(text) {
    if (!buddyBubble) return;
    buddyBubble.textContent = text;
    buddyBubble.hidden = false;
    clearTimeout(buddyTimer);
    buddyTimer = setTimeout(function () { buddyBubble.hidden = true; }, 3500);
  }

  if (buddyBtn) {
    buddyBtn.addEventListener("click", function () { buddySay(pick(buddyLines)); });
    // greet after the visitor enters the site
    setTimeout(function () { buddySay("Psst… meet Finn, Neira's best buddy 🐾"); }, 9000);
  }

})();


/* ================= FINN + MORE INTERACTIVITY ================= */
(function () {
  var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function $(id) { return document.getElementById(id); }

  /* ---------- Cat Quest ---------- */
  var tasks = [
    { id: "pet",   label: "Pet the big cat 5 times" },
    { id: "meow",  label: "Say \"meow\" to the cat" },
    { id: "story", label: "Read all of Finn's story" },
    { id: "cheer", label: "Let Finn cheer you up" },
    { id: "game",  label: "Catch 5 yarns" },
    { id: "quiz",  label: "Find out which cat you are" }
  ];
  var doneTasks = {};
  var questBtn = $("questBtn"), questPanel = $("questPanel"), questList = $("questList");
  var questCount = $("questCount"), questReward = $("questReward");

  function renderQuest() {
    questList.innerHTML = "";
    var n = 0;
    tasks.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = (doneTasks[t.id] ? "✅ " : "⬜ ") + t.label;
      if (doneTasks[t.id]) { li.className = "done"; n++; }
      questList.appendChild(li);
    });
    questCount.textContent = n + "/" + tasks.length;
    if (n === tasks.length) {
      questReward.hidden = false;
      questBtn.classList.add("done");
    }
    return n;
  }

  function quest(id) {
    if (doneTasks[id]) return;
    doneTasks[id] = true;
    var n = renderQuest();
    var r = questBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 5);
    if (n === tasks.length) {
      questPanel.hidden = false;
      questBtn.setAttribute("aria-expanded", "true");
      burst(window.innerWidth / 2, window.innerHeight / 2, 18);
      rain();
    }
  }

  if (questBtn) {
    renderQuest();
    questBtn.addEventListener("click", function () {
      questPanel.hidden = !questPanel.hidden;
      questBtn.setAttribute("aria-expanded", String(!questPanel.hidden));
    });
  }

  /* ---------- helpers: hearts + paw rain ---------- */
  function burst(x, y, n) {
    for (var i = 0; i < n; i++) {
      var h = document.createElement("span");
      h.className = "heart";
      h.textContent = pick(["💗", "🐾", "💕", "✨"]);
      h.style.left = x + (Math.random() * 120 - 60) + "px";
      h.style.top = y + (Math.random() * 40 - 20) + "px";
      h.style.animationDelay = Math.random() * 0.25 + "s";
      document.body.appendChild(h);
      setTimeout((function (el) { return function () { el.remove(); }; })(h), 1400);
    }
  }

  function rain() {
    if (noMotion) return;
    for (var i = 0; i < 30; i++) {
      var p = document.createElement("span");
      p.className = "paw-fall";
      p.textContent = pick(["🐾", "🐱", "💗"]);
      p.style.left = Math.random() * 100 + "vw";
      p.style.fontSize = 1 + Math.random() * 1.5 + "rem";
      p.style.animationDuration = 2 + Math.random() * 2 + "s";
      p.style.animationDelay = Math.random() + "s";
      document.body.appendChild(p);
      setTimeout((function (el) { return function () { el.remove(); }; })(p), 5200);
    }
  }

  /* ---------- Quest hooks for the big cat section ---------- */
  var stage = $("catStage"), clicks = 0;
  if (stage) {
    stage.addEventListener("click", function () {
      clicks++;
      if (clicks >= 5) quest("pet");
    });
  }

  var quizBox = $("quizResult");
  if (quizBox && "MutationObserver" in window) {
    new MutationObserver(function () { if (!quizBox.hidden) quest("quiz"); })
      .observe(quizBox, { attributes: true, attributeFilter: ["hidden"] });
  }

  /* ---------- Talk to the cat (type "meow") ---------- */
  var meowForm = $("meowBox"), meowInput = $("meowInput"), bubble = $("catBubble");

  function catSays(text) { if (bubble) bubble.textContent = text; }

  function doMeow() {
    catSays("MEOW! 😹🐾");
    rain();
    quest("meow");
    meowInput.value = "";
  }

  function reply(text) {
    var t = text.toLowerCase();
    if (t.indexOf("meow") > -1) return doMeow();
    if (/finn/.test(t))       catSays("Finn? That's Neira's best buddy! Scroll down to meet him 💗");
    else if (/neira|rein/.test(t)) catSays("Neira loves cats SO much. 🐾");
    else if (/hi|hello|hey/.test(t)) catSays("Hiii! Mrrp! 😽");
    else if (/love/.test(t))  catSays("Aww, I love you too. Prrrr 💗");
    else if (t.trim())        catSays(pick(["Mrrp? Try typing 'meow'. 😼", "I only speak meow. Try it!", "*tilts head* 🐱 ...say meow?"]));
  }

  if (meowForm && meowInput) {
    // The surprise only happens after clicking the Send button (or pressing Enter)
    meowForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = meowInput.value;
      if (!text.trim()) return;
      reply(text);
      meowInput.value = "";
    });
  }

  /* ---------- Paw trail ---------- */
  var trail = $("trailToggle"), lastX = 0, lastY = 0;
  document.addEventListener("pointermove", function (e) {
    if (noMotion || !trail || !trail.checked || e.pointerType === "touch") return;
    if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < 45) return;
    lastX = e.clientX; lastY = e.clientY;
    var p = document.createElement("span");
    p.className = "paw-trail";
    p.textContent = "🐾";
    p.style.left = e.clientX + "px";
    p.style.top = e.clientY + "px";
    document.body.appendChild(p);
    setTimeout(function () { p.remove(); }, 800);
  });

  /* ---------- Finn's story (edit the text with your real memories!) ---------- */
  var chapters = [
    { t: "Hello, Finn 👋", p: "Some friendships start quietly. Mine started the day Finn came into my life. I didn't know it yet, but I had just met one of my very best friends." },
    { t: "My little shadow 🐾", p: "Wherever I am at home, Finn is never far. Quiet company, soft paws, and a cat who makes every room feel warmer." },
    { t: "On the sad days 🌧️", p: "Some days feel heavy, and I don't always want to talk about it. Finn doesn't need me to. He just shows up and stays close, and little by little, things get lighter." },
    { t: "On the bored days 🎈", p: "When I'm bored, Finn makes sure it doesn't last. With his curiosity and cute little antics, there's never a dull moment when he's around." },
    { t: "Why I love him 💗", p: "Finn doesn't care how my day went or how I look. He's there for me all the same. I love him very much, and I'm so thankful he's mine. Thank you for reading his story! Now go pet the cat up there. 🐾" }
  ];
  var ci = 0;
  var sTag = $("storyTag"), sTitle = $("storyTitle"), sText = $("storyText");
  var sDots = $("storyDots"), sPrev = $("storyPrev"), sNext = $("storyNext");

  function showChapter() {
    var c = chapters[ci];
    sTag.textContent = "Chapter " + (ci + 1) + " of " + chapters.length;
    sTitle.textContent = c.t;
    sText.textContent = c.p;
    [sTitle, sText].forEach(function (el) {
      el.classList.remove("story-fade"); void el.offsetWidth; el.classList.add("story-fade");
    });
    sDots.innerHTML = "";
    chapters.forEach(function (_, i) {
      var d = document.createElement("i");
      if (i === ci) d.className = "on";
      sDots.appendChild(d);
    });
    sPrev.disabled = ci === 0;
    sNext.textContent = ci === chapters.length - 1 ? "Read again ↺" : "Next chapter →";
    if (ci === chapters.length - 1) quest("story");
  }

  if (sTitle) {
    sPrev.addEventListener("click", function () { if (ci > 0) { ci--; showChapter(); } });
    sNext.addEventListener("click", function () {
      ci = ci === chapters.length - 1 ? 0 : ci + 1;
      showChapter();
    });
    showChapter();
  }

  /* ---------- Cheer-up corner ---------- */
  var moods = {
    sad: {
      msg: "I'm sorry you're feeling down. Finn would curl up right next to you for as long as you need. You're not alone. 💗",
      btn: "Get a cuddle from Finn 🫂"
    },
    bored: {
      msg: "Bored? Finn says it's playtime! Let's go catch some yarn. 🧶",
      btn: "Play with Finn 🧶"
    },
    stressed: {
      msg: "Okay, slow down. Finn says: breathe with him. In… and out…",
      btn: "Breathe with Finn 🌬️"
    },
    happy: {
      msg: "Yay! Finn is so happy for you that he's doing zoomies! 🎉",
      btn: "Zoomies! 💨"
    }
  };
  var moodBtns = document.querySelectorAll("#moods button");
  var cheerOut = $("cheerOut"), cheerText = $("cheerText"), cheerAct = $("cheerAct");
  var breatheBox = $("breathe"), breatheTxt = $("breatheTxt");
  var currentMood = null, breatheTimer = null;

  function stopBreathing() { clearInterval(breatheTimer); breatheBox.hidden = true; }

  moodBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      currentMood = b.dataset.mood;
      moodBtns.forEach(function (x) { x.classList.toggle("on", x === b); });
      stopBreathing();
      cheerText.textContent = moods[currentMood].msg;
      cheerAct.textContent = moods[currentMood].btn;
      cheerOut.hidden = false;
      var r = b.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top, 4);
      quest("cheer");
    });
  });

  if (cheerAct) {
    cheerAct.addEventListener("click", function () {
      var r = cheerAct.getBoundingClientRect();
      if (currentMood === "sad") {
        burst(r.left + r.width / 2, r.top, 14);
        cheerText.textContent = "*Finn snuggles in and starts purring* 🐈‍⬛💗 Better?";
      } else if (currentMood === "bored") {
        $("arena").scrollIntoView({ behavior: noMotion ? "auto" : "smooth", block: "center" });
        setTimeout(startGame, noMotion ? 0 : 600);
      } else if (currentMood === "stressed") {
        breatheBox.hidden = false;
        var inhale = true;
        breatheTxt.textContent = "Breathe in…";
        clearInterval(breatheTimer);
        breatheTimer = setInterval(function () {
          inhale = !inhale;
          breatheTxt.textContent = inhale ? "Breathe in…" : "Breathe out…";
        }, 4000);
      } else if (currentMood === "happy") {
        burst(r.left + r.width / 2, r.top, 10);
        if (!noMotion) {
          var z = document.createElement("span");
          z.className = "zoomie";
          z.textContent = "🐈‍⬛💨";
          document.body.appendChild(z);
          setTimeout(function () { z.remove(); }, 1700);
        }
      }
    });
  }

  /* ---------- Catch the yarn ---------- */
  var arena = $("arena"), yarn = $("yarn"), arenaMsg = $("arenaMsg");
  var gScore = $("gScore"), gTime = $("gTime"), gBest = $("gBest"), gStart = $("gStart");
  var score = 0, timeLeft = 15, playing = false, tick = null, hop = null, best = 0;

  try { best = parseInt(localStorage.getItem("finnBest"), 10) || 0; } catch (e) {}
  if (gBest) gBest.textContent = best;

  function moveYarn() {
    if (!playing) return;
    var maxX = arena.clientWidth - yarn.offsetWidth;
    var maxY = arena.clientHeight - yarn.offsetHeight;
    yarn.style.left = Math.random() * Math.max(maxX, 0) + "px";
    yarn.style.top = Math.random() * Math.max(maxY, 0) + "px";
    clearTimeout(hop);
    hop = setTimeout(moveYarn, Math.max(380, 850 - score * 30));
  }

  function endGame() {
    playing = false;
    clearInterval(tick); clearTimeout(hop);
    yarn.hidden = true;
    arenaMsg.hidden = false;
    if (score > best) {
      best = score; gBest.textContent = best;
      try { localStorage.setItem("finnBest", String(best)); } catch (e) {}
    }
    arenaMsg.textContent = score >= 12 ? "Wow, " + score + "! Finn is SO proud of you. 😻"
      : score >= 6 ? score + " yarns! Finn is impressed. 😺"
      : score + " yarns. Finn says try again! 🐱";
    gStart.textContent = "Play again ♡";
    gStart.disabled = false;
  }

  function startGame() {
    if (playing) return;
    playing = true; score = 0; timeLeft = 15;
    gScore.textContent = 0; gTime.textContent = timeLeft;
    arenaMsg.hidden = true; yarn.hidden = false;
    gStart.disabled = true;
    moveYarn();
    tick = setInterval(function () {
      timeLeft--;
      gTime.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  if (gStart && yarn) {
    gStart.addEventListener("click", startGame);
    yarn.addEventListener("click", function () {
      if (!playing) return;
      score++;
      gScore.textContent = score;
      var r = yarn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top, 1);
      if (score >= 5) quest("game");
      moveYarn();
    });
  }

  /* ---------- Reveal sections as you scroll ---------- */
  if ("IntersectionObserver" in window && !noMotion) {
    var targets = document.querySelectorAll("main section:not(.hero) .wrap");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }
})();
