
routes=document.querySelectorAll("template[path]");
_atob= atob;
_btoa= btoa;
btoa = function () {
    return _btoa(encodeURIComponent(arguments[0]))
}
atob = function () {
    return decodeURIComponent(_atob(arguments[0]))
}

function href(e) {
    location.href='./#/'+e
}
function per(v, n = 0) {
    if (v instanceof Array) {
        return [v[0] + n, v[1]]
    }
    var s = v.split(/([0-9\.]+)/i)
    s.shift();
    v = +s[0]
    s = (s[1] || "").trim().toLowerCase()
    return [v + n, s]
}
function gw(w, minW) {
    w = per(w)
    minW = per(minW)
    if (w[0] >= minW[0]) {
        return w
    }
    return minW
}
function m(value, max, main) {
    main = main || 100;
    max = max == 0 ? value : max;
    var y = max;
    var x = value;
    var x = x * main,
        x = x / y;
    return x > main ? main : x;
}

function pgInit(res) {
    window.MOVIE_LISTS = res
    pg = document.querySelector('div.pg')
    pg.set = function (p = 0, test) {
        if (typeof p !== "number") {
            p = 0
        }
        if (p > this.max) {
            p = this.max
        }
        if (1 > p) {
            p = 1
        }
        !test && (this.cr = p)

        // console.log(m);

        p = m(p, this.max, 100)
        !test && (this.text.innerText = `${this.cr} of ${this.max}`) || (this.text.innerText = ``)
        this.range.style.width = `${p}%`
        // console.log(p);
    }

    pg.range = pg.querySelector('.bar')
    pg.wrapper = pg.querySelector('.pgwp')
    pg.text = pg.range.querySelector('.progress')
    pg.max = res.pg_length
    var cr = res.pg_current
    // cr = 30
    pg.cr = cr
    // console.log(cr);
    pg.set(cr)
}
function pgR() {
    if (MOVIE_LISTS.next) {
        location.href = "./#/movies?" + btoa(MOVIE_LISTS.next)
    }
return
    //console.log(xjs);
    pg.wrapper.style.pointerEvents = 'none'
    var w = pg.range.offsetWidth + "px"
    pg.range.style.width = '100%'
    setTimeout(function () {
        pg.range.style.width = w
        setTimeout(function () {
            pg.set(pg.cr += 1)
            setTimeout(function () {
                pg.wrapper.style.pointerEvents = ''
            }, 300)
        }, 300)
    }, 300)
}
function pgL() {
    if(MOVIE_LISTS.prev) {
        location.href = "./#/movies?" + btoa(MOVIE_LISTS.prev)
    }
    var m = pg.range.style.minWidth
    var rw = gw(pg.range.style.width, m)
    var w = per(rw).join("")
    var w1 = per(rw, 2).join("")
    // console.log(w,w1);
    var w1 = "60%"
    pg.range.style.minWidth = "0"
    pg.range.style.width = '20%'
    pg.wrapper.style.pointerEvents = 'none'
    // pg.text.style.pointerEvents = 'none'
    // pg.text.style.opacity="0"
    setTimeout(function () {
        // pg.text.style.opacity = ""
        // pg.text.style.pointerEvents = ""
        pg.range.style.width = w1
        setTimeout(function () {
            pg.range.style.width = w
            setTimeout(function () {
                pg.set(pg.cr -= 1)
                pg.range.style.minWidth = m
                setTimeout(function () {
                    pg.wrapper.style.pointerEvents = ''
                }, 100)
            }, 300)
        }, 300)
    }, 300)
}
function search(node) {
    var v = node.value.trim()
    if(!v) return
var p=node.parentNode
    p.classList.add('loading')
    href('movies?' + btoa(api_url(`/movies/search/name/`+encodeURIComponent(v))))
    setTimeout(function() {
        p.classList.remove('loading')
    },2000)
    // console.log(v);

}

function sideBar() {
    const menuIcon = document.getElementById("menuIcon")
    const article = document.getElementById("article")

    var bar = sideBar.bar ;
    if (!bar) bar =sideBar.bar = document.querySelector('side-bar');
    bar=bar.parentElement;
    if (bar.hasAttribute("open")) {
        // menuIcon.classList.remove("x")
        // menuIcon.classList.add("sidebar")
        sideBar.open = false
        bar.removeAttribute('open')
        article.onclick = null
    }else{
        // menuIcon.classList.remove("sidebar")
        // menuIcon.classList.add("x")
        sideBar.open=true
        bar.setAttribute('open', true)
        setTimeout(() => article.onclick = sideBar, 100)
    }
}
function watchLater(movie, node){
    watchLaterStorage.has(movie.id).then(function(e){
       e=!e
       if (e) {
           watchLaterStorage.setItem(movie.id,movie)
           node.classList.add('red')
           node.innerText ="unsave"
        } else {
            watchLaterStorage.removeItem(movie.id)
            node.classList.remove('red')
           node.innerText = "Save to Watch later"
        }
    });
}
function frame(node,movie) {
    var d=document.createElement('div')
    d.innerHTML = movie.trailerHTML
    d=d.firstElementChild;
    var n;
    if (d) {
        movie.trailer=d.src
        d.src=""
        setTimeout(function() {
            node.replaceWith(d)
        }, 100);
        n=d
    }else{
        n=node
    }
  
    n.onmouseover =function(){
        n.onmouseover =null
        n.src = movie.trailer
        n.parentNode.classList.remove('loading')
    }
    // n.style.border = "1px solid red"

}
function imgLoad(node){
    node.classList.remove('pending')
}

function sanitize(e) {
    sanitize.elm.innerHTML = e
    return sanitize.elm.innerText
}

function num(e){
    e=Number(e)||0
e=e.toLocaleString().split(',')
var dg =e.shift(0);
var s=num.locale[e.length]||num.locale[4]
return dg+s.trim();
}
num.locale=[' ','k','m', 'b','b+']
sideBar.bar=document.querySelector('side-bar')
sanitize.elm = document.createElement('span')

function route(hash) {
    return hash.trim().replace(/^#?(\/|\\)?/, "/")
}


window.onhashchange = function () {
    var query=null;
    var template=null
    var  path="";
    try {
        path = route(location.hash)
        path=path.split(/\||\?/)
        query = atob(path[1] || '').trim()
        path = path[0].trim()

        for (var i = 0; i < routes.length; i++) {
            var r=routes[i]
            var p = (new RegExp('^' + r.getAttribute('path') + '$')).test(path)
            if (p) {
                template =r
                break
            } 
        }
        if (!template) {
            throw "404"
        }
    } catch (error) {
      //console.log(routes);
        console.log(error);
        template = 
            document.querySelector(`template[sys="${error}"]`)
            ||
            document.querySelector(`template[sys="error"]`)
    }
   // console.log(template);
    emit('pagechange', { template: template, path: path, query: query })
}

var { event: { emit, emitData, on } } = XJSX;


  


;

// (async function h({ document: { body } }) {
//     // console.log(arguments.callee+'');
// return
//         var n=Date.now()
//         var mv = new Movie()
//         d = mv.getList()
//         d = await d.get(0)
//         d = await d.downloads.getStandardQuality()
//         d=await d[0].getSource()
//         console.log(Date.now()-n,d);
//     })(window);
