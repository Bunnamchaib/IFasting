const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
function ui(){
 const match=html.match(/<script id="lessons">([\s\S]*?)<\/script>/);assert.ok(match,'lesson content is embedded');
 const c={};vm.createContext(c);vm.runInContext(match[1],c);vm.runInContext(html.match(/<script id="translations">([\s\S]*?)<\/script>/)[1],c);
 const nodes=new Map(),get=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;}});return nodes.get(selector)};
 const jobs=new Map();let timerId=0,rendered=0,scroll,focused=false;
 Object.assign(c,{t:s=>s,page:'stageDetail',lessonIndex:3,lessonStep:0,lessonPlaying:false,lessonTimers:[],lessonReturnScroll:0,views:{home(){},fasting(){},water(){},sleep(){},progress(){}},render:()=>rendered++,document:{querySelector:get,getElementById:id=>id==='weight-trend'?{scrollIntoView(){focused=true;},focus(){}}:null},window:{scrollY:123,scrollTo:pos=>scroll=pos},matchMedia:()=>({matches:false}),setTimeout:fn=>{jobs.set(++timerId,fn);return timerId;},clearTimeout:id=>jobs.delete(id)});
 const start=html.indexOf(' // Stage learning views:');assert.ok(start>=0);
 vm.runInContext(html.slice(start,html.indexOf('\n function phaseIndex(){',start)),c);
 return {c,get,jobs,rendered:()=>rendered,scroll:()=>scroll,focused:()=>focused};
}
test('every lesson has diagrams, three steps, glossary, limits and complete English content',()=>{
 const {c}=ui();assert.equal(c.IFLessons.length,5);
 for(const raw of c.IFLessons){assert.equal(raw.types.length,3);assert.equal(raw.nodes.length,3);assert.equal(raw.captions.length,3);assert.ok(raw.terms.length>=2);assert.ok(raw.limits.length>30);
  const strings=[raw.title,raw.range,raw.subtitle,raw.simple,raw.limits,...raw.nodes,...raw.captions,...raw.terms.flat()];
  for(const source of strings){assert.ok(c.IFEnglish[source],source);assert.doesNotMatch(c.IFEnglish[source],/[\u0E00-\u0E7F]/,source);}
 }
 assert.throws(()=>c.lessonData(-1));assert.throws(()=>c.lessonData(5));
});
test('lesson animation advances its visual and caption, can stop, and honors reduced motion',()=>{
 const {c,get,jobs}=ui();c.playLesson();assert.equal(c.lessonPlaying,true);assert.equal(jobs.size,3);
 const first=jobs.values().next().value;first();assert.equal(c.lessonStep,1);assert.match(get('[data-lesson-drawing]').innerHTML,/lesson-particle/);assert.match(get('[data-lesson-caption]').textContent,/Ketogenesis/);
 c.playLesson();assert.equal(c.lessonPlaying,false);assert.equal(jobs.size,0);
 c.matchMedia=()=>({matches:true});c.playLesson();assert.equal(c.lessonStep,2);assert.equal(jobs.size,0);assert.doesNotMatch(get('[data-lesson-drawing]').innerHTML,/lesson-particle/);
});
test('home weight navigation opens progress and the weight section while canceling animation',()=>{
 const {c,rendered,focused,scroll}=ui();c.navigatePage('progress','weight-trend');
 assert.equal(c.page,'progress');assert.equal(rendered(),1);assert.equal(focused(),true);assert.equal(scroll().top,0);
 c.navigatePage('sleep');assert.equal(c.page,'sleep');
 c.navigatePage('not-a-page');assert.equal(c.page,'sleep');
});
