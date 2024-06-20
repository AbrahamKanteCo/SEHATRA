$(function (e) {


    /*----P-scrolling JS ----*/
    const ps31 = new PerfectScrollbar('.countryscroll', {
        useBothWheelAxes: true,
    });

    const ps32 = new PerfectScrollbar('#scrollbar', {
        useBothWheelAxes: true,
        suppressScrollX: true,
    });

    const ps33 = new PerfectScrollbar('#scrollbar2', {
        useBothWheelAxes: true,
        suppressScrollX: true,
    });

    const ps34 = new PerfectScrollbar('#scrollbar3', {
        useBothWheelAxes: true,
        suppressScrollX: true,
    });
    /*-----P-scrolling JS -----*/

});

function index1(annee) {
    document.querySelector(".chart-container").innerHTML = '<canvas id="leads" class="h-400 chart-dropshadow-primary"></canvas>';
    const ctx = document.getElementById('leads').getContext('2d');

    if (annee == null) {
        annee = new Date().getFullYear()
    }
    fetch('earning-revenue/' + annee)
        .then(response => response.json())
        .then(data => {
            const statistiquesVentesObj = data.statistiques_ventes;

            // Extraire les mois et les valeurs du tableau
            const mois = Object.keys(statistiquesVentesObj);
            const ventes = mois.map(m => statistiquesVentesObj[m].nombre_ventes);
            const revenues = mois.map(m => statistiquesVentesObj[m].revenues);


            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: mois,
                    datasets: [{
                        label: "Revenues",
                        data: revenues,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: true,
                        pointStyle: 'circle',
                        pointRadius: 0,
                        pointBorderColor: 'transparent',
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                        lineTension: 0.3,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            enabled: true,
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                beginAtZero: true,
                                fontSize: 10,
                                fontColor: "rgba(171, 167, 167, 0.9)",
                            },
                            title: {
                                display: true,
                                text: 'Mois',
                                color: "#8e9cad",
                                font: {
                                    size: 15,
                                    weight: '500',
                                },
                            },
                            grid: {
                                display: false,
                                color: 'rgba(171, 167, 167, 0.1)',
                                drawBorder: false,
                            },
                        },
                        y: {
                            ticks: {
                                beginAtZero: true,
                                fontSize: 10,
                                fontColor: "rgba(171, 167, 167, 0.9)",
                                callback: function (value, index, values) {
                                    return value.toLocaleString() + ' Ar';
                                },
                                stepSize: 100000,
                                min: 0,
                                max: Math.max(...revenues),
                            },
                            title: {
                                display: true,
                                text: 'Revenue',
                                color: "#8e9cad",
                                font: {
                                    size: 15,
                                    weight: '500',
                                },
                            },
                            grid: {
                                display: false,
                                color: 'rgba(171, 167, 167, 0.1)',
                                drawBorder: false,
                            },
                        }
                    },
                }
            });
        });
}
function vectormap(start, end) {
    requete = ""
    if (start != null && end != null) {
        requete = "?debut=" + start + "&fin=" + end
    }
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
        fetch('ventes_pays' + requete)
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
                        ventes = 0;
                        if (data[code.toString()] !== undefined) {
                            ventes = data[code.toString()];
                        }
                        label.html(label.html() + ' :' + ventes + ' ventes');
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching sample data:', error);
            });
    });

}