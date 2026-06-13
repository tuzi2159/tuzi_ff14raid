const members = ["MT","ST","H1","H2","D1","D2","D3","D4"];
const days = ["五","六","日"];

let data = [];

const modal = document.getElementById("modal");
const listDiv = document.getElementById("list");
const resultDiv = document.getElementById("result");

/* ================= INIT ================= */

function init(){
  document.getElementById("m_member").innerHTML =
    members.map(m=>`<option>${m}</option>`).join("");
}

init();

/* ================= MODAL ================= */

function openModal(){
  modal.classList.remove("hidden");
  buildWeekForm();
}

function closeModal(){
  modal.classList.add("hidden");
}

/* 🔥 建立整週表單 */
function buildWeekForm(){

  const box = document.getElementById("weekForm");

  let timeOptions = "";
  for(let h=14; h<=24; h+=0.5){
    let hh = Math.floor(h);
    let mm = h % 1 === 0 ? "00" : "30";
    let label = `${String(hh).padStart(2,"0")}:${mm}`;
    timeOptions += `<option value="${label}">${label}</option>`;
  }

  box.innerHTML = "";

  days.forEach(d=>{
    box.innerHTML += `
      <div class="day-block">
        <h4>${d}</h4>

        <div>時段1
          <select class="t1_${d}">
            ${timeOptions}
          </select>
        </div>

        <div>時段2
          <select class="t2_${d}">
            ${timeOptions}
          </select>
        </div>
      </div>
    `;
  });
}

/* ================= SUBMIT ================= */

function submitWeek(){

  const m = document.getElementById("m_member").value;

  days.forEach(d=>{

    const t1 = document.querySelector(`.t1_${d}`).value;
    const t2 = document.querySelector(`.t2_${d}`).value;

    if(!t1 || !t2) return;

    data.push({
      m,
      d,
      s: t1,
      e: t2
    });

  });

  renderList();
  closeModal();
}

/* ================= LIST ================= */

function renderList(){

  listDiv.innerHTML = "";

  data.forEach((x,i)=>{

    listDiv.innerHTML += `
      <div class="card">
        ${x.m}｜${x.d}｜${x.s}-${x.e}
        <button onclick="remove(${i})">X</button>
      </div>
    `;
  });
}

function remove(i){
  data.splice(i,1);
  renderList();
}

/* ================= TIME ================= */

function toMin(t){
  const [h,m]=t.split(":").map(Number);
  return h*60+m;
}

function toSlots(s,e){
  let arr=[];
  for(let t=s;t<e;t+=30) arr.push(t);
  return arr;
}

/* ================= CALC ================= */

function calc(){

  let map = {};

  for(let x of data){

    const s = toMin(x.s);
    const e = toMin(x.e);

    if(!map[x.d]) map[x.d]={};
    if(!map[x.d][x.m]) map[x.d][x.m]=[];

    map[x.d][x.m].push([s,e]);
  }

  let output=[];

  for(const day in map){

    let timeline={};
    members.forEach(m=>timeline[m]=new Set());

    for(const m in map[day]){
      map[day][m].forEach(([s,e])=>{
        toSlots(s,e).forEach(t=>{
          timeline[m].add(t);
        });
      });
    }

    for(let t=14*60;t<24*60;t+=30){

      let available = members.filter(m=>timeline[m].has(t)).length;

      if(available>=7){

        let missing = members.filter(m=>!timeline[m].has(t));

        output.push({
          day,
          time:t,
          available,
          missing
        });
      }
    }
  }

  renderResult(output);
}

/* ================= RENDER ================= */

function renderResult(res){

  resultDiv.innerHTML="";

  res.forEach(r=>{

    let time = `${String(Math.floor(r.time/60)).padStart(2,"0")}:${String(r.time%60).padStart(2,"0")}`;

    resultDiv.innerHTML += `
      <div class="card">
        ${r.day}｜${time}｜${r.available}/8
        <br>
        缺：${r.missing.join(",")}
      </div>
    `;
  });
}

/* ================= CLEAR ================= */

function clearAll(){
  data=[];
  listDiv.innerHTML="";
  resultDiv.innerHTML="";
}
