(()=>{function t(t,n){return t+Math.round((n-t)/2)}function n(t,n,a,e=2){const r=a[1]-a[0];return n.map((function(n){let o=0,l=0;for(let s=0;s<t.length;s++){let i=t[s];if(!isNaN(i)){i=(i-a[0])/r,i=i<0?0:i>1?1:i;let t=n-i;o+=Math.abs(t/=e)<=1?.75*(1-t*t)/e:0,l++}}return o/l}))}function a(t,n,a=2){return n.map((function(n){let e=0,r=0;for(let o=0;o<t.length;o++){let l=t[o];if(!isNaN(l)){let t=n-l;e+=Math.abs(t/=a)<=1?.75*(1-t*t)/a:0,r++}}return e/r}))}onmessage=function(e){if("multi"===e.data[4].analysis)return void this.postMessage(function(n){const a=[];for(let t of n.data[2])a.push("int32"===t[1]?new Int32Array(t[0]):new Float32Array(t[0]));const e=a.length,r=n.data[4],o=r.scaleVals;for(let t of o)t.push(t[1]-t[0]);new Uint8Array(n.data[0]);const l=new Uint8Array(n.data[1]),s=l.length,i=new Array(e),c=new Uint8Array(n.data[3]),f=r.cat;let u=0;for(let t=0;t<s;t++)c[t]===f&&0===l[t]&&u++;for(let t=0;t<e;t++)i[t]=new Float64Array(u);count=0;for(let t=0;t<s;t++)if(c[t]===f&&0===l[t]){for(let n=0;n<e;n++){let e=(a[n][t]-o[n][0])/o[n][2];i[n][count]=e<0?0:e>1?1:e}count++}const h=[];let d=Number.MAX_VALUE,m=Number.MIN_VALUE;for(let n=0;n<e;n++){const a=i[n],e=a.length;a.sort();const r=t(0,e),o=a[r],l=a[t(0,r)],s=a[t(r+1,e)],c=s-l;let f=l-1.5*c,u=s+1.5*c;f=f<a[0]?a[0]:f,u=u>a[e-1]?a[e-1]:u,d=Math.min(d,f),m=Math.max(m,u),h.push({max:u,min:f,Q1:l,Q3:s,med:o,id:n})}return h.max=m,h.min=d,h}(e));const r=new Uint8Array(e.data[0]),o=new Uint8Array(e.data[1]),l=new Uint8Array(e.data[2]),s="int32"===e.data[3][1]?Int32Array:Float32Array,i=new s(e.data[3][0]),c=e.data[4],f=i.length,u=c.values.length,h=new Array(u).fill(0);for(let t=0;t<f;t++)0!==o[t]&&o[t]!==r[t]||h[l[t]]++;const d=[];for(let t=0;t<u;t++)d.push(new s(h[t]));const m=new Array(u).fill(0),A=new Float32Array(c.xPos);for(let t=0;t<f;t++){if(0!==o[t]&&o[t]!==r[t])continue;const n=l[t];d[n][m[n]++]=i[t]}const w=[];if("boxplot"===c.analysis){const n={};for(let a=0;a<u;a++){const e=d[a],r=e.length;if(0==r)continue;e.sort();const o=t(0,r),l=e[o],s=e[t(0,o)],i=e[t(o+1,r)],c=i-s;let f=s-1.5*c,u=i+1.5*c;f=f<e[0]?e[0]:f,u=u>e[r-1]?e[r-1]:u,n[a]=w.length,w.push({max:u,min:f,Q1:s,Q3:i,med:l,id:a})}for(let t=0;t<f;t++){const a=n[l[t]];void 0!==a&&(A[t]=50*a+4+42*Math.random())}}else{const t={};for(let e=0;e<u;e++){let r=null;r=c.scaletrim?n(d[e],c.ticks,c.scaletrim,c.bandwidth||7):a(d[e],c.ticks,c.bandwidth||7);const o=Math.max(...r);0===o||isNaN(o)||(r.id=e,r.max=o,t[e]=[w.length,o,r],w.push(r))}c.ticks[c.ticks.length-1],c.ticks[0],c.ticks[1];for(let n=0;n<f;n++){const a=t[l[n]];a&&(A[n]=50*a[0]+4+42*Math.random())}}postMessage(w)}})();