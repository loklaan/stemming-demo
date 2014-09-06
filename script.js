(function(window, document, undefined) {
  "use strict";

/*
   Controller Variables
   ========================================================================== */

   var isShowing = 0,
   timeoutId = 0;

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

    var wordlist = [],
    stemmed = [],
    timer = 0;
    var clean = $('#input').val();
    if (typeof clean === "undefined") {
      return;
    }
    clean = clean.replace(/[^\w]/g, ' ').replace(/\s+/g, ' ');

    wordlist = clean.split(' ');

    for (var index in wordlist) {
      if (wordlist.hasOwnProperty(index)) {
        var singleTimer = Date.now();
        var stem = stemmer(wordlist[index], steps);
        timer += Date.now() - singleTimer;
        stemmed.push(stem);
      }
    }

    stopTimeouts();
    startLiveStem(wordlist, stemmed);

    $('#stemPerf').text((timer === 1 || timer === 0 ? '> 1' : timer) + 'ms');
    $('#output').val(stemmed.join(' '));

    updateStemWordCount();
    updateStemCharCount(stemmed.join('').length);
  };

/*
   Private Functions
   ========================================================================== */

   function startLiveStem(words, stems) {
    if (words[0] === '' && words[0].length === 1) {
      return;
    }
    var i = 0;
    var timeout;
    isShowing = true;
    toggleStopLiveStemButton();

    var inFn = function() {
      if (words[i] !== '') {
        var patch = words[i];
        for (var char in words[i]) {
          if (words[i][char] !== stems[i][char]) {
            patch = words[i].substr(0, char) + '<span class="bg-danger">' + words[i].substr(char) + '</span>';
            break;
          }
        }
        setCurrentStemInner(patch);
      }
      updateStemLiveCount(i + 1);

      if (words[i].length > stems[i].length) {
        timeout = 300;
      } else {
        timeout = 150;
      }

      if (words.length === 1 ) {
        toggleStopLiveStemButton();
        return;
      } else if (i === words.length - 1 || !isShowing) {
        timeoutId = setTimeout(function() {
          setCurrentStemText('...');
          updateStemLiveCount('-');
          toggleStopLiveStemButton();
        }, timeout);
      } else {
        i += 1;
        timeoutId = setTimeout(inFn, timeout);
      }
    };

    inFn();
  }

/*
   Utils
   ========================================================================== */

   function stopTimeouts() {
    clearTimeout(timeoutId);
  }

  function toggleStopLiveStemButton() {
    if ($('#stopbtn').prop('disabled')) {
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

  function getWordCount(body) {
    var val = body;
    val = val.replace(/[^\w]/g, ' ').replace(/\s+/g, ' ');
    val = val.split(' ').length;
    return val;
  }

})(window, document);
