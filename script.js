var barangays=["Guilid","Tinago","Bonga","Cavasi","Maonon"];
var FAC=[["Ligao City Health Office","Health office","Ligao City","Public health programs, immunization, maternal and child care, DOTS (tuberculosis), social hygiene, lab and dental services","Open daily, 7:00–17:00",1],
["Ligao City Coastal Rural Health Unit","Rural health unit","Barangay Cabarian","Serves the coastal barangays: general consultation, lab, dental, nutrition, prenatal and postnatal care","Hours to be confirmed",1],["Main Health Center (Guilid)","Barangay station","Barangay Guilid","Primary care and referrals","Hours to be confirmed",1]].concat(["Tinago","Bonga","Cavasi","Maonon"].map(function(b)
{return[b+" BHS","Barangay station","Barangay "+b,"Primary care and referrals","Hours to be confirmed",1]})).concat([["Josefina Belmonte Duran Memorial District Hospital (JBDMDH)","Hospital","National highway, Barangay Tuburan","25-bed government hospital","Open 24 hours",1],["Zone Medical and Intervention Hospital","Hospital","Diversion Road","Level 2 private hospital","Open 24 hours",0],["Clinica Aban Birthing Home, Laboratory, and Diagnostic Clinic","Private clinic","Ligao City","PhilHealth-accredited maternity and diagnostic clinic","Open 24 hours",0]]);

var facNames=["Ligao City Health Office","Ligao City Coastal Rural Health Unit","Main Health Center (Guilid)","JBDMDH (District Hospital)"];
var P="<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>";
var FEATS=[["Book appointments","Pick a facility, service and date without queuing first.",P+"<rect x='3' y='5' width='18' height='16' rx='2'/><path d='M3 10h18M8 3v4M16 3v4'/></svg>"],["Track referrals","Barangay workers refer upward and see when the hospital responds.",P+"<path d='M5 12h14M13 6l6 6-6 6'/></svg>"],["See your own record","Visits, medications and results in one place, shared only with consent.",P+"<path d='M6 3h9l4 4v14H6z'/><path d='M9 12h7M9 16h7'/></svg>"],["Get health alerts","The City Health Office posts dengue, flood and vaccination notices.",P+"<path d='M6 9a6 6 0 0112 0c0 6 3 7 3 7H3s3-1 3-7M10 20a2 2 0 004 0'/></svg>"],["Spot outbreaks early","Case counts per barangay show on a city dashboard.",P+"<path d='M4 20V10M10 20V4M16 20v-8M22 20H2'/></svg>"],["Text-message access","Check alerts and book from any basic phone.",P+"<path d='M4 5h16v11H9l-5 4z'/></svg>"]];
var PRIV=[["Data Privacy Act","Built around RA 10173: only needed data, clear purpose, patient rights."],["Consent first","Patients choose who sees their record and can withdraw anytime."],["Role-based access","Each role sees only what its job needs."],["Audit logs","Every view and change is recorded and reviewable."],["Encryption","Data is encrypted in transit and at rest."],["Standard formats","HL7 FHIR for exchange and ICD-10 for diagnoses."]];
function fresh(){return{auth:false,step:0,pend:"resident",err:"",role:"resident",
appts:[{svc:"Prenatal checkup",fac:"Ligao City Health Office",date:"2026-11-16"}],refs:[],
alerts:[{t:"Dengue prevention: clear standing water around your home this week.",from:"City Health Office"}],
cases:{Guilid:4,Tinago:9,Bonga:2,Cavasi:6,Maonon:3},consent:{},
sms:[{t:"Demo text line. Send HELP to start."}],q:"",ty:"All"}}
var S=fresh();
function setc(){facNames.forEach(function(f){S.consent[f]=true})}
setc();
var ROLES=[["resident","Resident"],["bhw","Barangay health worker"],["doctor","Doctor"],["cho","City Health Office"]];
var $=function(i){return document.getElementById(i)};
function tod(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(){var t=tod();return t>"2026-11-18"?t:"2026-11-18"}
function barLabel(){return barangays.map(function(b){return b+" "+S.cases[b]}).join(", ")}
function hint(st,r,t){return S.refs.some(function(x){return x.status===st})?'<p></p><button class="btn sm" data-r="'+r+'">'+t+"</button>":""}
function sendSms(v,f){S.sms.push({t:v,me:1});S.sms.push({t:reply(v)});render();if(f){var m=$("sm");if(m)m.focus()}}
function guide(){var n,t;
 if(!S.refs.length){n=1;t="As a barangay health worker, send a referral for Maria Reyes."}
 else if(S.refs.some(function(x){return x.status==="Pending"})){n=2;t="As a doctor, accept the referral."}
 else{n=3;t="As a resident, see the referral status on Maria Reyes’s record."}
 return'<p class="guide"><b>Demo path, step '+n+" of 3:</b> "+t+"</p>"}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function toast(m){var t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove("on")},2400)}
function opts(a){return a.map(function(x){return"<option>"+esc(x)+"</option>"}).join("")}
function tag(s){return'<span class="tag'+(s==="Pending"?" w":"")+'">'+esc(s)+"</span>"}
function alerts(){return S.alerts.map(function(a){return'<div class="alert">'+esc(a.t)+' <span class="muted">'+esc(a.from)+"</span></div>"}).join("")}
function refList(arr,doc){return arr.length?arr.map(function(r){var i=S.refs.indexOf(r);return'<div class="row"><span><b>'+esc(r.patient)+"</b> "+(doc?"from "+esc(r.barangay):"to "+esc(r.to))+'<br><span class="muted">'+esc(r.reason)+"</span></span>"+(doc&&r.status==="Pending"?'<button class="btn sm" data-a="accept" data-i="'+i+'">Accept</button>':tag(r.status))+"</div>"}).join(""):(doc?'<p class="muted">No referrals yet.</p><button class="btn sm" data-r="bhw">Switch to Barangay health worker to send one</button>':'<p class="muted">No referrals yet. Send one with the form.</p>')}

function login(){
 if(S.step===0)return'<div class="panel auth"><h3>Sign in</h3><p class="muted">Demo only. No real account is created.</p><label for="lr">I am a</label><select id="lr">'+ROLES.map(function(r){return'<option value="'+r[0]+'">'+r[1]+"</option>"}).join("")+'</select><label for="lm">Mobile number</label><input id="lm" inputmode="tel" autocomplete="tel" value="0917 000 0000"><p></p><button class="btn" data-a="code">Send code</button></div>';
 return'<div class="panel auth"><h3>Enter your code</h3><p class="muted">We sent a 4-digit code by text. For this demo, use 1234.</p><label for="lc">Code</label><input id="lc" inputmode="numeric" maxlength="4" autocomplete="one-time-code"><div class="err" id="le" role="alert">'+esc(S.err)+'</div><p></p><button class="btn" data-a="verify">Verify and sign in</button> <button class="btn sm ghost" data-a="back">Back</button></div>';
}
function resident(){
 var mine=S.refs.filter(function(r){return r.patient==="Maria Reyes"});
 return alerts()+'<div class="cols"><div class="panel"><h3>My record: Maria Reyes (sample)</h3><div class="row"><span>Blood pressure, 4 Nov<br><span class="muted">Tinago BHS</span></span><b>150/95</b></div><div class="row"><span>Immunization<br><span class="muted">Ligao City Health Office</span></span><span class="tag">Up to date</span></div>'+mine.map(function(r){return'<div class="row"><span>Referral to '+esc(r.to)+'<br><span class="muted">'+esc(r.reason)+"</span></span>"+tag(r.status)+"</div>"}).join("")+"</div>"+
 '<div class="panel"><h3>Book an appointment</h3><label for="af">Facility</label><select id="af">'+opts(facNames)+'</select><label for="as">Service</label><select id="as">'+opts(["General consultation","Vaccination","Prenatal checkup","Laboratory test"])+'</select><label for="ad">Date</label><input id="ad" type="date" min="'+tod()+'" value="'+dd()+'"><p></p><button class="btn" data-a="book">Book appointment</button></div>'+
 '<div class="panel"><h3>My appointments</h3>'+S.appts.map(function(a){return'<div class="row"><span>'+esc(a.svc)+'<br><span class="muted">'+esc(a.fac)+", "+esc(a.date)+'</span></span><span class="tag">Booked</span></div>'}).join("")+"</div>"+
 '<div class="panel" role="group" aria-labelledby="ch"><h3 id="ch">Who can see my record</h3>'+facNames.map(function(f,i){return'<div class="row"><label class="cl" for="c'+i+'">'+esc(f)+'</label><input id="c'+i+'" type="checkbox" data-c="'+esc(f)+'" '+(S.consent[f]?"checked":"")+' class="ck"></div>'}).join("")+"</div>"+
 '<div class="panel"><h3>Text-message access</h3><p class="muted">No internet needed. Try HELP, ALERTS, STATUS or BOOK (BOOK reserves a general consultation).</p><div class="sms" id="smsb" role="log" aria-live="polite" aria-label="Text messages">'+S.sms.map(function(m){return'<span class="'+(m.me?"me":"")+'">'+esc(m.t)+"</span>"}).join("")+'</div><div class="chips">'+["HELP","ALERTS","STATUS","BOOK"].map(function(c){return'<button class="btn sm ghost" data-a="chip" data-v="'+c+'">'+c+"</button>"}).join("")+'</div><div class="smsf"><input id="sm" aria-label="Text message" placeholder="Type a command"><button class="btn sm" data-a="sms">Send</button></div></div></div>';
}
function bhw(){
 return'<div class="cols"><div class="panel"><h3>Refer a patient</h3><label for="rp">Patient</label><select id="rp"><option>Maria Reyes</option><option>Jose Santos</option><option>Ana Dela Cruz</option></select><label for="rb">Barangay</label><select id="rb">'+opts(barangays)+'</select><label for="rt">Refer to</label><select id="rt"><option>JBDMDH (District Hospital)</option><option>Zone Medical and Intervention Hospital</option><option>Ligao City Health Office</option></select><label for="rr">Reason and vitals</label><textarea id="rr" rows="3">Cough for 3 weeks, BP 150/95</textarea><p></p><button class="btn" data-a="refer">Send referral</button></div><div class="panel"><h3>Referrals I sent</h3>'+refList(S.refs,false)+hint("Pending","doctor","Switch to Doctor to accept it")+"</div></div>";
}
function doctor(){return'<div class="panel"><h3>Incoming referrals</h3>'+refList(S.refs,true)+hint("Accepted","resident","View it as the patient")+"</div>"}
function cho(){
 var mx=Math.max.apply(null,barangays.map(function(b){return S.cases[b]}));
 return'<div class="cols"><div class="panel"><h3>Dengue cases this week (sample)</h3><div class="bars" role="img" aria-label="Dengue cases by barangay: '+barLabel()+'">'+barangays.map(function(b){return"<div><span>"+esc(b)+'</span><span class="b" style="width:'+S.cases[b]/mx*100+'%"></span><b>'+S.cases[b]+"</b></div>"}).join("")+'</div><p class="muted" style="margin-top:1rem">Counts only, no names. Tinago is highest.</p></div><div class="panel"><h3>Post a health alert</h3><label for="at">Message</label><textarea id="at" rows="3">Free anti-flu vaccination at the City Health Office this Friday.</textarea><p></p><button class="btn" data-a="alert">Post to all users</button></div></div>';
}
function render(){
 var ae=document.activeElement,k=null;
 if(ae&&ae.closest&&ae.closest("#stage,#roles")){k=ae.id?"#"+ae.id:ae.dataset.c?'[data-c="'+ae.dataset.c+'"]':ae.dataset.r?'[data-r="'+ae.dataset.r+'"]':ae.dataset.a?'[data-a="'+ae.dataset.a+'"]':null}
 $("roles").innerHTML=S.auth?ROLES.map(function(r){return'<button class="r" data-r="'+r[0]+'" aria-pressed="'+(S.role===r[0])+'">'+r[1]+"</button>"}).join("")+'<span class="push"></span><button class="btn sm ghost" data-a="reset">Reset demo</button><button class="btn sm" data-a="out">Sign out</button>':"";
 $("stage").innerHTML=S.auth?{resident:resident,bhw:bhw,doctor:doctor,cho:cho}[S.role]():login();
 var b=$("smsb");if(b)b.scrollTop=b.scrollHeight;
 $("guide").innerHTML=S.auth?guide():"";
 var n=k&&document.querySelector(k);
 if(!n&&k)n=S.auth?$("stage").querySelector("h3"):$("stage").querySelector("input,select");
 if(n){if(n.tagName==="H3")n.tabIndex=-1;n.focus()}
}
function reply(c){
 c=c.trim().toUpperCase();
 if(c==="HELP")return"Reply ALERTS, STATUS or BOOK.";
 if(c==="ALERTS")return S.alerts[0].t;
 if(c==="STATUS"){var r=S.refs.filter(function(x){return x.patient==="Maria Reyes"})[0];return S.appts.length+" appointment(s) booked."+(r?" Referral: "+r.status+".":"")}
 if(c==="BOOK"){S.appts.push({svc:"General consultation",fac:"Ligao City Health Office",date:"2026-11-18"});return"Booked: General consultation, Ligao City Health Office, 18 Nov. Reply STATUS to check."}
 return"Sorry, we didn’t understand that. Text HELP.";
}
document.addEventListener("click",function(e){
 var b=e.target.closest("button");if(!b)return;
 if(b.dataset.r){S.role=b.dataset.r;render();return}
 var a=b.dataset.a;if(!a)return;
 if(a==="code"){S.pend=$("lr").value;S.step=1;S.err="";render()}
 if(a==="back"){S.step=0;render()}
 if(a==="verify"){if($("lc").value==="1234"){S.auth=true;S.role=S.pend;S.step=0;render();toast("Signed in")}else{S.err="That code doesn’t match. Use 1234 in this demo.";render();var c=$("lc");if(c){c.setAttribute("aria-invalid","true");c.setAttribute("aria-describedby","le");c.focus()}}}
 if(a==="out"){S.auth=false;S.step=0;render()}
 if(a==="book"){var d=$("ad");if(!d.value||d.value<tod()){d.setAttribute("aria-invalid","true");d.focus();toast("Choose today or a later date.");return}S.appts.push({svc:$("as").value,fac:$("af").value,date:$("ad").value});render();toast("Appointment booked")}
 if(a==="refer"){var rr=$("rr");if(!rr.value.trim()){rr.setAttribute("aria-invalid","true");rr.focus();toast("Add a reason and vitals first.");return}S.refs.push({patient:$("rp").value,barangay:$("rb").value,to:$("rt").value,reason:$("rr").value,status:"Pending"});render();toast("Referral sent")}
 if(a==="accept"){S.refs[+b.dataset.i].status="Accepted";render();toast("Referral accepted")}
 if(a==="alert"){var at=$("at");if(!at.value.trim()){at.setAttribute("aria-invalid","true");at.focus();toast("Write the alert message first.");return}S.alerts.unshift({t:$("at").value,from:"City Health Office"});render();toast("Alert posted")}
 if(a==="sms"){var v=$("sm").value;if(!v.trim())return;sendSms(v,1)}
 if(a==="chip")sendSms(b.dataset.v);
 if(a==="reset"){var o=S;S=fresh();S.auth=o.auth;S.role=o.role;S.q=o.q;S.ty=o.ty;setc();render();toast("Demo reset")}
});
document.addEventListener("change",function(e){if(e.target.dataset&&e.target.dataset.c){S.consent[e.target.dataset.c]=e.target.checked;toast(e.target.checked?e.target.dataset.c+" can now see your record.":e.target.dataset.c+" can no longer see your record.")}});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.id==="sm")document.querySelector("[data-a=sms]").click();
 if(e.key==="Enter"&&e.target.tagName==="INPUT"&&e.target.closest(".auth")){var pb=document.querySelector(".auth .btn[data-a]");if(pb)pb.click()}});
function dir(){
 var q=S.q.toLowerCase();
 var r=FAC.filter(function(f){return(S.ty==="All"||f[1]===S.ty)&&(f.join(" ").toLowerCase().indexOf(q)>-1)});
 $("dcount").textContent=r.length+(r.length===1?" facility":" facilities")+" found";
 $("dres").innerHTML=r.length?r.map(function(f){return'<div class="panel"><h3>'+esc(f[0])+'</h3><span class="tag'+(f[5]?"":" w")+'">'+(f[5]?"Phase 1: public facility":"Phase 2: private facility")+"</span><p>"+esc(f[1])+", "+esc(f[2])+"</p><p>"+esc(f[3])+'</p><p class="'+(/confirmed/.test(f[4])?"tbc":"ok")+'">'+esc(f[4])+'</p><p style="margin-top:.8rem"><a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&amp;query='+encodeURIComponent(f[0]+", "+f[2]+", Ligao City, Albay")+'">Get directions</a></p></div>'}).join(""):'<p class="muted">No facility matches. Clear the search or choose All types.</p>';
}
$("feats").innerHTML=FEATS.map(function(f){return'<div class="panel"><div class="ic">'+f[2]+"</div><h3>"+f[0]+"</h3><p>"+f[1]+"</p></div>"}).join("");
$("priv").innerHTML=PRIV.map(function(f){return'<div class="panel"><h3>'+f[0]+"</h3><p>"+f[1]+"</p></div>"}).join("");
$("t").innerHTML=["All"].concat(["Health office","Rural health unit","Barangay station","Hospital","Private clinic"]).map(function(x){return"<option value=\""+x+'">'+(x==="All"?"All types":x)+"</option>"}).join("");
$("q").addEventListener("input",function(e){S.q=e.target.value;dir()});
$("t").addEventListener("change",function(e){S.ty=e.target.value;dir()});
var TT={home:"Home",directory:"Find a facility",demo:"Try the portal",how:"How it works"},first=true;
$("clr").addEventListener("click",function(){S.q="";S.ty="All";$("q").value="";$("t").value="All";dir();$("q").focus()});
document.querySelector(".skip").addEventListener("click",function(e){e.preventDefault();var m=$("main");m.tabIndex=-1;m.focus()});
function route(){
 var h=(location.hash||"#home").slice(1);if(["home","directory","demo","how"].indexOf(h)<0)h="home";
 ["home","directory","demo","how"].forEach(function(id){$(id).classList.toggle("on",id===h)});
 document.querySelectorAll("nav a").forEach(function(a){if(a.getAttribute("href")==="#"+h)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
 window.scrollTo(0,0);
 document.title=TT[h]+" | Ligao City Health Portal";
 if(!first){var hd=$(h).querySelector("h1,h2");if(hd){hd.tabIndex=-1;hd.focus({preventScroll:true})}}
 first=false;
}
window.addEventListener("hashchange",route);
dir();render();route();
var TB=$("theme"),RT=document.documentElement;
function setTheme(t,sv){RT.setAttribute("data-theme",t);TB.setAttribute("aria-pressed",t==="dark");if(sv)try{localStorage.setItem("theme",t)}catch(x){}}
var st=null;try{st=localStorage.getItem("theme")}catch(x){}
setTheme(st||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
TB.addEventListener("click",function(){setTheme(RT.getAttribute("data-theme")==="dark"?"light":"dark",1)});