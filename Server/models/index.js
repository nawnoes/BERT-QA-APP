import mongoose from 'mongoose';
import Korquad from './korquad';

mongoose.Promise =global.Promise; //기존 몽구스 프로미스를 노드의 프로미스로 연결한것.
mongoose.connect('mongodb://localhost:27017/ADKF');

const database = mongoose.connection; //db와 연결 시도

database.on('open', //db와 연결될때 이벤트
  function(){
    console.log('database 연결'+process.env.DATABASE_URL);
  }
);
database.on('disconnect', // db연결 끊길때
  function(){
      console.log('database 연결 끊어짐');
  }
);
database.on('error', //에러 발생하는 경우.
  console.error.bind(console,'mongoose 연결 에러')
);
const models = {Korquad};

export {database};

export default models;