const ps32 = new PerfectScrollbar('#scrollbar5', {
    useBothWheelAxes: true,
    suppressScrollX: true,
});
const ps33 = new PerfectScrollbar('#scrollbar6', {
    useBothWheelAxes: true,
    suppressScrollX: true,
});
function vectormap() {
    document.querySelector('#vmap').innerHTML = ""
    $(document).ready(function () {

        function sizeMap() {
            var containerWidth = $('.some-parent-element').width(),
                containerHeight = (containerWidth / 1.4);

            $('#vmap').css({
                'width': containerWidth,
                'height': containerHeight
            });
        }
        sizeMap();
        fetch('audience_pays')
            .then(response => response.json())
            .then(data => {
                $(window).on("resize", sizeMap);
                jQuery('#vmap').vectorMap({
                    map: 'world_en',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    hoverOpacity: 0.7,
                    enableZoom: true,
                    showTooltip: true,
                    scaleColors: [myVarVal],
                    values: data,
                    normalizeFunction: 'polynomial',
                    onLabelShow: function (event, label, code) {
                        code = code;
                        utilisateurs = 0;
                        if (data[code.toString()] !== undefined) {
                            utilisateurs = data[code.toString()];
                        }
                        label.html(label.html() + ' :' + utilisateurs + ' utilisateur(s)');
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching sample data:', error);
            });
    });

}
