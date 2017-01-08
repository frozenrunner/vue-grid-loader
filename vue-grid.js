Vue.component('vue-grid',{
  template: `<table id="testGrid" class="table is-bordered is-striped">
    <thead>
      <tr>
        <th v-for="header in tableHeader">
          {{header}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="tableRow in tableData">
        <td @click="renderInput($event)" v-for="data in tableRow">
          {{data}}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td v-show="dataLoaded" v-for="foot in tableFooter">
          {{foot}}
        </td>
      </tr>
    </tfoot>
  </table>`,
  props: ['initCsvData'],
  data() {
      return {
        highlightedRow: '',
        dataLoaded: false,
        activeInput: null,
      }
  },
  methods: {
    renderInput(event) {
      if (this.activeInput == null){
        var input = document.createElement("input");
        var target = event.target;
        input.value = event.target.textContent.trim();
        event.target.textContent = '';
        event.target.appendChild(input);
        var vueComponent = this;
        input.addEventListener("blur", function() {
          var textNode = document.createTextNode(input.value)
          target.removeChild(input);
          target.appendChild(textNode);
          vueComponent.activeInput = null;
        })
        this.activeInput = input
      }
    }
  },
  computed: {
    tableHeader: function(){
      return this.initCsvData[0];
    },
    tableData: function() {
      var tempCsvData = this.initCsvData;
      return tempCsvData.slice(1,51);
    },
    tableFooter: function() {
      var footer = {};
      var length = 0, width = 0, height = 0, price = 0;
      for (var i = 1, len = this.initCsvData.length-1; i < len; i++){
        length += parseFloat(this.initCsvData[i][3]);
        width += parseFloat(this.initCsvData[i][4]);
        height += parseFloat(this.initCsvData[i][5]);
        price += parseFloat(this.initCsvData[i][6]);
      }
      footer[0] = 'Totals';
      footer[1] = '';
      footer[2] = '';
      footer[3] = '$' + length.toFixed(2);
      footer[4] = '$' + width.toFixed(2);
      footer[5] = '$' + height.toFixed(2);
      footer[6] = '$' + price.toFixed(2);
      footer[7] = '';
      footer[8] = '';
      footer[9] = '';
      footer[10] = '';
      if (this.initCsvData.length > 0) {
        this.dataLoaded = true
      }
      return footer;
    }
  }
});

var Test = new Vue({
  el: "#root",
  data: {
    showGrid: false,
    csvTableData: ''
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
      for ( var i = 0, length = array.length; i < length; i++ )
      {
        var row = array[i].toString().split(',');
        var data = {};
        for ( var x = 0; x < row.length; x++ )
        {
          data[x] = row[x];
        }
        jsonData.push(data);
      }
      this.csvTableData = jsonData;
      this.dataLoaded = true;
    }
  }
})
