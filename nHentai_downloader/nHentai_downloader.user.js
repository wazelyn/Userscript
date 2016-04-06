// ==UserScript==
// @name         nHentai Downloader
// @namespace    http://devs.forumvi.com
// @description  Download manga on nHentai.net
// @version      1.1.3
// @icon         http://i.imgur.com/FAsQ4vZ.png
// @author       Zzbaivong
// @match        http://nhentai.net/g/*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @require      https://openuserjs.org/src/libs/baivong/jszip.min.js
// @require      https://openuserjs.org/src/libs/baivong/FileSaver.min.js
// @connect      nhentai.net
// @supportURL   https://github.com/baivong/Userscript/issues
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// ==/UserScript==

jQuery(function($) {
    'use strict';

    function deferredAddZip(i, filename) {
        var deferred = $.Deferred();

        GM_xmlhttpRequest({
            method: 'GET',
            url: images[i],
            responseType: 'arraybuffer',
            onload: function(response) {
                zip.file(filename, response.response);
                $download.html('<i class="fa fa-cog fa-spin"></i> ' + (++current) + '/' + total);
                deferred.resolve(response);
            },
            onerror: function(err) {
                console.error(err);
                deferred.reject(err);
            }
        });

        return deferred;
    }

    var zip = new JSZip(),
        prevZip = false,
        deferreds = [],
        current = 0,
        total = 0,
        images = [],
        $download = $('#download'),
        doc = document,
        tit = doc.title;

    window.URL = window.URL || window.webkitURL;

    $download.one('click', function(e) {
        e.preventDefault();

        $download.attr('href', '#download');

        $(window).on('beforeunload', function() {
            return 'Progress is running...';
        });

        $download.html('<i class="fa fa-cog fa-spin"></i> Waiting...').css('backgroundColor', 'orange');

        $('.lazyload').each(function(i, v) {
<<<<<<< HEAD:nHentai_downloader/nHentai_downloader.user.js
            images[i] = 'http:' + $(v).attr('data-src').replace('t.n', 'i.n').replace(/\/(\d+)t\./, '/$1.');
=======
            images[i] = 'http:' + $(this).attr('data-src').replace('t.n', 'i.n').replace(/\/(\d+)t\./, '/$1.');
>>>>>>> master:nHentai_downloader.user.js
        });

        total = images.length;

        $.each(images, function(i, v) {
            var filename = v.replace(/.*\//g, '');

            deferreds.push(deferredAddZip(i, filename));
        });

        $.when.apply($, deferreds).done(function() {
            var blob = zip.generate({
                    type: 'blob'
                }),
                zipName = tit.split(' » ')[0].replace(/\s/g, '_') + '.zip';

            if (prevZip) {
                window.URL.revokeObjectURL(prevZip);
            }
            prevZip = blob;

            $download.html('<i class="fa fa-check"></i> Complete').css('backgroundColor', 'green').attr({
                href: window.URL.createObjectURL(prevZip),
                download: zipName
            });

            saveAs(blob, zipName);

            doc.title = '[⇓] ' + tit;

        }).fail(function(err) {
            $download.html('<i class="fa fa-exclamation"></i> Fail').css('backgroundColor', 'red');
            console.error(err);
        }).always(function() {
            $(window).off('beforeunload');
        });

    });

});