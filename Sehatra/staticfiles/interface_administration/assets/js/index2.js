function canvasDoughnut(start, end) {

	if ($('.canvasDoughnut').length) {
		requete = "";
		if (start != null && end != null) {
			requete = "?debut=" + start + "&fin=" + end;
		}
	
		fetch('ventes_data' + requete)
			.then(response => response.json())
			.then(data => {
				if (data.Madagascar==0 && data.International==0) {
					document.querySelector(".chart-container").innerHTML = 'Aucune donnée';
				} else {
					const ventes = Object.keys(data);
					const nb = ventes.map(m => data[m]);
					document.querySelector(".chart-container").innerHTML = '<canvas class="canvasDoughnut" height="200" width="200"></canvas>';
					var chart_doughnut_settings = {
						type: 'doughnut',
						tooltipFillColor: "rgba(51, 51, 51, 0.55)",
						maintainAspectRatio: false,
						responsive: true,
						data: {
							labels: ventes,
							datasets: [{
								data: nb,
								backgroundColor: [
									"#2dce89",
									"#ff5b51"
								],
								hoverBackgroundColor: [
									"#2dce89",
									"#ff5b51"
								]
							}]
						},
						options: {
							plugins: {
								legend: {
									display: false,
								}
							},
							cutout: "70%",
							responsive: true,
						}
					}
	
					$('.canvasDoughnut').each(function () {
						var chart_element = $(this);
						var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);
					});
				}
			});
	}
	
}

function myfirstchart() {
	fetch('stats_vue_users')
		.then(response => response.json())
		.then(data => {
			const stats = data.statistiques_pages;

			const mois = Object.keys(stats);
			const newusers = mois.map(m => stats[m].nombre_nouveaux_utilisateurs);
			const vues = mois.map(m => stats[m].nombre_vues);


			var chartdata3 = [
				{
					name: 'Vue de mes pages',
					type: 'bar',
					barMaxWidth: 7,
					data: vues,
					itemStyle: {
						normal: {
							barBorderRadius: [50, 50, 0, 0],
						}
					}
				},
				{
					name: 'Nouveaux utilisateurs',
					type: 'bar',
					barMaxWidth: 7,
					data: newusers,
					itemStyle: {
						normal: {
							barBorderRadius: [50, 50, 0, 0],
						}
					}
				}
			];

			var option5 = {
				grid: {
					top: '6',
					right: '0',
					bottom: '17',
					left: '35',
				},
				tooltip: {
					show: true,
					showContent: true,
					alwaysShowContent: true,
					triggerOn: 'mousemove',
					trigger: 'axis',
					axisPointer:
					{
						label: {
							show: false,
						}
					}

				},
				xAxis: {
					data: mois,
					axisLine: {
						lineStyle: {
							color: 'rgba(67, 87, 133, .09)'
						}
					},
					axisLabel: {
						fontSize: 10,
						color: '#8e9cad'
					}
				},
				yAxis: {
					splitLine: {
						lineStyle: {
							color: 'rgba(67, 87, 133, .09)'
						}
					},
					axisLine: {
						lineStyle: {
							color: 'rgba(67, 87, 133, .09)'
						}
					},
					axisLabel: {
						fontSize: 10,
						color: '#8e9cad'
					}
				},
				series: chartdata3,
				color: [myVarVal, '#f72d66', '#cedbfd']
			};
			var chart5 = document.getElementById('myfirstchart');
			var barChart5 = echarts.init(chart5);
			barChart5.setOption(option5);
			window.addEventListener('resize', function () {
				barChart5.resize();
			})
		});
}

function chartcircleprimary() {
	$('#chart-circle-primary').circleProgress({
		fill: {
			color: myVarVal,
		},
		emptyFill: hexToRgba(myVarVal, 0.4),
	})
}