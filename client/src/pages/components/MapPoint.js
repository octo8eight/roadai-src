import { React, useEffect, useState } from "react";
import Xarrow from "react-xarrows";
import Sidebar from "./SideBar";

function MapPoint(props) {
	const data = props.data.roadmap;

	const [mapPoints, setMapPoints] = useState([]);
	const [showSidebar, setShowSidebar] = useState(false);
	const [currentPoint, setCurrentPoint] = useState({ children: [] });

	function toggleSidebar() {
		setShowSidebar(!showSidebar);
	}

	function handleOpenSideBar(e, data) {
		e.preventDefault();
		if (currentPoint === data) {
			toggleSidebar();
		} else {
			setCurrentPoint(data);
			setShowSidebar(true);
		}
	}

	useEffect(() => {
		console.log(data);
		const points = [];
		Object.keys(data).forEach((key) => {
			points.push(data[key].name);
		});
		setMapPoints(points);
	}, [data]);
	return (
		<div className="MapPoints">
			{/* <div className="MapPoint">
                <h1>Arrays and objects</h1>
            </div> */}

			{Object.keys(data).map((key) => {
				return (
					<div
						key={data}
						className="MapPoint"
						id={data[key].name}
						onClick={(e) => {
							handleOpenSideBar(e, data[key]);
						}}
					>
						<h1>{data[key].name}</h1>
					</div>
				);
			})}
			{mapPoints.map((point, pointIndex) => {
				if (mapPoints.includes(mapPoints[pointIndex + 1])) {
					return (
						<Xarrow
							start={mapPoints[pointIndex]}
							end={mapPoints[pointIndex + 1]}
							color="white"
							showHead={false}
						/>
					);
				}
			})}
			<Sidebar
				show={showSidebar}
				parentToggle={toggleSidebar}
				data={currentPoint}
			/>
		</div>
	);
}

export default MapPoint;
