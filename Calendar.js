import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
 
export default class ExampleFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: props.tableHead,
      tableData: [
        ['1', '2', '3'],
        ['a', 'b', 'c' ],
        ['1', '2', '3'],
        ['a', 'b', 'c']
      ]
      ,items: [], 
      loading: true,
      response: {"victor":["10:00am–11:00am","11:00am–12:00pm","7:00pm–8:00pm","10:00am–11:00am","9:00am–10:00am","12:00pm–1:00pm"],"nbc_silverwater":["9:00am–10:00am","7:00pm–8:00pm","7:00pm–8:00pm","9:00am–10:00am","7:00pm–8:00pm","9:00pm–10:00pm","4:00pm–5:00pm","6:00pm–7:00pm","7:00pm–8:00pm","9:00pm–10:00pm","12:00pm–1:00pm","1:00pm–2:00pm"],"nbc_homebush":["7:00am–8:00am","8:00am–9:00am","11:00am–12:00pm","5:00pm–6:00pm","6:00pm–7:00pm","11:00am–12:00pm","12:00pm–1:00pm","4:00pm–5:00pm","4:00pm–5:00pm"]}
    }
  }

//   async componentDidMount() {
//     console.log('component did mount')
//     try {
//         console.log("Trying API", this.state);
//         const response = await fetch('https://serene-ocean-36002.herokuapp.com/today');
      
//         console.log("--------------Done API----------------");

//         this.setState({ items: response, loading: false }, () => {
//             console.log("App Component - State Updated", this.state);
//           });

//     } catch(err) {
//         console.log("Error fetching data-----------", err);
//     }
// }

 convertTime12to24 = (time12h) => {
    // const [time, modifier] = time12h.split(' ');
    
    var  modifier = time12h.slice(-2);
    var time = time12h.substring(0, time12h.length-2);
    console.log(time + " ::::: TIME");
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'pm') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }

  

  _alertIndex(index) {
    Alert.alert(`This is row ${this.processHeaders()}`);
  }
  processHeaders() { 
    var temp = this.state.response; 
    var keys = [];
    keys.push("time")
    for(var k in temp) keys.push(k);
    this.setState({
        tableHead: keys,

    })
    this.generateTable(keys.length)
    return (keys);
  }

  generateTable(keySize) {
    var arr = [];
    for (var i = 0; i < 16; i++) {
        arr[i] = new Array(keySize).fill("X");
        arr[i][0] = (i + 7).toString() + ":00";
    }

    this.setState({
        tableData: arr,
    })
    this.consumeResponse(arr);
  }

  consumeResponse(arr){
      response = this.state.response;

      var keys = [];
      for(var k in response) keys.push(k);

      for (var i = 0; i < keys.length; i++) {
        var respArr = response[keys[i]];
        var column = i + 1;
        console.log(respArr)
        for (var x in respArr){
            var res = respArr[x].split("–");  
            console.log(respArr[x] + "   xxxxxx   " ) 

            console.log(res[0] + "   00000   " ) 
            var time = parseInt(this.convertTime12to24(res[0]).substring(0,2));
            console.log(time)
            console.log(column)
            console.log(arr)

            arr[time - 7][column] = "FREE"
            this.setState({
                tableData: arr,
            })
        }

      }
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
       </TouchableOpacity>
    );
 
    return (
      <View style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          {
            state.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data={cellData == 3 ? element(cellData, index) : cellData} textStyle={styles.text}/>
                  ))
                }
              </TableWrapper>
            ))
          }
        </Table>
      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' }
});