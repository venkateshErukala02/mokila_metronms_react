import { useState, useEffect, useRef } from "react";
import Tree from '../Topology/tree';
import './../Topology/topology.css'; 



const TreeList = ({ getElementAtEvent,selectedNodeId,circleId,onStationResolved ,selectedTreeNodeId,selectedPrevNodeId,prevIdActive,onStationCircleIdChange,stationRefreshKey}) => {
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
  const [uniquefacilitieData,setUniquefacilitieData] = useState([]);
  const hasExpandedRef = useRef(false);
  const [regionId, setRegionId] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [regionName,setRegionName] = useState(null);
  const [locationName,setLocationName] = useState(null);
  const [stationName,setStationName] = useState(null);



  useEffect(() => {
  if (!selectedTreeNodeId?.id) return;

  // Find the node in treeData by ID
  const node = findNodeById(treeData, selectedTreeNodeId.id);
  if (node) {
    setSelectedNode(node); // update internal state
  }
}, [selectedTreeNodeId, treeData]);




  useEffect(()=>{
        if (!circleId) return;
        let url= `api/v2/facilities?_s=uniqueName==${circleId}`;
        getUniquefacilitieData(url);

    },[circleId,stationRefreshKey]);

//   useEffect(() => {
//   if (!uniquefacilitieData || !selectedNodeId) return;

//   const expandByMode = async () => {
//     let currentNode = [{
//       key: "0",
//       text: "Global",
//       data: {mode: "global", display: "Global", id: 0, type: "region"},
//       selected: "",
//       icon: "globimg",
//       children: [
      
//       ],
//     }]; // Global
//     setSelectedNode(currentNode);

//     for (const mode of ["global","region", "location"]) {
//       await getDatanodesLine(getUrl(currentNode));
//       currentNode = currentNode.children.find(n => n.data.mode === mode);
//       setSelectedNode(currentNode);
//     }
//   };

//   expandByMode();
// }, [uniquefacilitieData,selectedNodeId]);


useEffect(() => {
  if (!regionId || !locationId || !regionName || !locationName || !stationName) return;
  if (!selectedNodeId) return;
  if (hasExpandedRef.current) return;

  const expandByMode = async () => {
    let currentNode = treeData[0]; // Global
    setSelectedNode(currentNode);

    for (const mode of ["region", "location"]) {
      const children = await getDatanodesLine(
        getUrl(currentNode),
        currentNode
      );

      const matchingNode = children.find(n => {
        if (mode === "region" && n.text === regionName) {
          return true;
        }
        if (mode === "location" && n.text === locationName) {
          return true;
        }
        return false;
      });

      if (!matchingNode) break;


      if (mode === "region") {
        if (currentNode.text === "line1") {
          const line1Sections = children.filter(n => n.text.includes("line1-sec"));
          // Ensure expanding sections only within line1
          const section1Node = line1Sections.find(n => n.text === "line1-sec1");
          const section2Node = line1Sections.find(n => n.text === "line1-sec2");

          // Expand section1 if it's line1-sec1
          if (currentNode.text === "line1-sec1" && section1Node) {
            currentNode = section1Node;
            setSelectedNode(currentNode);
          }

          // Expand section2 if it's line1-sec2
          if (currentNode.text === "line1-sec2" && section2Node) {
            currentNode = section2Node;
            setSelectedNode(currentNode);
          }
        }

        // Handling for line4, which only has section line1-sec1
        if (currentNode.text === "line4") {
          const sectionNode = children.find(n => n.text === "line1-sec1");
          if (currentNode.text === "line1-sec1" && sectionNode) {
            currentNode = sectionNode;
            setSelectedNode(currentNode);
          }
        }
      }

      // Handling for location mode
      if (mode === "location") {
         const sections = await getDatanodesLine(getUrl(currentNode), currentNode);

    // Only find the section that matches locationName
    const targetSection = sections.find(n => n.text === locationName);

    if (targetSection) {
      currentNode = targetSection;
      setSelectedNode(currentNode);
        const facilities = await getDatanodesLine(getUrl(currentNode), currentNode)
      const stationNode = facilities.find(f => f.text === stationName);
        if (!stationNode) return;
        onStationResolved?.(stationNode); 
        currentNode = stationNode;
        setSelectedNode(currentNode);
        return;
      }
    

      }

      currentNode = matchingNode;
      setSelectedNode(currentNode);
    }
    hasExpandedRef.current = true;
  };

  expandByMode();
}, [regionId, locationId, selectedNodeId, regionName, locationName,stationName]);


const facilityIdRef = useRef(null);

 const getUniquefacilitieData = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Basic ${btoa('admin:admin')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            setUniquefacilitieData(data || []);

            const facility = data?.facility?.[0];
            const facilityId = facility?.id ?? null;
            facilityIdRef.current = facilityId;
              setRegionId(facility?.regionId || null);
              setLocationId(facility?.locationId || null);
              setRegionName(facility?.regionName || null);
              setLocationName(facility?.locationName || null);
              setStationName(facility?.name || null);
              // onStationCircleIdChange?.(facility?.id || null);
              onStationCircleIdChange?.(facilityIdRef.current);
            setIsError({ status: false, msg: "" });
        } else {
            throw new Error("Data not found");
        }
    } catch (error) {
        setIsError({ status: true, msg: error.message });
    } finally {
        setIsLoading(false);
    }
};

const getUrl = (node) => {
  // Ensure that selectedUniqueId and its properties are defined

  switch (node?.data?.mode) {
    case "global": 
      return "api/v2/treeview/regions";
    case "region": 
      return regionId ? `api/v2/treeview/regions/${regionId}/locations` : "";
    case "location": 
      return locationId ? `api/v2/treeview/locations/${locationId}/facilitiesn?show=all` : "";
    default: 
      return "";
  }
};



// useEffect(() => {
//   if (!selectedNodeId?.id || !selectedNodeId?.path?.length) return;

//   const expandPath = async () => {
//     let currentNode = treeData[0]; // Global
//     setSelectedNode(currentNode);

//     for (const modeOrId of selectedNodeId.path.slice(1)) {
//       // load children for current node
//       await getDatanodesLine(getUrl(currentNode), currentNode);

//       // find next node by mode or id
//       const nextNode = currentNode.children.find(
//         n => n.data.mode === modeOrId || n.data.id === selectedNodeId.id
//       );

//       if (!nextNode) break;

//       currentNode = nextNode;
//       setSelectedNode(currentNode);
//     }
//   };

//   expandPath();
// }, [selectedNodeId]);


// const getDatanodesLine = async (url, targetNode) => {
//   setIsLoading(true);

//   try {
//     const headers = new Headers();
//     headers.set('Authorization', 'Basic ' + btoa('admin:admin'));

//     const res = await fetch(url, { headers });
//     const data = await res.json();

//     if (!res.ok) throw new Error("data not found");

//     const children = (Array.isArray(data) ? data : []).map(n => ({ ...n, children: [] }));

//     setTreeData(prev => {
//       const copy = structuredClone(prev);

//       const attachChildren = (nodes) => {
//         for (const node of nodes) {
//           if (node.data.id === targetNode?.data?.id && node?.data?.mode === targetNode?.data?.mode) {
//             if (!node.children?.length) node.children = children;
//             return true;
//           }
//           if (node.children && attachChildren(node.children)) return true;
//         }
//       };

//       attachChildren(copy);
//       return copy;
//     });
//   } catch (err) {
//     setIsError({ status: true, msg: err.message });
//   } finally {
//     setIsLoading(false);
//   }
// };

// useEffect(() => {
//   // if (!selectedNodeId?.id || !selectedNodeId?.path?.length) return;
//   if (hasExpandedRef.current) return;
//   const expandPath = async () => {
//     let currentNode = treeData[0]; // Global
//     setSelectedNode(currentNode);

//     for (const modeOrId of selectedNodeId.path.slice(1)) {
//       // load children and get them directly
//       const children = await getDatanodesLine(getUrl(currentNode), currentNode);

//       // find next node in the path from loaded children
//       const nextNode = children.find(
//         n => n.data.mode === modeOrId || n.data.id === selectedNodeId.id
//       );

//       if (!nextNode) break;

//       currentNode = nextNode;
//       setSelectedNode(currentNode);
//     }
//   };

//   expandPath();
// }, [selectedNodeId]);


// useEffect(() => {
//   if (!selectedNodeId?.path?.length) return;
//   if (hasExpandedRef.current) return;

//   const expandPath = async () => {
//     let currentNode = treeData[0];
//     setSelectedNode(currentNode);

//     for (const modeOrId of selectedNodeId.path.slice(1)) {
//       const children = await getDatanodesLine(getUrl(currentNode), currentNode);
//       const nextNode = children.find(
//         n => n.data.mode === modeOrId || n.data.id === selectedNodeId.id
//       );
//       if (!nextNode) break;

//       currentNode = nextNode;
//       setSelectedNode(currentNode);
//     }

//     hasExpandedRef.current = true; // 🔐 HARD STOP
//   };

//   expandPath();
// }, [selectedNodeId, regionId, locationId]);


// Immutable attachChildren function
const attachChildren = (nodes, targetNode, children) => {
  if (!nodes || !Array.isArray(nodes)) return nodes;

  return nodes.map(node => {
    // If this is the node we want to attach children to
    if (node.data.id === targetNode.data.id && node.data.mode === targetNode.data.mode) {
      console.log("Attaching children to node:", node.data.display, "children:", children.length);
      return { ...node, children: children || [] }; // create new object
    }

    // If the node has children, recurse
    if (node.children && node.children.length) {
      return { ...node, children: attachChildren(node.children, targetNode, children) };
    }

    // Otherwise return the node as is
    return node;
  });
};




// const getDatanodesLine = async (url, targetNode) => {
//    if (!targetNode) {
//     console.warn("targetNode is undefined. Aborting getDatanodesLine.");
//     return [];
//   }
//   setIsLoading(true);
//   try {
//     const headers = new Headers();
//     headers.set('Authorization', 'Basic ' + btoa('admin:admin'));

//     const res = await fetch(url, { headers });
//     if (!res.ok) throw new Error("data not found");

//     const data = await res.json();
//     const children = (Array.isArray(data) ? data : []).map(n => ({ ...n, children: [] }));
//     console.log('ppppppp',children);

//     // setTreeData(prev => {
//     //   const copy = structuredClone(prev);

//       // const attachChildren = (nodes) => {
//       //   for (const node of nodes) {
//       //     if (node.data.id === targetNode?.data?.id && node.data.mode === targetNode?.data?.mode) {
//       //       if (!node.children?.length) node.children = children;
//       //       return true;
//       //     }
//       //     if (node.children && attachChildren(node.children)) return true;
//       //   }
//       // };

//       //   attachChildren(copy, targetNode, children);
//       // return copy;
//     // });
//     setTreeData(prev => attachChildren(prev, targetNode, children));


//     return children; // ✅ return the loaded children
//   } catch (err) {
//     setIsError({ status: true, msg: err.message });
//     return []; // return empty array if error
//   } finally {
//     setIsLoading(false);
//   }
// };

const getDatanodesLine = async (url, targetNode) => {
  if (!targetNode) {
    console.warn("targetNode is undefined. Aborting getDatanodesLine.");
    return [];
  }


   const existingNode = findNodeById(treeData, targetNode.data.id);
  if (existingNode && existingNode.children && existingNode.children.length > 0) {
    console.log("Data already fetched for this node.");
    return existingNode.children;
  }

  setIsLoading(true);
  try {
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa('admin:admin'));

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error("data not found");

    const data = await res.json();
    const children = (Array.isArray(data) ? data : []).map(n => ({ ...n, children: [] }));
    console.log('ppppppp', children);

    // Use the immutable attachChildren
    setTreeData(prev => attachChildren(prev, targetNode, children));
    return children; // ✅ return the loaded children
  } catch (err) {
    setIsError({ status: true, msg: err.message });
    return []; // return empty array if error
  } finally {
    setIsLoading(false);
  }
};


const findNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (node.data?.id === id) return node;
    if (node.children?.length) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};



  // const getDatanodesLine = async (url) => {
  //   setIsLoading(true);
  //   setIsError({ status: false, msg: "" });
  
  //   try {
  //     const username = "admin";
  //     const password = "admin";
  
  //     const headers = new Headers();
  //     headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
  
  //     const options = {
  //       method: "GET",
  //       headers: headers,
  //       credentials: 'include',
  //     };
  
  //     const response = await fetch(url, options);
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       setIsLoading(false);
  //       const filteredData = (Array.isArray(data) ? data : []).map(node => ({
  //         ...node,
  //         children: [],
  //       }));
  //       setNodeData(filteredData);
  
  //       setTreeData((prevTreeData) => {
  //         const newTreeData = JSON.parse(JSON.stringify(prevTreeData));
  
  //         const updateNodeChildren = (nodes) => {
  //           for (let node of nodes) {
  //             // If it match using uniqueid or data.display
  //             if (
  //               node.data?.id === selectedNode.data?.id &&
  //               node.data?.mode === selectedNode.data?.mode
  //             ) {

  //               // It prevent  overwritingif  children  already  exist
  //               if (!node.children || node.children.length === 0) {
  //                 node.children = filteredData;
  //               }
  //               return true;
  //             }
  //             if (node.children && node.children.length > 0) {
  //               if (updateNodeChildren(node.children)) return true;
  //             }
  //           }
  //           return false;
  //         };
  
  //         updateNodeChildren(newTreeData);
  //         return newTreeData;
  //       });
  
  //     } else {
  //       throw new Error("data not found");
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     setIsError({ status: true, msg: error.message });
  //   }
  // };
  
  

  // useEffect(() => {
  //   if (!selectedNode) return;
  //   let url = ""; 
  
  //   switch (selectedNode?.data?.mode) {
  //     case 'global':
  //       url = "api/v2/treeview/regions";
  //       getDatanodesLine(url,selectedNode);
  //       break;
  
  //     case 'region':
  //       url = `api/v2/treeview/regions/${selectedNode.data.id}/locations`;
  //       getDatanodesLine(url,selectedNode);
  //       break;

  //     case 'location':
  //       url = `api/v2/treeview/locations/${selectedNode.data.id}/facilitiesn?show=all`;
  //       getDatanodesLine(url,selectedNode);
  //       break;

       
  //     case 'Trains':
  //       url = `api/v2/treeview/regions/${selectedNode.data.id}/locations`;
  //       getDatanodesLine(url,selectedNode);
  //       break;
  //     // case 'facility':
  //     //   url= `api/v2/treeview/station/${selectedNode.data.id}`;
  //     //   getDatanodesLine(url);
  //     // break;
  //     case 'yard':
  //       url = `api/v2/treeview/locations/${selectedNode.data.id}/facilitiesn?show=all`;
  //       getDatanodesLine(url,selectedNode);
  //       break;
  
  //     default:
  //       break;
  //   }
  // }, [selectedNode]);
  

useEffect(() => {
  if (!selectedNode) return;
  // if (!hasExpandedRef.current) return;

  const expandSelectedNode = async () => {
    // Find the node inside the treeData
    const nodeInTree = findNodeById(treeData, selectedNode.data.id);
    if (!nodeInTree || (nodeInTree.children && nodeInTree.children.length > 0)) return;

    let url = "";
    switch (nodeInTree.data.mode) {
      case 'global':
        url = "api/v2/treeview/regions";
        break;
      case 'region':
        url = `api/v2/treeview/regions/${nodeInTree.data.id}/locations`;
        break;
      case 'location':
        url = `api/v2/treeview/locations/${nodeInTree.data.id}/facilitiesn?show=all`;
        break;
      case 'yard':
        url = `api/v2/treeview/locations/${nodeInTree.data.id}/facilitiesn?show=all`;
        break;
      default:
        return;
    }

    // Load children and attach them
    await getDatanodesLine(url, nodeInTree);
  };

  expandSelectedNode();
}, [selectedNode]);


  return (
    <>
      <div className="" style={{ marginLeft: '0px',height:'75vh',overflowX:'clip',overflowY:'auto' }}>
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
                selectedNode={selectedNode}  getElementAtEvent={getElementAtEvent} 
                selectedNodeId={selectedTreeNodeId} 
                selectedPrevNodeId={selectedPrevNodeId}
                prevIdActive={prevIdActive}
                />
              </div>
            </div>
          </p>
        </div>
      </div>
    </>
  );
};

export default TreeList;

