import mongoose from 'mongoose';

const korquadSchema = new mongoose.Schema({
    id:Number,
    context:String,
    question:String,
    answer:String,
});

const Korquad = mongoose.model('Korquad', korquadSchema);
console.log('x1')

// var data1 = new Korquad({
//     id:19,
//     context:"왜",
//     question:"질문은",
//     answer:"답변은",
// });
// data1.save(function(err, data1){
//     if(err) return console.error(err);
//     console.log(data1);
// });

// Korquad.find({num:1}, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log(JSON.stringify(result))
//     console.log('x3')

// })
// console.log('x2ß')

export default Korquad;