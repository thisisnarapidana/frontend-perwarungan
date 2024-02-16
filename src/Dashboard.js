import React, { useState } from "react";
import SpotifyPlayerComponent from "./components/SpotifyPlayerComponent.js";
import Catalog from "./pages/Catalog.js";
import Floorplan from "./pages/Floorplan.js";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./tombol.css";

import SalesChart from "./SalesChart";

function Dashboard({ socket, auth }) {
  const [activeKey, setActiveKey] = useState("katalog");

  const handleTabSelect = (key) => {
    setActiveKey(key);
  };

  return (
    <div>
      {auth.role === "admin" || auth.role === "clerk" ? (
        <>
          <SpotifyPlayerComponent rolee={auth.role} socket={socket} />
          <Tabs
            activeKey={activeKey}
            onSelect={handleTabSelect}
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="denah" title="denah">
              <Floorplan rolee={auth.role || ""} />
            </Tab>
            <Tab eventKey="katalog" title="katalog">
              <Catalog rolee={auth.role || ""} />
            </Tab>
            {auth.role === "admin" && (
              <Tab eventKey="sales" title="sales">
                <SalesChart />
              </Tab>
            )}
          </Tabs>
        </>
      ) : (
        <>
          <SpotifyPlayerComponent socket={socket} />
          <div>
            <Catalog />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
