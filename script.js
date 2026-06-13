const members = ["MT","ST","H1","H2","D1","D2","D3","D4"];
const days = ["五","六","日"];

let data = [];

const modal = document.getElementById("modal");
const list = document.getElementById("list");

function openModal(){
  modal.classList.remove("hidden");

  document.getElementById("member").innerHTML =
    members.map(m=>`<option>${m}</option>`).join("");

  buildForm();
}

function closeModal(){
  modal.classList.add("hidden");
}

/* 30min time options */
function timeOptions(){
  let opt="";
  for(let h=14; h<=24; h++){
    opt+=`<option>${String(h).padStart(2,"0")}:00</option>`;
    if(h<24) opt+=`<option>${String(h).padStart(2,"0")}:30</option>`;
  }
  return opt;
}

/* build UI */
function buildForm(){

  const box=document.getElementById("form");
  box.innerHTML="";

  days.forEach(d=>{
    box.innerHTML+=`
      <div class="day">
        <b>${d}</b><br>

        時段1：
        <select class="s1_${d}">
          ${timeOptions()}
        </select>

        <select class="e1_${d}">
          ${timeOptions()}
        </select>

        <br>

        時段2：
        <select class="s2_${d}">
          ${timeOptions()}
        </select>

        <select class="e2_${d}">
          ${timeOptions()}
        </select>
      </div>
    `;
  });
}

/* submit */
function submit(){

  const m=document.getElementById("member").value;

  days.forEach(d=>{

    let s1=document.querySelector(`.s1_${d}`).value;
    let e1=document.querySelector(`.e1_${d}`).value;

    let s2=document.querySelector(`.s2_${d}`).value;
    let e2=document.querySelector(`.e2_${d}`).value;

    data.push({m,d,s:s1,e:e1});
    data.push({m,d,s:s2,e:e2});

  });

  render();
  closeModal();
}

/* render list */
function render(){

  list.innerHTML="";

  data.forEach(x=>{
    list.innerHTML+=`
      <div class="card">
        ${x.m}｜${x.d}｜${x.s}-${x.e}
      </div>
    `;
  });
}
