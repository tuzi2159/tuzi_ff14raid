const members = ["MT","ST","H1","H2","D1","D2","D3","D4"];

/* 14:00–24:00 → 20 slots */
const slots = Array.from({length:20},(_,i)=>{
  let h = 14 + Math.floor(i/2);
  let m = i%2===0 ? "00":"30";
  return `${String(h).padStart(2,"0")}:${m}`;
});

function buildTable(){

  let html = `<table><tr><th></th>`;

  slots.forEach(t=>{
    html += `<th>${t}</th>`;
  });

  html += `</tr>`;

  members.forEach(m=>{
    html += `<tr><th>${m}</th>`;

    slots.forEach((_,i)=>{
      html += `
        <td>
          <input type="checkbox" data-m="${m}" data-t="${i}">
        </td>
      `;
    });

    html += `</tr>`;
  });

  html += `</table>`;

  document.getElementById("table").innerHTML = html;
}

buildTable();

/* ===== 計算 ===== */

function calc(){

  let map = {};

  document.querySelectorAll("input[type=checkbox]").forEach(cb=>{
    if(cb.checked){
      let m = cb.dataset.m;
      let t = Number(cb.dataset.t);

      if(!map[t]) map[t]=0;
      map[t]++;
    }
  });

  let result = Object.entries(map)
    .filter(([t,count])=>count>=7)
    .map(([t,count])=>slots[t]);

  alert("可開團時間:\n" + result.join("\n"));
}
