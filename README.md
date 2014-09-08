# Search Engine Tech - Demo

Demonstration is primary done through the web page. An API was implemented for tasks requiring server side code.

#### Web Page

1. Porter Stemmer
  * Paste text into the appropriate box
  * See stemmed results, pseudo diff of text vs stemmed and a 'live' stemming view
2. Language Detect *(Stemming was __not__ updated to support French)*
  * Naive approach was to compare highest amount of language stop words
3. Part of Speech Tagging *(via RESTful API)*
  * __[Not](https://www.npmjs.org/package/pos)__ Brill Tagger, but is an extension of the work Eric Brill had done.
4. Search for a type. ie fish or tree *(via RESTful API)*
  * Perfect matching it is not

#### Web API *only*
I didn't have time to add this to something in the Page.

1. Wordnet API, visit `localhost:3000/api/wordnet/<word>`
    * See sets of synonyms or hypernyms, grouped by sense. Add query `set` with `synonyms` or `hypernyms`, ie `localhost:3000/api/wordnet/<word>?set=synonyms
    * Uses [natural](https://www.npmjs.org/package/natural)

## Install
[Download](http://nodejs.org/download/) and install Node.JS (comes with `npm`)

In main directory, install dependencies with `npm`
```shell
$ npm install
```

## Run
Run with `node` or `npm`
```shell
$ npm start
```

Visit `http://localhost:3000`