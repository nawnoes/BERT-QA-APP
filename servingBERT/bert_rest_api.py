from flask import Flask
from flask_restful import reqparse, Api, Resource

from servingBERT import qa

#flask server
app = Flask(__name__)
api = Api(app)
parser= reqparse.RequestParser()
parser.add_argument('context')
parser.add_argument('question')

#BERT 모델 로딩
qa_module = qa.QaModule()


class BertQA(Resource):
    def get(self):
        return {
            'answer': 'hello qa system'
        }
class BertQaPost(Resource):

    def post(self):
        args = parser.parse_args() # context, question, answer로 구성

        print(args['context'])
        print(args['question'])
        qa_example = {
            'context':args['context'],
            'question': args['question']
        }
        answer=qa_module.getAnswer([qa_example])
        print(answer)
        result = { 'result': answer}


        return result, 201

api.add_resource(BertQA,'/api/bert/qa')
api.add_resource(BertQaPost,'/api/bert/qa/post')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9909)
