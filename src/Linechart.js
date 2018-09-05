import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Doughnut } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client'
import App from './App';

class Linechart extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {
			chartData: {
                labels: [this.props.deviccc],
                datasets: [
                    {
                        backgroundColor: ['#FF6384', '#36A2EB'],
						hoverBackgroundColor: ['#FF6384', '#36A2EB'], 
                        data: []
                    }
                ]
            }
		};
	}
	
	componentDidMount(props) {
		const socket = socketIOClient(this.props.endpoint);
		socket.emit('getAllValuesOnChange');
		socket.emit('getAllDevicesOnChange');
		socket.emit('getReadingOnChange', {
				unit: 'unit-name',
				reading: 'reading-name'
		});
		//socket.emit('command', 'Hi', data => {console.log(data); this.getPower()} );
		socket.on('value', data => this.getPower() );
		
	}
	
	getPower = () => {
		var devs = [];
		var powers = [];
		if (this.props) {
			for (var i = 0; i < this.props.devices.length; i++) {
			if (/(_power)/.test(this.props.devices[i].Name)) {
				devs.push(this.props.devices[i].Name);
				var strnum = this.props.devices[i].Internals.STATE;
				var num = parseFloat(strnum);
				powers.push(num);
			}
			}
		}
		
		let copypowerdevs = this.state.chartData;
		copypowerdevs.labels = devs;
		copypowerdevs.datasets[0].data = powers;
					
		this.setState({ chartData: copypowerdevs });
	}
	
	render() {
	
	const button = <button onClick = {this.getPower}> Back to home </button>
	
    return (
		<div >
			<Doughnut data={this.state.chartData} width="80%" height="50%" />
			
				{button}
		</div>
		
    );
  }
  
}
export default Linechart;