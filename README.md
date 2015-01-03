# webmake-ejs

Require EJS files with [Webmake](https://github.com/medikoo/modules-webmake)

## Install

To use this extension, install it aside of Webmake:

    $ npm install webmake-ejs

If you use global installation of Webmake, then extension also needs to be installed globally:

    $ npm install -g webmake-ejs

## Usage

When running Webmake, ask webmake to use it:

    $ webmake --ext=ejs program.js bundle.js

Same way when Webmake is used programmatically:

    webmake(inputPath, { ext: 'ejs' }, cb);

webmake-ejs can be used with any other Webmake extension, e.g.:

    $ webmake --ext=ejs --ext=otherext program.js bundle.js

## Programmatically


### test-ejs-file.ejs

```html
<% if (names.length) { %>
<ul>
  <% names.forEach(function(name){ %>
    <li><%= name %></li>
  <% }) %>
</ul>
<% } %>
```

### index.html
Ensure you include a script reference to `ejs.js` or `ejs.min.js`!

```html
<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src="node_modules/ejs/ejs.js"></script>
<body>
<script src="bundle.js"></script>
</body>
</html>
```

### app.js

```javascript
var names = ['loki', 'tobi', 'jane'];
var html = require('./test-ejs-file')({
  'names': names
});
document.body.innerHTML = html;
```

### run it

```sh
webmake --ext=ejs app.js bundle.js
```

### Output
```html
<ul>
    <li>loki</li>
    <li>tobi</li>
    <li>jane</li>
</ul>
```
