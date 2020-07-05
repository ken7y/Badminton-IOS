import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
 
export default class ExampleFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Loading"],
      tableData: [
        ["Loading"]
      ]
      ,items: [], 
      loading: true,
      response: null,
      date: "Today"
    }
  }


 componentDidMount() {
    console.log('component did mount')
    this.getTodayData();
}

getTodayData() {
  try {
    console.log("Trying API", this.state);
    axios.get("https://roan-astonishing-dinner.glitch.me/today")
    .then(response => {
        console.log(response.data);
        this.setState({ response: response.data, loading: false, date: "Today" }, () => {
        this.processHeaders();
      });
    })
} catch(err) {
    console.log("Error fetching data-----------", err);
}
}

getTomorrowData() {
    try {
        console.log("Trying API", this.state);
        axios.get("https://roan-astonishing-dinner.glitch.me/tomorrow")
        .then(response => {
            console.log(response.data);
            this.setState({ response: response.data, loading: false, date: "Tomorrow" }, () => {
            this.processHeaders();
          });
        })
    } catch(err) {
        console.log("Error fetching data-----------", err);
    }
}

 convertTime12to24 = (time12h) => {
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
    keys.push("Time")
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
        if (respArr == "default") { continue; }
        var column = i + 1;
        console.log("respArr: " + respArr)
        for (var x in respArr){
            var res = respArr[x].split("–");  
            var time = parseInt(this.convertTime12to24(res[0]).substring(0,2));
            arr[time - 7][column] = "FREE"
            this.setState({
                tableData: arr,
            })
        }

      }
  }

  render() {
    const state = this.state;
    const elementFree = (data, index) => (
        <View >
          <Text style={styles.freeText}>FREE</Text>
        </View>
    );
 
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{this.state.date}</Text>

        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          {
            state.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data= {cellData == "FREE" ? elementFree() : cellData} textStyle={styles.text}/>
                  ))
                }
              </TableWrapper>
            ))
          }
        </Table>


        <View style={styles.buttonContainer} >        
        <TouchableOpacity onPress={() => this.getTodayData()}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Today</Text>
        </View>
       </TouchableOpacity>

        <TouchableOpacity onPress={() => this.getTomorrowData()}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Tomorrow</Text>
        </View>
       </TouchableOpacity>
       </View>


      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 4, backgroundColor: '#fff'},
  buttonContainer: { flex: 1, flexDirection:"row", justifyContent: "space-around", paddingTop: 14},
  head: { height: 40, backgroundColor: '#228B97' },
  header: {fontSize:24, textAlign:"center", paddingBottom: 20 },
  text: { margin: 11, textAlign: "center" },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 88, height: 24, backgroundColor: '#78B7BB',  borderRadius: 2},
  btnText: { textAlign: 'center', color: '#fff', fontSize: 18 },
  freeText: {color: '#32CD32', textAlign: 'center' },
  takenText: {color: '#B22222', textAlign: 'center' }
});