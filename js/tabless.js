/*

Copyright (c) 2013 Krivega Dmitriy, http://krivega.com

Licensed under the MIT license
http://en.wikipedia.org/wiki/MIT_License

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

$(document).ready(function () {

  var jSonData = {
    "result": [{
      "id": 1,
      "date": "1995-03-31",
      "client": "Mya 3",
      "amount": 2566,
      "tax": 69,
      "total": 1414,
      "notes": "Dignissim volutpat vulputate."
    }, {
      "id": 2,
      "date": "2008-04-07",
      "client": "Leah 3",
      "amount": 2700,
      "tax": 56,
      "total": 2578,
      "notes": "Quis dolore vulputate."
    }, {
      "id": 3,
      "date": "2007-05-14",
      "client": "Savannah 2",
      "amount": 2128,
      "tax": 124,
      "total": 1703,
      "notes": "Molestie velit consequat."
    }, {
      "id": 4,
      "date": "2006-07-14",
      "client": "Claire 1",
      "amount": 2550,
      "tax": 9,
      "total": 1861,
      "notes": "Hendrerit augue ullamcorper."
    }, {
      "id": 5,
      "date": "2009-07-08",
      "client": "Ava 2",
      "amount": 2561,
      "tax": 61,
      "total": 2846,
      "notes": "Nisl blandit blandit."
    }, {
      "id": 6,
      "date": "2011-04-12",
      "client": "Angelina 3",
      "amount": 1925,
      "tax": 128,
      "total": 1022,
      "notes": "Dolor te consectetuer."
    }, {
      "id": 7,
      "date": "2002-02-16",
      "client": "Ava 1",
      "amount": 437,
      "tax": 113,
      "total": 1861,
      "notes": "Volutpat ex laoreet."
    }, {
      "id": 8,
      "date": "1999-02-21",
      "client": "Isabelle 1",
      "amount": 2525,
      "tax": 36,
      "total": 2634,
      "notes": "Eum ut feugait."
    }, {
      "id": 9,
      "date": "2006-09-14",
      "client": "Camila 1",
      "amount": 2863,
      "tax": 130,
      "total": 1422,
      "notes": "Odio nonummy lobortis."
    }, {
      "id": 10,
      "date": "1988-02-25",
      "client": "Jocelyn 2",
      "amount": 1221,
      "tax": 86,
      "total": 2731,
      "notes": "Zzril consequat feugait."
    }, {
      "id": 11,
      "date": "2007-08-15",
      "client": "Sydney 1",
      "amount": 323,
      "tax": 58,
      "total": 1144,
      "notes": "Eum iriure blandit."
    }, {
      "id": 12,
      "date": "2006-10-02",
      "client": "Gabrielle 2",
      "amount": 2725,
      "tax": 17,
      "total": 1447,
      "notes": "Et in dolore."
    }, {
      "id": 13,
      "date": "2003-09-01",
      "client": "Melanie 3",
      "amount": 1890,
      "tax": 0,
      "total": 2452,
      "notes": "Augue consequat dolore."
    }, {
      "id": 14,
      "date": "2000-10-05",
      "client": "Avery 2",
      "amount": 1064,
      "tax": 92,
      "total": 1239,
      "notes": "Vulputate te esse."
    }]
  };


  function Tabless(table) {
    this.table = document.getElementById(table);
    this.tbody = this.table.getElementsByTagName('tbody')[0];
    this._allTrs = [];
    this._dataTrs = [];
    // значения по умолчанию
    this.amountVisibleRows = 5; // значение видимых строк
    this.page = 1; // страница
    this.curSortCol = 0;  // номер колонки, по которой выполнена текущая сортировка, считаем с 0
    
    this.curSortUp = true; // направление сортировки вверх
    this._sortData = false; // сортировка по видимым строкам

    // изменение страницы
    this.changePage = function (page) {
      this.page = page;
      this.update();
      return this;
    };
    
    // первая страница
    this.firstPage = function () {
			if (this.page == 1) return this;
      this.page = 1;
      this.update();
      return this;
    };
    // последняя страница
    this.lastPage = function () {
			if (this.page == this.pages) return this;
      this.page = this.pages;
      this.update();
      return this;
    };
    // следующая страница
    this.nextPage = function () {
      if (this.page == this.pages) return this;
      ++this.page;
      this.update();
      return this;
    };
    // предыдущая страница
    this.previousPage = function () {
      if (this.page == 1) return this;
      --this.page;
      this.update();
      return this;
    };
    // изменение количества видимых строк
    this.changeVisibleRows = function (amountVisibleRows) {
      this.amountVisibleRows = amountVisibleRows;
      this.page = 1;
      this.update();
      return this;
    };

    //заполнение таблицы данными
    this.update = function (data, sortData, page) {
      if (data) {
        this.data = data;
        this._dataTrToArr();
        this.data = this._dataTrs;
      }
      if (page) this.page = page;
      
      //выбираем сортировку по данным или по видимым строкам
      if (sortData == true) this._sortData = true;

      this.clear();

      // вычисляем количество видимых строк
      if (this.data.length < this.amountVisibleRows) {
        this.amountVisibleRows = this.data.length;
      }
      // количество страниц
      this.pages = Math.ceil(this.data.length / this.amountVisibleRows);

      // вычисляем номера строк для первой и последней на текущей странице
      var pageStart = this.amountVisibleRows * this.page - this.amountVisibleRows;
      var pageEnd = this.amountVisibleRows * this.page;
      if (pageEnd > this.data.length) pageEnd = this.data.length;
      if (this.page == 1) {
        pageStart = 0;
        pageEnd = this.amountVisibleRows;
      }
      this.pageStart = pageStart;
      this.pageEnd = pageEnd;
      console.log(this.page, this.pageStart, this.pageEnd);
      // заполняем таблицу данными
      var html, item;
      for (var i = this.pageStart; i < this.pageEnd; i++) {
        item = this.data[i];
        html = '<tr>'
        for (var j = 0; j < item.length; j++) {
          html += '<td>' + item[j] + '</td>'
        }
        html += '</tr>';
        this.tbody.innerHTML += html;
      };
      
      //и сразу же меняем направление сортировки и сортируем, если не сортировка по всем данным
      if (!this._sortData) {
				this.curSortUp = !this.curSortUp;
				this.initSort(this.curSortCol, Number);
			}else{
				this._arrToSortIcon();
			};
			
      return this;
    };

    // строки в массив
    this._trToArr = function () {
      this._allTrs.length = 0;
      for (var i = 0; i < this.tbody.children.length; i++) {
        this._allTrs.push(this.tbody.children[i]);
      }
      return this;
    };

    //данные в массив
    this._dataTrToArr = function () {
      this._dataTrs.length = 0;
      var item;
      for (var i = 0; i < this.data.length; i++) {
        item = this.data[i];
        var itemArr = [];
        itemArr.length = 0;
        for (var key in item) {
          itemArr.push(item[key])
        }
        this._dataTrs.push(itemArr);
      }
      return this;
    };

    // сортировка по колонке newCol
    this.initSort = function (newCol, normalize) {

      //выбираем сортировку по данным или по видимым строкам
      if (this._sortData) {
        var allTrs = this.data;
      } else {
        this._trToArr();
        allTrs = this._allTrs
      }

      if (newCol == this.curSortCol) {
        // кликнули на отсортированную колонку, меняем сортировку на обратную
        this.curSortUp = !this.curSortUp;
      } else {
        // сортируем по новой колонке
        this.curSortCol = newCol;
        this.curSortUp = true;
      }

      // вычисляем значение для сортировки(normalize-метод обработки значений)
      if (this._sortData) {
        for (var i = 0, row; row = allTrs[i]; i++) {
          row.sortValue = normalize(row[this.curSortCol]);
        }
      } else {
        for (var i = 0, row; row = allTrs[i]; i++) {
          row.sortValue = normalize(row.cells[this.curSortCol].innerHTML);
        }
      }

      // сортируем
      allTrs.sort(function (a, b) {
        return (a.sortValue > b.sortValue) || -(a.sortValue < b.sortValue);
      });

      if (!this.curSortUp) allTrs.reverse();

      // выставляем ряды в нужном порядке
      if (this._sortData) {
        this.data = allTrs;
        this.update();
      } else {
        for (var i = allTrs.length - 1, row, last = null; row = allTrs[i]; i--) {
          row.parentNode.insertBefore(row, last);
          last = row;
        }
      }
      
      //вставляем стрелку
      this._arrToSortIcon();
    };
    
    // иконка сортировки. Пришлось тут включить jquery для краткости
    this._arrToSortIcon = function () {
			var icon = $('#'+table+' th i');
			if(icon.length==0){
				$('#'+table+' 	th').append('<i></i>');
			}
			icon = $('#'+table+' th i');
			icon.removeAttr('class');
			this.curSortUp ? icon[this.curSortCol].setAttribute('class', 'icon-arrow-up icon-white') : icon[this.curSortCol].setAttribute('class', 'icon-arrow-down icon-white');
		};

    this.clear = function () {
      this.tbody.innerHTML='';
      return this;
    };
  }

  // функция сортировки даты в прототип конструктора
  Tabless.prototype.SORT_DATE = function (value) {
    return +new Date(value)
  };

  
  //функции сортировки для колонок по типам данных в прототип конструктора
  Tabless.prototype.sortTable = function (cellIndex) {
				
    if (cellIndex == 0) {			
      this.initSort(cellIndex,Number)
    } else if (cellIndex == 1) {
      this.initSort(cellIndex,this.SORT_DATE)
    } else if (cellIndex == 2) {
      this.initSort(cellIndex,String)
    } else if (cellIndex == 3) {
      this.initSort(cellIndex,Number)
    } else if (cellIndex == 4) {
      this.initSort(cellIndex,Number)
    } else if (cellIndex == 5) {
      this.initSort(cellIndex,Number)
    } else if (cellIndex == 6) {
      this.initSort(cellIndex,String)
    };
	};



/***********************************************************************/
	//таблица с сортировкой по видимым данным
  tableSortTd = new Tabless("table-sort-td");

  tableSortTd.update(jSonData.result);

	//сортировка по клику на заголовок
  $("#table-sort-td").on('click', 'th', function () {
		tableSortTd.sortTable(this.cellIndex);
  });			
	
	//заполнение футера таблицы начальными данными
  $("#table-sort-td .table-view-start").html(tableSortTd.pageStart + 1);
  $("#table-sort-td .table-view-end").html(tableSortTd.pageEnd);
  $("#table-sort-td .table-view-amount").html(tableSortTd.data.length);
  $("#table-sort-td .table-pages").html(tableSortTd.pages);

	//на первую страницу
  $("#table-sort-td .first-page").on('click', function () {

    tableSortTd.firstPage();
    $("#table-sort-td .input-page").val(tableSortTd.page);
    $("#table-sort-td .table-view-start").html(tableSortTd.pageStart + 1);
    $("#table-sort-td .table-view-end").html(tableSortTd.pageEnd);
    
    return false;
  });

	//на последнюю
  $("#table-sort-td .last-page").on('click', function () {
    tableSortTd.lastPage();
    $("#table-sort-td .input-page").val(tableSortTd.page);
    $("#table-sort-td .table-view-start").html(tableSortTd.pageStart + 1);
    $("#table-sort-td .table-view-end").html(tableSortTd.pageEnd);

    return false;
  });
	
	//на следующую
  $("#table-sort-td .next-page").on('click', function () {
    tableSortTd.nextPage();
    $("#table-sort-td .input-page").val(tableSortTd.page);
    $("#table-sort-td .table-view-start").html(tableSortTd.pageStart + 1);
    $("#table-sort-td .table-view-end").html(tableSortTd.pageEnd);

    return false;
  });

	//на предыдущую
  $("#table-sort-td .previous-page").on('click', function () {
    tableSortTd.previousPage();
    $("#table-sort-td .input-page").val(tableSortTd.page);
    $("#table-sort-td .table-view-start").html(tableSortTd.pageStart + 1);
    $("#table-sort-td .table-view-end").html(tableSortTd.pageEnd);

    return false;
  });
	
	//ввод страницы вручную
  $("#table-sort-td .input-page").on('keydown', function () {
    var $this = $(this);
    if (event.which == 13) {
      var value = $this.val();
      $this.blur();
      tableSortTd.changePage(value);
      $("#table-sort-td .table-view-start").html(tableSortTd.pageStart + 1);
      $("#table-sort-td .table-view-end").html(tableSortTd.pageEnd);

      return false;
    }
  });

	//выбор количества отображаемых строк
  $("#table-sort-td .select-show-rows").on('change', function () {
    var $this = $(this);
    var value = $this.val();
    tableSortTd.changeVisibleRows(value);
    $("#table-sort-td .input-page").val(tableSortTd.page);
    $("#table-sort-td .table-view-start").html(tableSortTd.pageStart + 1);
    $("#table-sort-td .table-view-end").html(tableSortTd.pageEnd);
    $("#table-sort-td .table-pages").html(tableSortTd.pages);
    return false;
  });
  

/***********************************************************************/
	//таблица с сортировкой по всем данным, не только по видимым
	tableSortData = new Tabless("table-sort-data");

  tableSortData.update(jSonData.result, true)

	//сортировка по клику на заголовок
  $("#table-sort-data").on('click', 'th', function () {
		tableSortData.sortTable(this.cellIndex);
  });			
	
	//заполнение футера таблицы начальными данными
  $("#table-sort-data .table-view-start").html(tableSortData.pageStart + 1);
  $("#table-sort-data .table-view-end").html(tableSortData.pageEnd);
  $("#table-sort-data .table-view-amount").html(tableSortData.data.length);
  $("#table-sort-data .table-pages").html(tableSortData.pages);

	//на первую страницу
  $("#table-sort-data .first-page").on('click', function () {

    tableSortData.firstPage();
    $("#table-sort-data .input-page").val(tableSortData.page);
    $("#table-sort-data .table-view-start").html(tableSortData.pageStart + 1);
    $("#table-sort-data .table-view-end").html(tableSortData.pageEnd);
    
    return false;
  });

	//на последнюю
  $("#table-sort-data .last-page").on('click', function () {
    tableSortData.lastPage();
    $("#table-sort-data .input-page").val(tableSortData.page);
    $("#table-sort-data .table-view-start").html(tableSortData.pageStart + 1);
    $("#table-sort-data .table-view-end").html(tableSortData.pageEnd);

    return false;
  });
	
	//на следующую
  $("#table-sort-data .next-page").on('click', function () {
    tableSortData.nextPage();
    $("#table-sort-data .input-page").val(tableSortData.page);
    $("#table-sort-data .table-view-start").html(tableSortData.pageStart + 1);
    $("#table-sort-data .table-view-end").html(tableSortData.pageEnd);

    return false;
  });

	//на предыдущую
  $("#table-sort-data .previous-page").on('click', function () {
    tableSortData.previousPage();
    $("#table-sort-data .input-page").val(tableSortData.page);
    $("#table-sort-data .table-view-start").html(tableSortData.pageStart + 1);
    $("#table-sort-data .table-view-end").html(tableSortData.pageEnd);

    return false;
  });
	
	//ввод страницы вручную
  $("#table-sort-data .input-page").on('keydown', function () {
    var $this = $(this);
    if (event.which == 13) {
      var value = $this.val();
      $this.blur();
      tableSortData.changePage(value);
      $("#table-sort-data .table-view-start").html(tableSortData.pageStart + 1);
      $("#table-sort-data .table-view-end").html(tableSortData.pageEnd);

      return false;
    }
  });

	//выбор количества отображаемых строк
  $("#table-sort-data .select-show-rows").on('change', function () {
    var $this = $(this);
    var value = $this.val();
    tableSortData.changeVisibleRows(value);
    $("#table-sort-data .input-page").val(tableSortData.page);
    $("#table-sort-data .table-view-start").html(tableSortData.pageStart + 1);
    $("#table-sort-data .table-view-end").html(tableSortData.pageEnd);
    $("#table-sort-data .table-pages").html(tableSortData.pages);
    return false;
  });

});
