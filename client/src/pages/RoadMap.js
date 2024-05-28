import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/RoadMap.css";
import MapPoint from "./components/MapPoint";
import { useNavigate } from "react-router-dom";

function RoadMap() {
  const id = useParams().mapId;
  const [mapData, setMapData] = useState(null);
  const redirect = useNavigate();

  async function fetchData(mapId) {
    await fetch(`http://localhost:3001/map/${mapId}`, {
      method: "GET",
    })
      .then(async (response) => {
        const data = await response.json();
        const parsedData = JSON.parse(data.map.data);
        setMapData(parsedData);
      })
      .catch(() => {
        redirect("/404");
      });
  }

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return (
    <div className="RoadMap">
      {mapData ? <MapPoint data={mapData} /> : <h1>Loading...</h1>}
    </div>
  );
}

export default RoadMap;
