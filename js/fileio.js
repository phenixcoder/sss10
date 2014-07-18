function loadJsonFile(fileUri, callback) {
    console.log("loadFile: " +  fileUri);
    
    $.ajax({
        url: fileUri,
        type: "GET",
        dataType: "json",
        async: false,
        success: function(data) {
            callback(data);
        }
    });
}

/*
todo: incomplete and buggy

function writeFile(fileUri, data, callback)
{
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getFile(fileUri, {create: true, exclusive: false}, function(fe) {
            fe.createWriter(function(writer) {
                writer.onwriteend = function(evt) {
                    callback();
                    console.log("wrote file " + evt);
                };

                writer.write(data);
            }, failed);
        }, failed);
    }, failed);
}

function readFile(fileUri, callback) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getFile(fileUri, null, function(fe){
            fe.file(function(file) {
                var reader = new FileReader();
                reader.onload = function(evt)
                {
                    console.log('onload');
                    callback(evt.target.result);         
                };

                reader.onerror = function(evt)
                {
                    console.log('fail');
                    console.log(evt.target);
                };

                reader.readAsText(fileUri);
            }, failed);
        }, failed);
    }, failed);
}

function failed(error) {
    console.log(error.code);
}
*/