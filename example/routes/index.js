// AWS를 사용하기 위한 패키지 로드
var fs = require('fs');
var AWS = require('aws-sdk');
var formidable = require('formidable');

// AWS 지역 설정
// AWS.config.region = 'ap-northeast-2';
AWS.config.loadFromPath('./MYPATH.json');

module.exports = (app, User) => {

    // 모든 유저 데이터 가져오기
    app.get('/api/users', (req, res) => {
        User.find((err, users) => {

            // 에러가 날 경우 에러처리
            if(err) {
                return res.status(500).send({error: 'none'});
            }

            // 유저 데이터를 반환
            res.json(users);
        })
    });

    // 유저 데이터 가져오기
    app.get('/api/users/:user_id', (req, res) => {
        User.findOne({id: req.params.user_id}, (err, user) => {

            // 에러처리
            if(err) {
                return res.status(500).json({error: err});
            }

            if(!user) {
                return res.status(404).json({error: 'not found'});
            }

            // 유저 데이터를 반환
            res.json(user);
        })
    });

    // 유저 생성
    app.post('/api/users', (req, res) => {
        var s3 = new AWS.S3(); // aws 객체 생성
        var user = new User(); // 디비에 담을 유저 객체 생성
        var form = new formidable.IncomingForm(); // 폼에서 데이터를 가져오기 위한 객체 생성

        form.parse(req, (err, fields, files) => {

            // 유저의 아이디와 패스워드를 디비데이터에 넣습니다.
            user.id = fields.id;
            user.pw = fields.pw;

            // s3에 저장할 이미지의 데이터 포맷
            var param = {
                'Bucket': '[YOUR_BUCKET]', // [BUCKET_NAME]에는 버킷이름을 입력해주세요.
                'Key': fields.id + '.png', // s3에 올라갈 파일명 값입니다.
                'ACL': 'public-read', // 접근 권한
                'Body': fs.createReadStream(files.imagefile.path), // image파일을 올리시면 됩니다.
                'ContentType': 'image/png' // 확장자
            }

            s3.upload(param, (err, data) => {
                // 이 부분에서 이제 마지막으로 남은 image 데이터의 url을 디비에 넘겨줍니다.
                user.imageUrl = data.Location;

                // 데이터를 db에 저장해줍니다.
                user.save((err) => {

                    // 에러가 날 경우 에러를 출력해주고 0이라는 결과를 반환합니다.
                    if(err) {
                        console.log(err);
                        res.json({result: 0});
                    }

                    // 성공했을 경우 1이라는 결과를 반환합니다.
                    res.json({result: 1});
                });

            });

        });

    });

}
