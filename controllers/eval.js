const db = require('../util/database.js');
const url = require('url');


exports.getQuestions = (req, res, next) => {
  var questions =[];
  var q = url.parse(req.url,true);
  const group = q.query.group;
  db.execute(`SELECT * FROM questions ORDER BY RAND()`)
    .then(([rows]) =>{

      let counter1 = 0;
      let counter2 = 0;
      let counter3 = 0;

      for(let i=0 ;i<rows.length ;i++ ){
        if(rows[i].level==1 && counter1<=2){
          rows[i].options = [];
          questions.push(rows[i]);
          counter1++;
        }
        if(rows[i].level==2 && counter2<=2){
          rows[i].options = [];
          questions.push(rows[i]);
          counter2++;
        }
        if(rows[i].level==3 && counter3<=3){
          rows[i].options = [];
          questions.push(rows[i]);
          counter3++;
        }
        if(counter2+counter3+counter1 == 10){ break; }
      }
      questions.sort((a, b) => (a.level > b.level) ? 1 : -1);
  }).then(() =>{
    db.execute('SELECT * FROM choices').then(([rows]) =>{
      for(let i=0; i<questions.length; i++){
        for(let j=0; j<rows.length ;j++){
          if(questions[i].qid == rows[j].qid){
            let temp = { choice:"", ansid: 0 }
            temp.choice = rows[j].choice;
            temp.ansid = rows[j].ansid;
            questions[i].options.push(temp);
          }
        }
      }
    res.status(200).json(questions);
    })
  })
};


exports.postResult = (req, res, next) => {

  var qid=req.body.qid;
  var answer=req.body.answers;
  var uid = req.body.uid;

  var score = 0;
    
  for(let i=0;i<answer.length;i++){
    for(let j=0;j<answer[i].length;j++){
      db.execute('INSERT INTO user ( `uid`, `qid` , `useranswer`) VALUES (?,?,?)',
        [uid,qid[i],answer[i][j]]
      );
    }
  }
  
  db.execute('SELECT * FROM correct_choices')
  .then(([rows])=>{
    for(let i=0;i<qid.length;i++){
      var k=0;
      for(let j=0 ;j<rows.length ;j++){
        if(qid[i]==rows[j].qid){   
          for(let l=0;l<answer[i].length;l++){
            if(answer[i][l]==rows[j].correct)
            k++;
          }
        }
      }
      if(k==answer[i].length)
      score++;  
    }
    console.log(score);
  })
  .then(() => {
    res.status(201).json({
      message: 'Answers Stored Successfully!',
      post: {uid: uid, qid: qid, score: score }
    })
  });
};