const members = ["MT","ST","H1","H2","D1","D2","D3","D4"];

/*
資料格式：
member -> available time slots (30min index)
*/
let data = {};

/* 初始化 */
function init(){
  document.getElementById("members").innerHTML =
    members.map(m=>`<div>${m}</div>`).join("");

  renderTimeline();
}
init();

/* 測試資料 */
function addMock(){

  data = {
    MT: [0,1,2,3,10,11],
    ST: [0,1,2,10,11],
    H1: [1,2,3,10],
    H2: [0,1,10,11],
    D1: [0,1,2,3,10,11],
    D2: [1,2,10,11],
    D3: [0,10,11],
    D4: [0,1,2,3,10,11]
  };

  renderTimeline();
}

/* 14:00–24:00 → 20 slots (30min) */
function renderTimeline(){

  const container = document.getElementById("timeline");
  container.innerHTML = "";

  for(let t=0; t<20; t++){

    let row = document.createElement("div");
    row.className = "row";

    let label = document.createElement("div");
    label.className = "time";
    label.innerText = `${14 + Math.floor(t/2)}:${t%2===0?"00":"30"}`;

    row.appendChild(label);

    members.forEach(m=>{

      let cell = document.createElement("div");
      cell.className = "cell";

      if(data[m] && data[m].includes(t)){
        cell.classList.add("active");
      }

      row.appendChild(cell);
    });

    container.appendChild(row);
  }
}
