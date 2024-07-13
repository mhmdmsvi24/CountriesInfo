const counter = document.querySelector(".country__number");

export function printComponent(html, parent, clear = false) {
  if (clear) {
    parent.innerHTML = "";
  }
  parent.insertAdjacentHTML("beforeend", html);
}

// Passes the Number of countries fetched into the small fixed div at the bottom of the page
export function printCounter(data) {
  counter.textContent = data;
}
