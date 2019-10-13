# gradespage

A simple web app to replicate my grades webpage.  This is for
development only.

## Getting Started

1. Install [Node.js](https://nodejs.org/en/download/).

2. Clone this repository.  `cd` into the project and run

```
$ npm install
```

3. To start a local server that hosts this webpage, run

```
$ npm start
```

and then open `localhost:3000` in your browser.


## Development

Almost all the fun of the table and the histogram are defined in
`public/javascripts/grades.js` via [D3](https://d3js.org).  Modifying
this will be the most challending part.

Other associated files that most likely won't need to change are
`routes/grades.js` and `views/grades.pug`.

After changing something, save your work, (re)start the server, and
refresh the webpage.
