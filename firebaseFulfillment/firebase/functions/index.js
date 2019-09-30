// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient,Payload} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const request = require("request-promise");
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://cpe-projectregbot-bumgbp.firebaseio.com'
});

const LINE_UID = "Uce1bc2d3734480596e9a3d0e3e3a65d7";


const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer bOm7yb73MVk2vg2+XtpanAfyx6suxctLGo3svKKshw9dl06JGmNGcUT6H2FjQvCYsGWN295PYDP1znAhSyCs7HSQjHFbMZTqEqkt4GWDH/vtYaFrGr+pjI8B9PLENlKWfCBu5OSkcwhOjj8Bt3h84AdB04t89/1O/w1cDnyilFU="
};
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  // //
  function identification(agent) {
    let StringID = request.body.queryResult.parameters.StringID;
    let NumberID = request.body.queryResult.parameters.NumberID;
    console.log("StringID "+StringID);
    console.log("NumberID "+NumberID);
    var ID = StringID+NumberID;
    var Name = 'none';
    
    if(StringID == 'B'){
      //https://cdn.pixabay.com/photo/2016/02/11/16/59/dog-1194083_960_720.jpg
    	Name = 'student';
      let a = '';
      let b = '';
      let c = '';
      let d = '';
      let e = '';
      let h = '';
      let j = [];
      return admin.database().ref("teacher").once('value').then(snapshot => {
        for(let k in snapshot.val()){
          j.push(
            {
              ...snapshot.val()[k],
              key: k
            }
          )
        }
        console.log(" ++ " + JSON.stringify(j));

        return admin.database().ref(Name+"/"+ID).once('value').then(snapshot => {
          a +=  "ชื่อ " + snapshot.val().prefix + snapshot.val().firstname + "  " + snapshot.val().lastname + "\n" + "gpax : " + snapshot.val().gpax + " " + "ปีการศึกษา " +  snapshot.val().year+ "\n";
          b +=  snapshot.val().image;
        
          c +=  snapshot.val().year;
          return admin.database().ref("lecturer_register/"+c).child(ID).once('value').then(snapshot => {
            //console.log(a);
            //e += a+"เวลาที่ลงวิชาโปรเจค: "+ snapshot.val().date + "\nที่ได้ลงทะเบียนกับอาจารย์:\n "+snapshot.val().teacher
            for(let z in snapshot.val().teacher){
              for(let i in j){
                //console.log(snapshot.val().teacher[z]);
                if(snapshot.val().teacher[z] == j[i].key){
                  h += j[i].prefix+j[i].firstname+" "+j[i].lastname+"\n"
                }
              }
            }
            console.log(" -- "+h);
            agent.add( a+"เวลาที่ลงวิชาโปรเจค: "+ snapshot.val().date + "\nที่ได้ลงทะเบียนกับอาจารย์:\n "+h);
            agent.add(sendAsPayload({
            "type": "image",
            "originalContentUrl": b,
            "previewImageUrl": b,
            "animated": false
              })); 
            /*
            for(let i in snapshot.val().teacher){
              h += await admin.database().ref("teacher/"+snapshot.val().teacher[i]).once('value').then(snapshot => {
              d += "\n" + snapshot.val().prefix + snapshot.val().firstname + "  " + snapshot.val().lastname;
              console.log(" aaaa "+d);
              });//return     
            }
            return d;
            */
            });//end teacher
           
       
           });//Name+"/"+ID


      });
     
    }else if(StringID == 'A'){
      Name = 'teacher';
      let a ='';
      let b ='';
      let c ='';
      let d ='';
      //"teacher_profile/"
     admin.database().ref("teacher_profile/"+ID).once('value').then(snapshot => {
        c += snapshot.val().image;
        });//end teacher

     admin.database().ref("teacher_profile/"+ID+"/email").once('value').then(snapshot => {
        d += snapshot.val();
        });//end teacher
      
     admin.database().ref("teacher_profile/"+ID+"/header").once('value').then(snapshot => {
        a += snapshot.val();
        });//end teacher
      
     admin.database().ref("teacher_profile/"+ID+"/professional").once('value').then(snapshot => {
        b += snapshot.val();
        });//end teacher
 
      
   	 return admin.database().ref(Name).child(ID).once('value').then(snapshot => {
     //console.log(c);
     //console.log("1111111");
     agent.add("ชื่อ " + snapshot.val().prefix + snapshot.val().firstname + "  " + snapshot.val().lastname +"\nProject:\n "+a+"\nProfessional:\n "+b+"\nemail:\n "+d);
     agent.add(sendAsPayload({
     "type": "image",
     "originalContentUrl": c,
     "previewImageUrl": c,
     "animated": false
    	}));
       
     });//return
    }//end else
  }//end function

  function teacher(agent) {
    let TeacherName = request.body.queryResult.parameters.NameTeacher;
    let Name = ''+TeacherName;
    console.log(" Name" + Name);
    let a ='';
    let b ='';
    let c ='';
    let d ='';
    let e = [];
    let f = [];
    let ID ='';
      //"teacher_profile/"
     return admin.database().ref("teacher").once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          e.push(
            key
          );
          f.push(
            childData.firstname
          );
        });
        //console.log(e);
        //console.log(f);
        for(let i in f){
          if(f[i] === Name){
              ID = e[i]
          }
        }
        console.log(" ID--- "+ID);
      
     admin.database().ref("teacher_profile/"+ID).once('value').then(snapshot => {
        c += snapshot.val().image;
        });//end teacher
     admin.database().ref("teacher_profile/"+ID+"/email").once('value').then(snapshot => {
        d += snapshot.val();
        });//end teacher
      
     admin.database().ref("teacher_profile/"+ID+"/header").once('value').then(snapshot => {
        a += snapshot.val();
        });//end teacher
      
     admin.database().ref("teacher_profile/"+ID+"/professional").once('value').then(snapshot => {
        b += snapshot.val();
        });//end teacher
 
      
   	 return admin.database().ref("teacher").child(ID).once('value').then(snapshot => {
     //console.log(c);
     //console.log("1111111");
     agent.add("ชื่อ " + snapshot.val().prefix + snapshot.val().firstname + "  " + snapshot.val().lastname +"\nProject:\n "+a+"\nProfessional:\n "+b+"\nemail:\n "+d);
     agent.add(sendAsPayload({
     "type": "image",
     "originalContentUrl": c,
     "previewImageUrl": c,
     "animated": false
    	}));
       
     });//return
     
    });
  }//endfuction
  ////////////////////////////////////////////////////////////////
  // function reg(agent) {
  // let yearReg = request.body.queryResult.parameters.yearReg;
  // let ID = request.body.queryResult.parameters.ID;
  // let a = '';
 //  admin.database().ref("lecturer_register/").once('value').then(snapshot => {
  // a += snapshot.val();
   //   });//end selectteacher
   
  // return admin.database().ref("lecturer_register/").child(ID).once('value').then(snapshot => {
 //  agent.add("เวลาที่ลงวิชาโปรเจค: "+ snapshot.val().date + "\ngpax: " + snapshot.val().gpax +"\nที่ได้ลงทะเบียนกับอาจารย์:\n "+a);
  //    });//end regstudent
 //	}//end function
  ////////////////////////////////////////////////////////
   function delinew(agent) {
    let a = [];
    let b = [];
    let c = [];
    let d = [];
    let e = [];
    let f = 0;
    let g = '';
  return admin.database().ref("test_notice").once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      /*
      c.push(
        "ประกาศ: "+childData.title+"\nรายละเอียด: "+childData.information+"\nจากรหัสอาจารย์:  "+childData.user+ "\n"
      );*/
      a.push(
        childData.title
      );
      b.push(
        childData.imageUrl
      );
      c.push(
        childData.information
      );
      d.push(
        childData.date
      );
      e.push(
        childData.user
      );

      //console.log(childData);
     // childSnapshot.forEach(function(childSnapshot1) {
     //  c[d] = ""+childSnapshot1.val().information+"\nจากรหัสอาจารย์:  "+childSnapshot1.val().user+ "\n";
     //  d++;
     //  });
    });
    f = Object.keys(a).length-1;
    console.log("ครู0 "+e[f]);
    return admin.database().ref("teacher/"+e[f]).once('value').then(snapshot => {
        g += "ชื่อ " + snapshot.val().prefix + snapshot.val().firstname + "  " + snapshot.val().lastname;
        agent.add("ประกาศข่าวล่าสุด: "+a[f]+"\nเนื้อหา: "+c[f]+"\nเวลาที่ประกาศ: "+d[f]+"\nโดย "+g);
        agent.add(sendAsPayload({
        "type": "image",
        "originalContentUrl": b[f],
        "previewImageUrl": b[f],
        "animated": false
         }));      
        });//return
    //console.log(Object.keys(c).length-1);
    //console.log(" --- "+ c[4]);
    //console.log(c[Number(Object.keys(c).length-1)]);   
    });
 	}//end function
  
  //agent.add(sendAsPayload({
   // "type": "image",
   // "originalContentUrl": snapshot.val().image,
   // "previewImageUrl": snapshot.val().image,
   // "animated": false
  	//	}));
  
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  
  intentMap.set('ID - custom - yes', identification);
 // intentMap.set('lecturer_register', reg);
  intentMap.set('Notice', delinew);
  intentMap.set('Teacher - custom - yes', teacher);
  // intentMap.set('ID - custom - yes', TeacherProfile);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
const sendAsPayload = (json) => {
  return new Payload(`LINE`, json, { sendAsMessage: true });
};
//ref('notice/A0001/0')
//0 */4 * * *
//*/5 * * * *
exports.scheduledFunction = functions.pubsub.schedule("0 * */6 * *").timeZone('Asia/Bangkok').onRun(async (change, context) => {
    let b = '';
    let d = 0;
    let c = [];
    let c1 = [];
    let c2 = [];
    let c3 = [];
    let c4 = [];
    let e = '';
    let x = 0 ;
    let g = '';

      admin.database().ref("total_notice/ab").once('value').then(snapshot => {
      x += snapshot.val();
      });

      admin.database().ref("test_notice").once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          /*
          c.push(
            "ประกาศ: "+childData.title+"\nรายละเอียด: "+childData.information+"\nจากรหัสอาจารย์:  "+childData.user+ "\n"
          );*/
          c.push(
            childData.title
          );
          c1.push(
            childData.imageUrl
          );
          c2.push(
            childData.information
          );
          c3.push(
            childData.date
          );
          c4.push(
            childData.user
          );

          //console.log(childData);
         // childSnapshot.forEach(function(childSnapshot1) {
         //  c[d] = ""+childSnapshot1.val().information+"\nจากรหัสอาจารย์:  "+childSnapshot1.val().user+ "\n";
         //  d++;
         //  });
        });
        d = Object.keys(c).length-1;
       // console.log("XX1 = "+x);
        //console.log(Object.keys(c).length-1);
        //console.log(" --- "+ c[4]);
        //console.log(c[Number(Object.keys(c).length-1)]);
        return admin.database().ref("teacher/"+c4[Number(Object.keys(c).length-1)]).once('value').then(snapshot => {
          g += snapshot.val().prefix + snapshot.val().firstname + "  " + snapshot.val().lastname;
          console.log(" --- "+ g);
          if(d > x){
             console.log("XX2 = "+c[Number(Object.keys(c).length-1)]);
            // broadcast(`ประกาศข่าว\n${c[Number(Object.keys(c).length-1)]}`);
            //flexbroadcast(c[Number(Object.keys(c).length-1)],c1[Number(Object.keys(c).length-1)],c2[Number(Object.keys(c).length-1)],c3[Number(Object.keys(c).length-1)],g);
          }
          admin.database().ref("total_notice").update({ab: d});
          //flexbroadcast(c[Number(Object.keys(c).length-1)],c1[Number(Object.keys(c).length-1)],c2[Number(Object.keys(c).length-1)],c3[Number(Object.keys(c).length-1)],g);
          });
    });

    /*
    let a = await admin.database().ref("notice/A0001/0").once('value');
    console.log(" วันที่ประกาศ "+ a.val().date +" เนื้อหา"+ a.val().information+" จากรหัสอาจารย์ "+a.val().user);
    b += " วันที่ประกาศ "+ a.val().date +"\nเนื้อหา "+ a.val().information+"\nจากรหัสอาจารย์ "+a.val().user + "\n";
    */
    //broadcast(`ประกาศข่าว\n${b}`);
  });
/*
const broadcast = (msg) => {
    return request.post({
      uri: `${LINE_MESSAGING_API}/broadcast`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        messages: [{ type: "text", text: msg }]
      })
    })
  };
*/

const flexbroadcast = (title,imageUrl,information,date,user) => {
    return request.post({
      uri: `${LINE_MESSAGING_API}/broadcast`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        messages: [
          {
            "type": "flex",
            "altText": "This is a Flex message",
            "contents":{
//////////
                "type": "bubble",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": title
                    }
                  ]
                },
                "hero": {
                  "type": "image",
                  "url": imageUrl,
                  "size": "full",
                  "aspectRatio": "2:1"
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": information
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "จาก: "+user
                    },
                    {
                      "type": "text",
                      "text": "เวลาที่ประกาศ: "+date
                    }
                  ]
                }
          
/*
                "type": "bubble",
                "body":{
                  "type": "box",
                  "layout": "horizontal",
                  "contents":[
                    {
                      "type": "text",
                      "text": "Hello,"
                    },
                    {
                      "type": "text",
                      "text": "World!" 
                    }
                  ]//bubblecontent
                }//body
*/
          }//flexcontents
         }
        ]//massage
      })
    })
  };
  