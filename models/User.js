const mongoose = require('mongoose');

// 스키마 
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, // 스페이스 없애주는 역할
        unique: 1, // email이 중복되면 안됨 (유니크)
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: { // 유저가 관리자, 일반 유저 등 될 수 있음.
        type: Number, // 0이면 일반유저 1이면 관리자
        default: 0, // 지정하지 않으면 디폴트가 0
    },
    image: String, // 사용자 사진
    token: { // 토큰을 이용해서 유효성 검사
        type: String,
    },
    tokenExp: { // 토큰 유효기간
        type: Number,
    },
});

// 스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema);

// 위의 모델을 따른 파일에서도 쓸 수 있도록 export
module.exports = { User }