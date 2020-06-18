/* 
 * original dropzone design by pinceladasdaweb (https://github.com/pinceladasdaweb/imgur-upload),
 * trimmed down massively to only support one dropzone and one file, and without imgur uploading
 */

var callback = null;

function setDropzoneCallback(cb) {
    callback = cb;
}

var last_target = null;
function registerDragzoneListeners(zone) {
    var events = ['dragenter', 'dragleave', 'dragover', 'drop'];

    events.map(function(event) {
        window.addEventListener(event, function(e) {
            e = e || window.event;
            if (event === 'dragleave' || event === 'drop') {
                // only register drag leave when leaving the document
                if (e.target === last_target || e.target === document) {
                    zone.classList.remove('dropzone-dragging');
                }
            } else {
                last_target = e.target;
                zone.classList.add('dropzone-dragging');
            }
            if (event === 'drop') {
                if (e.preventDefault) {  // don't redirect to the image
                    e.preventDefault();
                }
                let files = e.dataTransfer.files;
                if (callback && files.length > 0) {
                    callback(files[0]);  // single file only
                }
            }
        }, false);
    });
}

function createEls(name, props, text) {
    var el = document.createElement(name), p;
    for (p in props) {
        if (props.hasOwnProperty(p)) {
            el[p] = props[p];
        }
    }
    if (text) {
        el.appendChild(document.createTextNode(text));
    }
    return el;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
        
var zone = document.querySelector('.dropzone')

zone.appendChild(createEls('p', {}, 'Drag, paste or select your image.'));
zone.appendChild(createEls('input', {type: 'file', multiple: 'multiple', accept: 'image/*'}));
//this.insertAfter(zone, createEls('div', {className: 'status'}))

registerDragzoneListeners(zone);

document.onpaste = function(event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            if (callback)
                callback(item.getAsFile());
            break;  // single file only
        }
    }
}
    
