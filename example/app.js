// 패키지 로드
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');

// bodyParser를 사용하기 위해 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// 포트 설정
var port = process.env.PORT || 8080;

// 라우터 설정
var router = require('./routes')(app, User);

// 몽고디비와 연결
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected');
});

mongoose.Promise = require('bluebird'); // Promise 처리를 위해 호출
mongoose.connect('[YOUR_DB_URL]'); // [DB_URL]에는 의뢰자분의 db url을 기입해 주시면 됩니다.

// 서버 실행
var server = app.listen(port, () => {
    console.log('Server started on port' + port);
});
