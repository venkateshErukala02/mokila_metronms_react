import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState,useEffect } from "react";
import "../ornms.css";
import './../Topology/topology.css';
import globe from '../../assets/img/glob2.png';
import { useSelector } from "react-redux";


const getElementAtEvent =(value)=>{

}

const Tree = ({ data,getElementAtEvent,selectedNode,setSelectedNode,isLastChild,selectedTreeNodeId,selectedPrevNodeId,prevIdActive}) => {
  const [selectedParent, setSelectedParent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });


  let url ='api/v2/treeview/regions/2/locations';

 const getDataObj=(e)=>{
  
 }
  const dataName = useSelector((state) => state.stationid.stationid);

  
  return (
    <div className="d-tree">
      <ul className="d-flex d-tree-container flex-column neecl" style={{padding:'0',marginLeft:"45px"}}>
        {data.map((tree,index) => (
          <TreeNode
             key={tree.label? tree.label: tree.text}
            node={tree}
            //  parent ={null}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            //onNodeClick={handleClickNode}
            getElementAtEvent={getElementAtEvent}
            isLastChild={index === data.length - 1}
            dataName={dataName}
             selectedTreeNodeId={selectedTreeNodeId}
             selectedPrevNodeId={selectedPrevNodeId}
             prevIdActive={prevIdActive}
            // parentNode={}
          />
        ))}
      </ul>
    </div>
  );
};


const TreeNode = ({ node, selectedNode, setSelectedNode,getElementAtEvent,isLastChild,dataName,selectedTreeNodeId,selectedPrevNodeId,prevIdActive }) => {
//   const [childVisible, setChildVisibility] = useState(
//   selectedNode?.text === dataName
// );
const [childVisible, setChildVisible] = useState(false);

useEffect(() => {
    // Expand if this node is the selected one
    if (selectedNode?.data?.id === node.data?.id || selectedTreeNodeId?.id === node.data?.id) {
      setChildVisible(true);
    }
  }, [selectedNode, node]);

  if (node.data?.mode === 'sta') {
    return null;
  }

  // let children = [];

 

 if (node.data?.mode === 'sta') return null;

  const hasChild = Array.isArray(node.children) && node.children.length > 0;

  const getNodeLabel = (node) => {
    const mode = node.data?.mode;
  
    if (mode === "region" || mode === "location") {
      return node.data?.display || node.text || "Unknown";
    } else if (
      mode === "AP" || 
      mode === "CAM" || 
      mode === "transcoder" || 
      mode === "encoder"
    ) {
      return node.data?.systemname || "Unnamed Device";
    } else if (mode === "facility" || node.data?.parent === "yard_1") {
      return node.text || "Unnamed Facility";
    } else if (node.data?.parent === "yard" || mode === 'global') {
      return node.data?.display || "Unnamed Yard";
    } else {
      return node.data?.display || node.text || "Unknown";
    }
  };
  
  

  

  const getIconClass=(node)=>{
    const mode = node.data?.mode;
    if(mode ==='global'){
      return 'glob-img-icon';
    }else if(mode==='region'){
      return 'line-img-icon';
    }else if(mode==='location' || mode ==='Trains' || mode ==='mainline' || mode ==='yard'){
       return 'section-img-icon';
    }else if(mode ==='facility'){
      return 'station-img-icon';
    }else if(mode ==='AP'){
      return 'cloap-img-icon';
    }else if(mode==='encoder' || mode ==='transcoder'){
      return 'encoder-img-icon';
    }else if(mode ==='CAM'){
      return 'cam-img-icon'
    }

  }

   const handleNodeClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setChildVisible(prevState => !prevState); // Toggle the visibility of children
    setSelectedNode(node); // Update the selected node state
    getElementAtEvent(node); // Call the function passed as prop
  };

const isSelected = prevIdActive
  ? selectedPrevNodeId?.id === node.data?.id
  : selectedNode?.data?.id === node.data?.id;


  
  return (
//     <li
//       className={`d-tree-node border-0 ${!isLastChild ? 'line-hegt':''}`}
//       onClick={(e) => {
//         e.stopPropagation();
//         setSelectedNode(node);
//         getElementAtEvent(node);
//         // setChildVisibility((v) => !v)
//       }}
//       style={{
//         marginLeft: selectedNode === node.label ==='Golbal' ? "0px" : "0px",
//         // cursor: "pointer",
//       }}
//     >
//       <div className="d-flex" style={{marginLeft:'0px'}} onClick={() => setChildVisibility((v) => !v)}>
//         {hasChild && (
//           <div
//              className={`d-inline d-tree-toggler ${childVisible ? "active" : ""}`} 
//              onClick={(e) => {
//     e.stopPropagation();
//     if (dataName === selectedNode?.text) {
//       setChildVisibility((v) => !v);
//     }
//   }} 
//             >
//             {/* <FontAwesomeIcon icon="caret-right" /> */}
//           </div>
//         )}

//         <div className={`col d-tree-head globhee1 ${selectedNode?.text === node.text ? "" : ""}`} style={{
//         // backgroundColor: selectedNode === node.text ? "#beebff" : "white",marginBottom:'3px',
//         //  color: selectedNode?.text === node.text ? "red" : "black",
//         cursor: "pointer",
//       }}>
//           <i className="arrowopen1"></i>
//           <span className={`${selectedNode?.text === node.text ? "selected" : ""}`}>
//   <i className={`mr-5 ${getIconClass(node)}`}> </i>
//             {getNodeLabel(node)}
//           </span>
        
         
        

//       {hasChild && childVisible && (
//         <div className="d-tree-content default-line">
//         {/* //  <div className="d-tree-content default-line"> */}

//           <ul className="d-flex d-tree-container flex-column neecl">
//             {Array.isArray(node.children) &&node.children.map((child,index) => ( 
//               <TreeNode
//               // parent ={children}
//                 key={child.label ? child.label : child.text}
//                 node={child}
//                 selectedNode={selectedNode}
//                 setSelectedNode={setSelectedNode}
//                 getElementAtEvent={getElementAtEvent}
//                 isLastChild={index === node.children.length - 1}
//                 // parent={node}
//                 dataName={dataName}
//               />
//             ))}
//           </ul>
//         </div>
//       )}

// </div>
//       </div>
//     </li>

 <li className={`d-tree-node border-0 ${!isLastChild ? 'line-hegt' : ''}`} style={{
         marginLeft: selectedNode === node.label ==='Golbal' ? "0px" : "0px",
         // cursor: "pointer",
       }}
       onClick={(e) => {
        e.stopPropagation();
        setChildVisible((v) => !v);
      }}
       
>
      <div className="d-flex" style={{ marginLeft: '0px', cursor: "pointer" }}>

        {/* Toggle button */}
        {hasChild && (
          <div
            className={`d-tree-toggler ${childVisible ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation();
             setChildVisible(prevState => !prevState); }}
          />
        )}

        {/* Node label */}
        <div
          className={`d-tree-head globhee1 ${isSelected ? "selected" : ""}`}
          onClick={handleNodeClick}
        >
          <i className="arrowopen1"></i>
          <span className={`${selectedNode?.text === node.text ? "selected" : ""}`}></span>
          {/* <span style={{ fontWeight: (isSelected ? 'bold' : 'normal')  }}>
            </span> */}
          <i className={`mr-5 ${getIconClass(node)}`}></i>
          {getNodeLabel(node)}
        </div>
      </div>

      {/* Children */}
      {hasChild && childVisible && (
        <div className="d-tree-content default-line">
        <ul className="d-flex d-tree-container flex-column neecl" style={{ paddingLeft: '20px' }}>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.label || child.text}
              node={child}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              getElementAtEvent={getElementAtEvent}
              isLastChild={index === node.children.length - 1}
              dataName={dataName}
              selectedTreeNodeId={selectedTreeNodeId}
              selectedPrevNodeId={selectedPrevNodeId}
              prevIdActive={prevIdActive}
            />
          ))}
        </ul>
        </div>
      )}
    </li>
  );
};

export default Tree;
