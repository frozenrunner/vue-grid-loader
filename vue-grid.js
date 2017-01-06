new Vue({
  el: "#root",
  data: {
    highlightedRow: '',
    dataLoaded: false,
    tableData: {}
  },
  methods: {
    readFile(event) {
      var fileInput = event.target;
      var file = fileInput.files[0];
      var textType = /text.*/;

      var vueInstance = this;
      var reader = new FileReader();

      reader.onload = function(e) {
        vueInstance.processData(reader.result);
      }
      reader.readAsText(file);
    },
    processData(csv){
      var allTextLines = csv.split(/\r\n|\n/);
      var lines = [];
      for (var i=0; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(';');
              var tarr = [];
              for (var j=0; j<data.length; j++) {
                  tarr.push(data[j]);
              }
              lines.push(tarr);
      }
      this.jsonDataArray(lines);
    },
    jsonDataArray(array) {
      var headers = array[0].toString().split(',');
      var jsonData = [];
      for ( var i = 1, length = array.length; i < length; i++ )
      {
        var row = array[i].toString().split(',');
        var data = {};
        for ( var x = 0; x < row.length; x++ )
        {
          data[headers[x]] = row[x];
        }
        jsonData.push(data);
      }

      this.tableData = {'page': '1', 'records': '100', 'rows': jsonData};
      this.dataLoaded = true;

      $("#testGrid").jqGrid({
    	datatype: "jsonstring",
      datastr: this.tableData,
      jsonReader: {repeatitems: false},
    	height: 250,
       	colNames:['Id','Description', 'Name', 'Length','Width','Height','Price', 'Territory', 'Class', 'Factor'],
       	colModel:[
       		{name:'Id',index:'Id', width:60, sortable:false},
       		{name:'Description',index:'Description', width:90, sortable:false},
       		{name:'Name',index:'Name', width:100, sortable:false},
       		{name:'Length',index:'Length', width:80, align:"right", sortable:false},
       		{name:'Width',index:'Width', width:80, align:"right", sortable:false},
       		{name:'Height',index:'Height', width:80,align:"right", sortable:false},
       		{name:'Price',index:'Price', width:150, sortable:false},
       		{name:'Territory',index:'Territory', width:150, sortable:false},
       		{name:'Class',index:'Class', width:150, sortable:false},
       		{name:'Factor',index:'Factor', width:150, sortable:false},
       	]});
    }
  }
})
