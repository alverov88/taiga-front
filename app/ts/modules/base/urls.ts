/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: modules/base/http.coffee
 */

import {Service} from "../../../ts/classes"
import * as angular from "angular"
import * as _ from "lodash"

let format = function(fmt, obj) {
    obj = _.clone(obj);
    return fmt.replace(/%s/g, match => String(obj.shift()));
};

class UrlsService extends Service {
    config:any
    urls:any
    mainUrl:any

    static initClass() {
        this.$inject = ["$tgConfig"];
    }

    constructor(config) {
        super()
        this.config = config;
        this.urls = {};
        this.mainUrl = this.config.get("api");
    }

    update(urls) {
        return this.urls = _.merge(this.urls, urls);
    }

    resolve() {
        let args = _.toArray(arguments);

        if (args.length === 0) {
            throw Error("wrong arguments to setUrls");
        }

        let name = args.slice(0, 1)[0];
        let url = format(this.urls[name], args.slice(1));

        return format("%s/%s", [
            _.trimEnd(this.mainUrl, "/"),
            _.trimStart(url, "/")
        ]);
    }

    resolveAbsolute() {
        let url = this.resolve.apply(this, arguments);
        if ((/^https?:\/\//i).test(url)) {
            return url;
        }
        if ((/^\//).test(url)) {
            return `${window.location.protocol}//${window.location.host}${url}`;
        }
        return `${window.location.protocol}//${window.location.host}/${url}`;
    }
}
UrlsService.initClass();


let module = angular.module("taigaBase");
module.service('$tgUrls', UrlsService);
