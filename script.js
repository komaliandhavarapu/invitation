(() => {
  const config = window.WEDDING_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const configuredTheme = config.theme || "rose";
  const theme = configuredTheme === "blue" ? "royal" : configuredTheme === "gold" ? "temple-gold" : configuredTheme;
  const wedding = config.wedding || {};
  const couple = config.couple || {};

  document.documentElement.dataset.theme = theme;
  $$("#themeSwitch [data-theme]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.theme === theme);
    button.addEventListener("click", () => {
      document.documentElement.dataset.theme = button.dataset.theme;
      $$("#themeSwitch [data-theme]").forEach((option) => option.classList.toggle("selected", option === button));
    });
    const themeSwitch = $("#themeSwitch");
    const updateThemeSwitchVisibility = () => {
      themeSwitch.classList.toggle("hidden", window.scrollY > 150);
    };
    window.addEventListener("scroll", updateThemeSwitchVisibility, { passive: true });
    updateThemeSwitchVisibility();
  });

  $$("[data-copy]").forEach((element) => {
    element.textContent = config.invitation?.[element.dataset.copy] || "";
  });
  $$("[data-couple]").forEach((element) => {
    element.textContent = couple[element.dataset.couple] || couple.display || "";
  });

  function getWeddingDate() {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(wedding.date || "");
    if (!match) {
      throw new Error("Wedding date must use YYYY-MM-DD format in config.js.");
    }

    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText) - 1;
    const day = Number(dayText);
    const timeMatch = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(wedding.time || "");
    if (!timeMatch) {
      throw new Error("Wedding time in config.js must be a valid time such as 6:45 AM.");
    }

    let hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2] || 0);
    const meridiem = timeMatch[3]?.toUpperCase();
    if (minutes > 59 || (meridiem && (hours < 1 || hours > 12)) || hours > 23) {
      throw new Error("Wedding time in config.js is outside the valid range.");
    }
    if (meridiem) {
      hours = (hours % 12) + (meridiem === "PM" ? 12 : 0);
    }

    const date = new Date(year, month, day, hours, minutes);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      throw new Error("Wedding date in config.js is not a valid calendar date.");
    }
    return date;
  }

  const weddingDateTime = getWeddingDate();
  const niceDate = weddingDateTime.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  $$('[data-wedding="dateWords"]').forEach((element) => {
    element.textContent = niceDate;
  });
  $$('[data-wedding="time"]').forEach((element) => {
    element.textContent = wedding.time || "";
  });
  $$('[data-wedding="muhurthamLabel"]').forEach((element) => {
    element.textContent = (wedding.muhurthamLabel || "Muhurtham").toUpperCase();
  });
  $$('[data-wedding="calendarCaption"]').forEach((element) => {
    element.textContent = wedding.calendarCaption || "A date to remember";
  });

  const brideParents = $("#brideParents");
  const groomParents = $("#groomParents");
  const renderParentNames = (element, names) => {
    const parentNames = (Array.isArray(names) ? names : [names]).filter(
      (name) => typeof name === "string" && name.trim()
    );
    element.replaceChildren();
    parentNames.forEach((name, index) => {
      if (index > 0) {
        const connector = document.createElement("span");
        connector.className = "parent-name-connector";
        connector.textContent = "&";
        element.append(connector);
      }
      const line = document.createElement("span");
      line.className = "parent-name-line";
      line.textContent = name.trim();
      element.append(line);
    });
  };
  renderParentNames(brideParents, config.parents?.bride);
  renderParentNames(groomParents, config.parents?.groom);

  $$('[data-venue="name"]').forEach((element) => {
    element.textContent = config.venue?.name || "";
  });
  $$('[data-venue="address"]').forEach((element) => {
    element.textContent = config.venue?.address || "";
  });
  const mapLink = $("#mapLink");
  const mapQuery = [config.venue?.name, config.venue?.address].filter(Boolean).join(", ");
  mapLink.href = config.venue?.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  function setPhoto(id, source) {
    const image = $(`#${id}`);
    if (!image || !source) return;
    image.src = source;
    image.addEventListener("load", () => image.classList.add("loaded"), { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
  }
  setPhoto("ramSitaPhoto", config.photos?.ramSita);
  setPhoto("templePhoto", config.photos?.temple);

  const eventList = $("#eventList");
  (config.events || []).forEach((event, index) => {
    const card = document.createElement("article");
    card.className = "event-card";
    card.style.setProperty("--delay", `${index * 0.12}s`);

    const icon = document.createElement("span");
    icon.className = "event-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = event.icon || "✿";

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = event.name || "";
    const date = document.createElement("p");
    date.textContent = [event.date, event.note].filter(Boolean).join(" · ");
    body.append(title, date);

    const time = document.createElement("strong");
    time.textContent = event.time || "";
    card.append(icon, body, time);
    eventList.append(card);
  });

  const gallery = $("#momentsGrid");
  const lightbox = $("#photoLightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const galleryDots = $("#galleryDots");
  let galleryCards = [];
  let currentGalleryIndex = 0;
  const galleryDotButtons = [];
  (config.photos?.moments || []).forEach((item, index) => {
    const source = typeof item === "string" ? item : item.src;
    const caption = typeof item === "string" ? "A memory to treasure" : item.caption || "A memory to treasure";
    const card = document.createElement("figure");
    card.className = "moment-slide polaroid";

    const imageButton = document.createElement("button");
    imageButton.className = "photo-open";
    imageButton.type = "button";
    imageButton.setAttribute("aria-label", `View photo: ${caption}`);
    const image = document.createElement("img");
    image.src = source;
    image.alt = caption;
    image.addEventListener("error", () => {
      image.remove();
      card.classList.add("photo-empty");
    }, { once: true });
    imageButton.append(image);
    imageButton.addEventListener("click", () => {
      lightboxImage.src = source;
      lightboxImage.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.showModal();
    });

    const label = document.createElement("figcaption");
    label.textContent = caption;
    card.append(imageButton, label);
    gallery.append(card);
    galleryCards.push(card);

    const dot = document.createElement("button");
    dot.className = "gallery-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show photo ${index + 1}: ${caption}`);
    dot.addEventListener("click", () => {
      navigateGallery(index);
    });
    galleryDots.append(dot);
    galleryDotButtons.push(dot);
  });
  const galleryCount = $("#galleryCount");
  const updateGalleryCount = (selectedIndex) => {
    if (!galleryCards.length) {
      galleryCount.textContent = "";
      galleryDots.hidden = true;
      return;
    }
    const visibleIndex = Number.isInteger(selectedIndex)
      ? selectedIndex
      : Math.round(gallery.scrollLeft / Math.max(gallery.clientWidth, 1));
    const index = Math.max(0, Math.min(galleryCards.length - 1, visibleIndex));
    currentGalleryIndex = index;
    galleryDotButtons.forEach((dot, dotIndex) => {
      if (dotIndex === index) {
        dot.classList.add("active");
        dot.setAttribute("aria-current", "true");
      } else {
        dot.classList.remove("active");
        dot.removeAttribute("aria-current");
      }
    });
    galleryCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(galleryCards.length).padStart(2, "0")}`;
  };
  const navigateGallery = (index) => {
    const targetIndex = Math.max(0, Math.min(galleryCards.length - 1, index));
    updateGalleryCount(targetIndex);
    gallery.scrollTo({
      left: targetIndex * gallery.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  };
  gallery.addEventListener("scroll", updateGalleryCount, { passive: true });
  window.addEventListener("resize", updateGalleryCount, { passive: true });
  $(".gallery-previous").addEventListener("click", () => {
    navigateGallery(currentGalleryIndex - 1);
  });
  $(".gallery-next").addEventListener("click", () => {
    navigateGallery(currentGalleryIndex + 1);
  });
  updateGalleryCount();
  $(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  const audio = $("#bgMusic");
  const musicButton = $("#musicBtn");
  const musicLabel = $("#musicLabel");
  audio.src = config.music || "";
  const playBackgroundMusic = async () => {
    try {
      await audio.play();
      return true;
    } catch (error) {
      musicLabel.textContent = "Music could not be played";
      console.error("Unable to play the configured wedding music.", error);
      return false;
    }
  };
  musicButton.addEventListener("click", async () => {
    if (audio.paused) {
      await playBackgroundMusic();
    } else {
      audio.pause();
    }
  });
  audio.addEventListener("pause", () => {
    musicLabel.textContent = "Play music";
    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-label", "Play background music");
  });
  audio.addEventListener("play", () => {
    musicLabel.textContent = "Pause music";
    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-label", "Pause background music");
  });

  function updateCountdown() {
    const milliseconds = Math.max(0, weddingDateTime.getTime() - Date.now());
    const values = [
      Math.floor(milliseconds / 86400000),
      Math.floor(milliseconds / 3600000) % 24,
      Math.floor(milliseconds / 60000) % 60,
      Math.floor(milliseconds / 1000) % 60
    ];
    ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
      $(`#${id}`).textContent = String(values[index]).padStart(2, "0");
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll(".polaroid, .event-card").forEach((element, index) => {
        window.setTimeout(() => element.classList.add("shown"), index * 140);
      });
    });
  }, { threshold: 0.14 });
  $$(".page").forEach((section) => observer.observe(section));

  const hero = $("#home");
  const beginButton = $("#beginBtn");
  const openingVideo = $("#openingVideo");
  const beginStatus = $("#beginStatus");
  beginButton.addEventListener("click", async () => {
    if (hero.classList.contains("started")) return;
    void playBackgroundMusic();
    hero.classList.add("started");
    beginButton.disabled = true;
    beginButton.textContent = "A beautiful beginning";
    beginStatus.textContent = "";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      $("#couple").scrollIntoView({
        behavior: "auto",
        block: "start"
      });
      return;
    }

    let advanced = false;
    const advanceToCouple = () => {
      if (advanced) return;
      advanced = true;
      $("#couple").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    openingVideo.addEventListener("ended", advanceToCouple, { once: true });
    openingVideo.currentTime = 0;
    try {
      await openingVideo.play();
    } catch (error) {
      console.error("The opening video could not be played.", error);
      openingVideo.removeEventListener("ended", advanceToCouple);
      hero.classList.remove("started");
      beginButton.disabled = false;
      beginButton.innerHTML = 'Tap to Begin <span aria-hidden="true">↓</span>';
      beginStatus.textContent = "The opening video could not be played. Please try again.";
      return;
    }
    const duration = Number.isFinite(openingVideo.duration) ? openingVideo.duration * 1000 : 4000;
    window.setTimeout(advanceToCouple, duration + 250);
  });
})();
