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
    "uglify-js": "2.2.1",
    "jasmine-node": "1.2.3",
    "jquery": "1.8.3",
    "sinon": "1.5.2",
    "backbone": "0.9.10"
  },
  "scripts": {"test": "./node_modules/jasmine-node/bin/jasmine-node spec"}
}, null, 2));