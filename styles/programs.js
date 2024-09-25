const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;

//Get the number of cards that can fit in the carousel at once

let cardPreView = Math.round(carousel.offsetWidth / firstCardWidth);


carouselChildrens.slice(-cardPreView).reverse().forEach(card =>{
  carousel.insertAdjacentHTML("afterbegin",card.outerHTML);
});

carouselChildrens.slice(0, cardPreView).forEach(card =>{
  carousel.insertAdjacentHTML("beforeend",card.outerHTML);
});


//Add event listner for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
  });

});

const dragStart = (e) =>{
  isDragging = true;
  carousel.classList.add("dragging");
  //Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;

}

const dragging = (e)=> {
  if(!isDragging) return;// if isDragging is false return from here
  //update the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}
const dragStop = () =>{
  isDragging = false;
  carousel.classList.remove("dragging");
}

const autoPlay = () => {
  if(window.innerWidth < 800) return;
  timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();


const infinteScroll = () => {
  if(carousel.scrollLeft === 0 ){
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - ( 2 * carousel.offsetWidth);
    carousel.classList.remove("no-transition");
  }
  else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth){
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
}
clearTimeout(timeoutId);
if(!wrapper.matches(":hover")) autoPlay();
}

carousel.addEventListener("mousedown",dragStart);
carousel.addEventListener("mousemove",dragging);
document.addEventListener("mouseup",dragStop);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
carousel.addEventListener("scroll",infinteScroll);
wrapper.addEventListener("mouseleave",autoPlay);