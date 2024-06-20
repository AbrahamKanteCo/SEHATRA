//Date range as a button
$(document).ready(function() {
	moment.locale('fr')
	$('#daterange-btn').daterangepicker({
		ranges: {
			'Aujourd\'hui': [moment(), moment()],
			'Hier': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'7 derniers jours': [moment().subtract(6, 'days'), moment()],
			'30 derniers jours': [moment().subtract(29, 'days'), moment()],
			'Ce mois': [moment().startOf('month'), moment().endOf('month')],
			'Le mois dernier': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		},
		startDate: moment().subtract(29, 'days'),
		endDate: moment()
	}, function(start, end) {
		$('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
		filtrerparDate(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'));
	})
})