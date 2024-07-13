import "./src/styles/cards.css";
import "./src/styles/nav.css";
import "./index.css";

import { searchIcon, arrowIcon } from "./src/components/assets";
import { creatComponent } from "./src/api/countries";

const searchIconEl = document.querySelector(".search__bar__icon");
searchIconEl.src = searchIcon;

const homeItem = document.getElementById("home-item");

const scrollTopBtn = document.getElementById("scroll__top");
scrollTopBtn.style.backgroundImage = `url(${arrowIcon})`;

// Navigation
homeItem.addEventListener("click", creatComponent);

// Scroll to top button
scrollTopBtn.addEventListener("click", () => {
  scrollTo(0, 0);
});
