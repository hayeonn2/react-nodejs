// backend 시작점

const express = require('express') // express 가져옴
const app = express() // 새로운 express app 생성
const port = 5000 // 5000번 포트를 백 서버로 둠

// mongoose - 어플리케이션과 몽고디비 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hayeonn2:zxc123@cluster0.sxo71bz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
 .then(() => console.log('MongoDB Connected...')) // 연결 됐을 때
 .catch(err => console.log(err)) // 연결 잘 안됐을 때

// 루트 디렉토리에 오면 hello world 를 출력함
app.get('/', (req, res) => {
  res.send('Hello World! 하이염ㅋㅋ')
})

// 5000번 포트에서 실행 함
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

