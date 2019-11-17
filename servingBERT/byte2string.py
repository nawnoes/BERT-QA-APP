import json
import pathlib
import pprint



file = pathlib.Path('/Users/[Username]/Desktop/dev/workspace/KorQuAD-beginner/config/KorQuAD_v1.0_train.json')
file_text= file.read_text(encoding='utf-8')

#json 데이터 로드
json_data=json.loads(file_text)
print(type(json_data)) # dict
data=json_data['data']
print(len(data))
pp = pprint.PrettyPrinter(indent=4)
# for a in data:
#     pp.pprint(a)p.
# pp.pprint(data,'./test_data.json')

with open("file_out.txt", "w") as fout:
    fout.write(pprint.pformat(data))

# json 예쁘게 출력해주는 함수 pprint
# path = pathlib.Path('./KorQuAD_v1.0_train_kor.json')
# print(path)
# path.write_text(str(json_data),'./test_data.json')