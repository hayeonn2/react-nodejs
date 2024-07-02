// backend 시작점

const express = require('express') // express 가져옴
const app = express() // 새로운 express app 생성
const port = 5000 // 5000번 포트를 백 서버로 둠
const bodyParser = require('body-parser');

const config = require('./config/key')

const { User } = require('./models/User');

// bodyParser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
// application/x-www-form-urlencoded << 이런 데이터를 분석해서 가져오도록 함
app.use(bodyParser.urlencoded({ extended: true }));

// application/json << 이 데이터를 분석해서 가져오도록 함
app.use(bodyParser.json());

// mongoose - 어플리케이션과 몽고디비 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
 .then(() => console.log('MongoDB Connected...')) // 연결 됐을 때
 .catch(err => console.log(err)) // 연결 잘 안됐을 때

// 루트 디렉토리에 오면 hello world 를 출력함
app.get('/', (req, res) => {
  res.send('Hello World! 하이염ㅋㅋ!!')
});

// client에서 보내주는 정보들 (회원가입을 위한 라우트)
app.post('/register', (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면, 그것들을 데이터 베이스에 넣어준다.
  
  // 인스턴스를 만든다.
  // req.body 안에 json 형식으로 들어감
  // bodyParser를 이용해서 req.body로 클라이언트 정보를 받아줌
  const user = new User(req.body);

// save는 몽고디비에서 오는 것 (정보들이 유저모델에 저장이 됨)
user.save()
  .then((result) => {
    res.status(200).json({
      result,
      // success: true,
    });
  })
  // 만약에 에러가 있다고 한다면, 제이슨 형식으로 전달함 (실패와 에러메세지 전달)
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      err
      // success: false,
    });
  });

  // try {
  //   const user = new User(req.body);
  //   const result = await user.save();
  //   res.status(201).json({
  //     message: 'User created',
  //     result: result
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({
  //     error: err
  //   });
  // }
  

})

// 5000번 포트에서 실행 함
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

