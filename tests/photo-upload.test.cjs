const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

test('canceled upload cannot unblock saving a newer pending profile photo',async()=>{
 const html=fs.readFileSync('index.html','utf8');
 const app=html.match(/<script id="application">([\s\S]*?)<\/script>/)[1];
 const between=(start,end)=>app.slice(app.indexOf(start),app.indexOf(end,app.indexOf(start)));
 const listeners={},decodes=[],writes=[],errors=[];
 const original={name:'Test',avatar:'original-photo'};
 const state={profile:{...original}};
 const fileInput={addEventListener(type,handler){listeners.photo=handler;}};
 const context={
  document:{addEventListener(type,handler){listeners[type]=handler;}},
  $(){return fileInput;},
  compressPhoto(){return new Promise(resolve=>decodes.push(resolve));},
  updatePhotoPreview(){},
  fail(error){errors.push(error.message);},
  t(value){return value;},
  state,
  readProfile(form){return {name:'Test',avatar:form.elements.avatar.value};},
  async commit(change){change(state);writes.push(state.profile.avatar);},
  C:{updateProfile(s,p){s.profile=p;}},
  id(){return 'unused';},now(){return '2026-10-20T00:00:00Z';},
  modal:{close(){}},toast(){}
 };
 vm.createContext(context);
 // Execute the production upload state and both real event handlers. Only image
 // decoding and the browser/persistence boundary are replaced by controllable fakes.
 vm.runInContext(between('let avatarForm','let state'),context);
 vm.runInContext(between("$('#avatarFile').addEventListener",'function checkinType'),context);
 vm.runInContext(between("document.addEventListener('submit'","$('#importFile').addEventListener"),context);
 const makeForm=()=>{
  const buttons=[{disabled:false},{disabled:false}],submit={disabled:false,isConnected:true};
  return {id:'profileForm',isConnected:true,
   dataset:{profileSnapshot:JSON.stringify(original),initialWeight:'70'},
   elements:{avatar:{value:original.avatar}},
   querySelectorAll(){return buttons;},querySelector(){return submit;}};
 };
 const upload=form=>{
  context.nextForm=form;
  vm.runInContext('avatarForm=nextForm',context);
  return listeners.photo({target:{files:[{type:'image/jpeg'}]}});
 };
 const save=form=>listeners.submit({target:form,preventDefault(){}});
 const canceled=makeForm(),firstUpload=upload(canceled);
 canceled.isConnected=false; // Closing/reopening replaces the old dialog form.
 const current=makeForm(),secondUpload=upload(current);
 decodes[0]('canceled-photo');await firstUpload;
 await save(current);
 assert.deepEqual(writes,[],'Save must remain blocked until the current photo finishes decoding');
 assert.equal(errors.length,1,'The pending-photo message should explain why Save was blocked');
 decodes[1]('new-photo');await secondUpload;
 await save(current);
 assert.deepEqual(writes,['new-photo'],'Saving after decoding must persist the newly selected photo');
});
