const day = document.getElementById("day");
const month = document.getElementById("month");
const year = document.getElementById("year");
const result = document.getElementById("result");

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fill(wheel, values) {
  wheel.innerHTML = "<div class='item'></div>";
  values.forEach(v => {
    const d = document.createElement("div");
    d.className = "item";
    d.textContent = v;
    wheel.appendChild(d);
  });
  wheel.innerHTML += "<div class='item'></div>";
}

fill(day, Array.from({length:31},(_,i)=>i+1));
fill(month, months);
fill(year, Array.from({length:100},(_,i)=>2025-i));

function activeValue(wheel) {
  const items = wheel.querySelectorAll(".item");
  const center = wheel.scrollTop + 90;
  let value = null;

  items.forEach(i => {
    const pos = i.offsetTop + 20;
    i.classList.remove("active");
    if (Math.abs(pos - center) < 20) {
      i.classList.add("active");
      value = i.textContent;
    }
  });
  return value;
}

function calc() {
  const d = parseInt(activeValue(day));
  const m = months.indexOf(activeValue(month));
  const y = parseInt(activeValue(year));
  if (isNaN(d) || m < 0 || isNaN(y)) return;

  const birth = new Date(y, m, d);
  const now = new Date();

  let Y = now.getFullYear() - birth.getFullYear();
  let M = now.getMonth() - birth.getMonth();
  let D = now.getDate() - birth.getDate();

  if (D < 0) { M--; D += 30; }
  if (M < 0) { Y--; M += 12; }

  result.innerHTML = `🎉 <b>${Y}</b> years • <b>${M}</b> months • <b>${D}</b> days 💖`;
}

[day, month, year].forEach(w =>
  w.addEventListener("scroll", () => requestAnimationFrame(calc))
);
