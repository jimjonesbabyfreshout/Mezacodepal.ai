(self.webpackChunkkitsune=self.webpackChunkkitsune||[]).push([[857],{4666:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var i,o=n(9755);function a(t,e){a.prototype.init.call(this,t,e)}i=o,a.prototype={init:function(t,e){var n=this,o=i(t),a=o.find('[type="submit"], [data-type="submit"]');e=i.extend({positionMessage:!1,removeForm:!1,replaceFormWithMessage:!1},e),n.options=e,n.voted=!1,n.$form=o,a.on("click",(function(t){if(!n.voted){var e,o,s=i(this),r=s.closest("form"),l=r.attr("action"),d=r.serializeArray(),c={};for(a.attr("disabled","disabled"),r.addClass("busy"),e=0,o=d.length;e<o;e++)c[d[e].name]=d[e].value;c[s.attr("name")]=s.val(),i.ajax({url:l,type:"POST",data:c,dataType:"json",success:function(t){t.survey&&n.showSurvey(t.survey,r.parent()),t.message&&n.showMessage(t.message,s,r),s.addClass("active"),a.prop("disabled",!1),r.removeClass("busy"),n.voted=!0,c.ignored||i(document).trigger("vote",i.extend(c,{url:l})),n.$form.filter((function(){return!r.is(this)})).remove()},error:function(){var t=gettext("There was an error submitting your vote.");n.showMessage(t,s),a.prop("disabled",!1),r.removeClass("busy")}})}return i(this).trigger("blur"),t.preventDefault(),!1}))},showMessage:function(t,e,n){var o=this,a=i('<div class="ajax-vote-box"><p class="msg document-vote--heading"></p></div>'),s=e.offset();if(a.find("p").html(t),console.log("options",o.options),o.options.positionMessage){i("body").append(a),a.css({top:s.top-a.height()-30,left:s.left+e.width()/2-a.width()/2});var r=setTimeout(l,1e4);i("body").one("click",l)}else o.options.replaceFormWithMessage?n.replaceWith(a.removeClass("ajax-vote-box")):e.parent().parent().addClass(e.val()).append(a);function l(){a.fadeOut((function(){a.remove()})),o.options.removeForm&&o.$form.fadeOut((function(){o.$form.remove()})),i("body").off("click",l),clearTimeout(r)}},showSurvey:function(t,e){var n=i(t),o=n.find("#remaining-characters"),s=n.find("textarea"),r=parseInt(o.text(),10),l=n.find("input[type=radio][name=unhelpful-reason]"),d=n.find("[type=submit], [data-type=submit]"),c=n.find(".disabled-reason"),f=n.find("textarea");function u(){var t=l.filter(":checked").val(),e=f.val();void 0!==t&&("other"!==t&&"firefox-feedback"!==t||e)?(d.prop("disabled",!1),c.fadeOut(600)):(d.prop("disabled",!0),c.fadeIn(600))}e.after(n),e.remove(),d.prop("disabled",!0),s.on("input",(function(){var t=s.val().length;r-t>=0?o.text(r-t):(o.text(0),s.val(s.val().substr(0,r))),u()})),l.on("change",u),new a(n.find("form"),{replaceFormWithMessage:!0})}}},579:(t,e,n)=>{"use strict";n(7804);var i,o,a,s=n(4666),r=n(4994),l=n(2864),d=n(9755);new l.Z,i=(0,r.Rb)(),o=(0,r.an)(i),a=(0,r.uP)(i,o),d(".document-vote form").append(d('<input type="hidden" name="referrer"/>').attr("value",o)).append(d('<input type="hidden" name="query"/>').attr("value",a)),window.location.href.indexOf("relay-integration")>-1?d("img.lazy").loadnow():d("img.lazy").lazyload(),new s.Z(".document-vote form",{positionMessage:!1,replaceFormWithMessage:!0,removeForm:!0}),d(window).on("load",(function(){var t=window.location.hash;t&&(window.location.hash="",setTimeout((function(){window.location.hash=t}),0))}))},7804:(t,e,n)=>{!function(t){function e(){window.location.hash&&(window.location.hash=window.location.hash)}function n(e,n,i){var o=0;return e.filter(".lazy").each((function(){t(this).hasClass("lazy")&&function(e,n){return t(window).height()+t(window).scrollTop()>=t(e).offset().top-n.threshold}(this,n)&&t(this).data("original-src")&&t(this).is(":visible")&&(t.fn.lazyload.loadOriginalImage(this,i),t(this).removeClass("lazy"),o++)})),o}t.fn.lazyload=function(i){var o=t.extend(t.fn.lazyload.defaults,i),a=this,s=!1,r=a.length;t(window).on("scroll",(function(t){s=!0})),n(a,o,null),t(window).trigger("scroll");var l=window.location.hash;e();var d=setInterval((function(){if(r<=0)return t(window).off("scroll"),void clearInterval(d);if(s){s=!1;var e=null;l!=window.location.hash&&(e=window.location.hash,l=window.location.hash);var i=n(a,o,e);r-=i}}),250);return this},t.fn.lazyload.defaults={threshold:750},t.fn.lazyload.loadOriginalImage=function(n,i){null!=i&&t(n).on("load",(function(){e()})),t(n).attr("src",t(n).data("original-src")).removeData("original-src")},t.fn.loadnow=function(e){this.each((function(){t.fn.lazyload.loadOriginalImage(this),t(this).removeClass("lazy")}))}}(n(9755))},2864:(t,e,n)=>{"use strict";n.d(e,{Z:()=>l});var i=n(5861),o=n(4687),a=n.n(o),s=n(7354),r=n(9755);function l(t){var e=this;this.$container=t||r("body"),this.state={},this.loadData(),this.initEvents(),this.wrapTOCs(),this.initShowFuncs(),this.updateUI().then((function(){e.updateState(),e.showAndHide()}))}l.prototype.productShortMap={fx:"firefox",m:"mobile",tb:"thunderbird"},l.prototype.platformMap={Windows:{default:"win10",XP:"winxp",Vista:"win7",7:"win7",8:"win8",8.1:"win8",10:"win10",11:"win11"},"Mac OS":"mac"},l.prototype.loadData=function(){try{this.data=JSON.parse(this.$container.find(".showfor-data").html())}catch(t){this.data={products:[],platforms:[],versions:[]}}for(var t in this.productSlugs=this.data.products.map((function(t){return t.slug})),this.platformSlugs=[],this.data.platforms)this.data.platforms[t].forEach(function(t){this.platformSlugs.push(t.slug)}.bind(this));for(var e in this.versionSlugs={},this.data.versions)this.data.versions[e].forEach(function(t){this.versionSlugs[t.slug]=e}.bind(this))},l.prototype.initEvents=function(){window.onpopstate=this.updateUI.bind(this),this.$container.on("change keyup","input, select",this.onUIChange.bind(this))},l.prototype.ensureSelect=function(t,e,n,i){var o,a,s,l={};function d(t,e){for(var n=0;n<t.length;n++)if(t[n].slug===e)return t[n];return null}if("version"===e)null!==(s=d(this.data.versions[n],i))&&(l["data-min"]=s.min_version,l["data-max"]=s.max_version);else if("platform"===e)s=d(this.data.platforms[n],i);else{if("product"!==e)throw new Error("Unknown showfor select type "+e);s=d(this.data.products,i)}if(null!==s){if(i=e+":"+i,0===t.find('option[value="'+i+'"]').length){for(a in o=r("<option>").attr("value",i).text(s.name),l)o.attr(a,l[a]);t.append(o)}t.val(i)}},l.prototype.updateUI=(0,i.Z)(a().mark((function t(){var e,n,i,o,l,d,c,f,u,h,p,v,m,w,g=this;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=null,(i=document.location.hash).indexOf(":")>=0&&(n=i.slice(1)),null===n&&window.sessionStorage&&(n=sessionStorage.getItem("showfor::persist")),!n){t.next=10;break}if(o=!1,this.$container.find(".product input[type=checkbox]").prop("checked",!1),n.split("&").forEach(function(t){var e=t.split(":"),n=e[0]||null,i=e[1]||null,a=e[2]||null,s=this.$container.find('.product[data-product="'+n+'"]');if(0!==s.length){if(o=!0,s.find('input[type=checkbox][value="product:'+n+'"]').prop("checked",!0),i){var r=s.find("select.platform");this.ensureSelect(r,"platform",n,i)}if(a){var l=s.find("select.version");this.ensureSelect(l,"version",n,a)}}}.bind(this)),!o){t.next=10;break}return t.abrupt("return");case 10:return l=new s.ZP,t.next=13,l.getBrowser();case 13:return d=t.sent,t.next=16,l.getOS();case 16:c=t.sent,f=null===(e=d.version)||void 0===e?void 0:e.toString("major"),u=this.$container.find(".product"),h={},u.each((function(t,e){var n=r(e);h[n.data("product")]=n})),d.mozilla&&f&&(c.mobile&&-1!==this.productSlugs.indexOf("mobile")?(p="m"+f,v=h.mobile.find("select.version"),this.ensureSelect(v,"version","mobile",p)):-1!==this.productSlugs.indexOf("firefox")&&(m="fx"+f,w=h.firefox.find("select.version"),this.ensureSelect(w,"version","firefox",m))),u.find("select.platform").each((function(t,e){var n=r(e),i=n.parents(".product").data("product"),o=g.platformMap[c.name]||c.name.toLowerCase();"string"!=typeof o&&(o=o[c.version]||o.default),g.ensureSelect(n,"platform",i,o)}));case 23:case"end":return t.stop()}}),t,this)}))),l.prototype.onUIChange=function(){this.updateState(),this.showAndHide(),this.persist()},l.prototype.persist=function(){var t,e,n=0,i="";for(t in this.state)(e=this.state[t]).enabled&&(n>0&&(i+="&"),i+=t+":"+(e.platform||"")+":"+(e.version&&e.version.slug||""),n++);""!==i&&((""===document.location.hash||document.location.hash.indexOf(":")>=0)&&history.replaceState(this.state,i,"#"+i),window.sessionStorage&&window.sessionStorage.setItem("showfor::persist",i))},l.prototype.updateState=function(){this.state={},this.$container.find(".product").each(function(t,e){var n=r(e),i=n.data("product");this.state[i]={enabled:n.find("input[type=checkbox]").prop("checked")},n.find("select").each(function(t,e){var n=r(e),o=n.val().split(":"),a=o[0],s=o[1];if("version"===a){var l=n.find("option:selected");s={slug:s,min:parseFloat(l.data("min")),max:parseFloat(l.data("max"))}}this.state[i][a]=s}.bind(this))}.bind(this))},l.prototype.wrapTOCs=function(){this.$container.find("#toc a").each((function(t,e){var n=r(e),i=n.attr("href");if("#"===i[0])for(var o=r(i),a=n.parent();o.length;){if(o.hasClass("for")){var s=r("<span/>",{class:"for","data-for":o.data("for")});a=a.wrap(s)}o=o.parent()}}))},l.prototype.initShowFuncs=function(){this.$container.find(".for").each(function(t,e){var n=r(e),i=n.data("for").split(/\s*,\s*/),o=this.matchesCriteria.bind(this,i);n.data("show-func",o)}.bind(this))},l.prototype.showAndHide=function(){this.$container.find(".for").each((function(t,e){var n=r(e),i=n.data("show-func")();void 0!==i?n.toggle(i):n.show()}))},l.prototype.matchesCriteria=function(t){var e=!1,n=!1,i=!1,o=!1,a=[];for(var s in this.state){var r=this.state[s];r.enabled&&r.platform&&a.push(r.platform)}return t.forEach(function(t){var s,r,l=0===t.indexOf("not");l&&(t=t.replace(/^not ?/,""));var d=">=";if("="===(t=this.productShortMap[t]||t)[0]&&(t=t.slice(1),d="="),this.productSlugs.indexOf(t)>=0)e=!0,this.state[t].enabled!==l&&(n=!0);else if(void 0!==this.versionSlugs[t]){s=this.versionSlugs[t],e=!0,r=parseFloat(/^[a-z]+([\d\.]+)$/.exec(t)[1]);var c=this.state[s].version.min,f=this.state[s].version.max;(this.state[s].enabled&&(">="===d&&r<f||"="===d&&r>=c&&r<f))!==l&&(n=!0)}else if(this.platformSlugs.indexOf(t)>=0)i=!0,a.indexOf(t)>=0!==l&&(o=!0);else if("win"===t){i=!0;var u=!1;["winxp","win7","win8","win10","win11"].forEach((function(t){a.indexOf(t)>=0&&(u=!0)})),u!==l&&(o=!0)}}.bind(this)),(!e||n)&&(!i||o)}},247:(t,e,n)=>{"use strict";var i,o=n(7830),a=n(9755);(i=a)((function(){function t(){return i("html").attr("lang")}function e(){return i("body").data("default-slug")}i("body").is(".document")&&(i(document).on("vote",(function(n,i){var a;if(_gaq){if("helpful"in i)a="Helpful";else{if(!("not-helpful"in i))return;a="Not Helpful"}(0,o.Z)("Article Vote",i.source+" - "+a,e()+" / "+t())}})),i("#os").on("change",(function(){(0,o.Z)("ShowFor Switch","OS - "+i(this).val(),e()+" / "+t())})),i("#browser").on("change",(function(){(0,o.Z)("ShowFor Switch","Version - "+i(this).val(),e()+" / "+t())})),setTimeout((function(){(0,o.Z)("Article Read",e()+" / "+t())}),1e4))}))}},t=>{var e=e=>t(t.s=e);t.O(0,[901,354,672],(()=>(e(579),e(247)))),t.O()}]);