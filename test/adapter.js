document.body.innerHTML += [
  '<div id="qunit-fixture">',
    '<div id="testElement">',
      '<h1>Test</h1>',
    '</div>',
  '</div>',

  '<script type="text/template" id="dom-template">',
    'This template lives in the <b>DOM</b>',
  '</script>',

  '<script type="text/template" id="test">',
    'Sample template.',
  '</script>',

  '<div id="container" style="display:none"></div>',

  '<div id="prefilled" style="display:none">',
    '<span class="test"></span>',
  '</div>'
].join('\n');
