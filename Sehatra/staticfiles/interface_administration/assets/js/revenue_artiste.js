if(document.querySelector('#revenue_artiste') !== null){
    revenue();
}
function revenue(annee) {
    document.querySelector(".chart-container1").innerHTML = '<canvas id="revenue_artiste" class="h-400 chart-dropshadow-primary"></canvas>';
    const ctx = document.getElementById('revenue_artiste').getContext('2d');
  
    if(annee==null){
        annee=new Date().getFullYear()
    }
    fetch('earning-revenue-artiste/'+annee)
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
                                callback: function(value, index, values) {
                                    return   value.toLocaleString()+' Ar';
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