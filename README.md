# Search Engine Tech - Demo

Demonstration is primary done through the web page. An API was implemented for tasks requiring server side code.

#### Porter Stemmer
Uses client code.
  * Paste text into the appropriate box
  * Available views:
    * stemmed results
    * diff of original vs stem
    * _live_ stemming view
  * Includes naive stemming for _French plurals_

#### Language Detect
Uses client code.
  * Compare highest amount of language specific stop words
  * Detects after Stemming is started

#### Part of Speech Tagging
Uses client and server code.
  * Uses [pos](https://www.npmjs.org/package/pos), a FastTag Tagger which is based on the Brill Tagger
  * Tags after Stemming is started
  * Search feature for a _type_. ie 'fish' or 'tree'
    * Returns all recognised types
    * False positives may happen

#### Synonym and Hypernym search
Uses client and server code.
  * Uses [natural](https://www.npmjs.org/package/natural)
  * Visit seperate page, `localhost:3000/wordnet`
  * Groups synonyms and hypernyms by word sense

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

Visit `http://localhost:3000` or `http://localhost:3000/wordnet`