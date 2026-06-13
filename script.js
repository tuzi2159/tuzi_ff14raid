const members = ["MT","ST","H1","H2","D1","D2","D3","D4"];

let data = [];

const listDiv = document.getElementById("list");
const resultDiv = document.getElementById("result");
const modal = document.getElementById("modal");

/* ========= init ========= */
function init(){
  const sel = document.getElementById("m_member");
  sel.innerHTML = members.map(m=>`<option>${m}</option>`).join("");
}
init();

/* ========= modal ========= */
function openModal(){
  modal.classList.remove("hidden");
}

function closeModal(){
  modal.classList.add("hidden");
}

/* ========= add slot ========= */
function addSlot(){

  const m = document.getElementById("m_member").value;
  const d = document.getElementById("m_day").value;
  const s = document.getElementById("m_start").value;
  const e = document.getElementById("m_end").value;

  data.push({m,d,s,e});

  renderList();
  closeModal();
}

/* ========= render list ========= */
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

/* ========= time utils ========= */
function toMin(t){
  const [h,m]=t.split(":").map(Number);
  return h*60+m;
}

function toSlots(s,e){
  let arr=[];
  for(let t=s;t<e;t+=30) arr.push(t);
  return arr;
}

/* ========= calc ========= */
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

/* ========= render ========= */
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

/* ========= clear ========= */
function clearAll(){
  data=[];
  listDiv.innerHTML="";
  resultDiv.innerHTML="";
}
