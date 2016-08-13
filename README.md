# images-watermark-sync
Sync images and add Watermark

Project watches for modifications in source Directory, and updates the Images in target Directory

##Tecnologies
* [Nodejs](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Chokidar](https://github.com/paulmillr/chokidar) - file watcher for node.js
* [GraphicsMagick](http://www.graphicsmagick.org/) - GraphicsMagick is the swiss army knife of image processing

##Project Structure
```
├── images ##Source Directory (Project watches this Folder)
│   └── image1.jpg
├── index.js
├── output ##Targed Directory
│   └── images
│       └── image1.jpg
├── package.json
└── watermarks
    └── fpk.png
```
