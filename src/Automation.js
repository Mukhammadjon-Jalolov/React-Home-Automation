import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client'
import ReactDOM from 'react-dom';

class Automation extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			value: 'Select a device',
			action: 'Select event',
			time: '',
			miniactions: [],
			miniactions2: [],
			again: 0,
			minitasks: [],
			clear: 0,
			miniactionadded: false,
			hardcommands: ["dim50%", "dim100%", "on-for-timer", "on-till"]
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSet = this.handleSet.bind(this);
		this.general = this.general.bind(this);
		this.handleTime = this.handleTime.bind(this);
		this.test = this.test.bind(this);
		this.deletemini = this.deletemini.bind(this);
		this.savemini = this.savemini.bind(this);
	}
	
	createSelectItems() {
		let items = [];
		for (let i = 0; i < this.props.devices.length; i++) {
			items.push(<option key={i} value={this.props.devices[i].Name}>{this.props.devices[i].Name}</option>);
		}
		return items;
	}
	
	createSelectSets(seldevs) {
		var sets = [];
		for (let i = 0; i < this.props.devices.length; i++) {
			if (this.props.devices[i].Name == seldevs) {
				if (this.props.devices[i].PossibleSets.length > 1) {
					var intermed = this.props.devices[i].PossibleSets.split(" ");
						for (let i = 0; i < intermed.length; i++) {
							for (let j = 0; j < this.state.hardcommands.length; j++) {
								if (this.state.hardcommands[j] == intermed[i]) {
									sets.push(<option key={j} value={this.state.hardcommands[j]}>{this.state.hardcommands[j]}</option>);
								}
							}
						}
					}
					sets.push(<option key={"on"} value={"on"}>on</option>);
					sets.push(<option key={"off"} value={"off"}>off</option>);
				}
			}
		return sets;
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
		window.alert("You have selected " + event.target.value);
	}
	
	handleSet(event) {
		this.setState({action: event.target.value});
		window.alert("You have selected " + event.target.value);
	}

	handleTime(event) {
		this.setState({time: event.target.value});
		console.log("You have selected " + event.target.value);
	}
	
	general () {
		const socket = socketIOClient(this.props.endpoint);
		
		
		var complexorbasic = '';
		var atornotifyorempty = '';
		var finaltasks = '';
		var partcommand = '';
		
		var ifpart = " IF ([" + this.state.value + "] eq " + '"' + this.state.action + '") '; // Complete!
		
		//socket.emit('command', "set " + this.state.value + " " + this.state.action + this.state.daily + " " + this.state.time);
		
		if (this.state.minitasks.length) {
			complexorbasic = "complex";
			finaltasks = "( " + this.state.minitasks + " )";
		} else if (!this.state.minitasks.length) {
			complexorbasic = "basic";
			ifpart = '';
			finaltasks = ' set ' + this.state.value + " " + this.state.action;
		}
		
		if (this.state.time) {
			atornotifyorempty = " at " + this.state.time;
		} else if (!this.state.time) {
			atornotifyorempty = " notify " + this.state.value;
		}
		
		if (!this.state.minitasks.length && !this.state.time) {
			partcommand = finaltasks;
		} else {
			partcommand = "define " + complexorbasic + this.state.value + atornotifyorempty + ifpart + finaltasks;
		}
		
		console.log(partcommand);
	}
	
	test () {
		this.setState({again: this.state.again + 1});
		this.state.miniactions.push(this.state.again);
		this.setState({miniactions2: this.state.miniactions})
		this.setState({miniactionadded: true})
	}
	
	deletemini (child) {
		for (let i = 0; i < this.state.miniactions.length; i++) {
			if (this.state.miniactions[i] == child) {
				this.setState({again: this.state.again - 1}); //????
				this.state.miniactions.splice(i, 1);
				//delete this.state.miniactions[i];
				//this.setState({miniactions2: []}); //????
				this.setState({miniactions2:this.state.miniactions});
				console.log(this.state.miniactions);
			}
		}
	}
	
	savemini (object, third) {
		this.state.minitasks.push(object);
		
	}
	
	render() {
	const button = <button onClick = {this.general}> Set </button>
	
	const listItem = this.state.miniactions2.map((ident, id) =>
	  <li key={id}>
	  <div>
		<MiniAutomation devices = {this.props.devices} deletemini = {this.deletemini} savemini = {this.savemini} hardcommands = {this.state.hardcommands}/>
	  </div>
	  </li>
		);
	
    return (
	<div>
	<select value={this.state.value} onChange={this.handleChange}>
       {this.createSelectItems()}
	</select>
	<select value={this.state.action} onChange={this.handleSet}>
       {this.createSelectSets(this.state.value)}
	</select>
	<input type="time" onChange={this.handleTime} />
	{button}
	<br/><br/>
	<button onClick = {this.test}> Add Action </button>
	<br/><br/>
	<ul>
		{listItem}
	</ul>
	</div>
    );
  }
  
}


class MiniAutomation extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			value: '',
			action: '',
			info: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSet = this.handleSet.bind(this);
		this.deleteminiaction = this.deleteminiaction.bind(this);
		this.saveminiaction = this.saveminiaction.bind(this);
	}
	// Child component create dropdown list // -----------------------------------------------------
	createSelectItems() {
		let items = [];
		for (let i = 0; i < this.props.devices.length; i++) {
			items.push(<option key={i} value={this.props.devices[i].Name}>{this.props.devices[i].Name}</option>);
		}
		return items;
	}
	
	createSelectSets(seldevs) {
	var sets = [];
		for (let i = 0; i < this.props.devices.length; i++) {
			if (this.props.devices[i].Name == seldevs) {
				if (this.props.devices[i].PossibleSets.length > 1) {
					var intermed = this.props.devices[i].PossibleSets.split(" ");
					
						for (let i = 0; i < intermed.length; i++) {
							sets.push(<option key={i} value={intermed[i]}>{intermed[i]}</option>);
							/*for (let j = 0; j < this.props.hardcommands.length; j++) {
								if (this.props.hardcommands[j] == intermed[i]) {
									//sets.push($scope.hardcommands[j]);
									sets.push(<option key={j} value={this.props.hardcommands[j]}>{this.props.hardcommands[j]}</option>);
								}
							} */
						}
						
					}
					//sets.push(<option key={"on"} value={"on"}>on</option>);
					//sets.push(<option key={"off"} value={"off"}>off</option>);
				}
			}
		return sets;
	}
	// ----------------------------------------------------------------------------------------------
	handleChange(event) {
		this.setState({value: event.target.value});
		console.log("You have selected " + event.target.value);
		/*if (this.state.action){
			this.props.deletemini(this.state.value + " and " + this.state.action)
		}*/
	}
	
	handleSet(event) {
		this.setState({action: event.target.value});
		console.log("You have selected " + event.target.value);
		/*if (this.state.value){
			this.props.deletemini(this.state.value + " and " + this.state.action)
		}*/
	}
	
	deleteminiaction () {
		//passing miniaction to parent component
		this.props.deletemini(this.props.ident);
	}
	
	saveminiaction () {
		if (this.state.value && this.state.action) {
			var object = "set " + this.state.value + " " + this.state.action;
			
			this.setState({info: "Saved!"})
			this.props.savemini(object, this.props.ident);
		} else {
			this.setState({info: "Please complete filling!"})
		}
		
	}
	
	render() {
	const deletebutton = <button onClick = {this.deleteminiaction}> Delete </button>
	const savebutton = <button onClick = {this.saveminiaction}> Save </button>
	
    return (
	<div>
	<h4> {this.state.info} </h4>
	{this.props.ident}
	<select value={this.state.value} onChange={this.handleChange}>
       {this.createSelectItems()}
	</select>
	<select value={this.state.action} onChange={this.handleSet}>
       {this.createSelectSets(this.state.value)}
	</select>
	{deletebutton}
	{savebutton}
	</div>
    );
  }
}

export default Automation;
