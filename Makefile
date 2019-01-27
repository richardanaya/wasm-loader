everything: setup generate_webidl lint build minify build_examples
build:
	./node_modules/.bin/rollup src/webidl-loader.js --file webidl-loader.js --format umd --name webidlLoader
build_examples:
	cd examples && ../node_modules/.bin/poetry helloworld.poem -b helloworld.wasm
	cd examples && ../node_modules/.bin/poetry alert.poem -b alert.wasm
setup:
	npm install
generate_webidl:
	node tools/generate_webidl.js Console.webidl Window.webidl Document.webidl HTMLElement.webidl Node.webidl Element.webidl HTMLCanvasElement.webidl
lint:
	./node_modules/.bin/prettier --write src/webidl-loader.js src/webidl.js tools/generate_webidl.js
minify:
	./node_modules/.bin/babel-minify webidl-loader.js -o webidl-loader.min.js
publish:
	npm publish
