const express = require('express');

const router = express.Router();

const fs = require('fs'),
    path = require('path');

const routesDir = path.join(__dirname, '/routes/');
const sockets = [];
const ariane = {};
const arianeStr = {};

/**
 * charge toute les pages dans le dossier et sous dossiers /route et avec une extension .js
 * si le fichier contient une fonction route() ou socket(), il les chargeras.
 * si il contient une seule methode, il la chargera comme route();
 * genere aussi tout les fils d'ariane
 */
async function routing() {

    for (const file of await getFiles(routesDir)) {
        let imp = await require(`./routes/${file}`);
        try {
            if (imp.route) {
                imp.route(router);
            }
            else {
                imp(router);
            }
        } catch (e) { console.log("Impossible de charger la route " + file); }
        if (imp.socket) {
            sockets.push(imp.socket);
        }
        let path1 = router.stack[router.stack.length - 1].route.path;
        path1 = path1.substring(1).split("/:", 1)[0].split("&:")[0];
        if (imp.breadcrumb) {
            if (Array.isArray(imp.breadcrumb))
                for (m in imp.breadcrumb) {
                    retrieveAriane(imp.breadcrumb[m], path1);
                }
            else
                retrieveAriane(imp.breadcrumb, path1);
        }
        else {
            generateAriane(file, path1);
        }
    }
}


//genere un fil d'ariane hierarchique automatiquement basé sur les sous dossiers
function generateAriane(file, path1) {
    let bread = file.substring(0, file.length - 3).split('/');
    arianeStr[path1] = file.substring(0, file.length - 3);
    let pathb = [];
    for (k in bread) {
        pathb.push(bread[k])
        let index = ariane;
        for (l in pathb) {
            if (!index[pathb[l]]) {
                if (parseInt(k) === (bread.length - 1))
                    index[pathb[l]] = { name: formatName(path1), url: path1, childs: {} };
                else if (!index[pathb[l]]) {
                    index[pathb[l]] = { name: formatName(pathb[l]), url: pathb[l], childs: {} };
                    console.log(pathb[l] + ": fils generer automatiquement (penser a l'assigner manuellement)");
                }
            }
            index = index[pathb[l]].childs;
        }
    }
}

//override un fils manuellement
function retrieveAriane(breadobj, path1) {
    let index = ariane;
    if (breadobj.parentPath) {
        arianeStr[path1] = breadobj.parentPath + "/" + breadobj.target;
        let parents = breadobj.parentPath.split('/');
        let pathb = [];
        for (k in parents) {
            pathb.push(parents[k])
            for (l in pathb) {
                if (!index[pathb[l]])
                    index[pathb[l]] = { name: formatName(pathb[l]), url: pathb[l], childs: {} };
                index = index[pathb[l]].childs;
            }
        }
    }
    else
        arianeStr[path1] = breadobj.target;
    if (!index[breadobj.target])
        index[breadobj.target] = {};
    if (breadobj.name)
        index[breadobj.target].name = formatName(breadobj.name);
    if (breadobj.url)
        index[breadobj.target].url = breadobj.url;
}
function formatName(str) {
    return str.replace(/_/g, " ").replace(/-/g, " ").toLowerCase()
        .split(' ')
        .map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
}
function getAriane(url) {
    res = [{ name: 'Acceuil', url: 'acceuil' }];
    if (arianeStr[url]) {
        let parts = arianeStr[url].split('/');
        let index = ariane;
        for (k in parts) {
            if (index[parts[k]]) {
                res.push({ name: index[parts[k]].name, url: index[parts[k]].url });
                index = index[parts[k]].childs;
            }
        }
    }
    return res;
}
const { resolve } = require('path');
const { readdir } = require('fs').promises;

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory())
            return getFiles(res);
        if (dirent.name.endsWith('.js')) {
            return res.substring(res.indexOf('\\routes\\') + '\\routes\\'.length).replace('\\', '/');
        }
        return null;
    }));
    return Array.prototype.concat(...files);
}
module.exports = { router: router, sockets: sockets, routing: routing, getAriane: getAriane };