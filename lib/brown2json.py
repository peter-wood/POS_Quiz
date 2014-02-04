import nltk
from nltk.corpus import brown
sents = brown.tagged_sents(simplify_tags = True)
fh = open('brown.json', 'w')
for i in range(len(sents)):
    fh.write("{ number : " + str(i) + ", ")
    tokens = "tokens : [ "
    tags = "tags: [ "
    for (x,y) in sents[i]:
      tokens += '"' + x + '", '
      tags += '"' + y + '", '
    fh.write(tokens[:-2] + '], ' + tags[:-2] + ']}\n')
fh.close()
    
