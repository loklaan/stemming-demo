(function(exports) {
  "use strict";

  var natural = require('natural');
  var pos = require('pos');
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

    app.get('/api/example*', function(req, res) {

      var wordnet = new natural.WordNet();
      wordnet.lookup('node', function(results) {
        var info = {
          query: 'node',
          data: []
        };
        results.forEach(function(result) {
          info.results.push({
            synsetOffset: result.synsetOffset,
            pos: result.pos,
            lemma: result.lemma,
            synonyms: result.synonyms,
            gloss: result.gloss,
          });
        });
        res.json(info);
      });

    });
    app.get('/api/get/:pos/:offset*', function(req, res) {

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

    app.get('/api*', function(req, res){
      res.json({
        error: 'not a valid endpoint'
      });
    });

  };

})(exports);