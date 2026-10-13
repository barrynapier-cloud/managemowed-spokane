const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { createRequire } = require('module');
const { execFileSync } = require('child_process');
const root = 'C:/Users/User/Documents/Codex/ManageMowed/managemowed-spokane';
const req = createRequire(root + '/server.js');
const git = args => execFileSync('C:/Program Files/Git/cmd/git.exe', ['-c','safe.directory='+root,'-C',root,...args], {encoding:'utf8'});
const prior = JSON.parse(git(['show','10a287a1e02a90f4ca0475adfafa105730c090e6:locations.json']));
const current = JSON.parse(fs.readFileSync(root+'/locations.json','utf8'));
const expected = structuredClone(prior);
expected.locations.capecoral.resend.notificationEmails[0] = 'Kristin.B@managemowed.com';
assert.deepEqual(current,expected);
const messages = [];
class FakePool { on(){} async query(sql) { return {rows:/RETURNING id, created_at/.test(sql) ? [{id:1,created_at:'2026-10-13T00:00:00Z'}] : []}; } async end(){} }
class FakeResend { constructor(){ this.emails = {send:async data => {messages.push(data); return {data:{id:'local-intercept'}};}};}}
require.cache[req.resolve('pg')] = {exports:{Pool:FakePool}};
require.cache[req.resolve('resend')] = {exports:{Resend:FakeResend}};
for (const loc of Object.values(current.locations)) process.env[loc.resend.apiKeyEnv] = 'local-intercept-only';
delete process.env.DATABASE_URL;
const app = req('./server.js');
const http = require('http');
const server = app.listen(0,'127.0.0.1',async()=>{
  function post(host) {return new Promise((resolve,reject)=>{
    const body=JSON.stringify({fullName:'Internal Routing Check',email:'routing-check@example.invalid',company:'Internal verification',details:'Controlled local verification only',_mm:'v1',_elapsed:10000,website:''});
    const r=http.request({host:'127.0.0.1',port:server.address().port,path:'/api/leads',method:'POST',headers:{host,'content-type':'application/json','content-length':Buffer.byteLength(body)}},res=>{let data='';res.on('data',d=>data+=d);res.on('end',()=>resolve({status:res.statusCode,body:JSON.parse(data)}));});
    r.on('error',reject);r.end(body);
  });}
  try {
    const results=[];
    for (const key of ['capecoral','eugene','spokane']) {
      messages.length=0;
      const loc=current.locations[key];
      const response=await post(loc.domains[0]);
      assert.equal(response.status,200); assert.equal(response.body.location,key); assert.equal(messages.length,2);
      assert.deepEqual(messages[0].to,loc.resend.notificationEmails);
      assert.equal(messages[0].replyTo,'routing-check@example.invalid');
      assert.deepEqual(messages[0].bcc||[],current.globalBccEmails.filter(e=>!loc.resend.notificationEmails.includes(e)));
      assert.equal(messages[1].replyTo,loc.resend.notificationEmails[0]);
      assert.equal(messages[1].reply_to,loc.resend.notificationEmails[0]);
      assert.deepEqual(messages[1].to,['routing-check@example.invalid']);
      results.push({location:key,notificationTo:messages[0].to,customerReplyTo:messages[1].replyTo,status:'passed'});
    }
    const ejs=req('ejs');
    const rendered=await ejs.renderFile(root+'/views/index.ejs',{loc:{...current.locations.capecoral,key:'capecoral'},host:'www.managemowedcapecoral.com'});
    const priorRendered=await ejs.renderFile(root+'/views/index.ejs',{loc:{...prior.locations.capecoral,key:'capecoral'},host:'www.managemowedcapecoral.com'});
    assert.equal(rendered,priorRendered);
    assert.equal((rendered.match(/mailto:Kristin.B@managemowed.com/g)||[]).length,2);
    assert(!rendered.includes('Kristin@managemowed.com'));
    const result={checkedAt:new Date().toISOString(),routingTests:results,allOtherLocationObjectsUnchanged:12,globalBccUnchanged:true,renderIdenticalToReviewedPublicEmailRevision:true,onlyAdditionalChangedField:'locations.capecoral.resend.notificationEmails[0]',database:'stubbed',emailDelivery:'intercepted; no real email sent',liveDeliveryVerified:false};
    fs.writeFileSync('outputs/capecoral-routing-checks.json',JSON.stringify(result,null,2)+'\n');
    console.log(JSON.stringify(result,null,2));
  } catch(e) {console.error(e);process.exitCode=1;} finally {server.close();}
});
