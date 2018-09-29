PATH := $(shell npm bin):$(PATH)

STATIC=./static
DIST_STATIC=./dist/static
TMP=./dist/tmp

build: npm css js fonts img site

npm:
	npm install

css: npm
	mkdir -p $(TMP)/css/
	mkdir -p $(DIST_STATIC)/css
	node-sass $(STATIC)/scss/ferme.scss $(TMP)/css/ferme.css
	csso $(TMP)/css/ferme.css --output $(TMP)/css/ferme.min.css
	cp $(TMP)/css/ferme.min.css $(DIST_STATIC)/css/
	cat \
		node_modules/leaflet/dist/leaflet.css \
		> $(TMP)/css/ferme-map.css
	csso $(TMP)/css/ferme-map.css --output $(TMP)/css/ferme-map.min.css
	cp $(TMP)/css/ferme-map.min.css $(DIST_STATIC)/css/

js: npm
	mkdir -p $(TMP)/js/
	mkdir -p $(DIST_STATIC)/js
	cat \
		node_modules/leaflet/dist/leaflet.js \
		$(STATIC)/js/ferme-map.js \
		> $(TMP)/js/ferme-map.js
	uglifyjs --compress --mangle -o $(TMP)/js/ferme-map.min.js $(TMP)/js/ferme-map.js
	cp $(TMP)/js/ferme-map.min.js $(DIST_STATIC)/js
	uglifyjs --compress --mangle -o $(TMP)/js/ferme-countdown.min.js $(STATIC)/js/ferme-countdown.js
	cp $(TMP)/js/ferme-countdown.min.js $(DIST_STATIC)/js

fonts:
	mkdir -p $(DIST_STATIC)/fonts
	cp -R $(STATIC)/fonts/* $(DIST_STATIC)/fonts/
	cp -R node_modules/@fortawesome/fontawesome-free/webfonts/* $(DIST_STATIC)/fonts/

img:
	mkdir -p $(DIST_STATIC)/img
	cp $(STATIC)/img/* $(DIST_STATIC)/img/
	cp $(STATIC)/favicon.ico $(DIST_STATIC)/
	cp node_modules/leaflet/dist/images/* $(DIST_STATIC)/img/

site:
	hugo

.PHONY: build
