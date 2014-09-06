(function(window, document, undefined) {
  "use strict";

/*
   Controller Variables
   ========================================================================== */

   var isShowing = 0,
   timeoutId = 0,
   wordlist = [],
   stemmed = [],
   diffed = [];

   /* Init */
   $('#input').keyup(function() {
    updateContentCharCount($(this).val().length);
    updateContentWordCount();
  });
   updateContentCharCount($('#input').val().length);
   updateContentWordCount();

/*
   Public Controllers
   ========================================================================== */
   var Exports = window.Stem = {};

   Exports.stopLiveStems = function() {
    isShowing = false;
  };

  Exports.buildStems = function() {

    var steps = {
      one: $('#step1').prop('checked'),
      two: $('#step2').prop('checked'),
      three: $('#step3').prop('checked'),
      four: $('#step4').prop('checked'),
      five: $('#step5').prop('checked')
    };

    wordlist = [];
    stemmed = [];
    diffed = [];
    var diffcount= 0,
    timer = 0,
    lang;
    var clean = $('#input').val();
    if (typeof clean === "undefined") {
      return;
    }

    clean = clean.replace(/'/g, '').replace(/[^\w]/g, ' ').replace(/\s+/g, ' ');
    lang = getLanguage(clean);
    $('#language').text(lang);

    wordlist = clean.split(' ');

    // Build stems
    for (var index in wordlist) {
      if (wordlist.hasOwnProperty(index)) {
        var singleTimer = Date.now();
        var stem = stemmer(wordlist[index], steps);
        timer += Date.now() - singleTimer;
        stemmed.push(stem);

        // Build diffs
        for (var char in wordlist[index]) {
          if (wordlist[index][char] !== stem[char]) {
            var patch = wordlist[index].substr(0, char) + '<span class="bg-danger">' + wordlist[index].substr(char) + '</span>';
            diffed.push(patch);
            diffcount += 1;
            break;
          } else if (parseInt(char) === wordlist[index].length - 1) {
            diffed.push(stem);
          }
        }
      }
    }

    stopTimeouts();
    if (diffcount > 0) {
      $('#diffview').removeClass('hidden');
      $('#diffview').addClass('show');
    }
    startLiveStem(diffed, diffcount);

    $('#stemPerf').text((timer === 1 || timer === 0 ? '> 1' : timer) + 'ms');
    $('#output').val(stemmed.join(' '));

    updateDiffCount(diffcount);
    updateStemWordCount();
    updateStemCharCount(stemmed.join('').length);
  };

/*
   Private Functions
   ========================================================================== */

   function startLiveStem(diffs) {
    if (diffs[0] === '' && diffs[0].length === 1) {
      return;
    }
    var i = 0;
    var timeout;
    isShowing = true;
    toggleStopLiveStemButton(true);

    var inFn = function() {
      if (diffs[i] !== '') {
        setCurrentStemInner(diffs[i]);
        var temp = diffs[i];
        diffs[i] = '<span class="bg-success">' + diffs[i] + '</span>';
        $('#diff').html(diffs.join(' '));
        diffs[i] = temp;
      }
      updateStemLiveCount(i + 1);

      if (diffs[i][diffs[i].length - 1] === '>') {
        timeout = 300;
      } else {
        timeout = 20;
      }

      if (diffs.length === 1 ) {
        toggleStopLiveStemButton(false);
        return;
      } else if (i === diffs.length - 1 || !isShowing) {
        timeoutId = setTimeout(function() {
          $('#diff').html(diffs.join(' '));
          setCurrentStemText('...');
          updateStemLiveCount('-');
          toggleStopLiveStemButton(false);
        }, timeout);
      } else {
        i += 1;
        timeoutId = setTimeout(inFn, timeout);
      }
    };

    inFn();
  }

  function getLanguage(words) {
    var langs = {
      fre: 'French',
      en: 'English'
    };
    var frenchResults = words.match(frenchStopWords);
    var englishResults = words.match(englishStopWords);

    if (frenchResults === null) {
      return langs.en;
    } else if (englishResults === null) {
      return langs.fre;
    } else {
      return frenchResults.length > englishResults.length ? langs.fre : langs.en ;
    }
  }

/*
   Utils
   ========================================================================== */

   function stopTimeouts() {
    clearTimeout(timeoutId);
  }

  function toggleStopLiveStemButton(toggle) {
    if (toggle) {
      $('#stopbtn').prop('disabled', false);
    } else {
      $('#stopbtn').prop('disabled', true);
    }
  }

  function updateStemLiveCount(count) {
    $('#wordsleft').text(count);
  }

  function setCurrentStemText(text) {
    $('#stemshow').text(text);
  }

  function setCurrentStemInner(html) {
    $('#stemshow').html(html);
  }

  function updateContentCharCount(words) {
    $('#words').text(words);
  }

  function updateStemCharCount(stems) {
    $('#stems').text(stems);
  }

  function updateContentWordCount() {
    if ($('#input').val() === '') {
      $('#wordscount').text(0);
    } else {
      $('#wordscount').text(getWordCount($('#input').val()));
    }
  }

  function updateStemWordCount() {
    $('#stemscount').text(getWordCount($('#output').val()));
  }

  function updateDiffCount(count) {
    $('#diffcount').text(count);
  }

  function getWordCount(body) {
    var val = body;
    val = val.replace(/[^\w]/g, ' ').replace(/\s+/g, ' ');
    val = val.split(' ').length;
    return val;
  }

  var frenchStopWords = /(?:\s)(alors|au|aucuns|aussi|autre|avant|avec|avoir|bon|car|ce|cela|ces|ceux|chaque|ci|comme|comment|dans|des|du|dedans|dehors|depuis|deux|devrait|doit|donc|dos|droite|début|elle|elles|en|encore|essai|est|et|eu|fait|faites|fois|font|force|haut|hors|ici|il|ils|je|juste|la|le|les|leur|là|ma|maintenant|mais|mes|mine|moins|mon|mot|même|ni|nommés|notre|nous|nouveaux|ou|où|par|parce|parole|pas|personnes|peut|peu|pièce|plupart|pour|pourquoi|quand|que|quel|quelle|quelles|quels|qui|sa|sans|ses|seulement|si|sien|son|sont|sous|soyez||sujet|sur|ta|tandis|tellement|tels|tes|ton|tous|tout|trop|très|tu|valeur|voie|voient|vont|votre|vous|vu|ça|étaient|état|étions|été|être)(?:\s)/gi;

  var englishStopWords = /(?:\s)(a|about|above|after|again|against|all|am|an|and|any|are|aren't|as|at|be|because|been|before|being|below|between|both|but|by|can't|cannot|could|couldn't|did|didn't|do|does|doesn't|doing|don't|down|during|each|few|for|from|further|had|hadn't|has|hasn't|have|haven't|having|he|he'd|he'll|he's|her|here|here's|hers|herself|him|himself|his|how|how's|i|i'd|i'll|i'm|i've|if|in|into|is|isn't|it|it's|its|itself|let's|me|more|most|mustn't|my|myself|no|nor|not|of|off|on|once|only|or|other|ought|our|ours||ourselves|out|over|own|same|shan't|she|she'd|she'll|she's|should|shouldn't|so|some|such|than|that|that's|the|their|theirs|them|themselves|then|there|there's|these|they|they'd|they'll|they're|they've|this|those|through|to|too|under|until|up|very|was|wasn't|we|we'd|we'll|we're|we've|were|weren't|what|what's|when|when's|where|where's|which|while|who|who's|whom|why|why's|with|won't|would|wouldn't|you|you'd|you'll|you're|you've|your|yours|yourself|yourselves)(?:\s)/gi;

})(window, document);
