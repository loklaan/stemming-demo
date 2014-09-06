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
    timer = 0;
    var clean = $('#input').val();
    if (typeof clean === "undefined") {
      return;
    }
    clean = clean.replace(/[^\w]/g, ' ').replace(/\s+/g, ' ');

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

})(window, document);
