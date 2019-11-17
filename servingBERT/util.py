import run_squad as rs
import tokenization
import collections
import json
import os
import modeling
import requests
import math



def read_squad_data(json_input, is_training):
  """Read a SQuAD json file into a list of SquadExample."""
  # input_data = json_input["data"]
  input_data = json_input


  def is_whitespace(c):
    if c == " " or c == "\t" or c == "\r" or c == "\n" or ord(c) == 0x202F:
      return True
    return False

  #데이터를 받아오는 부분
  examples = []
  # 읽어온 input_data는 paragraphs와 title로 구분 되어있음
  # paragraph는 질의응답셋인 qas와 문맥정보를 의미하는 context로 구성되어 있다.
  for entry in input_data:
    # input_date에서 각 데이터를 하나씩 불러 오고
    # 데이터를 context 먼저 처리

    paragraph_text = entry["context"]
    doc_tokens = [] # 띄어쓰기 기준으로 단어를 토큰으로 나눈다
    char_to_word_offset = [] # 각 charater가 몇 번째 단어에 속하는지 순서를 0,1,2,...,n으로 나타낸다
    prev_is_whitespace = True
    for c in paragraph_text: # context를 character 단위로 받아온다.
        if is_whitespace(c):
          prev_is_whitespace = True
        else:
          if prev_is_whitespace: # character가 화이트스페이스가 아니고, 이전이 화이트페이스면
            doc_tokens.append(c) # 최초 삽입
          else:
            doc_tokens[-1] += c # 마지막 배열의 요소에 character들을 추
          prev_is_whitespace = False #character가 화이트스페이스가 아니므로 false로 변경
        char_to_word_offset.append(len(doc_tokens) - 1) #0 부터 시작으로 len -1


    # qas_id = qa["id"] # 질의의 id
    question_text = entry["question"] #질문 데이터
    start_position = None
    end_position = None
    orig_answer_text = None
    is_impossible = False

    start_position = -1
    end_position = -1
    orig_answer_text = ""

    example = rs.SquadExample(
        qas_id=1,
        question_text=question_text,
        doc_tokens=doc_tokens,
        orig_answer_text=orig_answer_text,
        start_position=start_position,
        end_position=end_position,
        is_impossible=is_impossible)
    examples.append(example)

  return examples

def _get_best_indexes(logits, n_best_size):
  """Get the n-best logits from a list."""
  index_and_score = sorted(enumerate(logits), key=lambda x: x[1], reverse=True)

  best_indexes = []
  for i in range(len(index_and_score)):
    if i >= n_best_size:
      break
    best_indexes.append(index_and_score[i][0])
  return best_indexes


def _compute_softmax(scores):
  """Compute softmax probability over raw logits."""
  if not scores:
    return []

  max_score = None
  for score in scores:
    if max_score is None or score > max_score:
      max_score = score

  exp_scores = []
  total_sum = 0.0
  for score in scores:
    x = math.exp(score - max_score)
    exp_scores.append(x)
    total_sum += x

  probs = []
  for score in exp_scores:
    probs.append(score / total_sum)
  return probs

def process_inputs(input_data):
    bert_config = modeling.BertConfig.from_json_file(rs.FLAGS.bert_config_file)

    eval_examples = read_squad_data(input_data,is_training=False)
    eval_features = []

    eval_writer = rs.FeatureWriter(
        filename=os.path.join("./colab_output", "train.tf_record"),
        is_training=False)

    def append_feature(feature):
        eval_features.append(feature)
        eval_writer.process_feature(feature)

    # 토크나이저에 사전과 do_lower_case 설정
    tokenizer = tokenization.FullTokenizer(
        vocab_file=rs.FLAGS.vocab_file, do_lower_case=rs.FLAGS.do_lower_case)

    rs.convert_examples_to_features(
        examples=eval_examples,
        tokenizer=tokenizer,
        max_seq_length=rs.FLAGS.max_seq_length,
        doc_stride=rs.FLAGS.doc_stride,
        max_query_length=rs.FLAGS.max_query_length,
        is_training=False,
        output_fn=append_feature)
    eval_writer.close()

    return eval_examples, eval_features


def process_result(result):
    # unique_id = int(result["unique_ids"].int64_val[0])
    # start_logits = [float(x) for x in result["start_logits"].float_val]
    # end_logits = [float(x) for x in result["end_logits"].float_val]
    unique_id = int(result["unique_ids"][0])
    start_logits= result["start_logits"].tolist()
    end_logits = result["end_logits"].tolist()

    # start_logits = np.array(start_logits).reshape(batch_size, max_seq_length)
    # end_logits = np.array(end_logits).reshape(batch_size, max_seq_length)

    formatted_result = rs.RawResult(
        unique_id=unique_id,
        start_logits=start_logits[0],
        end_logits=end_logits[0])

    return formatted_result

def write_predictions(all_examples, all_features, all_results, n_best_size,
                      max_answer_length, do_lower_case, version_2_with_negative  ):

  example_index_to_features = collections.defaultdict(list)
  for feature in all_features:
    example_index_to_features[feature.example_index].append(feature)

  unique_id_to_result = {}
  for result in all_results:
    unique_id_to_result[result.unique_id] = result

  _PrelimPrediction = collections.namedtuple(  # pylint: disable=invalid-name
      "PrelimPrediction",
      ["feature_index", "start_index", "end_index", "start_logit", "end_logit"])

  all_predictions = collections.OrderedDict()
  all_nbest_json = collections.OrderedDict()
  scores_diff_json = collections.OrderedDict()

  for (example_index, example) in enumerate(all_examples):
    features = example_index_to_features[example_index]

    prelim_predictions = []
    # keep track of the minimum score of null start+end of position 0
    score_null = 1000000  # large and positive
    min_null_feature_index = 0  # the paragraph slice with min mull score
    null_start_logit = 0  # the start logit at the slice with min null score
    null_end_logit = 0  # the end logit at the slice with min null score
    for (feature_index, feature) in enumerate(features):
      result = unique_id_to_result[feature.unique_id]
      start_indexes = _get_best_indexes(result.start_logits, n_best_size)
      end_indexes = _get_best_indexes(result.end_logits, n_best_size)
      # if we could have irrelevant answers, get the min score of irrelevant
      if version_2_with_negative:
        feature_null_score = result.start_logits[0] + result.end_logits[0]
        if feature_null_score < score_null:
          score_null = feature_null_score
          min_null_feature_index = feature_index
          null_start_logit = result.start_logits[0]
          null_end_logit = result.end_logits[0]
      for start_index in start_indexes:
        for end_index in end_indexes:
          # We could hypothetically create invalid predictions, e.g., predict
          # that the start of the span is in the question. We throw out all
          # invalid predictions.
          if start_index >= len(feature.tokens):
            continue
          if end_index >= len(feature.tokens):
            continue
          if start_index not in feature.token_to_orig_map:
            continue
          if end_index not in feature.token_to_orig_map:
            continue
          if not feature.token_is_max_context.get(start_index, False):
            continue
          if end_index < start_index:
            continue
          length = end_index - start_index + 1
          if length > max_answer_length:
            continue
          prelim_predictions.append(
              _PrelimPrediction(
                  feature_index=feature_index,
                  start_index=start_index,
                  end_index=end_index,
                  start_logit=result.start_logits[start_index],
                  end_logit=result.end_logits[end_index]))

    if version_2_with_negative:
      prelim_predictions.append(
          _PrelimPrediction(
              feature_index=min_null_feature_index,
              start_index=0,
              end_index=0,
              start_logit=null_start_logit,
              end_logit=null_end_logit))
    prelim_predictions = sorted(
        prelim_predictions,
        key=lambda x: (x.start_logit + x.end_logit),
        reverse=True)

    _NbestPrediction = collections.namedtuple(  # pylint: disable=invalid-name
        "NbestPrediction", ["text", "start_logit", "end_logit"])

    seen_predictions = {}
    nbest = []
    for pred in prelim_predictions:
      if len(nbest) >= n_best_size:
        break
      feature = features[pred.feature_index]
      if pred.start_index > 0:  # this is a non-null prediction
        tok_tokens = feature.tokens[pred.start_index:(pred.end_index + 1)]
        orig_doc_start = feature.token_to_orig_map[pred.start_index]
        orig_doc_end = feature.token_to_orig_map[pred.end_index]
        orig_tokens = example.doc_tokens[orig_doc_start:(orig_doc_end + 1)]
        tok_text = " ".join(tok_tokens)

        # De-tokenize WordPieces that have been split off.
        tok_text = tok_text.replace(" ##", "")
        tok_text = tok_text.replace("##", "")

        # Clean whitespace
        tok_text = tok_text.strip()
        tok_text = " ".join(tok_text.split())
        orig_text = " ".join(orig_tokens)

        final_text = rs.get_final_text(tok_text, orig_text, do_lower_case)
        if final_text in seen_predictions:
          continue

        seen_predictions[final_text] = True
      else:
        final_text = ""
        seen_predictions[final_text] = True

      nbest.append(
          _NbestPrediction(
              text=final_text,
              start_logit=pred.start_logit,
              end_logit=pred.end_logit))

    # if we didn't inlude the empty option in the n-best, inlcude it
    if version_2_with_negative:
      if "" not in seen_predictions:
        nbest.append(
            _NbestPrediction(
                text="", start_logit=null_start_logit,
                end_logit=null_end_logit))
    # In very rare edge cases we could have no valid predictions. So we
    # just create a nonce prediction in this case to avoid failure.
    if not nbest:
      nbest.append(
          _NbestPrediction(text="empty", start_logit=0.0, end_logit=0.0))

    assert len(nbest) >= 1

    total_scores = []
    best_non_null_entry = None
    for entry in nbest:
      total_scores.append(entry.start_logit + entry.end_logit)
      if not best_non_null_entry:
        if entry.text:
          best_non_null_entry = entry

    probs = _compute_softmax(total_scores)

    nbest_json = []
    for (i, entry) in enumerate(nbest):
      output = collections.OrderedDict()
      output["text"] = entry.text
      output["probability"] = probs[i]
      output["start_logit"] = entry.start_logit
      output["end_logit"] = entry.end_logit
      nbest_json.append(output)

    assert len(nbest_json) >= 1

    if not version_2_with_negative:
      all_predictions[example.qas_id] = nbest_json[0]["text"]
    else:
      # predict "" iff the null score - the score of best non-null > threshold
      score_diff = score_null - best_non_null_entry.start_logit - (
          best_non_null_entry.end_logit)
      scores_diff_json[example.qas_id] = score_diff
      if score_diff > rs.FLAGS.null_score_diff_threshold:
        all_predictions[example.qas_id] = ""
      else:
        all_predictions[example.qas_id] = best_non_null_entry.text

    all_nbest_json[example.qas_id] = nbest_json
  return all_predictions, all_nbest_json


def process_output(all_results,
                   eval_examples,
                   eval_features,
                   input_data,
                   n_best, n_best_size, max_answer_length):

    output_prediction_file = os.path.join(rs.FLAGS.output_dir, "predictions.json")
    output_nbest_file = os.path.join(rs.FLAGS.output_dir, "nbest_predictions.json")
    output_null_log_odds_file = os.path.join(rs.FLAGS.output_dir, "null_odds.json")

    all_predictions, all_nbest_json = write_predictions(eval_examples,
                                                        eval_features,
                                                        all_results,
                                                        n_best_size=n_best_size,
                                                        max_answer_length=max_answer_length,
                                                        do_lower_case=True,
                                                        version_2_with_negative=False)
    return all_predictions, all_nbest_json
    # re = []
    # for i in range(len(all_predictions)):
    #     id_ = input_data[i]["id"]
    #     if n_best:
    #         re.append(collections.OrderedDict({
    #             "id": id_,
    #             "question": input_data[i]["question"],
    #             "best_prediction": all_predictions[id_],
    #             "n_best_predictions": all_nbest_json[id_]
    #         }))
    #     else:
    #         re.append(collections.OrderedDict({
    #             "id": id_,
    #             "question": input_data[i]["question"],
    #             "best_prediction": all_predictions[id_]
    #         }))
    # return re

if __name__ == "__main__":
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
    example = process_inputs(input_data)

    # p_result=process_result(example[1][0])
    input_ids = []
    input_mask = []
    segment_ids = []

    unique_id= str(example[1][0].unique_id)


    for e in example[1][0].input_ids:
        input_ids.append(str(e))
    for e in example[1][0].input_mask:
        input_mask.append(str(e))
    for e in example[1][0].segment_ids:
        segment_ids.append(str(e))

        pred_input = {
            "inputs":{
                "examples":{
                        "unique_id": example[1][0].unique_id,
                        "input_ids": example[1][0].input_ids,
                        "input_mask": example[1][0].input_mask,
                        "segment_ids": example[1][0].segment_ids,
                    }
            }
        }
        pred_input5 = {
            "inputs": {
                "examples": {
                    "unique_id": unique_id,
                    "input_ids": input_ids,
                    "input_mask": input_mask,
                    "segment_ids": segment_ids,
                }
            }
        }
        pred_input2 = {
            "inputs": {
                "examples": [ input_ids, input_mask, segment_ids]
            }
        }
        pred_input3 = {
            "instances":  [ unique_id, input_ids,  input_mask, segment_ids]
        }


    # {
    #     "unique_id": example[1][0].unique_id,
    #     "input_ids": example[1][0].input_ids,
    #     "input_mask": example[1][0].input_mask,
    #     "segment_ids": example[1][0].segment_ids,
    # }

    # [
    #     example[1][0].unique_id,
    #     example[1][0].input_ids,
    #     example[1][0].input_mask,
    #     example[1][0].segment_ids,
    # ]
    # pred_input={
    #     "instances":[
    #         0,
    #         example[1][0].input_ids,
    #          example[1][0].input_mask,
    #          example[1][0].segment_ids,
    #          0,
    #     ]
    #
    # }

    print(pred_input3)
    # post
    j_data=json.dumps(pred_input3)
    # base64_data=base64.b64encode(j_data)
    r = requests.post(url, data=j_data)

    print(r.status_code)
    print(r.text)

