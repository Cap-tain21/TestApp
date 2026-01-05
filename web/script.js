const day = document.getElementById("day");
const month = document.getElementById("month");
const year = document.getElementById("year");
const result = document.getElementById("result");

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let last = { day:null, month:null, year:null };

function spacer() {
  const d = document.createElement("div");
  d.className = "item spacer";
  return d;
}
function item(v) {
  const d = document.createElement("div");
  d.className = "item";
  d.textContent = v;
  return d;
}

function fill(el, values) {
  el.innerHTML = "";
  for (let i=0;i<2;i++) el.appendChild(spacer());
  values.forEach(v => el.appendChild(item(v)));
  for (let i=0;i<2;i++) el.appendChild(spacer());
}

fill(day, Array.from({length:31},(_,i)=>i+1));
fill(month, months);
fill(year, Array.from({length:77},(_,i)=>2026-i));

function getActive(el, key) {
  const center = el.scrollTop + 100;
  let active;
  el.querySelectorAll(".item").forEach(i => {
    i.classList.remove("active");
    if (!i.classList.contains("spacer") &&
        Math.abs(i.offsetTop + 20 - center) < 18) {
      active = i;
    }
  });
  if (active) {
    active.classList.add("active");
    last[key] = active.textContent;
  }
  return active?.textContent;
}

/* DATE INTELLIGENCE */
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

function enforceValidDate() {
  const y = +last.year;
  const m = months.indexOf(last.month);
  const d = +last.day;
  if (!y || m < 0 || !d) return;

  const max = daysInMonth(y, m);
  if (d > max) {
    const target = (max + 2) * 40;
    day.scrollTo({ top: target, behavior: "smooth" });
    last.day = max;
  }
}

function snap(el) {
  el.scrollTo({
    top: Math.round(el.scrollTop / 40) * 40,
    behavior: "smooth"
  });
}

let snapTimer;
function onScroll(el, key) {
  return () => {
    getActive(el, key);
    enforceValidDate();
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => snap(el), 90);
    calcAge();
  };
}

function calcAge() {
  const d = +last.day;
  const m = months.indexOf(last.month);
  const y = +last.year;
  if (!d || m < 0 || !y) return;

  const birth = new Date(y, m, d);
  const now = new Date();

  let Y = now.getFullYear() - birth.getFullYear();
  let M = now.getMonth() - birth.getMonth();
  let D = now.getDate() - birth.getDate();

  if (D < 0) {
    M--;
    D += daysInMonth(now.getFullYear(), now.getMonth() - 1);
  }
  if (M < 0) {
    Y--;
    M += 12;
  }

  result.innerHTML = `🎉 <b>${Y}</b> years • <b>${M}</b> months • <b>${D}</b> days`;
}

day.addEventListener("scroll", onScroll(day,"day"));
month.addEventListener("scroll", onScroll(month,"month"));
year.addEventListener("scroll", onScroll(year,"year"));

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("startup").remove();
    document.getElementById("app").classList.remove("hidden");
    day.scrollTop = 3*40;
    month.scrollTop = 3*40;
    year.scrollTop = 3*40;
  }, 1500);
});
