"use strict";{const a=django.jQuery;let d;a.fn.actions=function(e){var n=a.extend({},a.fn.actions.defaults,e),o=a(this);let s=!1;function c(){a(n.acrossClears).hide(),a(n.acrossQuestions).show(),a(n.allContainer).hide()}function t(){a(n.acrossClears).show(),a(n.acrossQuestions).hide(),a(n.actionContainer).toggleClass(n.selectedClass),a(n.allContainer).show(),a(n.counterContainer).hide()}function i(){a(n.acrossClears).hide(),a(n.acrossQuestions).hide(),a(n.allContainer).hide(),a(n.counterContainer).show()}function l(){i(),a(n.acrossInput).val(0),a(n.actionContainer).removeClass(n.selectedClass)}function r(e){(e?c:i)(),a(o).prop("checked",e).parent().parent().toggleClass(n.selectedClass,e)}function u(){var t=a(o).filter(":checked").length,e=a(".action-counter").data("actionsIcnt");a(n.counterContainer).html(interpolate(ngettext("%(sel)s of %(cnt)s selected","%(sel)s of %(cnt)s selected",t),{sel:t,cnt:e},!0)),a(n.allToggle).prop("checked",function(){let e;return t===o.length?(e=!0,c()):(e=!1,l()),e})}a(n.counterContainer).show(),a(this).filter(":checked").each(function(e){a(this).parent().parent().toggleClass(n.selectedClass),u(),1===a(n.acrossInput).val()&&t()}),a(n.allToggle).show().on("click",function(){r(a(this).prop("checked")),u()}),a("a",n.acrossQuestions).on("click",function(e){e.preventDefault(),a(n.acrossInput).val(1),t()}),a("a",n.acrossClears).on("click",function(e){e.preventDefault(),a(n.allToggle).prop("checked",!1),l(),r(0),u()}),d=null,a(o).on("click",function(e){var t=(e=e||window.event).target||e.srcElement;if(d&&a.data(d)!==a.data(t)&&!0===e.shiftKey){let e=!1;a(d).prop("checked",t.checked).parent().parent().toggleClass(n.selectedClass,t.checked),a(o).each(function(){a.data(this)!==a.data(d)&&a.data(this)!==a.data(t)||(e=!e),e&&a(this).prop("checked",t.checked).parent().parent().toggleClass(n.selectedClass,t.checked)})}a(t).parent().parent().toggleClass(n.selectedClass,t.checked),d=t,u()}),a("form#changelist-form table#result_list tr").on("change","td:gt(0) :input",function(){s=!0}),a('form#changelist-form button[name="index"]').on("click",function(e){if(s)return confirm(gettext("You have unsaved changes on individual editable fields. If you run an action, your unsaved changes will be lost."))}),a('form#changelist-form input[name="_save"]').on("click",function(e){let t=!1;if(a("select option:selected",n.actionContainer).each(function(){a(this).val()&&(t=!0)}),t)return s?confirm(gettext("You have selected an action, but you haven’t saved your changes to individual fields yet. Please click OK to save. You’ll need to re-run the action.")):confirm(gettext("You have selected an action, and you haven’t made any changes on individual fields. You’re probably looking for the Go button rather than the Save button."))})},a.fn.actions.defaults={actionContainer:"div.actions",counterContainer:"span.action-counter",allContainer:"div.actions span.all",acrossInput:"div.actions input.select-across",acrossQuestions:"div.actions span.question",acrossClears:"div.actions span.clear",allToggle:"#action-toggle",selectedClass:"selected"},a(document).ready(function(){const e=a("tr input.action-select");0<e.length&&e.actions()})}