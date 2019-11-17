import { Router } from 'express';
import Korquad from '../models/korquad'


const router = Router();

//min, max 사이 난수 생성
var generateRandom = function(min, max) {
    console.log('generateRandom')
    var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(min + ' ' + max + ' ' + ranNum)
    return ranNum;
}
const a= ()=>{
    console.log('a')

}
router.get('/', async (req, res) => {
    Korquad.findOne({ _id: 1 }, function (err, data) {
        if (err) {
            return res.send(err);
        } else {
            return res.send(data);

        };
    });
});
router.get('/:data_id', async (req, res) => {
    console.log('r1')
    console.log('r1: ')

    Korquad.find({ num: parseInt(req.params.data_id) }, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(JSON.stringify(result))
        console.log('x3')
        return res.send(JSON.stringify(result))
    })
});
generateRandom(0, 10);

router.get('/random/qa', (req, res) => {
    const randomNum=generateRandom(0, 12);
    console.log(randomNum)
    Korquad.find({ num: parseInt(randomNum) }, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(typeof(result))
        console.log('x3')
        return res.send(JSON.stringify(result))
    })
});

export default router;