const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const ctx={};vm.createContext(ctx);
vm.runInContext(html.match(/<script id="translations">([\s\S]*?)<\/script>/)[1],ctx);
test('every static translated label has a non-Thai English message',()=>{
 const app=html.match(/<script id="application">([\s\S]*?)<\/script>/)[1];
 const calls=[...app.matchAll(/\bt\(("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\)/g)];
 assert.ok(calls.length>300,'Check the complete app UI, not a small sample');
 for(const call of calls){const source=vm.runInNewContext(call[1]);assert.equal(typeof ctx.IFEnglish[source],'string','Missing translation: '+source);assert.ok(!/[\u0e00-\u0e7f]/.test(ctx.IFEnglish[source]),'Thai leaked into English: '+source);}
});
test('English privacy and photo text preserve the local-only meaning',()=>{
 assert.match(ctx.IFEnglish['ย่อเป็น 128 × 128 px · เก็บในเครื่องและไฟล์สำรอง'],/128 × 128.*locally.*backups/);
 assert.match(ctx.IFEnglish['แชร์เฉพาะลิงก์แอป ข้อมูลสุขภาพไม่ถูกส่งไปด้วย'],/Only the app link.*Health data is not included/i);
});
test('translated feedback renders Undo and close actions after a successful save',()=>{
 const app=html.match(/<script id="application">([\s\S]*?)<\/script>/)[1];
 const source=app.slice(app.indexOf(' function toast('),app.indexOf(' function applyTheme('));
 const element={hidden:true,innerHTML:''};
 const sandbox={$:()=>element,clearTimeout(){},setTimeout(){return 1;},esc:v=>String(v),t:value=>ctx.IFEnglish[value]||value};
 vm.createContext(sandbox);vm.runInContext('let toastTimer,undoJob;'+source+'\ntoast("Saved",()=>{});',sandbox);
 assert.equal(element.hidden,false);assert.match(element.innerHTML,/Undo/);assert.match(element.innerHTML,/data-action="close-toast"/);assert.ok(element.innerHTML.includes(ctx.IFEnglish['ปิดข้อความ']));
});
