import tensorflow as tf
import json
from servingBERT import util as mc
import collections

export_dir = './savemodel'
predict_fn = tf.contrib.predictor.from_saved_model(export_dir)


input_data = {
         "options": {
          "n_best": True,
          "n_best_size": 3,
          "max_answer_length": 30
         },
         "data": [
         {
          "id": "001",
          "question": "Who invented LSTM?",
          "context":  "Many aspects of speech recognition were taken over by a deep learning method called long short-term memory (LSTM), a recurrent neural network published by Hochreiter and Schmidhuber in 1997.[51] LSTM RNNs avoid the vanishing gradient problem and can learn \"Very Deep Learning\" tasks[2] that require memories of events that happened thousands of discrete time steps before, which is important for speech. In 2003, LSTM started to become competitive with traditional speech recognizers on certain tasks.[52] Later it was combined with connectionist temporal classification (CTC)[53] in stacks of LSTM RNNs.[54] In 2015, Google's speech recognition reportedly experienced a dramatic performance jump of 49% through CTC-trained LSTM, which they made available through Google Voice Search."
         }
         ]
        }


url="http://localhost:8501/v1/models/korquad_cpu_model:predict"



print(type(input_data))
print(type(json.dumps(input_data)))
json_input=json.dumps(input_data)
eval_examples, eval_features = mc.process_inputs(input_data)

# feature_spec = {
#         "unique_ids": np.asarray(eval_features[0].unique_id).tolist(),
#         "input_ids": np.asarray(eval_features[0].input_ids).tolist(),
#         "input_mask": np.asarray(eval_features[0].input_mask).tolist(),
#         "segment_ids": np.asarray(eval_features[0].segment_ids).tolist()
#     }
# serialized_tf_example = tf.placeholder(dtype=tf.string,
#                            shape=[1],
#                            name='input_example_tensor')
# receiver_tensors = {'examples': serialized_tf_example}
# features = tf.parse_example(serialized_tf_example, feature_spec)
# out = predict_fn({'examples':[str(feature_spec)]})
def create_int_feature(values):
    f = tf.train.Feature(int64_list=tf.train.Int64List(value=list(values)))
    return f

inputs = collections.OrderedDict()
inputs["input_ids"] = create_int_feature(eval_features[0].input_ids)
inputs["input_mask"] = create_int_feature(eval_features[0].input_mask)
inputs["segment_ids"] = create_int_feature(eval_features[0].segment_ids)
inputs["unique_ids"] = create_int_feature([eval_features[0].unique_id])

tf_example = tf.train.Example(features=tf.train.Features(feature=inputs))
out = predict_fn({'examples':[tf_example.SerializeToString()]})
pr_out = mc.process_result(out)
pr_result = mc.process_output([pr_out],eval_examples,eval_features,inputs,True,5,30)

print(pr_result)