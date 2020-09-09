const db = require('../util/database.js');

exports.getQuestions = (req, res, next) => {
    let questions= [];

    let another = {
      question: 'Test Question',
      description: 'Help Text, if any',
      type: 'multiselect',
      choices: [],
      answers: [
        'Option1',
        'Option2'
      ],
      level: 1
    }

    db.execute('SELECT * FROM questions')
    .then(([rows]) =>{  
      let data = rows[0];
      another.question = data.question;
      another.description = data.description;
      another.type = data.type;
      another.choices.push(data.option1);
      another.choices.push(data.option2);
      another.choices.push(data.option3);
      another.choices.push(data.option4);
      another.level = data.level;

      res.status(200).json(another);
    })
    .catch(err => {
      console.log(err);
    });
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
