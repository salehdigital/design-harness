// WebGL self-test over the Chrome DevTools protocol. usage: node tools/gl-selftest.mjs <url> [waitMs]
// Needs Chrome on --remote-debugging-port=9333 (tools/gl-selftest.sh starts one with SwiftShader).
// Prints the JSON that index.html?selftest=gl writes into <pre id="selftest-gl">.
const url = process.argv[2], wait = +(process.argv[3]||20000);
const r = await fetch('http://localhost:9333/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'}).then(r=>r.json());
const ws = new WebSocket(r.webSocketDebuggerUrl); let id=0; const pend={}; const logs=[];
ws.onmessage = e => { const m=JSON.parse(e.data); if(m.id&&pend[m.id]){pend[m.id](m);delete pend[m.id];}
  if(m.method==='Runtime.consoleAPICalled') logs.push(m.params.type+': '+m.params.args.map(a=>a.value??a.description).join(' '));
  if(m.method==='Runtime.exceptionThrown') logs.push('EXC: '+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)); };
const send=(method,params={})=>new Promise(res=>{const i=++id;pend[i]=res;ws.send(JSON.stringify({id:i,method,params}));});
await new Promise(r=>ws.onopen=r);
await send('Runtime.enable'); await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url});
const t0=Date.now(); let out=null;
while(Date.now()-t0<wait){ await new Promise(r=>setTimeout(r,1000));
  const v=await send('Runtime.evaluate',{expression:"document.getElementById('selftest-gl')?.textContent||''",returnByValue:true});
  out=v.result?.result?.value; if(out) break; }
console.log(out||'NO RESULT'); console.error(logs.slice(0,30).join('\n')); process.exit(0);
