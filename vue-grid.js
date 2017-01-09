Vue.component('vue-grid',{
  template: `
  <div v-show="dataLoaded" class="box">
    <table id="testGrid" class="table is-bordered is-striped has-shadow">
      <thead>
        <tr>
          <th v-for="header in tableHeader">
            {{header}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tableRow, rowId) in tableData">
          <td @click="renderInput(rowId+1, parseInt(colId), $event)" v-for="(data, colId) in tableRow">
            <span :id="getSpanId(rowId+1, colId)">{{data}}</span>
            <input :id="getInputId(rowId+1, colId)" class="input" @keyup.enter="saveInput" @keyup.esc="revertInput(rowId+1, parseInt(colId))" style="display: none;" v-model="initCsvData[rowId+1][colId]"/>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th v-show="dataLoaded" v-for="foot in tableFooter">
            {{foot}}
          </th>
        </tr>
      </tfoot>
    </table>
  </card>`,
  props: ['initCsvData', 'data'],
  data() {
      return {
        highlightedRow: '',
        dataLoaded: false,
        isInputActive: false,
        activeInput: null,
        activeSpan: null,
        oldValue: ''
      }
  },
  methods: {
    getInputId(rowId, colId) {
      return 'vgInput_' + rowId + '_' + colId;
    },
    getSpanId(rowId, colId) {
      return 'vgSpan_' + rowId + '_' + colId;
    },
    renderInput(rowId, colId, event) {
      if (!this.isInputActive) {
        var activeInput;
        var activeSpan;

        if (event.target.tagName === 'SPAN') { //replace with switch?
          activeSpan = event.target;
          activeInput = event.target.parentNode.querySelector('input');
        } else if (event.target.tagName ==='INPUT') {
          activeInput = event.target;
          activeSpan = event.target.parentNode.querySelector('span');
        } else {
          activeSpan = event.target.querySelector('span');
          activeInput = event.target.querySelector('input');
        }

        activeInput.style.display = 'inline';
        activeSpan.style.display = 'none';
        this.oldValue = this.initCsvData[rowId][colId];

        this.isInputActive = true;
        this.activeSpan = activeSpan;
        this.activeInput = activeInput;
        this.activeInput.focus();
      } else {
        if (event.target.tagName !=='INPUT'){
          this.saveInput();
          this.renderInput(rowId, colId, event);
        }
      }
    },
    saveInput(){
      this.activeSpan.style.display = 'inline';
      this.activeInput.style.display = 'none';
      this.activeSpan = null;
      this.activeInput = null;
      this.isInputActive = false;
    },
    revertInput(rowId, colId) {
      this.initCsvData[rowId][colId] = this.oldValue;
      this.oldValue = '';
      this.saveInput();
    }
  },
  computed: {
    tableHeader() {
      return this.initCsvData[0];
    },
    tableData() {
      var tempCsvData = this.initCsvData;
      return tempCsvData.slice(1,51);
    },
    tableFooter() {
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
    processData(csv) {
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
