
import { HashRouter as Router,Routes, Route } from 'react-router-dom';
import DashBoardPage from '../pages/Dashboard/dashboardpage';
import DiscovPag from '../pages/Discovery/discoverypage';
import TopoPg from '../pages/Topology/topologypage';
import EventPg from '../pages/Events/eventspage';
import InventRpt from '../pages/Inventory/inventorypage';
import SettPage from '../pages/Settings/settingspage';
import Navbar from '../pages/Navbar/navbarpage';
import NewTopology from '../pages/Testtopo/newtopology';
import TestPie from '../test/testing';
import StationNodeDetails from '../pages/Dashboard/stationnodeview';
import TranscoderView from '../pages/Dashboard/transcoderview';
import TrainNodeView from '../pages/Dashboard/trainnodeview';
import ObcNodeView from '../pages/Dashboard/obcnodeview';
import Wayside from '../pages/Wayside/wayside';
import ConfigPage from '../pages/Config/configpage';
import EncoderNodeView from '../pages/Dashboard/encodernodeview';
import { useSelector } from 'react-redux';
import IoboxNodeView from '../pages/Dashboard/ioboxnodeview';
import CamNodeDetails from '../pages/Dashboard/camnodeview';


const RoutesPage = () => {

   const currentUser = useSelector((state) => state?.loginuser?.node?.role);
   return (
      <Router>
         <Navbar />
         <Routes>
            <Route path="/" element={<DashBoardPage />} />
            <Route path="/SN-view" element={<StationNodeDetails />} />
            <Route path="/transcoder-view" element={<TranscoderView />} />
            <Route path="/TR-view" element={<TrainNodeView />} />
            <Route path="/obc-view" element={<ObcNodeView />} />
            <Route path="/CAM-view" element={<CamNodeDetails />} />
            <Route path="/encoder-view" element={<EncoderNodeView />} />
            <Route path="/ioc-view" element={<IoboxNodeView />} />
            <Route path="/Discovery" element={<DiscovPag />} />
            <Route  path="/Topology" element={<TopoPg />} />
            <Route  path="/Wayside" element={<Wayside />} />
            <Route  path="/TestTopo" element={<NewTopology />} />
           {currentUser !== "Read-only" && ( <Route  path="/Config" element={<ConfigPage />} />)}
            <Route  path="/Event" element={<EventPg />} />
            <Route path="/Inventory" element={<InventRpt />} />
            {currentUser !== "Read-only" && ( <Route path="/Setting" element={<SettPage />} />)}
            <Route path="*" element={<p>The device type is unidentified, so no page is available.</p>} />
         </Routes>
      </Router>
   );
};

export default RoutesPage;