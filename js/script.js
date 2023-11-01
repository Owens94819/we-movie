
routes=document.querySelectorAll("template[path]");
_atob= atob;
_btoa= btoa;
btoa = function () {
    return _btoa(encodeURIComponent(arguments[0]))
}
atob = function () {
    return decodeURIComponent(_atob(arguments[0]))
}
function toHref(e){
    return './#/'+e.replace(/^[\\\/]/,'')
}
function href(e) {
    location.href=toHref(e)
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
function initPG({pg_length,pg_current}){
    pg_current=62
    var _cr = pg_current;
    if(_cr>1)_cr-=1
    var n=3;
    var cr = pg_length-_cr;
    var st = _cr
    var en=(pg_length-n);
    // var st = (cr-(en))+_cr
if(st>en){
en=pg_current
}
    var obj={start: st,len:n,current:pg_current}
    if (cr>3&&(en>pg_current)) {
        obj.end=en
    }
    console.log(obj);
    return obj
}

function search(node) {
    var v = node.value.trim()
    if(!v) return
var p=node.parentNode
    p.classList.add('loading')
    href('movies/search/name/' + v)
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
        path=path.split(/[\?\|]([^]+)/);
        query=(path[1] || location.search.replace(/^\?/,"")).trim();
        query=decodeURIComponent(query)
        // console.log(query);
        // try {
            // query = atob(query).trim()
        // } catch (error) {}

        path = decodeURIComponent(path[0].trim())
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
   _path=path.split("/");
    emit('pagechange', { template: template, path: path,_path:_path, size:_path.length&&_path.length-1, query: query })
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
