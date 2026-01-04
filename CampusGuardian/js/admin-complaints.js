// Student-side complaint logic

const BASE_API = "http://localhost:8080/api/complaints";

// ------- Overview for Dashboard -------
function loadStudentOverview(){
  const email = getUserEmail();
  if(!email) return;

  fetch(`${BASE_API}/by-email?email=${encodeURIComponent(email)}`)
    .then(r => r.json())
    .then(list => {
      if(!Array.isArray(list)) list = [];
      const total = list.length;
      const inProg = list.filter(c=>c.status==="In-Progress").length;
      const resolved = list.filter(c=>c.status==="Resolved").length;

      const tEl = document.getElementById("countTotal");
      const pEl = document.getElementById("countProgress");
      const rEl = document.getElementById("countResolved");
      if(tEl) tEl.innerText = `Total: ${total}`;
      if(pEl) pEl.innerText = inProg;
      if(rEl) rEl.innerText = resolved;

      const body = document.getElementById("recentBody");
      if(!body) return;
      body.innerHTML = "";

      if(list.length === 0){
        body.innerHTML = `<tr><td colspan="4">No complaints yet.</td></tr>`;
        return;
      }

      list.slice(-5).reverse().forEach(c=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.message}</td>
          <td>${renderStatusPill(c.status)}</td>
          <td>${c.priority || "Normal"}</td>
        `;
        body.appendChild(tr);
      });
    })
    .catch(()=>{
      const body = document.getElementById("recentBody");
      if(body) body.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
    });
}

function renderStatusPill(status){
  const s = status || "Pending";
  let cls = "status-pending";
  if(s==="In-Progress") cls="status-progress";
  if(s==="Resolved") cls="status-resolved";
  return `<span class="status-pill ${cls}">${s}</span>`;
}

// ------- Submit Complaint (UPDATED with Department) -------
function submitComplaintStudent(){
  const n = document.getElementById("name").value.trim();
  const e = document.getElementById("email").value.trim();
  const m = document.getElementById("message").value.trim();
  const p = document.getElementById("priority").value;
  const d = document.getElementById("department").value;
  const sel = document.getElementById("department");
  const dName = sel.options[sel.selectedIndex]?.text || "";
  const msg = document.getElementById("submitMsg");

  if(n===""||e===""||m===""||d===""){
    msg.style.color="orange";
    msg.innerText="Fill all fields";
    return;
  }

  msg.style.color="#BFDBFE";
  msg.innerText="Submitting...";

  fetch(BASE_API,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:n,
      email:e,
      message:m,
      priority:p || "Normal",
      status:"Pending",
      departmentId:d,          // added
      departmentName:dName     // added
    })
  })
  .then(res=>{
    if(res.ok){
      msg.style.color="#6EE7B7";
      msg.innerText="Complaint submitted successfully.";
      document.getElementById("message").value="";
    }else{
      msg.style.color="red";
      msg.innerText="Submission failed.";
    }
  })
  .catch(()=>{
    msg.style.color="red";
    msg.innerText="Backend not reachable.";
  });
}

// ------- Track Complaints -------
function trackComplaintsStudent(){
  const email = document.getElementById("trackEmail").value.trim();
  const id    = document.getElementById("trackId").value.trim();
  const msg   = document.getElementById("trackMsg");
  const body  = document.getElementById("trackBody");

  msg.style.color="#BFDBFE";
  msg.innerText="Loading...";
  body.innerHTML = `<tr><td colspan="5">Loading…</td></tr>`;

  if(id !== "" && email === ""){
    fetch(BASE_API)
      .then(r=>r.json())
      .then(list=>{
        if(!Array.isArray(list)) list=[];
        renderTrackResults(list.filter(c=>c.id===id),msg,body);
      });
    return;
  }

  if(email===""){
    msg.style.color="orange";
    msg.innerText="Enter email or complaint ID";
    body.innerHTML = `<tr><td colspan="5">Awaiting input…</td></tr>`;
    return;
  }

  fetch(`${BASE_API}/by-email?email=${encodeURIComponent(email)}`)
    .then(r=>r.json())
    .then(list=>{
      if(!Array.isArray(list)) list=[];
      if(id!=="") list=list.filter(c=>c.id===id);
      renderTrackResults(list,msg,body);
    });
}

function renderTrackResults(list,msg,body){
  if(list.length===0){
    msg.style.color="orange";
    msg.innerText="No complaint found.";
    body.innerHTML = `<tr><td colspan="5">No matching complaints</td></tr>`;
    return;
  }

  msg.innerText="";
  body.innerHTML="";
  list.forEach(c=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.message}</td>
      <td>${renderStatusPill(c.status)}</td>
      <td>${c.priority || "Normal"}</td>
      <td>${c.updatedAt || c.createdAt || "—"}</td>
    `;
    body.appendChild(tr);
  });
}
