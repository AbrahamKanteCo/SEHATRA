!function(){"use strict";function e(n,o){var t,e=document.createElement("form");for(t in e.method="POST",e.action=n,o){var i=document.createElement("input");i.type="hidden",i.name=t,i.value=o[t],e.appendChild(i)}document.body.appendChild(e),e.submit()}function s(n){"function"==typeof n?n():window.location.href=n}var i=window.allauth=window.allauth||{},n=JSON.parse(document.getElementById("allauth-facebook-settings").innerHTML),c=!1;i.facebook={init:function(n){var o,t,e;this.opts=n,window.fbAsyncInit=function(){FB.init(n.initParams),c=!0,i.facebook.onInit()},o=document,e="facebook-jssdk",o.getElementById(e)||((t=o.createElement("script")).id=e,t.async=!0,t.src=n.sdkUrl,o.getElementsByTagName("head")[0].appendChild(t))},onInit:function(){},login:function(o,n,t,e){var i=this;c?("reauthenticate"!==n&&"rerequest"!==n||(this.opts.loginOptions.auth_type=n),""!==e&&(this.opts.loginOptions.scope=e),FB.login(function(n){n.authResponse?i.onLoginSuccess(n,o,t):n&&n.status&&-1<["not_authorized","unknown"].indexOf(n.status)?i.onLoginCanceled(n):i.onLoginError(n)},i.opts.loginOptions)):s(this.opts.loginUrl+"?next="+encodeURIComponent(o)+"&action="+encodeURIComponent(n)+"&process="+encodeURIComponent(t)+"&scope="+encodeURIComponent(e))},onLoginCanceled:function(){s(this.opts.cancelUrl)},onLoginError:function(){s(this.opts.errorUrl)},onLoginSuccess:function(n,o,t){n={next:o||"",process:t,access_token:n.authResponse.accessToken,expires_in:n.authResponse.expiresIn,csrfmiddlewaretoken:this.opts.csrfToken};e(this.opts.loginByTokenUrl,n)},logout:function(o){var t=this;c&&FB.logout(function(n){t.onLogoutSuccess(n,o)})},onLogoutSuccess:function(n,o){o={next:o||"",csrfmiddlewaretoken:this.opts.csrfToken};e(this.opts.logoutUrl,o)}},i.facebook.init(n)}();