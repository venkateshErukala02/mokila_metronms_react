import React, { useState, useEffect } from "react";
import Tree from '../Topology/tree';
import './../Topology/topology.css';



const TreeList = ({ getElementAtEvent }) => {
  const [nodeData, setNodeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [treeData, setTreeData] = useState([
    {
      key: "0",
      text: "Global",
      data: {mode: "global", display: "Global", id: 0, type: "region"},
      selected: "",
      icon: "globimg",
      children: [
      
      ],
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });

  


  const getDatanodesLine = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
  
    try {
      const username = "admin";
      const password = "admin";
  
      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
  
      const options = {
        method: "GET",
        headers: headers,
        credentials: 'include',
      };
  
      const response = await fetch(url, options);
      const data = await response.json();
  
      if (response.ok) {
        setIsLoading(false);
        const filteredData = (Array.isArray(data) ? data : []).map(node => ({
          ...node,
          children: [],
        }));
        setNodeData(filteredData);
  
        setTreeData((prevTreeData) => {
          const newTreeData = JSON.parse(JSON.stringify(prevTreeData));
  
          const updateNodeChildren = (nodes) => {
            for (let node of nodes) {
              // Match using unique ID or `data.display`
              if (
                node.data?.id === selectedNode.data?.id &&
                node.data?.mode === selectedNode.data?.mode
              ) {

                // Prevent overwriting if children already exist
                if (!node.children || node.children.length === 0) {
                  node.children = filteredData;
                }
                return true;
              }
              if (node.children && node.children.length > 0) {
                if (updateNodeChildren(node.children)) return true;
              }
            }
            return false;
          };
  
          updateNodeChildren(newTreeData);
          return newTreeData;
        });
  
      } else {
        throw new Error("data not found");
      }
    } catch (error) {
      setIsLoading(false);
      setIsError({ status: true, msg: error.message });
    }
  };
  
  

  useEffect(() => {
    if (!selectedNode) return;
    let url = ""; 
  
    switch (selectedNode?.data?.mode) {
      case 'global':
        url = "api/v2/treeview/regions";
        getDatanodesLine(url);
        break;
  
      case 'region':
        url = `api/v2/treeview/regions/${selectedNode.data.id}/locations`;
        getDatanodesLine(url);
        break;

      case 'location':
        url = `api/v2/treeview/locations/${selectedNode.data.id}/facilitiesn?show=all`;
        getDatanodesLine(url);
        break;

       
      case 'Trains':
        url = `api/v2/treeview/regions/${selectedNode.data.id}/locations`;
        getDatanodesLine(url);
        break;
      // case 'facility':
      //   url= `api/v2/treeview/station/${selectedNode.data.id}`;
      //   getDatanodesLine(url);
      // break;
      case 'yard':
        url = `api/v2/treeview/locations/${selectedNode.data.id}/facilitiesn?show=all`;
        getDatanodesLine(url);
        break;
  
      default:
        break;
    }
  }, [selectedNode]);
  



  return (
    <>
      <div className="" style={{ marginLeft: '0px',height:'30vh',overflowX:'clip',overflowY:'auto' }}>
        <div className="col text-center" style={{ marginLeft: '0px' }}>
          <p className="mt-0" style={{ padding: '0', margin: '0' }}>
            <div className="row mt d-flex">
              <div className="col-lg-8 text-left text-dark">
                <Tree data={treeData} 
                  // onSelect={onSelect}
                  setSelectedNode={(node) => {
                    setSelectedNode(node); 
                  }}
                  isLastChild
                selectedNode={selectedNode}  getElementAtEvent={getElementAtEvent} />
              </div>
            </div>
          </p>
        </div>
      </div>
    </>
  );
};

export default TreeList;

