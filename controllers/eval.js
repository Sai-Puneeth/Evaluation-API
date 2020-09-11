const db = require('../util/database.js');

exports.getQuestions = (req, res, next) => {
  var questions =[];
  db.execute('SELECT * FROM questions ORDER BY RAND()')
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
      console.log(questions.length);
  }).then(() =>{
    db.execute('SELECT * FROM choices').then(([rows]) =>{
      for(let i=0; i<questions.length; i++){
        for(let j=0; j<rows.length ;j++){
          if(questions[i].qid == rows[j].qid){
            questions[i].options.push(rows[j].choice);
          }
        }
      }
    res.status(200).json(questions);
    })
  })
};

exports.postResult = (req, res, next) => {
  const uid = req.body.uid;
  const qid = req.body.qid; //array of question ids
  
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), uid: uid, qid: qid }
  });
};
