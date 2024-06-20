if(document.querySelector('.age_sexe_statistique') !== null){
	age_sexe_statistique(null,null);
}
if(document.querySelector('.langue_stat') !== null){
	langue(null,null);
}
if(document.querySelector('.sourceClicks') !== null){
	sourceClicks(null,null);
}
function langue(start, end) {
    requete = ""
    if (start != null && end != null) {
        requete = "?debut=" + start + "&fin=" + end
    }
    fetch('audience_langue' + requete)
        .then(response => response.json())
        .then(data => {
            const langue = Object.keys(data);
            const users = langue.map(m => data[m]);

            document.querySelector(".chart-container1").innerHTML = '<canvas class="langue_stat" height="200" width="200"></canvas>';
            if ($('.langue_stat').length) {

                var chart_doughnut_settings = {
                    type: 'doughnut',
                    tooltipFillColor: "rgba(51, 51, 51, 0.55)",
                    data: {
                        labels: langue,
                        datasets: [{
                            data: users,
                            backgroundColor: [myVarVal, '#FF5733',
                                '#33FF57',
                                '#3366FF',
                                '#FF33FF',
                                '#FFFF33',
                                '#33FFFF',
                                '#FF6633',
                                '#4CAF50',
                                '#2196F3',
                                '#9C27B0',
                                '#FF9800',
                                '#795548',
                                '#607D8B',
                                '#F44336',
                                '#E91E63',
                                '#3F51B5',
                                '#FF5722',
                                '#009688',
                                '#673AB7',
                                '#FFC107'],
                            hoverBackgroundColor: [myVarVal, '#FF5733',
                                '#33FF57',
                                '#3366FF',
                                '#FF33FF',
                                '#FFFF33',
                                '#33FFFF',
                                '#FF6633',
                                '#4CAF50',
                                '#2196F3',
                                '#9C27B0',
                                '#FF9800',
                                '#795548',
                                '#607D8B',
                                '#F44336',
                                '#E91E63',
                                '#3F51B5',
                                '#FF5722',
                                '#009688',
                                '#673AB7',
                                '#FFC107']
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
                    },
                }

                $('.langue_stat').each(function () {
                    var chart_element = $(this);

                    if (chart_element.data('chart')) {
                        chart_element.data('chart').destroy(); 
                    }

                    var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

                    chart_element.data('chart', chart_doughnut);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching sample data:', error);
        });
    /*-----canvasDoughnut-----*/
}

function sourceClicks(start,end) {
	requete=""
    if(start!=null && end!=null){
        requete="?debut="+start+"&fin="+end
    }
	fetch('audience_sources'+requete)
	.then(response => response.json())
	.then(data => {
	const sources = Object.keys(data);
	const users=sources.map(m => data[m]);
	
	document.querySelector(".chart-container2").innerHTML = '<canvas class="sourceClicks" height="200" width="200"></canvas>';
	if ($('.sourceClicks').length){

		var chart_doughnut_settings = {
			type: 'doughnut',
			tooltipFillColor: "rgba(51, 51, 51, 0.55)",
			data: {
				labels: sources,
				datasets: [{
					data: users,
					backgroundColor: [ myVarVal, '#FF5733',   
					'#33FF57',   
					'#3366FF',  
					'#FF33FF',   
					'#FFFF33',  
					'#33FFFF', 
					'#FF6633',    
					'#4CAF50',    
					'#2196F3',    
					'#9C27B0',    
					'#FF9800',   
					'#795548',    
					'#607D8B',    
					'#F44336',    
					'#E91E63',    
					'#3F51B5',    
					'#FF5722',    
					'#009688',    
					'#673AB7',    
					'#FFC107'    ],
					hoverBackgroundColor: [ myVarVal, '#FF5733',   
					'#33FF57',   
					'#3366FF',  
					'#FF33FF',   
					'#FFFF33',  
					'#33FFFF', 
					'#FF6633',    
					'#4CAF50',    
					'#2196F3',    
					'#9C27B0',    
					'#FF9800',   
					'#795548',    
					'#607D8B',    
					'#F44336',    
					'#E91E63',    
					'#3F51B5',    
					'#FF5722',    
					'#009688',    
					'#673AB7',    
					'#FFC107'   ]
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
			},
		}
		

		$('.sourceClicks').each(function(){

			var chart_element = $(this);

                    if (chart_element.data('chart')) {
                        chart_element.data('chart').destroy(); 
                    }

                    var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

                    chart_element.data('chart', chart_doughnut);

		});
	}
	})
	.catch(error => {
		console.error('Error fetching sample data:', error);
	});
	/*-----canvasDoughnut-----*/
}
function age_sexe_statistique(start,end) {
	requete=""
    if(start!=null && end!=null){
        requete="?debut="+start+"&fin="+end
    }
	fetch('audience_age_sexe'+requete)
	.then(response => response.json())
	.then(data => {
	const audience_age_sexe = Object.keys(data);
	const utilisateurs=audience_age_sexe.map(m => data[m]);
	
	document.querySelector(".chart-container3").innerHTML = '<canvas class="age_sexe_statistique" height="200" width="200"></canvas>';
	if ($('.age_sexe_statistique').length){

		var chart_doughnut_settings = {
			type: 'doughnut',
			tooltipFillColor: "rgba(51, 51, 51, 0.55)",
			data: {
				labels: audience_age_sexe,
				datasets: [{
					data: utilisateurs,
					backgroundColor: [ myVarVal, '#FF5733',   
					'#33FF57',   
					'#3366FF',  
					'#FF33FF',   
					'#FFFF33',  
					'#33FFFF', 
					'#FF6633',    
					'#4CAF50',    
					'#2196F3',    
					'#9C27B0',    
					'#FF9800',   
					'#795548',    
					'#607D8B',    
					'#F44336',    
					'#E91E63',    
					'#3F51B5',    
					'#FF5722',    
					'#009688',    
					'#673AB7',    
					'#FFC107'    ],
					hoverBackgroundColor: [ myVarVal, '#FF5733',   
					'#33FF57',   
					'#3366FF',  
					'#FF33FF',   
					'#FFFF33',  
					'#33FFFF', 
					'#FF6633',    
					'#4CAF50',    
					'#2196F3',    
					'#9C27B0',    
					'#FF9800',   
					'#795548',    
					'#607D8B',    
					'#F44336',    
					'#E91E63',    
					'#3F51B5',    
					'#FF5722',    
					'#009688',    
					'#673AB7',    
					'#FFC107'   ]
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
			},
		}
		

		$('.age_sexe_statistique').each(function(){

			var chart_element = $(this);

                    if (chart_element.data('chart')) {
                        chart_element.data('chart').destroy(); 
                    }

                    var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

                    chart_element.data('chart', chart_doughnut);

		});
	}
	})
	.catch(error => {
		console.error('Error fetching sample data:', error);
	});
}

function chartcircleprimary() {
	$('#chart-circle-primary').circleProgress({
		fill: {
			color: myVarVal
		},
		emptyFill: hexToRgba(myVarVal, 0.4),
	})
}
function chartcirclesuccess() {
	$('#chart-circle-success').circleProgress({
		fill: {
			color: myVarVal
		},
		emptyFill: hexToRgba(myVarVal, 0.4),
	})
}
function chartcirclewarning() {
	$('#chart-circle-warning').circleProgress({
		fill: {
			color: myVarVal
		},
		emptyFill: hexToRgba(myVarVal, 0.4),
	})
}




// function chartcircleprimary1() {
// 	$('#chart-circle-primary1').circleProgress({
// 		fill: {
// 			color: myVarVal
// 		},
// 		emptyFill: hexToRgba(myVarVal, 0.4),
// 	})
// }

// function chartcircleprimary2() {
// 	$('#chart-circle-primary2').circleProgress({
// 		fill: {
// 			color: myVarVal
// 		},
// 		emptyFill: hexToRgba(myVarVal, 0.4),
// 	})
// }

// function chartcircleprimary3() {
// 	$('#chart-circle-primary3').circleProgress({
// 		fill: {
// 			color: myVarVal
// 		},
// 		emptyFill: hexToRgba(myVarVal, 0.4),
// 	})
// }