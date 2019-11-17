import tensorflow as tf
import numpy as np
from tensorflow.python.saved_model import tag_constants

flags = tf.flags

FLAGS = flags.FLAGS

flags.DEFINE_integer(
    "max_seq_length", 384,
    "The maximum total input sequence length after WordPiece tokenization. "
    "Sequences longer than this will be truncated, and sequences shorter "
    "than this will be padded.")

flags.DEFINE_string(
    "export_dir", "/Users/a60058238/Desktop/dev/workspace/KorQuAD-beginner/korquad_cpu_model/00000123/",
    "The dir where the exported model has been written.")

flags.DEFINE_string(
    "predict_file", "config/KorQuAD_v1.0_dev.json",
    "The file of predict records")

graph = tf.Graph()
with graph.as_default():
    with tf.Session() as sess:
        tf.saved_model.loader.load(sess, [tag_constants.SERVING], FLAGS.export_dir)
        tensor_outputs = graph.get_tensor_by_name('loss/Softmax:0')
        record_iterator = tf.python_io.tf_record_iterator(path=FLAGS.predict_file)
        for string_record in record_iterator:
            example = tf.train.Example()
            example.ParseFromString(string_record)
            input_ids = example.features.feature['input_ids'].int64_list.value
            input_mask = example.features.feature['input_mask'].int64_list.value
            label_ids = example.features.feature['label_ids'].int64_list.value
            segment_ids = example.features.feature['segment_ids'].int64_list.value
            result = sess.run(tensor_outputs, feed_dict={

            })
            print(*(result[0]), sep='\t')