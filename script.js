const members=["MT","ST","H1","H2","D1","D2","D3","D4"];
const days=["五","六","日"];

let data=[];

const modal=document.getElementById("modal");
const list=document.getElementById("list");
const result=document.getElementById("result");

function openModal(){
  modal.classList.remove("hidden");

  document.getElementById("member").innerHTML =
    members.map(m=>`<option>${m}</option>`).join("");

  buildForm();
}

function closeModal(){
  modal.classList.add("hidden");
}

/* form */
function buildForm(){

  const box=document.getElementById("form");
  box.innerHTML="";

  days.forEach(d=>{
    box.innerHTML+=`
      <div style="margin-top:10px;">
        <b>${d}</b>

        <input placeholder="開始 14:00">
        <input placeholder="結束 24:00">
        <input placeholder="開始 14:00">
        <input placeholder="結束 24:00">
      </div>
    `;
  });
}

/* submit */
function submit(){

  const m=document.getElementById("member").value;
  const inputs=document.querySelectorAll("#form input");

  let i=0;

  days.forEach(d=>{

    let s1=inputs[i++].value;
    let e1=inputs[i++].value;
    let s2=inputs[i++].value;
    let e2=inputs[i++].value;

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
      <div class="item">
        ${x.m}｜${x.d}｜${x.s}-${x.e}
      </div>
    `;
  });
}
