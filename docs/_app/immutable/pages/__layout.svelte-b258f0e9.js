import{S as g,i as y,s as E,e as _,c as u,a as d,d as f,b as c,g as p,F as h,E as m,G as w,w as H,k as b,x as k,m as A,y as I,H as q,I as D,J as M,q as $,o as v,B as S}from"../chunks/index-ae238e30.js";import{w as T}from"../chunks/wordmark-0849a013.js";function B(i){let t,n,a;return{c(){t=_("header"),n=_("div"),a=_("a"),this.h()},l(r){t=u(r,"HEADER",{});var l=d(t);n=u(l,"DIV",{class:!0});var s=d(n);a=u(s,"A",{href:!0,"aria-label":!0,class:!0});var e=d(a);e.forEach(f),s.forEach(f),l.forEach(f),this.h()},h(){c(a,"href","https://pudding.cool"),c(a,"aria-label","The Pudding"),c(a,"class","svelte-1f524sp"),c(n,"class","wordmark svelte-1f524sp")},m(r,l){p(r,t,l),h(t,n),h(n,a),a.innerHTML=T},p:m,i:m,o:m,d(r){r&&f(t)}}}class C extends g{constructor(t){super(),y(this,t,null,B,E,{})}}function F(i){let t,n,a,r;t=new C({});const l=i[1].default,s=w(l,i,i[0],null);return{c(){H(t.$$.fragment),n=b(),a=_("main"),s&&s.c(),this.h()},l(e){k(t.$$.fragment,e),n=A(e),a=u(e,"MAIN",{id:!0});var o=d(a);s&&s.l(o),o.forEach(f),this.h()},h(){c(a,"id","content")},m(e,o){I(t,e,o),p(e,n,o),p(e,a,o),s&&s.m(a,null),r=!0},p(e,[o]){s&&s.p&&(!r||o&1)&&q(s,l,e,e[0],r?M(l,e[0],o,null):D(e[0]),null)},i(e){r||($(t.$$.fragment,e),$(s,e),r=!0)},o(e){v(t.$$.fragment,e),v(s,e),r=!1},d(e){S(t,e),e&&f(n),e&&f(a),s&&s.d(e)}}}function G(i,t,n){let{$$slots:a={},$$scope:r}=t;return i.$$set=l=>{"$$scope"in l&&n(0,r=l.$$scope)},[r,a]}class N extends g{constructor(t){super(),y(this,t,G,F,E,{})}}export{N as default};