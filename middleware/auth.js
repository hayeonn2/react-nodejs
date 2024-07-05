const { User } = require('../models/User');

const auth = (req, res, next) => {
    // 인증처리들을 해당 안에서 처리

    // 1. 클라이언트 쿠키에서 토큰을 가져옴 (cookie-parser 이용)
    const token = req.cookies.x_auth;

    // 2. token이 존재하는지 확인
    

    // 3. 토큰을 복호화, 유저를 찾음
    User.findByToken(token, (err, user) => {
        if(err) throw err;

        // 유저가 없다면 
        if(!user) return res.json({isAuth: false, error: true });

        // 유저가 있다면 (리퀘스트에 넣어줌으로 인해 index.js 에서 바로 req.user를 하면 유저 정보가 나옴)
        req.token = token; // 토큰넣어줌
        req.user = user; // 유저정보를 넣어줌
        next(); // middleware로 갈 수 있게 해줌
    })

    // 4. 유저가 있다면 인증 ok

    // 5. 유저가 없으면 인증 no
}

module.exports = { auth }
