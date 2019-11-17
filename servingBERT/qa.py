import tensorflow as tf
from servingBERT import util as mc
import collections

class QaModule(object):
    def __init__(self):
        self.export_dir = './savemodel'
        self.predict_fn = tf.contrib.predictor.from_saved_model(self.export_dir)
        self.docker_url = "http://localhost:8501/v1/models/korquad_cpu_model:predict"
        self.input_data =None
        self.eval_examples =None
        self.eval_features = None
        self.train_example = None
        self.inputs = None

    def preprocessInput(self,input_data):
        self.eval_examples, self.eval_features = mc.process_inputs(input_data)

    def create_int_feature(self, values):
        f = tf.train.Feature(int64_list=tf.train.Int64List(value=list(values)))
        return f
    def makeTFexample(self):
        self.inputs = collections.OrderedDict()
        self.inputs["input_ids"] = self.create_int_feature(self.eval_features[0].input_ids)
        self.inputs["input_mask"] = self.create_int_feature(self.eval_features[0].input_mask)
        self.inputs["segment_ids"] = self.create_int_feature(self.eval_features[0].segment_ids)
        self.inputs["unique_ids"] = self.create_int_feature([self.eval_features[0].unique_id])

        self.train_example = tf.train.Example(features=tf.train.Features(feature=self.inputs))
    def trainExampleSerializeToString(self):
        self.train_example = {'examples':[self.train_example.SerializeToString()]}

    def predict(self):
        return self.predict_fn(self.train_example)

    def getTextResult(self, predict_result):
        result = mc.process_result(predict_result)
        result2json = mc.process_output([result],self.eval_examples, self.eval_features, self.inputs, True, 5, 30)
        return result2json
    def getAnswer(self,input_data):
        self.preprocessInput(input_data)
        self.makeTFexample()
        self.trainExampleSerializeToString()
        predict_result = self.predict()
        final_result = self.getTextResult(predict_result)

        return final_result



