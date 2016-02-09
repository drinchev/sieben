!function(){function e(){var e=""
r.forEach(function(t){switch(t.value){case"divide":e+="÷"
break
case"multiply":e+="x"
break
case"plus":e+="+"
break
case"minus":e+="-"
break
default:e+=t.value}}),o.innerHTML=e||"0",o.innerHTML.length>7?o.classList.add("is-small"):o.classList.remove("is-small")}function t(){function e(t){return-1===t.indexOf(n[a])?n.length-1===a?t:(a++,e(t)):e(t.indexOf(n[a])===t.length-1?t.slice(0,-1):t.replace(p[n[a]],function(e,t,n,r){var u=parseFloat(t),i=parseFloat(r)
switch(a){case 0:return u/i
case 1:return u*i
case 2:return u+i
case 3:return u-i}}))}var t=o.innerHTML.replace(/,/g,"."),n=["÷","x","+","-"],a=0
return e(t)}function n(e){var t=r[r.length-1]
t&&"number"===t.type?t.value+=e:r.push({type:"number",value:e})}function a(n){if("clear"===n)return void("C"===c.innerHTML?(c.innerHTML="AC",r.pop()):r=[])
if("result"===n)return void(r=[{type:"number",value:t()}])
var a=r[r.length-1]
if("dot"===n)return void(a&&"number"===a.type?","!==a.value.charAt(a.value.length-1)&&(a.value+=","):r.push({type:"number",value:"0,"}))
if("plusminus"===n)return void(a&&"number"===a.type&&("-"===a.value.charAt(0)?a.value=a.value.replace(/^-/,""):a.value="-"+a.value))
if("percent"!==n)a&&"operation"===a.type?a.value=n:r.push({type:"operation",value:n})
else if(a&&"number"===a.type){var u=r.pop()
e()
var i=parseFloat(u.value.replace(/,/g,"."))/100,l=parseFloat(t())
r.push({type:"number",value:(l*i).toString()})}}document.body.addEventListener("touchmove",function(e){e.preventDefault()})
for(var r=[],u=("ontouchstart"in window||navigator.maxTouchPoints),i=u?"touchstart":"mousedown",l=u?"touchend":"mouseup",o=document.getElementById("screen"),s=document.getElementsByTagName("button"),c=document.getElementById("clear"),v="(\\d+(\\.\\d+)?)",p={"÷":new RegExp(v+"÷"+v),x:new RegExp(v+"x"+v),"+":new RegExp(v+"\\+"+v),"-":new RegExp(v+"-"+v)},d=0;d<s.length;d++)!function(t){var r=t.getAttribute("data-digit"),u=t.getAttribute("data-operation");(r||u)&&(t.addEventListener(i,function(i){r&&n(r),u&&a(u),e(),"clear"!==u&&(c.innerHTML="C"),i.preventDefault(),t.classList.add("is-touched")},!1),t.addEventListener(l,function(e){e.preventDefault(),t.classList.remove("is-touched")},!1))}(s[d])}()
