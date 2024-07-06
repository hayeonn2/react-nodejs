// backend 시작점
const express = require('express') // express 가져옴
const app = express() // 새로운 express app 생성
const port = 5000 // 5000번 포트를 백 서버로 둠
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key')
const {auth} = require('./middleware/auth')
const { User } = require('./models/User');

// bodyParser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
// application/x-www-form-urlencoded << 이런 데이터를 분석해서 가져오도록 함
app.use(bodyParser.urlencoded({ extended: true }));

// application/json << 이 데이터를 분석해서 가져오도록 함
app.use(bodyParser.json());
app.use(cookieParser());

// mongoose - 어플리케이션과 몽고디비 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {})
 .then(() => console.log('MongoDB Connected...')) // 연결 됐을 때
 .catch(err => console.log(err)) // 연결 잘 안됐을 때

// 루트 디렉토리에 오면 hello world 를 출력함
app.get('/', (req, res) => {
  res.send('Hello World! 하이염ㅋㅋ!!')
});

// client에서 보내주는 정보들 (회원가입을 위한 라우트)
app.post('/api/user/register', async (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면, 그것들을 데이터 베이스에 넣어준다.

  try {
    // 인스턴스를 만든다.
    // req.body 안에 json 형식으로 들어감
    // bodyParser를 이용해서 req.body로 클라이언트 정보를 받아줌
    const user = new User(req.body);
    const result = await user.save(); // save는 몽고디비에서 오는 것 (정보들이 유저모델에 저장이 됨)
    res.status(201).json({
      message: 'User created',
      result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});


// 로그인 route
app.post('/api/user/login', async (req, res) => {
  // 1. 요청된 이메일을 데이터베이스에서 있는지 찾기.
  // findOne: 몽고디비에서 제공하는 메소드
  try {
    const user = await User.findOne({email: req.body.email});

    // 유저 콜렉션 안에 해당 이메일을 가진 사람이 없다면
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이���일에 해당하는 유저가 없습니다."
      });
    }

    // 2. 요청된 이메일이 데이터베이스 있다면 비밀번호가 같은지 확인하기.
    const isMatch = await user.comparePassword(req.body.password);

    if(!isMatch) return res.json({
      loginSuccess: false,
      message: "비밀번호가 틀렸습니다."
    });

    // 3. 비밀번호가 같다면, 유저를 위한 토큰을 생성
    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);
      
      // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, ...
      // cookieParser 이용하기
      res.cookie("x_auth", user.token)
        .status(200)
        .json({
          loginSuccess: true,
          userId: user._id,
          token: user.token,
          message: "로그인 성공!"
        });
    });
  } catch(err) {
    console.error(err);
    res.status(400).send(err)
  }
});

// auth route
// auth 라는 미들웨어 : auth라는 엔드포인트에 리퀘스트를 받은다음, 콜백펑션 하기 전에
// 중간에서 무언가를 해주는 것 (middleware 폴더 auth.js)
app.get('/api/user/auth', auth, (req, res) => {
  // auth.js 에서 넣어준 token, user 정보를 바로 가져올 수 있다.
  // 여기 까지 왔다는 의미는 미들웨어(auth)를 성공적으로 통과했다.
  // = Authentication 이 트루라는 말
  // => 클라이언트에다가 정보를 전달해야 함
  res.status(200).json({
    _id: req.user._id, // auth에서 유저를 리퀘스트에 넣어서 작성 가능
    isAdmin: req.user.role === 0 ? false : true, // role이 0이면 일반 유저
    isAuth: true, 
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  }) 
})

// 로그아웃
app.get('/api/user/logout', auth, async (req, res) => {
  try{
    // 유저를 찾아서 데이터 업데이트
    await User.findOneAndUpdate({_id: req.user._id}, {token: ""});
    return res.status(200).send({ success: true });
  }catch (err) {
    return res.json({ success: false, err });
  }  
})

// app.get('/api/user/logout', auth, (req, res) => {
//   // 유저를 찾아서 데이터 업데이트
//   User.findOneAndUpdate({_id: req.user._id}, {token: ""})
//   .then(() => {
//   return res.status(200).send({ success: true });
//   })
//   .catch(err => {
//   return res.json({ success: false, err });
//   });
//   })

// 5000번 포트에서 실행 함
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

