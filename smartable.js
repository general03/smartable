/*!
 * Add header in table to filter and sort rows
 * without modify the source <table>
 *
 * https://github.com/general03/smartable
 *
 * @author RIGAUDIE David
 * @version 0.0.1
 */

(function() {

    this.smartab = function() {

        // Element table
        this.table = null;

        // Define option defaults
        var defaults = {
            tabId : 'table',
            linkUpSort : '../img/up-sort.png',
            linkDownSort : '../img/down-sort.png',
            linkNoSort : '../img/sort.png',
            widthFilter : 100,
            widthCol : 170,
            unsortCols : [1],
            unfilterCols : [1]
        }

        // Create options by extending defaults with the passed in arguments
        if (arguments[0] && typeof arguments[0] === "object")
        {
          // Merge options
          this.options = extendDefaults(defaults, arguments[0]);
            
          // Get the table with id selector
          var elementNumberFounded = document.querySelectorAll(this.options.tabId);
          if(elementNumberFounded.length > 1){
            console.log(elementNumberFounded.length + " elements founded with selector : '" + this.options.tabId + "'");
            console.log('Saved the first element ' + this.options.tabId + ' !');
          }

          this.table = document.querySelector(this.options.tabId);
          if(this.table == null)
          {
            console.log("Table is not found with selector : "+this.options.tabId)
          }
          else
          {
		    // Check right column number for unsortCols
		    var listUnsort = this.options.unsortCols.join().split(',');
		    var maxUnsort = Math.max.apply( Math, listUnsort);

		    if(maxUnsort > this.table.rows[0].cells.length-1)
		  	  console.log("'unsortCols' options has wrong value");
			
			// Check right column number for unfilterCols
		    var listUnfilter = this.options.unfilterCols.join().split(',');
		    var maxUnfilter = Math.max.apply( Math, listUnfilter);

		    if(maxUnfilter > this.table.rows[0].cells.length-1)
			  console.log("'unfilterCols' options has wrong value");               
          }
        }
    }

    /** Private methods **/

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
          if (properties.hasOwnProperty(property)) {
            source[property] = properties[property];
          }
        }
        return source;
    }

    // Need to do it in order to have right i
    function callbackSortTable(instance, i ){
      return function(){
        instance.sortTable(i);
      }
    }

    /** Public methods **/
        
    // Sort
    smartab.prototype.sortTable = function(column){
        if(this.table == null)
        {
            console.log("Table is not found with selector : "+this.options.tabId)
        }
        else
        {
            var el = document.getElementById(this.options.tabId+"sort"+column);

            // asc
            var asc = 1;
            
            switch(el.dataset.sort)
            {
                case 'desc' :
                    el.src= this.options.linkDownSort;
                    el.setAttribute('data-sort','asc');
                    break;

                case 'asc' :
                    el.src=this.options.linkUpSort;
                    el.setAttribute('data-sort','desc');
                    // desc
                    var asc = -1;
                    break;

                default:
                    el.src=this.options.linkDownSort;
                    el.setAttribute('data-sort','asc');                    
                    break;
            }

            // Add Sort on columns not in options
            for(var i=0;i<this.table.rows[0].cells.length;i++){            
                if(i!=column && -1 == this.options.unsortCols.indexOf(i)){
                    document.getElementById(this.options.tabId+"sort"+i).src = this.options.linkNoSort;
                    document.getElementById(this.options.tabId+"sort"+i).setAttribute('data-sort', 'none');            
                }
            }

            var rows = this.table.rows, contentHtml = new Array(), arr = new Array(), arrayHidden = new Array(), i, j, cells, cellLength, rowLength = rows.length;
            
            // fill the array with values from the table
            for(i = 2; i < rowLength; i++){

                cells = rows[i].cells;
                cellLength = cells.length;
                   
                if(rows[i].style.display == 'none')
                {
                    arrayHidden[i-2] = new Array();
                }
                else
                {
                    arr[i-2] = new Array();                
                    arr[i-2]['cols'] = new Array();    
                    arr[i-2]['class'] = rows[i].className;    
                    //arr[i-2]['classChildren'] = new Array();                
                }

                for(j = 0; j < cellLength; j++)
                {
                    if(rows[i].style.display == 'none')
                    {
                        arrayHidden[i-2][j] = cells[j].innerHTML;
                    }
                    else
                    {    
                        arr[i-2]['cols'][j] = cells[j].innerHTML;        
                        //arr[i-2]['classChildren'][j] = cells[j].className;                          
                    }
                }
            }

            // sort the array by the specified column number (column) and order (asc)
            arr.sort(function(a, b){
                return (a['cols'][column] == b['cols'][column]) ? 0 : ((a['cols'][column] > b['cols'][column]) ? asc : -1*asc);
            });

            for(i = 0; i < arr.length; i++){
                if(arr[i]['cols'] != undefined && arr[i]['cols'].length > 0)
                    contentHtml[i] = "<td>"+arr[i]['cols'].join("</td><td>")+"</td>";
            }

            // Add the <tr> hidden
            if(arrayHidden.filter(Boolean).length > 0)
            {
                for(i = 0; i < arrayHidden.length; i++){
                  if(arrayHidden[i] != undefined && arrayHidden[i].length > 0)
                    arrayHidden[i] = "<td>"+arrayHidden[i].join("</td><td>")+"</td>";
                }
            }

            // Delete all rows without header
            while(this.table.rows[2] != undefined)
            {
                this.table.rows[2].remove();
            }

            // Create new content table sorted
            var content = document.createElement('tbody');
            var newContent = "";
            // .filter(Boolean) => remove empty
            contentHtml.filter(Boolean).forEach(function(element, index, array){
                newContent += '<tr class="'+arr[index]['class']+'">'+element+'</tr>';
            });
            content.innerHTML = newContent;

            content.innerHTML += '<tr style="display:none">'+arrayHidden.filter(Boolean).join('</tr><tr style="display:none">')+'</tr>';

            // Add tbody to table
            this.table.appendChild(content);
        }
    }

    // Filter
    smartab.prototype.filterTable = function(){
        if(this.table == null)
        {
            console.log("Table is not found with selector : "+this.options.tabId)
        }
        else
        {
            var indexRowHeader = 1;
            if(this.table.rows[1].getElementsByTagName('th').length != 0)
                indexRowHeader = 2;

            for(var i=indexRowHeader;i<this.table.rows.length;i++){
            
                this.table.rows[i].style.display = 'table-row';
                
                // Prevent the clic sort before apply filter text
                if(this.table.rows[i].cells.length == 0 )
                {
                    continue;
                }
                
                for(var j=0;j<this.table.rows[0].cells.length;j++){
                    // If filter is not permit
                    if(-1 != this.options.unfilterCols.indexOf(j))
                        continue;
                        
                    // Check the value to filter
                    if(this.table.rows[i].cells[j].innerHTML.indexOf(this.table.rows[0].cells[j].childNodes[0].value) == -1){
                        // The text does not match the cell content
                        this.table.rows[i].style.display = 'none';
                        break;
                    }
                }
            }
        }
    }

    // Add <input> to Sort and Filter
      smartab.prototype.addHeader = function() {
        if(this.table == null)
        {
            console.log("Table is not found with selector : "+this.options.tabId)
        }
        else
        {
            var _this = this;
            var columns = this.table.rows[0].cells.length;
            var newRow = this.table.insertRow(0);
			
            for(var i=0; i<columns; i++){
                var newcell = newRow.insertCell(i);
                newcell.style.setProperty('width', this.options.widthCol+"px");

                // Add Filter depending on options
                if(-1 == this.options.unfilterCols.indexOf(i))
                {
                    this.filterTableElement = document.createElement("input");
                    this.filterTableElement.type = "text";
                    this.filterTableElement.tabIndex = (i+1);
                    this.filterTableElement.onchange = function(){ _this.filterTable()};
                    this.filterTableElement.style.setProperty('display', 'inline');
                    this.filterTableElement.style.setProperty('width', this.options.widthFilter+"px");

                    newcell.appendChild(this.filterTableElement);
                }
                
                // Add Sort depending on options
                if(-1 == this.options.unsortCols.indexOf(i))
                {
                    var sortTableElement = document.createElement("img");
                    sortTableElement.id = this.options.tabId+'sort'+i;
                    sortTableElement.setAttribute('data-sort', 'none');
                    sortTableElement.src = this.options.linkNoSort;
                    sortTableElement.onclick = callbackSortTable(this, i);
                
                    newcell.appendChild(sortTableElement);
                }

            }
        }
    }
}());
