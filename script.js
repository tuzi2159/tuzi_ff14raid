const membersDiv = document.getElementById("members");
const resultDiv = document.getElementById("result");

const membersList = ["MT","ST","H1","H2","D1","D2","D3","D4"];

function addRow() {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <select>
      ${membersList.map(m => `<option>${m}</option>`).join("")}
    </select>
    <input placeholder="日期 YYYY-MM-DD">
    <input placeholder="開始 HH:MM">
    <input placeholder="結束 HH:MM">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  membersDiv.appendChild(row);
}

function toMinutes(t) {
  const [h,m] = t.split(":").map(Number);
  return h*60 + m;
}

function rangeToSlots(start, end) {
  let arr = [];
  for (let t = start; t < end; t += 30) arr.push(t);
  return arr;
}

function calc() {
  const rows = document.querySelectorAll(".row");

  let data = {};

  rows.forEach(r => {
    const m = r.children[0].value;
    const date = r.children[1].value;
    const start = toMinutes(r.children[2].value);
    const end = toMinutes(r.children[3].value);

    if (!data[date]) data[date] = {};
    if (!data[date][m]) data[date][m] = [];

    data[date][m].push([start,end]);
  });

  let output = [];

  Object.keys(data).forEach(date => {

    let allSlots = {};

    membersList.forEach(m => allSlots[m] = new Set());

    membersList.forEach(m => {
      (data[date][m] || []).forEach(([s,e]) => {
        rangeToSlots(s,e).forEach(t => allSlots[m].add(t));
      });
    });

    let min = Math.min(...Object.values(allSlots).map(s => s.size ? 1 : 0));

    for (let i = 0; i < 24*60; i += 30) {

      let available = membersList.filter(m => allSlots[m].has(i)).length;

      if (available === 8) {
        output.push({date, time:i, type:"full"});
      } else if (available >= 7) {
        let missing = membersList.filter(m => !allSlots[m].has(i));
        output.push({date, time:i, type:"partial", available, missing});
      }
    }
  });

  render(output);
}

function render(data) {
  resultDiv.innerHTML = "";

  let grouped = {};

  data.forEach(d => {
    if (!grouped[d.date]) grouped[d.date] = [];
    grouped[d.date].push(d);
  });

  Object.keys(grouped).forEach(date => {

    let block = document.createElement("div");
    block.className = "result-block";

    block.innerHTML = `<h3>${date}</h3>`;

    grouped[date].forEach(d => {

      let time = `${String(Math.floor(d.time/60)).padStart(2,"0")}:${String(d.time%60).padStart(2,"0")}`;

      if (d.type === "full") {
        block.innerHTML += `<div>🟢 ${time}｜8/8</div>`;
      } else {
        block.innerHTML += `<div>🟡 ${time}｜${d.available}/8 缺：${d.missing.join(",")}</div>`;
      }

    });

    resultDiv.appendChild(block);
  });
}

function clearAll() {
  membersDiv.innerHTML = "";
  resultDiv.innerHTML = "";
}