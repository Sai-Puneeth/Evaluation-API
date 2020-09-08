exports.getQuestions = (req, res, next) => {
    let questions= [];

    let another = {
      question: 'Test Question',
      description: 'Help Text, if any',
      type: 'multiselect',
      choices: [
        'Option1',
        'Option2',
        'Option3',
        'Option4'
      ],
      answers: [
        'Option1',
        'Option2'
      ],
      level: 1
    }

    another.description = 'updated description'

    questions.push(another);
  
  res.status(200).json(questions);
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
