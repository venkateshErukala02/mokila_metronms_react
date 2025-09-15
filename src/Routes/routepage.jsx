
import { HashRouter as Router,Routes, Route } from 'react-router-dom';
import DashBoardPage from '../pages/Dashboard/dashboardpage';
import DiscovPag from '../pages/Discovery/discoverypage';
import TopoPg from '../pages/Topology/topologypage';
import EventPg from '../pages/Events/eventspage';
import InventRpt from '../pages/Inventory/inventorypage';
import SettPage from '../pages/Settings/settingspage';
import Navbar from '../pages/Navbar/navbarpage';
import NewTopology from '../pages/Testtopo/newtopology';
import SubwayMap from '../pages/Navbar/sample';
import TestPie from '../test/testing';
import StationNodeDetails from '../pages/Dashboard/stationnodeview';
import TranscoderView from '../pages/Dashboard/transcoderview';
import TrainNodeView from '../pages/Dashboard/trainnodeview';
import ObcNodeView from '../pages/Dashboard/obcnodeview';
import Wayside from '../pages/Topology/wayside';

const RoutesPage = () => {
   return (
      <Router>
         <Navbar />
         <Routes>
            <Route path="/" element={<DashBoardPage />} />
            <Route path="/SN-view" element={<StationNodeDetails />} />
            <Route path="/transcoder-view" element={<TranscoderView />} />
            <Route path="/TR-view" element={<TrainNodeView />} />
            <Route path="/obc-view" element={<ObcNodeView />} />
            <Route exact path="/Discovery" element={<DiscovPag />} />
            <Route  exact path="/Topology" element={<TopoPg />} />
            <Route  exact path="/Wayside" element={<Wayside />} />
            <Route  exact path="/TestTopo" element={<NewTopology />} />
            <Route  exact path="/Event" element={<EventPg />} />
            <Route exact path="/Inventory" element={<InventRpt />} />
            <Route exact path="/Setting" element={<SettPage />} />
            <Route exact path="*" element={<p>Error Not Found</p>} />
         </Routes>
      </Router>
   );
};

export default RoutesPage;