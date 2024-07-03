const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// salt를 이용해서 비밀번호를 암호화
// 그렇기 위해선 salt를 먼저 생성
// saltRounds : salt가 몇글자인지?
const saltRounds = 10;

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

// 유저 모델에 유저정보를 저장하기 전에 무엇(function)을 실행한다.
userSchema.pre('save', function(next){
    let user = this;

    // 비밀번호를 암호화 시킨다.
    // 이때, 비밀번호를 바꿀때만!! 암호화를 시켜야한다. (조건문 필요)
    if(user.isModified('password')){ // password가 바뀔때만 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            // this를 통해 user를 가리킴
            bcrypt.hash(user.password, salt, function(err, hash){
                // hash : 암호화된 비밀번호
                if(err) return next(err);
                user.password = hash; // hash된 비밀번호로 변경함
                next();
            })
        })
    } else {
        // 비밀번호를 바꾸는게 아니라 다른 것을 바꿀때는?
        next();
    }
    // next() // next()로 다음동작으로 보냄 - index 파일에 있는 user.save()로 넘어감
})

// 스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema);

// 위의 모델을 따른 파일에서도 쓸 수 있도록 export
module.exports = { User }