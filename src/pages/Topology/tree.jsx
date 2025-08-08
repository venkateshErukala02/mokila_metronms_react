import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState,useEffect } from "react";
import "../ornms.css";
import './../Topology/topology.css';
import globe from '../../assets/img/glob2.png';
import { useSelector } from "react-redux";


const getElementAtEvent =(value)=>{
  // console.log(value);

}

const Tree = ({ data,getElementAtEvent,selectedNode,setSelectedNode,isLastChild}) => {
  // const [getdata, setGetData]
  const [selectedParent, setSelectedParent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });


  let url ='api/v2/treeview/regions/2/locations';

 const getDataObj=(e)=>{
  console.log('namee',e.target.value);
  
 }
  const dataName = useSelector((state) => state.stationid.stationid);
console.log('jsjnjnjsdsnjd',dataName)

  
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
            // parentNode={}
          />
        ))}
      </ul>
    </div>
  );
};


const TreeNode = ({ node, selectedNode, setSelectedNode,getElementAtEvent,isLastChild,dataName }) => {
  //  const [childVisible, setChildVisibility] = useState(false);
  const [childVisible, setChildVisibility] = useState(
  selectedNode?.text === dataName
);


  if (node.data?.mode === 'sta') {
    return null;
  }

  // console.log(JSON.stringify(parent, null, 2))
  // console.log(JSON.stringify(selectedNode, null, 2))


  let children = [];

  const hasChild = node.children ? true : false;

 
  

  if(Array.isArray(node.children)){
    children = node;
  }else if(node.children && Array.isArray(node.children.nodes)){
    children = node.children.nodes;
  }

 

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

  
  return (
    <li
      className={`d-tree-node border-0 ${!isLastChild ? 'line-hegt':''}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNode(node);
        getElementAtEvent(node);
        // console.log(JSON.stringify(node, null, 2))
        // setChildVisibility((v) => !v)
      }}
      style={{
        marginLeft: selectedNode === node.label ==='Golbal' ? "0px" : "0px",
        // cursor: "pointer",
      }}
    >
      <div className="d-flex" style={{marginLeft:'0px'}} onClick={() => setChildVisibility((v) => !v)}>
        {hasChild && (
          <div
             className={`d-inline d-tree-toggler ${childVisible ? "active" : ""}`} 
             onClick={(e) => {
    e.stopPropagation();
    if (dataName === selectedNode?.text) {
      setChildVisibility((v) => !v);
    }
  }} 
            >
            {/* <FontAwesomeIcon icon="caret-right" /> */}
          </div>
        )}

        <div className={`col d-tree-head globhee1 ${selectedNode?.text === node.text ? "" : ""}`} style={{
        // backgroundColor: selectedNode === node.text ? "#beebff" : "white",marginBottom:'3px',
        //  color: selectedNode?.text === node.text ? "red" : "black",
        cursor: "pointer",
      }}>
          <i className="arrowopen1"></i>
          <span className={`${selectedNode?.text === node.text ? "selected" : ""}`}>
  <i className={`mr-5 ${getIconClass(node)}`}> </i>
            {getNodeLabel(node)}
          </span>
        
         
        

      {hasChild && childVisible && (
        <div className="d-tree-content default-line">
        {/* //  <div className="d-tree-content default-line"> */}

          <ul className="d-flex d-tree-container flex-column neecl">
            {Array.isArray(node.children) &&node.children.map((child,index) => ( 
              <TreeNode
              // parent ={children}
                key={child.label ? child.label : child.text}
                node={child}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                getElementAtEvent={getElementAtEvent}
                isLastChild={index === node.children.length - 1}
                // parent={node}
                dataName={dataName}
              />
            ))}
          </ul>
        </div>
      )}

</div>
      </div>
    </li>
  );
};

export default Tree;
