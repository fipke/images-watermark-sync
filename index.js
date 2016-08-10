var fs = require('fs'),
	gm = require('gm'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	chokidar = require('chokidar');

var inputDir = 'images/'
var outputDir = 'output/'
var logo_source = 'watermarks/wb2.png';

var watcher = chokidar.watch(inputDir, {
	ignored: /[\/\\]\./,
	persistent: true,
	ignoreInitial: true
});


// Something to use when events are received. 
var log = console.log.bind(console);
// Add event listeners. 
watcher
	.on('add', function(path) {
		addWatermark(path);
		log(`File ${path} has been added`);
	})
	.on('change', function(path) {
		addWatermark(path);
		log(`File ${path} has been changed`);
	})
	.on('ready', function() {
		walk(inputDir, function(path){
			addWatermark(path);
		});
		log(`Initial scan complete. Ready for changes`);
	})
	.on('unlink', function(path) {
		deleteFile(path);
		log(`File ${path} has been removed`);
	});

// More possible events. 
// watcher
//   .on('addDir', path => log(`Directory ${path} has been added`))
//   .on('unlinkDir', path => log(`Directory ${path} has been removed`))
//   .on('error', error => log(`Watcher error: ${error}`))
//   .on('ready', () => log('Initial scan complete. Ready for changes'))
//   .on('raw', (event, path, details) => {
//     log('Raw event info:', event, path, details);
//   });

function deleteFile(filePath) {
	var outputfile = path.join(outputDir, filePath);
	fs.unlink(outputfile, function(err) {
		if (err) {
			return console.error(err);
		}
		console.log("File deleted successfully!");
	});
}

function fileExist(filePath){
	if(fs.existsSync(filePath))
	{
		return true;
	}
	return false;
}


function walk(currentDirPath, callback) {
	var fs = require('fs'),
		path = require('path');
	fs.readdirSync(currentDirPath).forEach(function(name) {
		var filePath = path.join(currentDirPath, name);
		var stat = fs.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat);
		} else if (stat.isDirectory()) {
			walk(filePath, callback);
		}
	});
}

function addWatermark(filePath) {
	// console.log('base:'+JSON.stringify(path.parse(filePath)));

	var outputfile = path.join(outputDir, filePath);
	console.log('outputFile:' + outputfile);
	gm(filePath).size(function(err, size) {
		var height, percentage, readStream, width;
		if (err != null) {
			return err;
		}
		percentage = 1;
		width = Math.round(size.width * percentage);
		height = Math.round(size.height * percentage);
		readStream = fs.createReadStream(path.join(logo_source));
		return gm(readStream)
			.background('transparent')
			.gravity('Center')
			.resize(width, height)
			.extent(size.width, size.height)
			.toBuffer(function(err, buffer) {

				if (err != null) {
					return err;
				}
				mkdirp(path.dirname(outputfile));
				return gm(buffer)["in"](filePath)
					.out('-gravity', 'Center')
					.mosaic()
					.write(outputfile, function(err) {
						if (err != null) {
							return err;
						}
						return;
					});
			});
	});
}