# URLShortener

  Lightweight compact browser independent URL shortener written in pure JavaScript. Both front and back end use [ECMAScript 5](https://www.ecma-international.org/ecma-262/5.1/) standard for the sake of backward compatibility. Both front and back end have no dependencies on any external libraries or frameworks. Back end runs on [Node.js](https://nodejs.org/) platform.

  ## Features

  * No need to install any exernal libraries and frameworks
  * Scalability provided by the routing system
  * Wide browser support

  ## Browser support

  * Chrome
  * Firefox
  * Opera
  * Safari
  * Internet Explorer 8+

  ## Usage

  Just go to the project root directory and run the following:

```bash
$ node app.js
```

  ## Disclaimer
  The project database have in-memory persistence and hence is hardly appropriate for the production use. If you need stronger persistence you would probably have to add appropriate functionality to `shortener.js` module. Collaboration is highly encouraged.
