 // where files are dropped + file selector is opened
 var  dropRegion = document.getElementById("drop-region"),
    // where images are previewed
  var  imagePreviewRegion = document.getElementById("image-preview");

  // open file selector when clicked on the drop region
var fakeInput = document.createElement("input");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;
dropRegion.addEventListener('click', function() {
    fakeInput.click();
});

fakeInput.addEventListener("change", function() {
    var files = fakeInput.files;
    handleFiles(file);
});

// function preventDefault(e) {
//     e.preventDefault();
//       e.stopPropagation();
// }
 
// dropRegion.addEventListener('dragenter', preventDefault, false);
// dropRegion.addEventListener('dragleave', preventDefault, false);
// dropRegion.addEventListener('dragover', preventDefault, false);
// dropRegion.addEventListener('drop', preventDefault, false);

function handleDrop(e) {
    var dt = e.dataTransfer,
        files = dt.files;

    if (files.length) {

        handleFiles(files);

    } else {

        // check for img
        var html = dt.getData('text/html'),
            match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
            url = match && match[1];



        if (url) {
            uploadImageFromURL(url);
            return;
        }

    }


    function uploadImageFromURL(url) {
        var img = new Image;
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");

        img.onload = function() {
            c.width = this.naturalWidth;     // update canvas size to match image
            c.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);       // draw in image
            c.toBlob(function(blob) {        // get content as PNG blob

                // call our main function
                handleFiles( [blob] );

            }, "image/png");
        };
        img.onerror = function() {
            alert("Error in uploading");
        }
        img.crossOrigin = "";              // if from different origin
        img.src = url;
    }

}

// function handleDrop(e) {
//     var data = e.dataTransfer,
//         files = data.files;

//     handleFiles(files)      
// }

// dropRegion.addEventListener('drop', handleDrop, false);


function handleFiles(files) {
    for (var i = 0, len = files.length; i < len; i++) {
        if (validateImage(files[i]))
            previewAnduploadImage(files[i]);
    }
}

function validateImage(image) {
    // check the type
    var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validTypes.indexOf( image.type ) === -1) {
        alert("Invalid File Type");
        return false;
    }

    // check the size
    var maxSizeInBytes = 10e6; // 10MB
    if (image.size > maxSizeInBytes) {
        alert("File too large");
        return false;
    }

    return true;
}

function previewAnduploadImage(image) {
 
    // container
    var imgView = document.createElement("div");
    imgView.className = "image-view";
    imagePreviewRegion.appendChild(imgView);
 
    // previewing image
    var img = document.createElement("img");
    imgView.appendChild(img);
 
    // progress overlay
    var overlay = document.createElement("div");
    overlay.className = "overlay";
    imgView.appendChild(overlay);
 
 
    // read the image...
    var reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    }
    reader.readAsDataURL(image);
 
    // create FormData
    var formData = new FormData();
    formData.append('image', image);
 
    // upload the image
    var uploadLocation = 'UPLOAD_LOCATION';
 
    var ajax = new XMLHttpRequest();
    ajax.open("POST", uploadLocation, true);
 
    ajax.onreadystatechange = function(e) {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                // done!
            } else {
                // error!
            }
        }
    }
 
    ajax.upload.onprogress = function(e) {
 
        // change progress
        // (reduce the width of overlay)
 
        var perc = (e.loaded / e.total * 100) || 100,
            width = 100 - perc;
 
        overlay.style.width = width;
    }
 
    ajax.send(formData);
 
}

function detectDragDrop() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
}

// change the message
var dragSupported = detectDragDrop();
if (!dragSupported) {
    document.getElementsByClassName("drop-message")[0].innerHTML = 'Click to upload';
}    

dropRegion.addEventListener('dragenter', highlight, false);
dropRegion.addEventListener('dragover', highlight, false);
dropRegion.addEventListener('dragleave', unhighlight, false);
dropRegion.addEventListener('drop', unhighlight, false);

function highlight() {
    dropRegion.classList.add('highlighted');
}
function unhighlight() {
    dropRegion.classList.remove("highlighted");
}