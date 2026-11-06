
// Shared logic. Everything runs in the browser; nothing is sent anywhere.
var US_CUP_ML = 236.6;
var DENSITIES = {
  "water": 1.00, "milk": 1.03, "all-purpose flour": 0.53, "granulated sugar": 0.85,
  "butter": 0.96, "honey": 1.42, "cooking oil": 0.91,
  "atta (whole-wheat flour)": 0.507, "suji / semolina": 0.706
};
function showError(id, msg){ var el=document.getElementById(id); if(el){ el.textContent=msg; el.setAttribute("role","alert"); el.style.display="block"; } }
function hideError(id){ var el=document.getElementById(id); if(el){ el.style.display="none"; } }
function toggleHeightInputs(){
  var u=document.getElementById("height-unit"); if(!u) return;
  var ftin=document.getElementById("height-ftin"); var single=document.getElementById("height");
  if(u.value==="ft-in"){ if(ftin) ftin.style.display="block"; if(single) single.style.display="none"; }
  else { if(ftin) ftin.style.display="none"; if(single) single.style.display=""; }
}
function calcTDEE(){
  hideError("tdee-error");
  var age=parseFloat(document.getElementById("age").value);
  var sex=document.getElementById("sex").value;
  var act=parseFloat(document.getElementById("activity").value);
  var wRaw=parseFloat(document.getElementById("weight").value);
  var wUnitEl=document.getElementById("weight-unit"); var wUnit=wUnitEl?wUnitEl.value:"kg";
  var w = wUnit==="lb" ? wRaw*0.453592 : wUnit==="oz" ? wRaw*0.0283495 : wUnit==="st" ? wRaw*6.35029 : wRaw;
  var hUnitEl=document.getElementById("height-unit"); var hUnit=hUnitEl?hUnitEl.value:"cm";
  var h;
  if(hUnit==="ft-in"){
    var ft=parseFloat(document.getElementById("height-feet").value)||0;
    var inch=parseFloat(document.getElementById("height-inches").value)||0;
    h=ft*30.48+inch*2.54;
  } else {
    var hRaw=parseFloat(document.getElementById("height").value);
    h = hUnit==="m" ? hRaw*100 : hUnit==="in" ? hRaw*2.54 : hUnit==="ft" ? hRaw*30.48 : hRaw;
  }
  if(!(age>=10&&age<=100)) return showError("tdee-error","Please enter an age between 10 and 100.");
  if(!(h>=100&&h<=250)) return showError("tdee-error","Please enter a height between 100 and 250 cm.");
  if(!(w>=25&&w<=350)) return showError("tdee-error","Please enter a weight between 25 and 350 kg.");
  var bmr = 10*w + 6.25*h - 5*age + (sex==="male" ? 5 : -161);
  var tdee = bmr*act;
  document.getElementById("bmr").textContent = Math.round(bmr).toLocaleString();
  document.getElementById("tdee").textContent = Math.round(tdee).toLocaleString();
  var t2=document.getElementById("tdee2"); if(t2) t2.textContent = Math.round(tdee).toLocaleString();
  document.getElementById("cut").textContent = Math.round(tdee-500).toLocaleString();
  document.getElementById("bulk").textContent = Math.round(tdee+500).toLocaleString();
  setText("tdee-converted", "Using " + Math.round(w*10)/10 + " kg, " + Math.round(h*10)/10 + " cm.");
  showResult("tdee-result");
}
function showResult(id){ var el=document.getElementById(id); if(!el) return; el.style.display="block"; el.classList.remove("is-showing"); void el.offsetWidth; el.classList.add("is-showing"); }
function setText(id, v){ var el=document.getElementById(id); if(el) el.textContent=v; }
function r1(v){ return Math.round(v*10)/10; }
function r2(v){ return Math.round(v*100)/100; }
function convertKitchen(){
  hideError("kitchen-error");
  var ing=document.getElementById("ingredient").value;
  var from=document.getElementById("from-unit").value;
  var val=parseFloat(document.getElementById("amount").value);
  if(!(val>0&&val<=100000)) return showError("kitchen-error","Please enter an amount greater than 0.");
  var d=DENSITIES[ing];
  var grams, ml;
  // Weight inputs -> grams; volume inputs -> ml. Then convert via density.
  if(from==="g"){ grams=val; ml=val/d; }
  else if(from==="kg"){ grams=val*1000; ml=grams/d; }
  else if(from==="oz"){ grams=val*28.3495; ml=grams/d; }
  else if(from==="lb"){ grams=val*453.592; ml=grams/d; }
  else if(from==="ml"){ ml=val; grams=val*d; }
  else if(from==="l"){ ml=val*1000; grams=ml*d; }
  else if(from==="cup"){ ml=val*US_CUP_ML; grams=ml*d; }
  else if(from==="metric-cup"){ ml=val*250; grams=ml*d; }
  else if(from==="tbsp"){ ml=val*14.787; grams=ml*d; }
  else if(from==="tsp"){ ml=val*4.929; grams=ml*d; }
  else if(from==="floz"){ ml=val*29.574; grams=ml*d; }
  else { return showError("kitchen-error","Unknown unit. Please choose a unit from the list."); }
  setText("k-grams", r1(grams));
  setText("k-kg", r2(grams/1000));
  setText("k-oz", r2(grams/28.3495));
  setText("k-lb", r2(grams/453.592));
  setText("k-ml", r1(ml));
  setText("k-l", r2(ml/1000));
  setText("k-cups", r2(ml/US_CUP_ML));
  setText("k-metric-cups", r2(ml/250));
  setText("k-tbsp", r2(ml/14.787));
  setText("k-tsp", r2(ml/4.929));
  setText("k-floz", r2(ml/29.574));
  setText("k-ing", ing);
  setText("k-density", d.toFixed(3));
  var toEl=document.getElementById("to-unit"); var to=toEl?toEl.value:"all";
  var toMain=document.getElementById("k-to-main");
  if(to!=="all" && toMain){
    var labels={g:"grams (g)",kg:"kilograms (kg)",oz:"ounces (oz)",lb:"pounds (lb)",ml:"millilitres (ml)",l:"litres (l)",cup:"US cups", "metric-cup":"metric cups",tbsp:"tablespoons (tbsp)",tsp:"teaspoons (tsp)",floz:"fluid ounces (fl oz)"};
    var vals={g:r1(grams),kg:r2(grams/1000),oz:r2(grams/28.3495),lb:r2(grams/453.592),ml:r1(ml),l:r2(ml/1000),cup:r2(ml/US_CUP_ML),"metric-cup":r2(ml/250),tbsp:r2(ml/14.787),tsp:r2(ml/4.929),floz:r2(ml/29.574)};
    setText("k-to-value", vals[to]); setText("k-to-label", labels[to]||to);
    toMain.style.display="block";
  } else if(toMain){ toMain.style.display="none"; }
  showResult("kitchen-result");
}

function switchTool(name){
  var t=document.getElementById("panel-tdee"), k=document.getElementById("panel-kitchen");
  if(!t||!k) return;
  var showT = name==="tdee";
  t.hidden=!showT; k.hidden=showT;
  var btns=document.querySelectorAll(".switcher button");
  btns.forEach(function(b){
    var isT=b.textContent.trim().toLowerCase().indexOf("tdee")===0;
    b.setAttribute("aria-selected", String(isT===showT));
  });
}
