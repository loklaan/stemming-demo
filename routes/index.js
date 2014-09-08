(function(exports) {
  "use strict";

  var natural = require('natural');
  var pos = require('pos');
  var _ = require('lodash-node');
  var path = require('path');

  exports.init = function(app) {

/*
   Webclient Routes
   ========================================================================== */

    var templates = path.join(__dirname, '../public/views/');
    app.get('/', function(req, res) {
      res.sendFile(templates + 'index.html');
    });


/*
   API Routes
   ========================================================================== */

    /**
     * POS Tagging for a body of POST
     */
    app.post('/api/tag', function(req, res) {
      if (!req.body || req.body.words === '') {
        res.status(400);
        res.json({
          error: 'empty post form'
        });
      } else {

        var timer = Date.now();
        var data = {
          sets: (new pos.Tagger().tag(new pos.Lexer().lex(req.body.words))),
        };
        timer = Date.now() - timer;
        data.timer = timer;

        if (req.query.concat) {
          var taggedWords = '';
          data.sets.forEach(function(set, i, sets) {
            // make words like "they're" look nicer
            var isJoined = set[0].search(/'/) !== -1,
                isNextAJoined = false;
            if (sets[i+1]) {
              isNextAJoined = sets[i+1][0].search(/'/) !== -1;
            }

            var word = '';
            word += set[0];
            word += isJoined ? '' : '/' + set[1];
            word += isNextAJoined || isJoined ? '' : ' ';
            taggedWords += word;
          });
          data.sets = taggedWords;
        }

        res.json(data);
      }
    });

    /**
     * Raw data for a particular word, by offset, in WNdb
     */
    app.get('/api/wordnet/:pos/:offset*', function(req, res) {

      var wordnet = new natural.WordNet();
      wordnet.get(parseInt(req.params.offset), req.params.pos, function(results) {
        var info = {
          query: {
            synsetOffset: req.params.offset,
            pos: req.params.pos
          },
          data: {
            pos: results.pos,
            lemma: results.lemma,
            synonyms: results.synonyms,
            gloss: results.gloss,
          }
        };
        res.json(info);
      });

    });

    /**
     * Raw data for a particular word in WNdb
     */
    app.get('/api/wordnet/:word', function(req, res) {

      var wordnet = new natural.WordNet();
      wordnet.lookup(req.params.word, function(results) {
        if (req.query.set) {
          switch(req.query.set) {
            case 'synonyms':
                res.json(getType().synonyms(results, req.params.word));
              break;
            case 'hypernyms':
                getType().hypernyms(results, req.params.word, function(sets) {
                  res.json(sets);
                });
              break;
          }
        } else {
          res.json(results);
        }

      });

    });

    /**
     * Helper object
     */
    function getType() {
      var symbol = {
        hypernym: '@'
      };

      return {
        /**
         * Get the groups of synonyms by sense of a word
         */
        synonyms: function(data, word) {
          var sets = [];

          data.forEach(function(sense) {
            var cleaned = _.map(sense.synonyms, function(synonym) {
              return synonym.replace(/_/, ' ');
            });
            cleaned = _.without(cleaned, word);
            sets.push(cleaned);
          });

          sets = _.reject(sets, function(sense) {
            return sense.length === 0;
          });

          return sets;
        },

        /**
         * Get the groups of hypernyms
         */
        hypernyms: function(data, word, callback) {
          var sets = [],
            wordnet = new natural.WordNet(),
            finds = 0;

          data.forEach(function(set) {
            set.ptrs.forEach(function(ptr) {
              if (ptr.pointerSymbol === symbol.hypernym) {
                finds += 1;
                wordnet.get(ptr.synsetOffset, ptr.pos, function(hypernym) {
                  var hypernymSense = _.map(hypernym.synonyms, function(synonym) {
                    return synonym.replace(/_/, ' ');
                  });
                  sets.push(hypernymSense);
                  finds -= 1;
                  if (finds === 0) {
                    callback(sets);
                  }
                });
              }
            });
          });
        }
      };
    }

    app.get('/api*', function(req, res){
      res.json({
        error: 'not a valid endpoint'
      });
    });

  };

})(exports);