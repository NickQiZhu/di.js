require("./core");

require("util").puts(JSON.stringify({
  "name": "di-lite",
  "version": di.version,
  "description": "A ultra light-weight dependency injection container in Javascript ",
  "keywords": ["di", "ioc", "ioc container", "dependency management", "dependency injection", "di container"],
  "homepage": "http://nickqizhu.github.com/di.js/",
  "author": {"name": "Nick Zhu", "url": "http://nzhu.blogspot.ca/"},
  "repository": {"type": "git", "url": "https://github.com/NickQiZhu/di.js.git"},
  "dependencies": {
  },
  "devDependencies": {
    "uglify-js": "2.x",
    "jasmine-node": "1.x",
    "jquery": "1.x",
    "sinon": "1.x",
    "backbone": "0.9.x"
  },
  "scripts": {"test": "./node_modules/jasmine-node/bin/jasmine-node spec"}
}, null, 2));