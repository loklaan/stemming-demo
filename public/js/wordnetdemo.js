(function(window, document, undefined) {
  "use strict";

  /*
  Public Controllers
  ========================================================================== */

  var Exports = window.Demo = {};

  Exports.getSenseInfo = function() {
    var word = $('#senseinput').val().split(' ')[0];
    $.ajax({
      url: '/api/wordnet/' + word + '?set=synonyms',
      type: 'GET'
    }).done(function(data) {
      $('#sensesynoutput').html('<strong>Synonyms grouped by sense: </strong>' + _.reduce(data, function(out, group) {
        return out += '[ ' + _.reduce(group, function(outt, wrd) {
          return outt += ' <span class="bg-info">' + wrd + '</span>,';
        }, '') + ' ] ';
      }, ''));
    });
    $.ajax({
      url: '/api/wordnet/' + word + '?set=synonyms',
      type: 'GET'
    }).done(function(data) {
      $('#sensehypoutput').html('<strong>Hypernyms grouped by sense: </strong>' + _.reduce(data, function(out, group) {
        return out += '[ ' + _.reduce(group, function(outt, wrd) {
          return outt += ' <span class="bg-info">' + wrd + '</span>,';
        }, '') + ' ] ';
      }, ''));
    });
  };

})(window, document, undefined);