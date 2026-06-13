const membersList = ["MT","ST","H1","H2","D1","D2","D3","D4"];

const membersDiv = document.getElementById("members");
const resultDiv = document.getElementById("result");

/* ========== UI ========== */

function addRow() {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <select>
      ${membersList.map(m => `<option>${m}</option>`).join("")}
    </select>
    <input placeholder="YYYY-MM-DD">
    <input placeholder="HH:MM">
    <input placeholder="HH:MM">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  membersDiv.appendChild(row);
}

function toMin(t){
  const [h,m] = t.split(":").map(Number);
  return h*60+m;
}

/* ========== 把時間切成 30 分鐘 slots ========== */
function toSlots(start,end){
  const arr=[];
  for(let t=start;t<end;t+=30) arr.push(t);
  return arr;
}

/* ========== 收集資料 ========== */
function parseData(){
  const rows=document.querySelectorAll(".row");
  let data={};

  rows.forEach(r=>{
    const m=r.children[0].value;
    const d=r.children[1].value;
    const s=toMin(r.children[2].value);
    const e=toMin(r.children[3].value);

    if(!data[d]) data[d]={};
    if(!data[d][m]) data[d][m]=[];

    data[d][m].push([s,e]);
  });

  return data;
}

/* ========== 建立每個時間點可用人數 map ========== */
function buildTimeline(dayData){
  let map={};

  membersList.forEach(m=>{
    (dayData[m]||[]).forEach(([s,e])=>{
      toSlots(s,e).forEach(t=>{
        if(!map[t]) map[t]=new Set();
        map[t].add(m);
      });
    });
  });

  return map;
}

/* ========== 找連續區間 ========== */
function buildIntervals(map){
  const times=Object.keys(map).map(Number).sort((a,b)=>a-b);

  let result=[];
  let start=null;
  let prev=null;

  for(let t of times){
    if(start===null){
      start=t;
      prev=t;
      continue;
    }

    if(t===prev+30){
      prev=t;
    }else{
      result.push([start,prev+30]);
      start=t;
      prev=t;
    }
  }

  if(start!==null){
    result.push([start,prev+30]);
  }

  return result;
}

/* ========== 計算最佳排程 ========== */
function calc(){
  const data=parseData();
  let output=[];

  for(const day in data){

    const map=buildTimeline(data[day]);
    const intervals=buildIntervals(map);

    intervals.forEach(([s,e])=>{
      const people = map[s] ? map[s].size : 0;

      const missing = membersList.filter(m=>{
        return !(map[s] && map[s].has(m));
      });

      const hours=(e-s)/60;

      if(hours>=1){
        output.push({
          day,
          s,e,
          people,
          missing,
          hours
        });
      }
    });
  }

  render(output);
}

/* ========== 排序 + 顯示 ========== */
function render(data){
  resultDiv.innerHTML="";

  data.sort((a,b)=>{
    if(b.people!==a.people) return b.people-a.people;
    return b.hours-a.hours;
  });

  let grouped={};

  data.forEach(d=>{
    if(!grouped[d.day]) grouped[d.day]=[];
    grouped[d.day].push(d);
  });

  for(const day in grouped){

    const block=document.createElement("div");
    block.className="result-block";

    block.innerHTML=`<h3>${day}</h3>`;

    grouped[day].forEach(d=>{

      const s=`${String(Math.floor(d.s/60)).padStart(2,"0")}:${String(d.s%60).padStart(2,"0")}`;
      const e=`${String(Math.floor(d.e/60)).padStart(2,"0")}:${String(d.e%60).padStart(2,"0")}`;

      if(d.people===8){
        block.innerHTML+=`
          <div>🟢 ${s}-${e}｜8/8｜${d.hours}h</div>
        `;
      }else{
        block.innerHTML+=`
          <div>🟡 ${s}-${e}｜${d.people}/8｜缺：${d.missing.join(",")}｜${d.hours}h</div>
        `;
      }

    });

    resultDiv.appendChild(block);
  }
}

function clearAll(){
  membersDiv.innerHTML="";
  resultDiv.innerHTML="";
}
