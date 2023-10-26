XJSX.createEffect('slide', function (node, resolve, name) {

});


var cb = function (self,p) {
    if (!p) {
        var doc = document.createDocumentFragment();
        self.appendAllTo(doc)
    }
    var arg=self.p.split(',')
    // console.log(self.p);
    return function () {
        for (var i = 0; i < arg.length; i++) {
            var n = arg[i].trim()
            self.eval(arguments[i], n)
        }
        if (!p) {
            XJSX.parseElement(doc, self.eval)
            self.putChild(doc)
        }
    }
}

XJSX.createModule("await", XJSX.FUNCTION, {
    onload: function (v) {
        v = XJSX.parseXJSXParameter(v, this.eval)
        this.global.val = v.parameter[0]
        this.global.arg = v.arguments
    }
})
    .append("then", {
        onprogress: function () {
            this.disable()
        },
        onload: function () {
            this.killProcess()
        },
        callback: function (p) {
            var v = this.global.val
            this.p=p
            v.then(cb(this));
        }
    })
    .append("catch", {
        onprogress: function () {
            this.disable()
        },
        onload: function () {
            this.killProcess()
        },
        callback: function (p) {
            var v = this.global.val
            this.p = p
            v.catch(cb(this));
        }
    })
    .end();


XJSX.createModule("title", XJSX.METHOD, {
    callback: function (v,node, eval) {
        v = XJSX.parseXJSXParameter(v, eval).parameter
        var s=''
        for (var i = 0; i < v.length; i++) {
            s+=v[i]
        }
        XJSX.event.emitData('title', s)
    }
})

XJSX.createModule("initialize", XJSX.METHOD, {
    callback: function (v, node, eval) {
        v = XJSX.parseXJSXParameter(v, eval).parameter
        var s = ''
        for (var i = 0; i < v.length; i++) {
            s += v[i]
        }
        XJSX.event.emit('hashchange')
    }
})