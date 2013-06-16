$(function() {
/***********************************************************************/
	//таблица с сортировкой по отображаемым данным
  var tableSortTd = new Tabless("table-sort-td");

  tableSortTd.init('data.xml', 'xml');


/***********************************************************************/
	//таблица с сортировкой по всем данным, не только по отображаемым
	var tableSortData = new Tabless("table-sort-data");

  tableSortData.init('data.json', 'json', true);

});
