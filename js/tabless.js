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
var Tabless = (function ($) { 

    
  function Tabless(table) {
    var self = this;
    this.table = document.getElementById(table);
    this.$table = $('#'+table);
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
    
    this.init = function (url, dataType, sortData) {
      if (url && dataType) {
        this.getData(url, dataType);
      }
      //выбираем сортировку по данным или по видимым строкам
      if (sortData == true) this._sortData = true;
    };
    
    // получение данных с сервера
    this.getData = function (url, dataType) {
      $.ajax({
        dataType: dataType,
        url: url,
        //crossDomain: true
      }).done(function(data) {
        if(dataType=='xml'){
          var json = $.xml2json(data).result;
        }else{
          json = data.result;
        };
        self.data = json;
        self._dataTrToArr();
        self.update();
        self._initEvent();
      }).fail(function(jqXHR, textStatus) {
        showAlert( "Request failed: " + textStatus );
      });;        
      return this;
    };
    
    //заполнение таблицы данными
    this.update = function () {
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
      // заполняем таблицу данными
      var html = '', item;
      for (var i = this.pageStart; i < this.pageEnd; i++) {
        item = this.data[i];
        html += '<tr>';
        for (var j = 0; j < item.length; j++) {
          html += '<td>' + item[j] + '</td>';
        }
        html += '</tr>';
      };
      this.tbody.innerHTML = html;
      
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
      this.data = this._dataTrs;
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
			var $icon = this.$table.find('th i');
			if($icon.length==0){
				this.$table.find('th').append('<i></i>');
			}
			$icon = this.$table.find('th i');
			$icon.removeAttr('class');
			this.curSortUp ? $icon[this.curSortCol].setAttribute('class', 'icon-arrow-up icon-white') : $icon[this.curSortCol].setAttribute('class', 'icon-arrow-down icon-white');
		};
    
    // функция сортировки даты 
    this.SORT_DATE = function (value) {
      return +new Date(value)
    };
    
    //функции сортировки для колонок по типам данных 
    this.sortTable = function (cellIndex) {        
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
    //устанавливаем обработчики
    this._initEvent = function () {
      this.$table.on('click', 'th', function () {
        self.sortTable(this.cellIndex);
      });
    
      //на первую страницу
      this.$table.find(".first-page").on('click', function () {
        self.firstPage();
        self.$table.find(".input-page").val(self.page);
        self.$table.find(".table-view-start").html(self.pageStart + 1);
        self.$table.find(".table-view-end").html(self.pageEnd);      
        return false;
      });
      
      //на последнюю
      this.$table.find(".last-page").on('click', function () {
        self.lastPage();
        self.$table.find(".input-page").val(self.page);
        self.$table.find(".table-view-start").html(self.pageStart + 1);
        self.$table.find(".table-view-end").html(self.pageEnd);    
        return false;
      });
      
      //на следующую
      this.$table.find(".next-page").on('click', function () {
        self.nextPage();
        self.$table.find(".input-page").val(self.page);
        self.$table.find(".table-view-start").html(self.pageStart + 1);
        self.$table.find(".table-view-end").html(self.pageEnd);    
        return false;
      });
      
      //на предыдущую
      this.$table.find(".previous-page").on('click', function () {
        self.previousPage();
        self.$table.find(".input-page").val(self.page);
        self.$table.find(".table-view-start").html(self.pageStart + 1);
        self.$table.find(".table-view-end").html(self.pageEnd);    
        return false;
      });
      
      //ввод страницы вручную
      this.$table.find(".input-page").on('keydown', function (event) {
        var $this = $(this);
        if (event.which == 13) {
          var value = $this.val();
          $this.blur();
          self.changePage(value);
          self.$table.find(".table-view-start").html(self.pageStart + 1);
          self.$table.find(".table-view-end").html(self.pageEnd);
    
          return false;
        }
      });
    
      //выбор количества отображаемых строк
      this.$table.find(".select-show-rows").on('change', function () {
        var $this = $(this);
        var value = $this.val();
        self.changeVisibleRows(value);
        self.$table.find(".input-page").val(self.page);
        self.$table.find(".table-view-start").html(self.pageStart + 1);
        self.$table.find(".table-view-end").html(self.pageEnd);
        self.$table.find(".table-pages").html(self.pages);
        return false;
      });
      
      //заполнение футера таблицы начальными данными
      this.$table.find(".table-view-start").html(self.pageStart + 1);
      this.$table.find(".table-view-end").html(self.pageEnd);
      this.$table.find(".table-view-amount").html(self.data.length);
      this.$table.find(".table-pages").html(self.pages);
            
    };
    
    this.clear = function () {
      this.tbody.innerHTML='';
      return this;
    };
  }


//Единая, переопределяемая задержка для действий или функций
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

// Общие функции вывода сообщений
function showAlert(msg, type, callback) {
    if (!type) { var type = 'alert-error' }
    var alert = '<div class="alert '+type+' fade in">\
    <button type="button" class="close" data-dismiss="alert">×</button>'
    +'<span class="alert-text">'+msg+'</span></div>'
    $('#alert-place').html(alert);
    $(window).scrollTop(0);
    $('.alert').alert();
    if (callback) { delay(callback, 3000);
    } else { delay(hideAlert, 3000); }
    return false;
}

function hideAlert() { $('.alert').alert('close'); }

return Tabless;

}($));
