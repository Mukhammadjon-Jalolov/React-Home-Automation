import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client'
import ReactDOM from 'react-dom';
import Automation from './Automation';
import Linechart from './Linechart';

class App extends Component {
	constructor(props) {
		super(props);
		
		//const {numbers, response, endpoint} = this.props;
		
		this.state = {
			devices: [],
			deviccc: ["Lamp", "Lamp2"],
			endpoint: "http://194.95.194.122:8086",
		};
	}
	
	componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
	socket.emit('getAllValuesOnChange');
		socket.emit('getAllDevicesOnChange');
		socket.emit('getReadingOnChange', {
				unit: 'unit-name',
				reading: 'reading-name'
			});
			
			socket.emit('command', 'jsonlist2', data => this.filter(data));

	socket.on('value', data => this.listenchange(data));
	}
	
	
	filter = (color) => {
			var realmodel = [];
			var stringform = color.join("");
			var re = /Bye.../gi;
			var purestr = stringform.replace(re, " ");
			var jsobj = JSON.parse(purestr);
			
			for (var i=0; i < jsobj.Results.length; i++) {
				if(!/((new)|(fs20log)|(temp)|(telnet)|(WEB)|(autocreate)|(global)|(Logfile)|(initialUsb)|(eventTypes)|(CUL)|(FileLog)|(HM_)|(Action))/.test(jsobj.Results[i].Name)) {
					realmodel.push(jsobj.Results[i]);
				}
			} 
			
		this.setState({ devices: realmodel })
		console.log(realmodel);
	}
	
	listenchange = (change) => {
		for (let devnam in change){
			for (var i=0; i < this.state.devices.length; i++) {
				if (devnam === this.state.devices[i].Name) {
					console.log(change);
					
					let copydevices = JSON.parse(JSON.stringify(this.state.devices))
					copydevices[i].Internals.STATE = change[devnam];
					
					this.setState({
						devices: copydevices
						})
				}
			}
		}
	}
	
	test = (param, event) => {
		const socket = socketIOClient(this.state.endpoint);
		console.log(param + " is " + event.target.checked);
		if (event.target.checked === true) {
			socket.emit('command', 'set ' + param + ' on');
		}else{
			socket.emit('command', 'set ' + param + ' off');
		}
	}
	
  render() {
	
	const { devices } = this.state;
	const { endpoint } = this.state;
	
	const tryit = <Automation devices = {devices} endpoint = {endpoint}/>
	const listItem = this.state.devices.map((device, id) =>
  <li key={id}>
		<div className="elements">
<div className="status">
	<h4>{device.Name}  {device.Internals.STATE}&nbsp;&nbsp; </h4>
</div>
<div className="button">
	<label className="switch">
	<input type="checkbox" onChange={this.test.bind(this, device.Name)}/>
	<span className="slider round"></span>
	</label>
</div>
<div className="slidecontainer">
		<Content PossibleSets={device.PossibleSets} Name={device.Name} endpoint = {endpoint}/>
</div>
		</div>
  </li>
	);
	
    return (
      <div className="App">
	<header>
	<h1>FHEM Home <img src={logo} className="App-logo" alt="logo"/>  </h1>
	</header>
	
	  <article>
	  <ul>
	  {listItem}
	  </ul>
	  </article>
	  {tryit}
	  <Linechart devices = {this.state.devices} endpoint = {this.state.endpoint} deviccc = {this.state.deviccc}/>
	  <footer>FHEM home</footer>
	  </div>
    );
  }
}

class Content extends React.Component {
	constructor(props) {
		super(props);
	}
	
	handlerChange = (param, event) => {
	const socket = socketIOClient(this.props.endpoint);
	socket.emit('command', 'set ' + param + ' dim' + event.target.value + '%');
	}
	
   render() {
		let range;
	
	if (this.props.PossibleSets.includes('dim')) {
		range = <input type="range" onChange={this.handlerChange.bind(this, this.props.Name)} />
	}
	
      return (
         <div>
				{range}
         </div>
      );
   }
}

export default App;
