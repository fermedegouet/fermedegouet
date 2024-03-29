PATH := $(shell npm bin):$(PATH)

STATIC=./static
DIST_STATIC=./dist/static
TMP=./dist/tmp

build: npm css js fonts img img-resize site

npm:
	npm install

css: npm
	mkdir -p $(TMP)/css/
	mkdir -p $(DIST_STATIC)/css
	sass $(STATIC)/scss/ferme.scss $(TMP)/css/ferme.css
	csso $(TMP)/css/ferme.css --output $(TMP)/css/ferme.min.css
	cp $(TMP)/css/ferme.min.css $(DIST_STATIC)/css/
	cat \
		node_modules/leaflet/dist/leaflet.css \
		> $(TMP)/css/ferme-map.css
	csso $(TMP)/css/ferme-map.css --output $(TMP)/css/ferme-map.min.css
	cp $(TMP)/css/ferme-map.min.css $(DIST_STATIC)/css/
	cp node_modules/aos/dist/aos.css $(TMP)/css/aos.css
	csso $(TMP)/css/aos.css --output $(DIST_STATIC)/css/aos.min.css

sass-watch:
	sass --watch $(STATIC)/scss/ferme.scss $(DIST_STATIC)/css/ferme.min.css

js: npm
	mkdir -p $(TMP)/js/
	mkdir -p $(DIST_STATIC)/js
	cat \
		node_modules/leaflet/dist/leaflet.js \
		$(STATIC)/js/ferme-map.js \
		> $(TMP)/js/ferme-map.js
	uglifyjs --compress --mangle -o $(TMP)/js/ferme-map.min.js $(TMP)/js/ferme-map.js
	cp $(TMP)/js/ferme-map.min.js $(DIST_STATIC)/js
	uglifyjs --compress --mangle -o $(TMP)/js/ferme-crowdfunding-form.min.js $(STATIC)/js/ferme-crowdfunding-form.js
	cp $(TMP)/js/ferme-crowdfunding-form.min.js $(DIST_STATIC)/js
	cp node_modules/aos/dist/aos.js $(TMP)/js/aos.js
	uglifyjs --compress --mangle -o $(DIST_STATIC)/js/aos.min.js $(TMP)/js/aos.js

fonts:
	mkdir -p $(DIST_STATIC)/fonts
	cp -R node_modules/bootstrap-icons/font/fonts/* $(DIST_STATIC)/fonts/

img:
	mkdir -p $(DIST_STATIC)/img
	cp $(STATIC)/img/* $(DIST_STATIC)/img/
	cp $(STATIC)/favicon.ico $(DIST_STATIC)/
	cp node_modules/leaflet/dist/images/* $(DIST_STATIC)/img/

img-resize:
	for image in $(STATIC)/img/*.jpg ; do \
		convert -resize 768x $$image $$(echo -n $${image%.jpg}_768.jpg | sed -e 's%$(STATIC)%$(DIST_STATIC)%') ; \
		convert -resize 1024x $$image $$(echo -n $${image%.jpg}_1024.jpg | sed -e 's%$(STATIC)%$(DIST_STATIC)%') ; \
		convert -resize 1216x $$image $$(echo -n $${image%.jpg}_1216.jpg | sed -e 's%$(STATIC)%$(DIST_STATIC)%') ; \
		convert -resize 1408x $$image $$(echo -n $${image%.jpg}_1408.jpg | sed -e 's%$(STATIC)%$(DIST_STATIC)%') ; \
	done

site:
	hugo

.PHONY: build
