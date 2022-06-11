import React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import './logs.scss';

// class Logs extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			amount: 0,
// 			left: 0,
// 			body: [],
// 		};
// 	}

// 	componentDidMount() {
// 		ipcRenderer.on('amount', (e, message) => {
// 			const value = parseInt(message);
// 			this.setState((prev) => ({ ...prev, amount: value, left: value }));
// 			setChannelError(false);
// 		});

// 		ipcRenderer.on('data', (e, message) => {
// 			this.setState((prev) => ({
// 				...prev,
// 				left: prev.amount - message.counter,
// 				body: prev.body.concat(message.data),
// 			}));
// 		});

// 		ipcRenderer.on('stop', (e, message) => {
// 			this.setState((prev) => ({ ...prev, left: 0, isWorking: false }));
// 		});
// 	}

// 	componentWillUnmount() {
// 		ipcRenderer.removeListener('amount');
// 		ipcRenderer.removeListener('data');
// 	}

// 	render() {
// 		return (
// 			<div>
// 				{/* {this.state.body.map((item, i) => {
// 						return (
// 							<div className="user" key={i}>
// 								<div>
// 									{item.firstName +
// 										';' +
// 										item.lastName +
// 										';' +
// 										item.username +
// 										';' +
// 										item.phone}
// 								</div>
// 							</div>
// 						);
// 					})} */}
// 			</div>
// 		);
// 	}
// }
function renderRow(props) {
	const { index, style } = props;

	return (
		<ListItem style={style} key={index} component="div" disablePadding>
			<ListItemButton>
				<ListItemText primary={`Item ${index + 1}`} />
			</ListItemButton>
		</ListItem>
	);
}

export default function VirtualizedList() {
	return (
		<Box
			className="logs"
			sx={{
				width: '100%',
				height: 240,
				// maxWidth: 360,
				bgcolor: '#0d0d1c',
				color: '#fff',
			}}
		>
			<FixedSizeList
				height={240}
				width="100%"
				itemSize={46}
				itemCount={200}
				overscanCount={5}
			>
				{renderRow}
			</FixedSizeList>
		</Box>
	);
}

// export default Logs;
