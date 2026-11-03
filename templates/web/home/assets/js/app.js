// Optional page elements are guarded so one missing widget cannot disable
// the video and poster dialogs later in this file.
const offerDialog = document.querySelector("#offer-dialog");
if (offerDialog) {
  document.querySelectorAll("[data-offer]").forEach((button) => {
    button.addEventListener("click", () => offerDialog.showModal());
  });

  offerDialog.querySelector(".close")?.addEventListener("click", () => offerDialog.close());
  offerDialog.querySelector(".later")?.addEventListener("click", () => offerDialog.close());
  offerDialog.addEventListener("click", (event) => {
    if (event.target !== offerDialog) return;
    const bounds = offerDialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    ) offerDialog.close();
  });
}

const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const dailyInput = document.querySelector("#daily");
const dailyValue = document.querySelector("#daily-value");
const monthlyValue = document.querySelector("#monthly");
if (dailyInput && dailyValue && monthlyValue) {
  const updateCalculator = () => {
    const amount = Number(dailyInput.value);
    dailyValue.textContent = money(amount);
    monthlyValue.textContent = money(amount * 30);
  };
  dailyInput.addEventListener("input", updateCalculator);
  updateCalculator();
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const videoDialog = document.querySelector("#video-dialog");
const videoPlayer = document.querySelector("#video-player");
const videoTitle = document.querySelector("#video-title");
const videoExternal = document.querySelector("#video-external");
const reviewAudios = [...document.querySelectorAll("#voice-reviews audio")];
const pauseReviews = () => reviewAudios.forEach((audio) => audio.pause());

if (videoDialog && videoPlayer && videoTitle && videoExternal) {
  reviewAudios.forEach((audio) => audio.addEventListener("play", () => {
    reviewAudios.forEach((other) => {
      if (other !== audio) other.pause();
    });
    if (videoDialog.open) videoDialog.close();
  }));

  document.querySelectorAll("#video-grid .video").forEach((link) => {
    const thumbnail = link.querySelector(".video-thumb");
    const image = thumbnail?.querySelector("img");
    if (thumbnail) {
      const fallback = document.createElement("span");
      fallback.className = "video-fallback";
      fallback.textContent = "USK · VIDEO";
      thumbnail.prepend(fallback);
    }
    if (image) {
      image.addEventListener("error", () => { image.hidden = true; });
      if (image.complete && !image.naturalWidth) image.hidden = true;
    }

    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();

      const watchUrl = new URL(link.href, window.location.href);
      const videoId = watchUrl.searchParams.get("v");
      if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
        window.open(link.href, "_blank", "noopener");
        return;
      }

      pauseReviews();
      const title = link.querySelector("h3")?.textContent?.trim() || "USK Login video";
      videoTitle.textContent = title;
      videoExternal.href = watchUrl.href;

      const frame = document.createElement("iframe");
      frame.title = title;
      frame.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&playsinline=1`;
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      videoPlayer.replaceChildren(frame);
      videoDialog.showModal();
    });
  });

  videoDialog.addEventListener("close", () => videoPlayer.replaceChildren());
}

const posterDialog = document.querySelector("#poster-dialog");
const posterTitle = document.querySelector("#poster-title");
const posterImage = document.querySelector("#poster-full");
const posterDownload = document.querySelector("#poster-download");
if (posterDialog && posterTitle && posterImage && posterDownload) {
  document.querySelectorAll("[data-poster]").forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.title || "Poster sample";
      const imagePath = button.dataset.poster;
      if (!imagePath) return;

      // Resolve from the site root so this also works on the /home/ alias.
      const imageUrl = new URL(imagePath.replace(/^\/+/, ""), `${window.location.origin}/`);
      posterTitle.textContent = title;
      posterImage.src = imageUrl.href;
      posterImage.alt = title;
      posterDownload.href = imageUrl.href;
      posterDownload.download = imageUrl.pathname.split("/").pop() || "poster-sample.png";
      posterDialog.showModal();
    });
  });
}

[videoDialog, posterDialog].filter(Boolean).forEach((modal) => {
  modal.querySelector(".media-close")?.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target !== modal) return;
    const bounds = modal.getBoundingClientRect();
    if (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    ) modal.close();
  });
});
