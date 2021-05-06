
    var isUploadingFiles = false;
    var isWaitingToSend = false;
    var base64Files = [];
    function sendToServerPre() {
        if (isUploadingFiles) {
            isWaitingToSend = true;
            iziToast.warning({
                title: "Attention :",
                message: `Des fichiers sont en cours d'envois, ils seront transmis une fois les fichiers chargés`
            });
        }
        else {
            if (base64Files.length == 0) {
                iziToast.warning({
                    title: "Attention :",
                    message: `Vous n'avez chargé aucun fichiers`
                });
                return;
            }
            sendFiles(base64Files);
            changeAttachedFiles([]);
        }
    }
    function sendFiles(files) {
        let text = $('[name="upload_label"]');
        text.each((index, el) => {
            if (!el.value || el.value.length < 1) {
                el.value = el.placeholder;
            }
            let index1 = parseInt(el.id.replace("upload_label", ""));
            if (files[index1])
                files[index1].name = el.value;
        });
        socket.emit('manager.sendFiles', files);
    }
    const fileInput = document.getElementById("fileupload");
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 20) {
            e.target.value = null;
            iziToast.error({
                title: "Erreur :",
                message: `Nombre maximal de fichiers : 20`
            });
            return;
        }
        let size = 0;
        for (x in e.target.files) {
            if (e.target.files[x].name != "item" && typeof e.target.files[x].name != "undefined") {
                size += parseInt(((e.target.files[x].size / 1024) / 1024).toFixed(4)); // MB
            }
        }
        if (size >= 100) {
            e.target.value = null;
            iziToast.error({
                title: "Erreur :",
                message: `Taille maximal des fichiers dépassés :100 Mo`
            });
            return;
        }
        changeAttachedFiles(e.target.files);
        let count = e.target.files.length;
        isUploadingFiles = true;
        var filesTemp = [];
        base64Files = [];
        for (k in e.target.files) {
            if (typeof e.target.files[k] == "object") {
                const reader = new FileReader();
                reader.position = k;
                reader.onloadend = function (er) {
                    base64Files[er.target.position].data = reader.result;
                    if (base64Files.length == e.target.files.length) {
                        isUploadingFiles = false;
                        if (isWaitingToSend) {
                            isWaitingToSend = false;
                            sendFiles(base64Files);
                            changeAttachedFiles([]);
                            base64Files = [];
                        }
                        //socket.emit('messagerie.upload_file' , { based: reader.result , id: "" });
                    }
                }
                var parts = e.target.files[k].name.split('.');

                var extension = parts[parts.length - 1].toLowerCase();
                var name = "";
                for (l = 0; l < parts.length - 2; l++) {
                    name += "." + parts[l];
                }
                name = name.substring(1, name.length);
                if (name != 'item' && extension != 'item') {
                    base64Files[k] = { ext: extension, name: name };
                    reader.readAsArrayBuffer(e.target.files[k]);
                }
            }
        }
    });

    function changeAttachedFiles(fileobj) {
        let div = document.getElementById("attachedFilesDiv");
        div.innerHTML = "";
        for (const k in fileobj) {
            if (typeof fileobj[k] == "object") {
                var parts = fileobj[k].name.split('.');

                var name = "";
                for (l = 0; l < parts.length - 1; l++) {
                    name += "." + parts[l];
                }
                name = name.substring(1, name.length);
                div.innerHTML += '<i class="far fa-file-audio fa-2x" title="' + fileobj[k].name + '"></i>' + '<label > Nom</label><input id="upload_label' + k + '" name="upload_label" type="text" placeholder="' +name + '"><br><br>';
            }

        }
    }