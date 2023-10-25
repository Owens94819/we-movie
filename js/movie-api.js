
try {
    


(function (self) {
   
    
    /**@test */
    var api = 'http://localhost:1234/v1/'
    api = "https://we-movies-3qlw.onrender.com/v1/"

    var MovieTypes = [{ name: "Bollywood" }, { name: "Hollywood" }, { name: "DHollywood" }]

    function joinUrl(pr, ch) {
        pr = pr.trim()
        ch = ch.trim()
        return pr.replace(/\/$|$/, ch.replace(/^\/|^/, '/'))
    }

    function resolver(req, obj, prop, foo) {
        return new Promise(function (res, rej) {
            var calls = []
            for (var key in prop) {
                (obj[key] = function () {
                    var key = arguments.callee.key
                    var cb = prop[key]
                    var val;
                    if (cb instanceof Array) {
                        val = cb[0](req, cb[1])
                        cb = cb[1]
                    } else {
                        var arg = arguments
                        val = new Promise(function (res) {
                            calls.push({ key: key, arguments: arg, callback: cb, r: res })
                        })
                    }
                    return val
                }).key = key
            }

            req = req
                .then(foo)
                .then(res)
            req.then(function (e) {
                for (var key in prop) {
                    var callback = prop[key]
                    if ("function" === typeof callback) {
                        obj[key] = prop[key]
                    } else if (callback instanceof Array) {
                        obj[key] = prop[key][1]
                    }
                }
                prop = void 0;

                for (var i = 0; i < calls.length; i++) {
                    var arg = calls[i].arguments
                    var key = calls[i].key
                    var val = calls[i].val
                    var callback = calls[i].callback
                    calls[i].r(callback(arg[0], arg[1], arg[2]))
                }
                calls = void 0;
            });
        })
    }

    function List(req) {
        function pg(name, opt) {
            return function (req, cb) {
                req = req
                    .then(function (e) {
                        var req = list[name]
                        if (req) {
                            req = fetch(req, opt)
                            return req;
                        }
                        return new Promise(function (r, j) { j("@List." + name + "\n null") })
                    });
                return new List(req)
            }
        }
        var obj = {}
        var list;
        obj.first = [pg('first'), function () {
            var req = list.first
            req = fetch(req)
            var req = new List(req)
            return req
        }]
        obj.last = [pg('last'), function () {
            var req = list.last
            req = fetch(req)
            var req = new List(req)
            return req
        }]

        obj.next = [pg('next'), function () {
            var req = list.next
            req = fetch(req)
            var req = new List(req)
            return req
        }]
        obj.previous = [pg('prev'), function () {
            var req = list.prev
            req = fetch(req)
            var req = new List(req)
            return req
        }]

        obj.get = function (index) {
            return new Promise(function (r) {
                r(new Item(list.data[index]))
            })
        }

        obj.getAll = obj.forEach = function (foo) {
            return new Promise(function (r) {
                if ('function' === typeof foo) {
                    for (var i = 0; i < list.data.length; i++) {
                        foo(new Item(list.data[i]), i)
                    }
                }
                r(list.data)
            })
        }

        obj.current_pagination = function () {
            return new Promise(function (res) {
                res(list.pg_current)
            })
        }
        obj.pagination_size = function () {
            return new Promise(function (res) {
                res(list.pg_length)
            })
        }

        obj.length = function () {
            return new Promise(function (res) {
                res(list.length)
            })
        }

        resolver(req, this, obj, function (e) {
            return e.json().then(function (res) {
                /***@test */
                /**res['next'] = 'http://localhost:1234/v1/list'**/
                !list && (list = res)
            })
        })
    }

    function Item(e, info) {
        // var more=e['more-info']
        var more = joinUrl(api, 'info/' + e.id)

        /***@test */
        /**  more = 'http://localhost:1234/v1/info'**/
        /** */

        more = more + '?plain=true'
        // var info;
        var low;
        var md
        var hd
        var recommended
        var rating;
        this.year = e.year || new Date(e.datePublished).getFullYear()
        this.imdbProfile = e.meta['imdb-profile'] || ""
        this.description = e.description || e.plot
        this.imageThumb = e['image-thumb'] || ""
        this.imdbTitle = e['imdb-title'] || ""
        this.title = e.title || ""
        this.image = e.image || ""
        this.type = e.type || ""
        this.id = e.id || ""


        // new Promise(function (r) {
        //     var v = info.downloads
        //     r(new Downloads(v, e))
        // })
        // function pg(name, opt) {
        //     return function (req, cb) {
        //         req = req
        //             .then(function (e) {
        //                 var req = list[name]
        //                 if (req) {
        //                     req = fetch(req, opt)
        //                     return req;
        //                 }
        //                 return new Promise(function (r, j) { j("@List." + name + "\n null") })
        //             });
        //         return new List(req)
        //     }
        // }
        function getter(name) {
            return function () {
                return new Promise(function (r) {
                    r(info[name])
                })
            }
        }
        var obj;
        info && (obj = this) || (obj = {});

            obj.getName = getter("name"),
            obj.getImdbRating = function () {
                var url = info['imdb-rating']
                return new Promise(function (r) {
                    /*if (rating) {
                        r(rating)
                        return
                    }*/
                    fetch(url).then(function (e) {
                        return e.json()
                    }).then(function (e) {
                        r(/*rating=*/e)
                    });
                })
            },
            obj.getRuntime = getter("runtime"),
            obj.getTrailer = getter("trailer"),
            obj.getTrailerHtml = getter("trailerHTML"),
            obj.getGenres = getter("genre"),
            obj.getTags = getter("tags"),
            obj.getPlot = getter("plot"),
            obj.getDirectors = getter("directors"),
            obj.getDateModified = getter("dateModified"),
            obj.getDatePublished = getter("datePublished"),
            obj.getRecommendations = function (foo) {
                var recs = info.recommended;
                return new Promise(function (r) {
                    if (recommended) {
                        r(new Recommendations(recommended, void 0, foo))
                    } else {
                        r(recommended = new Recommendations(recs, true, foo))
                    }
                })
            }
            obj.getJson = function () {
                return new Promise(function (r) {
                    r(info)
                })
            }

           !info && resolver(fetch(more), this, obj, function (e) {
            return e.json().then(function (res) {
                !info && (info = res)
            })
          })

        this.downloads = {
            getLowQuality: null,
            getStandardQuality: null,
            getHdQuality: null,
        }

        function res(name, i) {
            return function (e) {
                return e.json().then(function (res) {
                    eval("!" + name + " && (" + name + " = res[0].files[i]," + name + ".id1=i)");
                })
            }
        }
        function prop(name) {
            return function () {
                return new Promise(function (r) {
                    eval("r(new Source("+name+", e))")
                })
            }
        }

        /***@test */
        resolver(/**fetch(joinUrl(api, 'downloads/info/low')) ||**/ fetch(joinUrl(api, "info/downloads/low/" + e.id)), this.downloads, { getLowQuality: prop("low") }, res('low', 0))

        var hdReq = /**new Promise(e => { }) ||**/ fetch(joinUrl(api, "info/downloads/hd/" + e.id))
        resolver(hdReq, this.downloads, { getStandardQuality: prop("md") }, res('md', 0))
        resolver(hdReq, this.downloads, { getHdQuality: prop("hd") }, res('hd', 1))

        /***@TODO
         * @this.tags
         * @this.meta
         * @this.ratings
         */
        // this.trailerHTML = e.trailerHTML
        // this.trailer = e.trailer
        // console.log(e);
    }

    function Recommendations(recs, arr, foo) {
        this.__proto__ = []
        if (arr) {
            for (var i = 0; i < recs.length; i++) {
                var rec = recs[i]
                rec.getInfo = function () {
                    return new Promise(function (r) {
                        fetch(joinUrl(api, 'info/' + rec.id + '?plain=true'))
                            .then(function (e) {
                                e.json().then(function (info) {
                                    r(new Item(info, info))
                                })
                            })
                    })
                };

                'function' === typeof foo && foo(rec, i)
                this.push(rec)
            }
        } else {
            for (var i = 0; i < recs.length; i++) {
                var rec = recs[i]
                'function' === typeof foo && foo(rec, i)
                this.push(rec)
            }
        }
    }

    function Source(v, info) {
        this.__proto__ = []
        for (var i2 = 0; i2 < v.length; i2++) {
            var l = v[i2]// hits:100,
            l.id1 = v.id1
            l.id2 = i2
            this.push(new File(l, info))
        }
    }

    function File(v, info) {
        this.size = v.size
        this.name = v.name
        this.tag = v.tag
        var source;
        var sources;

        // console.log(info.id, v.id1, v.id2);

        /**@test */
        resolver(/**fetch(joinUrl(api, '/download/sources')) ||**/ fetch(v.src), this, {
            getSources: function () {
                return new Promise(function (r) {
                    r(new FileSources(sources))
                })
            }
        }, function (e) {
            return e.json().then(function (res) {
                sources = res
            })
        });

        /***@test */
        resolver(/**fetch(joinUrl(api, '/download/source')) ||**/ fetch(joinUrl(api, 'download/direct/source/' + v.id1 + '/' + v.id2 + '/' + info.id)), this, {
            getSource: function () {
                return new Promise(function (r) {
                    r(source)
                })
            }
        }, function (e) {
            return e.json().then(function (res) {
                source = res
            })
        })
    }

    function FileSources(obj) {
        this.__proto__ = []
        this.name = obj.name;
        this.size = obj.size;
        for (var i = 0; i < obj.links.length; i++) {
            var source = obj.links[i];
            this.push(source);
            (function (source) {
                var src;
                var alt = source.alternative_link;
                delete source.alternative_link
                /***@test */
                resolver(/**fetch(joinUrl(api, '/download/source')) ||**/ fetch(alt), source, {
                    getAlternativeSources: function () {
                        return new Promise(function (r) {
                            r(src)
                        })
                    }
                }, function (e) {
                    return e.json().then(function (res) {
                        src = res
                    })
                })
            })(source)
        }
    }

    function MovieApi(CatID) {
        (!arguments.length||typeof catID !== "number") && (CatID = 2);
        var CatName = MovieTypes[CatID - 1];
        function search(by) {
            return function (name) {
                var req = joinUrl(api, "movies/search?searchname=" + encodeURIComponent(name) + "&id=" + CatName + "&by=" + by)
                req = fetch(req)
                //   req.catch(function (e) {
                //       console.error(e)
                //   })
                return new List(req)
            }
        }

        function paramSearch(type) {
            return function (name) {
                var req = joinUrl(api, "movies/search/" + type + "/" + encodeURIComponent(v))
                req = fetch(req)
                return new List(req)
            }
        }

        this.api = api
        this.getList = function (id) {
            id=encodeURIComponent(id);
            var req = joinUrl(api, "info/" + id)
            req = fetch(req)
            return new List(req)
        }
        this.getById = function (arguments) {
            var req = joinUrl(api, "movies/list?pg=1&by=date&catID=" + CatID)
            req = fetch(req)
            return req
            .then(function(e) { return e.json()})
            .then(function(e) { return new Item(e,e)});
        }

        // this.searchByName = search("Name")
        this.searchByDirector = search("Director")
        this.searchByStarcast = search("Starcast")

        this.searchByTitle = this.searchByMovieTitle = this.searchByName = this.searchByMovieName = paramSearch('Name')

        this.searchByTag = paramSearch('tag')
        this.searchByGenre = paramSearch('genre')
        this.searchByYear = paramSearch('year')
        this.searchByAlpha = function (from, to) {
            !from&&(from="a")
            !to&&(to="a")
            return paramSearch('alpha')(from + 'to' + to)
        }
    }

    MovieApi.BOLLY = 1;
    MovieApi.HOLLY = 2;
    MovieApi.DHOLLY = 3;

    self.MovieApi =
        self.FZMovieApi =
        self.FZMovie =
        self.Movie =
        MovieApi;
})(this);

} catch (e) {
alert(e)
}
