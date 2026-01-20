/* ==========================
   3D CYLINDER ROTATION (SLOW)
========================== */

const carousel = document.getElementById("carousel");
const panels = carousel.querySelectorAll(".panel");

let angle = 0;

// OLD: 0.35
// NEW: 0.14 (60% slower ✅)
let speed = 0.14;

function setupCylinder() {
  const count = panels.length;

  // radius based on screen size
  const isMobile = window.innerWidth < 520;
  const isTablet = window.innerWidth < 1000;

  let radius = 520; // desktop full width
  if (isTablet) radius = 420;
  if (isMobile) radius = 320;

  for (let i = 0; i < count; i++) {
    const panelAngle = (360 / count) * i;
    panels[i].style.transform =
      `translate(-50%, -50%) rotateY(${panelAngle}deg) translateZ(${radius}px)`;
  }
}

setupCylinder();
window.addEventListener("resize", setupCylinder);

function animate() {
  angle += speed;
  carousel.style.transform = `rotateY(${angle}deg)`;
  requestAnimationFrame(animate);
}

animate();

/* Premium: slow down even more on hover */
carousel.addEventListener("mouseenter", () => speed = 0.06);
carousel.addEventListener("mouseleave", () => speed = 0.14);
/* =========================================================
SECTION 2: LIFE AT OUR FARM (Deck → Spread + Modal)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ✅ Deck animation on scroll (open when visible, close when out)
  const deckRows = document.querySelectorAll(".deck-row");

  const deckObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-open");
        } else {
          entry.target.classList.remove("is-open");
        }
      });
    },
    { threshold: 0.35 }
  );

  deckRows.forEach((row) => deckObserver.observe(row));


  // ✅ Modal
  const modal = document.getElementById("farmModal");
  const modalBackdrop = document.getElementById("farmModalBackdrop");
  const modalClose = document.getElementById("farmModalClose");

  const modalImg = document.getElementById("farmModalImg");
  const modalTitle = document.getElementById("farmModalTitle");
  const modalDesc = document.getElementById("farmModalDesc");

  function openFarmModal({ title, img, desc }) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    modalImg.src = img;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    document.body.style.overflow = "hidden";
  }

  function closeFarmModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".farm-card").forEach((card) => {
    card.addEventListener("click", () => {
      openFarmModal({
        title: card.dataset.title,
        img: card.dataset.img,
        desc: card.dataset.desc,
      });
    });
  });

  modalBackdrop.addEventListener("click", closeFarmModal);
  modalClose.addEventListener("click", closeFarmModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFarmModal();
  });

});
/* =========================
   SECTION 3 — QUIET QUESTION (Cloud Floating + Spread from Center)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".quietq");
  if (!section) return;

  const stage = section.querySelector(".quietq-stage");
  if (!stage) return;

  const clouds = Array.from(stage.querySelectorAll(".cloud"));
  if (clouds.length === 0) return;

  let running = false;

  // ✅ Start hidden in the center (brain-area)
  clouds.forEach((c) => {
    if (c.classList.contains("cloud-5")) {
      c.style.transform = "translateX(-50%) scale(0.85)";
    } else {
      c.style.transform = "scale(0.85)";
    }
    c.style.opacity = "0";
  });

  // Base drift state
  const state = clouds.map((el) => ({
    el,
    x: 0,
    y: 0,
    r: 0,
    vx: (Math.random() * 0.18 + 0.06) * (Math.random() < 0.5 ? -1 : 1),
    vy: (Math.random() * 0.16 + 0.05) * (Math.random() < 0.5 ? -1 : 1),
    rr: (Math.random() * 0.02 + 0.008) * (Math.random() < 0.5 ? -1 : 1),
    limitX: 22,
    limitY: 16,
  }));

  function spreadOut() {
    clouds.forEach((c) => {
      c.style.transition =
        "opacity 800ms ease, transform 1000ms cubic-bezier(.2,.9,.2,1)";
      c.style.opacity = "1";

      if (c.classList.contains("cloud-5")) {
        c.style.transform = "translateX(-50%) scale(1)";
      } else {
        c.style.transform = "scale(1)";
      }
    });

    setTimeout(() => {
      clouds.forEach((c) => (c.style.transition = "none"));
    }, 1200);
  }

  function animate() {
    if (!running) return;

    state.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.r += s.rr;

      if (s.x > s.limitX || s.x < -s.limitX) s.vx *= -1;
      if (s.y > s.limitY || s.y < -s.limitY) s.vy *= -1;

      const cx = Math.max(-s.limitX, Math.min(s.limitX, s.x));
      const cy = Math.max(-s.limitY, Math.min(s.limitY, s.y));

      if (s.el.classList.contains("cloud-5")) {
        s.el.style.transform = `translateX(-50%) translate(${cx}px, ${cy}px) rotate(${s.r}deg)`;
      } else {
        s.el.style.transform = `translate(${cx}px, ${cy}px) rotate(${s.r}deg)`;
      }
    });

    requestAnimationFrame(animate);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !running) {
          running = true;
          spreadOut();
          requestAnimationFrame(animate);
        }
      });
    },
    { threshold: 0.4 }
  );

  io.observe(section);
});
/* =========================
   SECTION 4 — ABOUT THIS PLACE (Reveal Animation Trigger)
========================= */

window.addEventListener("load", () => {
  const aboutSection = document.querySelector(".rc-aboutplace");

  // If section not found, stop (prevents errors)
  if (!aboutSection) return;

  // ✅ Enable animation mode (this activates your CSS hidden state)
  aboutSection.classList.add("rc-anim");

  // ✅ Reveal when visible
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aboutSection.classList.add("is-live");

          // Optional: stop observing after it reveals once
          aboutObserver.unobserve(aboutSection);
        }
      });
    },
    {
      threshold: 0.25, // reveals when 25% visible
    }
  );

  aboutObserver.observe(aboutSection);
});
/* =========================
SECTION 5 — STAY & PRICING (FINAL JS)
Auto Gallery + Click + Scroll Reveal
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#stay-pricing");
  const mainPhoto = document.querySelector("#rcStayMainPhoto");
  const thumbs = document.querySelectorAll(".rc-stay-thumb");

  // ✅ Reveal animation on scroll
  if (section) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("is-live");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
  }

  // ✅ Gallery logic
  if (!mainPhoto || thumbs.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;

  const updateGallery = (index) => {
    const btn = thumbs[index];
    if (!btn) return;

    // active state
    thumbs.forEach((t) => t.classList.remove("is-active"));
    btn.classList.add("is-active");

    const newSrc = btn.getAttribute("data-img");
    const newAlt = btn.getAttribute("data-alt") || "RC Nature World accommodation photo";

    if (!newSrc) return;

    // smooth fade change
    mainPhoto.classList.remove("is-show");
    setTimeout(() => {
      mainPhoto.src = newSrc;
      mainPhoto.alt = newAlt;
      mainPhoto.classList.add("is-show");
    }, 180);

    currentIndex = index;
  };

  const startAutoRotation = () => {
    autoTimer = setInterval(() => {
      let next = currentIndex + 1;
      if (next >= thumbs.length) next = 0;
      updateGallery(next);
    }, 2500);
  };

  const stopAutoRotation = () => {
    if (autoTimer) clearInterval(autoTimer);
  };

  // click handler
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      stopAutoRotation();
      updateGallery(index);
      startAutoRotation();
    });
  });

  // Start
  updateGallery(0);
  startAutoRotation();
});
/* =========================
SECTION 6 — DAILY RHYTHM (Morning / Afternoon / Evening)
Auto Rotate + Smooth Switch + Scroll Reveal
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#daily-rhythm");
  if (!section) return;

  // Scroll reveal
  section.classList.add("rc-anim");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          section.classList.add("is-live");
          obs.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  obs.observe(section);

  // Tabs
  const tabs = section.querySelectorAll(".rc-rhythm-tab");
  const blocks = section.querySelectorAll(".rc-rhythm-block");
  const photo = section.querySelector("#rcRhythmPhoto");
  const caption = section.querySelector("#rcRhythmCaption");

  const config = {
    morning: {
      img: "assets/holistic-stay.jpg",
      alt: "Morning at RC Nature World",
      caption: "Morning calm — sunrise & birdsong."
    },
    afternoon: {
      img: "assets/rhythm-afternoon.jpg",
      alt: "Afternoon at RC Nature World",
      caption: "Afternoon ease — food, rest & learning."
    },
    evening: {
      img: "assets/rhythm-evening.jpg",
      alt: "Evening at RC Nature World",
      caption: "Evening warmth — sattvic food & slow conversations."
    }
  };

  let current = "morning";
  let timer = null;
  let manualPauseTimeout = null;

  const setActive = (key) => {
    current = key;

    // update tabs
    tabs.forEach((t) => {
      const isOn = t.dataset.time === key;
      t.classList.toggle("is-active", isOn);
      t.setAttribute("aria-selected", isOn ? "true" : "false");
    });

    // update blocks
    blocks.forEach((b) => {
      const match = b.dataset.block === key;
      b.classList.toggle("is-live", match);
    });

    // photo soft fade swap
    if (photo && config[key]) {
      photo.style.opacity = "0";
      setTimeout(() => {
        photo.src = config[key].img;
        photo.alt = config[key].alt;
        if (caption) caption.textContent = config[key].caption;
        photo.style.opacity = "1";
      }, 220);
    }
  };

  const nextKey = () => {
    const order = ["morning", "afternoon", "evening"];
    const index = order.indexOf(current);
    return order[(index + 1) % order.length];
  };

  const startAuto = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      setActive(nextKey());
    }, 6000); // ✅ rotate every 6 seconds
  };

  const pauseAutoForManual = () => {
    clearInterval(timer);
    clearTimeout(manualPauseTimeout);

    manualPauseTimeout = setTimeout(() => {
      startAuto();
    }, 8000); // ✅ restart after 8 sec
  };

  // click events
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.time;
      setActive(key);
      pauseAutoForManual();
    });
  });

  // default
  setActive("morning");
  startAuto();
});
/* ✅ UPCOMING EXPERIENCES — WORKING JS (Tabs + autoplay + progress + reveal) */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Upcoming Experiences JS Loaded");

  const root = document.querySelector("#upcoming-experiences");
  if (!root) {
    console.warn("❌ #upcoming-experiences not found");
    return;
  }

  document.documentElement.classList.add("js-ue");

  const tabs = Array.from(root.querySelectorAll(".ue__tab"));
  const panels = Array.from(root.querySelectorAll(".ueCard"));
  const bar = root.querySelector(".ue__bar");
  const stage = root.querySelector(".ue__stage");

  if (!tabs.length || !panels.length) {
    console.warn("❌ Tabs or Panels not found inside Upcoming Experiences");
    return;
  }

  const order = ["holi", "midmarch", "april"];
  let activeKey = "holi";

  const AUTOPLAY_MS = 4000; // ✅ faster so you notice auto changing
  let timer = null;
  let progressTimer = null;
  let startTime = 0;
  let paused = false;

  function setActive(key) {
    activeKey = key;

    tabs.forEach((btn) => {
      const isOn = btn.dataset.ueTab === key;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", isOn ? "true" : "false");
    });

    panels.forEach((card) => {
      const isOn = card.dataset.uePanel === key;
      card.classList.toggle("is-active", isOn);
      card.setAttribute("aria-hidden", isOn ? "false" : "true");
    });

    if (bar) bar.style.width = "0%";
    startTime = Date.now();
  }

  function nextPanel() {
    const idx = order.indexOf(activeKey);
    const nextKey = order[(idx + 1) % order.length];
    setActive(nextKey);
  }

  function stopAutoplay() {
    clearInterval(timer);
    clearInterval(progressTimer);
    timer = null;
    progressTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    startTime = Date.now();
    paused = false;

    progressTimer = setInterval(() => {
      if (paused) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      if (bar) bar.style.width = pct + "%";
    }, 40);

    timer = setInterval(() => {
      if (paused) return;
      nextPanel();
    }, AUTOPLAY_MS);
  }

  // ✅ Tab Click Working
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.ueTab;
      setActive(key);
      startAutoplay();
      console.log("✅ Tab clicked:", key);
    });
  });

  // ✅ Pause only when hovering media area
  if (stage) {
    stage.addEventListener("mouseenter", () => (paused = true));
    stage.addEventListener("mouseleave", () => {
      paused = false;
      startTime = Date.now();
    });
  }

  // ✅ Reveal animation
  const revealEls = root.querySelectorAll(".ue-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));

  // ✅ Start
  setActive(activeKey);
  startAutoplay();
});
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Testimonials JS Loaded Successfully");

  const root = document.querySelector("#testimonials");
  if (!root) {
    console.log("❌ #testimonials section not found");
    return;
  }

  // Enable reveal CSS system
  document.documentElement.classList.add("js-ts");

  const cards = Array.from(root.querySelectorAll(".tsCard"));
  const fill = root.querySelector(".ts__miniBarFill");
  const viewer = root.querySelector(".ts__viewer");

  if (!cards.length) {
    console.log("❌ No .tsCard found");
    return;
  }

  let activeIndex = 0;
  let paused = false;

  const AUTOPLAY_MS = 4500;
  let timer = null;
  let progressTimer = null;
  let startTime = Date.now();

  function setActive(index) {
    activeIndex = index;

    cards.forEach((card, i) => {
      const isOn = i === index;
      card.classList.toggle("is-active", isOn);
    });

    // Reset bar
    startTime = Date.now();
    if (fill) fill.style.width = "0%";
  }

  function nextCard() {
    const nextIndex = (activeIndex + 1) % cards.length;
    setActive(nextIndex);
  }

  function stopAutoplay() {
    clearInterval(timer);
    clearInterval(progressTimer);
    timer = null;
    progressTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    startTime = Date.now();

    // Progress bar tick
    progressTimer = setInterval(() => {
      if (paused) return;

      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      if (fill) fill.style.width = pct + "%";
    }, 40);

    // Rotate highlight
    timer = setInterval(() => {
      if (paused) return;
      nextCard();
    }, AUTOPLAY_MS);
  }

  // ✅ Click highlight works
  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
      setActive(idx);
      startAutoplay(); // restart after manual click
    });

    // ✅ keyboard support
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(idx);
        startAutoplay();
      }
    });
  });

  // ✅ Pause on hover (premium feel)
  if (viewer) {
    viewer.addEventListener("mouseenter", () => {
      paused = true;
    });

    viewer.addEventListener("mouseleave", () => {
      paused = false;
      startTime = Date.now();
    });
  }

  // ✅ Reveal animation on scroll
  const revealEls = root.querySelectorAll(".ts-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => io.observe(el));

  // ✅ Start
  setActive(0);
  startAutoplay();
});
/* ✅ TEAM SECTION JS — FIXED + AUTO DETECT
   - Click highlight works
   - Auto highlight works
   - Progress bar works
   - Hover pause works
   - Reveal animation works
*/

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Find the section even if id changes
  const root =
    document.querySelector("#team") ||
    document.querySelector("#meet-our-team") ||
    document.querySelector("#our-team") ||
    document.querySelector("#team-section") ||
    document.querySelector(".tm");

  if (!root) {
    console.warn("❌ Team section not found. Add id='team' OR class='tm'.");
    return;
  }

  console.log("✅ TEAM JS Running ✅", root);

  const cards = Array.from(root.querySelectorAll(".tmCard"));
  const fill = root.querySelector(".tm__miniBarFill");
  const viewer = root.querySelector(".tm__viewer");

  if (!cards.length) {
    console.warn("❌ No .tmCard found inside the team section.");
    return;
  }

  console.log("✅ Found team cards:", cards.length);

  // ✅ Settings
  const AUTOPLAY_MS = 4500;

  let activeIndex = 0;
  let timer = null;
  let progressTimer = null;
  let startTime = 0;
  let paused = false;

  function setActive(index) {
    activeIndex = index;

    cards.forEach((card, i) => {
      card.classList.toggle("is-active", i === index);
    });

    // progress reset
    if (fill) fill.style.width = "0%";
    startTime = Date.now();
  }

  function next() {
    setActive((activeIndex + 1) % cards.length);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    if (progressTimer) clearInterval(progressTimer);
    timer = null;
    progressTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    startTime = Date.now();

    // progress animation
    progressTimer = setInterval(() => {
      if (paused) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      if (fill) fill.style.width = pct + "%";
    }, 40);

    // change card
    timer = setInterval(() => {
      if (paused) return;
      next();
    }, AUTOPLAY_MS);
  }

  // ✅ Click highlight
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      setActive(i);
      startAutoplay(); // restart smooth after click
    });

    // keyboard support
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(i);
        startAutoplay();
      }
    });
  });

  // ✅ Pause on hover
  if (viewer) {
    viewer.addEventListener("mouseenter", () => {
      paused = true;
    });

    viewer.addEventListener("mouseleave", () => {
      paused = false;
      startTime = Date.now();
    });
  }

  // ✅ Reveal animation
  const revealEls = root.querySelectorAll(".tm-reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // ✅ Start
  setActive(0);
  startAutoplay();
});
/* ✅ SECTION 10: Principles & Values — AUTO ROTATE + CLICK + PROGRESS
   - Auto opens next principle every few seconds
   - Click opens instantly
   - Hover pauses autoplay
   - Reset button works
   - Scroll reveal works
*/

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#principles-values");
  if (!root) {
    console.warn("✅ PV2: Section not found (#principles-values)");
    return;
  }

  // Enable reveal mode for CSS (.js-pv2 .pv2-reveal)
  document.documentElement.classList.add("js-pv2");

  const items = Array.from(root.querySelectorAll(".pv2Item"));
  const resetBtn = root.querySelector("[data-pv2-reset]");
  const revealEls = Array.from(root.querySelectorAll(".pv2-reveal"));
  const progressBar = root.querySelector(".pv2__bar");

  if (!items.length) {
    console.warn("✅ PV2: No .pv2Item found");
    return;
  }

  // ✅ Autoplay Settings
  const AUTOPLAY_MS = 4500;
  let activeIndex = 0;
  let timer = null;
  let progressTimer = null;
  let startTime = 0;
  let paused = false;

  function closeAll() {
    items.forEach((item) => {
      item.classList.remove("is-open");
      item.setAttribute("aria-expanded", "false");

      const chev = item.querySelector(".pv2Item__chev");
      if (chev) chev.textContent = "+";
    });
  }

  function openOnly(index) {
    activeIndex = index;

    closeAll();

    const item = items[index];
    if (!item) return;

    item.classList.add("is-open");
    item.setAttribute("aria-expanded", "true");

    const chev = item.querySelector(".pv2Item__chev");
    if (chev) chev.textContent = "×";

    // Reset progress bar
    if (progressBar) progressBar.style.width = "0%";
    startTime = Date.now();
  }

  function nextAuto() {
    const nextIndex = (activeIndex + 1) % items.length;
    openOnly(nextIndex);
  }

  function stopAutoplay() {
    clearInterval(timer);
    clearInterval(progressTimer);
    timer = null;
    progressTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    paused = false;
    startTime = Date.now();

    // Progress animation
    progressTimer = setInterval(() => {
      if (paused) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      if (progressBar) progressBar.style.width = pct + "%";
    }, 40);

    // Auto switch
    timer = setInterval(() => {
      if (paused) return;
      nextAuto();
    }, AUTOPLAY_MS);
  }

  // ✅ Click to open
  items.forEach((item, index) => {
    const head = item.querySelector(".pv2Item__head");
    if (!head) return;

    head.addEventListener("click", (e) => {
      e.preventDefault();
      openOnly(index);
      startAutoplay(); // restart autoplay after click
    });

    // Keyboard support
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openOnly(index);
        startAutoplay();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        openOnly(0);
        startAutoplay();
      }
    });
  });

  // ✅ Reset button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      openOnly(0);
      startAutoplay();
    });
  }

  // ✅ Pause autoplay when mouse is on right panel (so user can read)
  const hoverArea = root.querySelector(".pv2__timelineWrap") || root;
  hoverArea.addEventListener("mouseenter", () => (paused = true));
  hoverArea.addEventListener("mouseleave", () => {
    paused = false;
    startTime = Date.now(); // continue smoothly
  });

  // ✅ Reveal on scroll
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ✅ Start
  openOnly(0);
  startAutoplay();

  console.log("✅ PV2 AUTO JS Loaded Successfully");
});
/* =========================
SECTION 11 — LOCATION & NEARBY PLACES (JS)
Reveal + Accordion (Premium)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#location-access");
  if (!section) return;

  // ✅ Reveal on scroll
  const revealEls = section.querySelectorAll(".rc-loc-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealEls.forEach((el) => io.observe(el));

  // ✅ Accordion
  const items = section.querySelectorAll(".rc-loc__accItem");

  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      // close others
      items.forEach((x) => {
        if (x !== btn) x.classList.remove("is-open");
      });

      // toggle current
      btn.classList.toggle("is-open");

      // update plus sign
      items.forEach((x) => {
        const chev = x.querySelector(".rc-loc__chev");
        if (!chev) return;
        chev.textContent = x.classList.contains("is-open") ? "–" : "+";
      });
    });
  });

  // Set initial chevrons correctly
  items.forEach((x) => {
    const chev = x.querySelector(".rc-loc__chev");
    if (!chev) return;
    chev.textContent = x.classList.contains("is-open") ? "–" : "+";
  });
});
/* ✅ SECTION 12: FAQ — AUTO OPEN (Working + Smooth) */
(function () {
  function initFAQ() {
    const root = document.querySelector("#faq");
    if (!root) {
      console.warn("❌ FAQ section not found (#faq).");
      return;
    }

    console.log("✅ FAQ AUTO JS Loaded Successfully");

    // Required elements
    const items = Array.from(root.querySelectorAll(".faqItem"));
    const resetBtn = root.querySelector("[data-faq-reset]");
    const barFill = root.querySelector(".faq__barFill");
    const stage = root.querySelector(".faq__viewer") || root; // safe

    if (!items.length) {
      console.warn("❌ No .faqItem found inside #faq");
      return;
    }

    // ✅ Auto-play settings
    const AUTOPLAY_MS = 4500; // change speed here
    const USER_PAUSE_MS = 9000; // pause after user click
    let autoplayTimer = null;
    let progressTimer = null;
    let startTime = 0;
    let paused = false;
    let activeIndex = 0;

    function closeItem(item) {
      item.classList.remove("is-open");

      const btn = item.querySelector(".faqQ");
      const ans = item.querySelector(".faqA");

      if (btn) btn.setAttribute("aria-expanded", "false");

      if (ans) {
        ans.setAttribute("aria-hidden", "true");
        ans.style.maxHeight = "0px";
      }
    }

    function openItem(item) {
      item.classList.add("is-open");

      const btn = item.querySelector(".faqQ");
      const ans = item.querySelector(".faqA");

      if (btn) btn.setAttribute("aria-expanded", "true");

      if (ans) {
        ans.setAttribute("aria-hidden", "false");
        // ✅ Smooth expand
        ans.style.maxHeight = ans.scrollHeight + "px";
      }
    }

    function setActive(index, userTriggered = false) {
      activeIndex = index;

      items.forEach((it) => closeItem(it));
      openItem(items[activeIndex]);

      // Progress bar reset
      if (barFill) barFill.style.width = "0%";
      startTime = Date.now();

      // If user clicked, pause autoplay for a while
      if (userTriggered) {
        paused = true;
        setTimeout(() => {
          paused = false;
          startTime = Date.now();
        }, USER_PAUSE_MS);
      }
    }

    function next() {
      const nextIndex = (activeIndex + 1) % items.length;
      setActive(nextIndex, false);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      if (progressTimer) clearInterval(progressTimer);
      autoplayTimer = null;
      progressTimer = null;
    }

    function startAutoplay() {
      stopAutoplay();
      paused = false;
      startTime = Date.now();

      // ✅ Smooth bar fill
      progressTimer = setInterval(() => {
        if (paused) return;
        if (!barFill) return;

        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
        barFill.style.width = pct + "%";
      }, 40);

      // ✅ Auto open next
      autoplayTimer = setInterval(() => {
        if (paused) return;
        next();
      }, AUTOPLAY_MS);
    }

    // ✅ Attach click events
    items.forEach((item, idx) => {
      const btn = item.querySelector(".faqQ");
      const ans = item.querySelector(".faqA");
      if (!btn || !ans) return;

      // initial heights
      ans.style.maxHeight = "0px";
      ans.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");

      btn.addEventListener("click", () => {
        const alreadyOpen = item.classList.contains("is-open");

        if (alreadyOpen) {
          // close if clicked again
          closeItem(item);
          if (barFill) barFill.style.width = "0%";
          paused = true;
          return;
        }

        setActive(idx, true);
      });

      // Enter + Space support
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // ✅ Reset button
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        setActive(0, true);
        startAutoplay();
      });
    }

    // ✅ Pause on hover (premium)
    if (stage) {
      stage.addEventListener("mouseenter", () => {
        paused = true;
      });
      stage.addEventListener("mouseleave", () => {
        paused = false;
        startTime = Date.now();
      });
    }

    // ✅ Scroll reveal
    document.documentElement.classList.add("js-faq");

    const revealEls = root.querySelectorAll(".faq-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => io.observe(el));

    // ✅ Fix open height on resize
    window.addEventListener("resize", () => {
      const openOne = items.find((it) => it.classList.contains("is-open"));
      if (!openOne) return;
      const ans = openOne.querySelector(".faqA");
      if (ans) ans.style.maxHeight = ans.scrollHeight + "px";
    });

    // ✅ Start
    setActive(0, false);
    startAutoplay();
  }

  // ✅ Works even without defer
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFAQ);
  } else {
    initFAQ();
  }
})();
/* ✅ Gallery Full Border Runway — Seamless + Smooth */
(function () {
  const section = document.querySelector("#gallery");
  if (!section) return;

  const rows = section.querySelectorAll("[data-galx-row]");

  rows.forEach((row) => {
    const track = row.querySelector(".galXRow__track");
    if (!track) return;

    // ✅ Prevent cloning twice
    if (track.dataset.ready === "1") return;
    track.dataset.ready = "1";

    // ✅ Clone track for seamless loop
    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");

    // ✅ Put clone next to original
    row.appendChild(clone);
  });
})();

/* =========================
SECTION 12 — BOOKING FORM (WORKING JS)
Opens Mail with Prefilled Text
========================= */

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector("#booking");
  if (!section) return;

  const form = document.querySelector("#bkForm");
  const submitBtn = document.querySelector("#bkSubmit");

  const nameEl = document.querySelector("#bkName");
  const countryEl = document.querySelector("#bkCountry");
  const phoneEl = document.querySelector("#bkPhone");
  const guestsEl = document.querySelector("#bkGuests");
  const eventEl = document.querySelector("#bkEvent");
  const roomEl = document.querySelector("#bkRoom");
  const datesEl = document.querySelector("#bkDates");
  const msgEl = document.querySelector("#bkMessage");

  const EMAIL_TO = "rcnatureworld@gmail.com";

  // ✅ Reveal animation on scroll
  const revealEls = document.querySelectorAll("#booking .bk-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));

  // ✅ Helper: show errors
  function showError(input, msg) {
    const field = input.closest(".bk__field");
    if (!field) return;
    const err = field.querySelector(".bk__error");
    if (err) err.textContent = msg || "";
  }

  function validateForm() {
    let ok = true;

    if (!nameEl.value.trim()) {
      showError(nameEl, "Please enter your name");
      ok = false;
    } else showError(nameEl, "");

    if (!countryEl.value.trim()) {
      showError(countryEl, "Please enter your country");
      ok = false;
    } else showError(countryEl, "");

    if (!phoneEl.value.trim()) {
      showError(phoneEl, "Please enter WhatsApp/Phone number");
      ok = false;
    } else showError(phoneEl, "");

    if (!guestsEl.value || Number(guestsEl.value) < 1) {
      showError(guestsEl, "Guests must be at least 1");
      ok = false;
    } else showError(guestsEl, "");

    if (!eventEl.value) {
      showError(eventEl, "Please select an experience");
      ok = false;
    } else showError(eventEl, "");

    return ok;
  }

  function buildEmail() {
    const subject = `Booking Inquiry — ${eventEl.value}`;
    const body =
      `Hi RC Nature World Team,

I want to book a stay at RC Nature World. Please share availability and final pricing.

Name: ${nameEl.value.trim()}
Country: ${countryEl.value.trim()}
WhatsApp/Phone: ${phoneEl.value.trim()}
Guests: ${guestsEl.value}
Experience: ${eventEl.value}
Room Preference: ${roomEl.value}
Preferred Dates: ${datesEl.value.trim() || "Flexible"}

Message:
${msgEl.value.trim() || "No extra message."}

Thank you!`;

    const mailto =
      `mailto:${encodeURIComponent(EMAIL_TO)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    return mailto;
  }

  // ✅ Submit action
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const ok = validateForm();
    if (!ok) return;

    submitBtn.disabled = true;
    const oldText = submitBtn.textContent;
    submitBtn.textContent = "Opening Email…";

    setTimeout(() => {
      window.location.href = buildEmail();
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;
    }, 450);
  });
});

/* ======================================================
   STICKY HEADER SCROLL LOGIC
   (Toggles header visibility based on scroll position)
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("sticky-header");
  const hero = document.getElementById("home"); // Assuming hero has id="home"

  if (!header || !hero) return;

  // ✅ Optimization: Cache height to avoid "reflow" on every scroll
  let heroHeight = hero.offsetHeight;
  let triggerPoint = heroHeight * 0.8;

  // Update on resize
  window.addEventListener("resize", () => {
    heroHeight = hero.offsetHeight;
    triggerPoint = heroHeight * 0.8;
  });

  // Throttled Scroll Check
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > triggerPoint) {
          header.classList.add("is-visible");
        } else {
          header.classList.remove("is-visible");
        }
        ticking = false;
      });
      ticking = true;
    }
  });
});

/* ======================================================
   MOBILE MENU LOGIC
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".header-nav");
  const links = document.querySelectorAll(".nav-link");

  if (!toggleBtn || !nav) return;

  // Create backdrop
  const backdrop = document.createElement("div");
  backdrop.classList.add("menu-backdrop");
  document.body.appendChild(backdrop);

  function toggleMenu() {
    const isOpen = nav.classList.contains("is-open");

    if (isOpen) {
      nav.classList.remove("is-open");
      toggleBtn.classList.remove("is-active");
      backdrop.classList.remove("is-active");
      document.body.style.overflow = "";
    } else {
      nav.classList.add("is-open");
      toggleBtn.classList.add("is-active");
      backdrop.classList.add("is-active");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
  }

  toggleBtn.addEventListener("click", toggleMenu);
  backdrop.addEventListener("click", toggleMenu);

  // Close when link clicked
  links.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggleBtn.classList.remove("is-active");
      backdrop.classList.remove("is-active");
      document.body.style.overflow = "";
    });
  });
});
