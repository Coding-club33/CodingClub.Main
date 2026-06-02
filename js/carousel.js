function initCarousel(wrapper) {
  const carousel = wrapper.querySelector(".carousel");
  if (!carousel) return;

  const leftBtn = wrapper.querySelector(".fa-angle-left");
  const rightBtn = wrapper.querySelector(".fa-angle-right");

  const firstCardWidth = carousel.querySelector(".card").offsetWidth;
  const carouselChildren = [...carousel.children];

  let isDragging = false, startX, startScrollLeft, timeoutId;

  // Clone cards for infinite scroll
  let cardPreView = Math.round(carousel.offsetWidth / firstCardWidth);

  carouselChildren.slice(-cardPreView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });
  carouselChildren.slice(0, cardPreView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });

  // Arrow buttons
  if (leftBtn) leftBtn.addEventListener("click", () => {
    carousel.scrollLeft -= firstCardWidth;
  });
  if (rightBtn) rightBtn.addEventListener("click", () => {
    carousel.scrollLeft += firstCardWidth;
  });

  // Mouse drag
  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };
  const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };
  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  // Touch drag
  const touchStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.touches[0].pageX;
    startScrollLeft = carousel.scrollLeft;
  };
  const touchMove = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.touches[0].pageX - startX);
  };
  const touchEnd = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  // Autoplay
  const autoPlay = () => {
    if (window.innerWidth < 800) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
  };
  autoPlay();

  // Infinite scroll
  const infiniteScroll = () => {
    if (carousel.scrollLeft === 0) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
      carousel.classList.remove("no-transition");
    } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
  };

  // Event listeners
  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("touchstart", touchStart, { passive: true });
  carousel.addEventListener("touchmove", touchMove, { passive: true });
  carousel.addEventListener("touchend", touchEnd);
  wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
  wrapper.addEventListener("mouseleave", () => { clearTimeout(timeoutId); autoPlay(); });
  carousel.addEventListener("scroll", infiniteScroll);
}

// Init every carousel on the page independently
document.querySelectorAll(".wrapper").forEach(initCarousel);
