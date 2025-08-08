import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import LeftNavList from "../Navbar/leftnavpage";
import MapLat from "../Topology/mapcomp";
import Tree from 'react-d3-tree';
import { useCenteredTree } from "./helper";
import {global} from '../../assets/img/glob2.png'
import './../Testtopo/testtopo.css';



const NewTopology = () => {
  const [translate, containerRef] = useCenteredTree();
  const [tlocationData,setTlocationData] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [newTreeData,setNewTreeData] =useState({})
  const [treeData, setTreeData] = useState({
    text: "Global",
    attributes: {
      mode: "root",
      id: -1,
      type: "root",
      img: "globalOpen.png"
    },
    children: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState({ status: false, msg: "" });
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };



const fetchNodeChildren = async (node) => {
  console.log('kjsfdfsfjk',node)
  let url;
  if (node.text === 'Global') {
    url = 'api/v2/treeview/regions';
  } else if (node.attributes.mode === 'region') {
    url = `api/v2/treeview/regions/${node.attributes.id}/cities`;
  } else if (node.attributes.mode === 'city') {
    url = `api/v2/treeview/regions/${node.attributes.id}/locations`;
  }   else if (node.attributes.type === "facility") {
    url = `api/v2/treeview/clf/${node.attributes.id}/?show=all`;
  } 
  
  else {
    return [];
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.map((item) => {
      const fullChildren = item.children || [];
      return {
        text: item.text || "Unnamed",
        attributes: {
          mode: item.data.mode || "region",
          id: item.data.id,
          type: item.data.type || "region",
          img: item.data.type  || "exploca.p",
        },
        // _fullChildren: fullChildren.map((child) => ({  // Save nested children for future
        //   ...child,
        //   children: [],
        // })),

        _fullChildren: fullChildren.map((child) => {
          return {
            text: child.text || "Unnamed",
            type: child.type || "Unnamed",
            fid: child.fid || "Unnamed",
            id: child.id || "Unnamed",
            icon: child.icon || "Unnamed",
            attributes: {
              id: child.data?.id,
              lat: child.data?.lat || "region",
              long: child.data?.long || "region",
              systemname: child.data?.systemname || "region",
              type: child.data?.type || "region",
            }
          };
        }),
        children: [] // Initially empty — only filled when user toggles
      };
    });
  } catch (err) {
    console.error("Error fetching children:", err);
    return [];
  }
};

const createTreeNode = (json) => {
  if ("" == json.data.mode) {
    
  }
};


const addChildrenToNode = (tree, nodeText, childrenToAdd) => {
  if (tree.text === nodeText) {
    return { ...tree, children: childrenToAdd };
  }

  return {
    ...tree,
    children: tree.children? tree.children.map(child =>
      addChildrenToNode(child, nodeText, childrenToAdd)
    ):[]
  };
};

const handleSecondaryToggle = async(nodeDatum) => {
  if (nodeDatum.children && nodeDatum.children.length > 0) {
    // Collapse the node
    setNewTreeData(prev => addChildrenToNode(prev, nodeDatum.text, []));
  }else if(nodeDatum._fullChildren && nodeDatum._fullChildren.length > 0){
  setNewTreeData((prevTree) => addChildrenToNode(prevTree, nodeDatum.text, nodeDatum._fullChildren || []));

 }else{
  const newChildren = await fetchNodeChildren(nodeDatum);
  setNewTreeData(prev => addChildrenToNode(prev, nodeDatum.text, newChildren));
 }
};


const handleToggle = async (nodeDatum) => {
  setSelectedNode(nodeDatum);
  if (nodeDatum.children && nodeDatum.children.length > 0) {
    // Collapse the node
    setTreeData(prev => addChildrenToNode(prev, nodeDatum.text, []));
  } else if (nodeDatum._fullChildren && nodeDatum._fullChildren.length > 0) {
    // Expand from saved full children
    const secondaryTree = {
      text: nodeDatum.text,
      attributes: nodeDatum.attributes,
      _fullChildren: nodeDatum._fullChildren,
      children: []
    };
    setNewTreeData(secondaryTree);
    //  setNewTreeData(prev => addChildrenToNode(prev, nodeDatum.text, nodeDatum._fullChildren))
    // setTreeData(prev => addChildrenToNode(prev, nodeDatum.text, nodeDatum._fullChildren));
  } else {
    // Fetch new children and save _fullChildren
    const newChildren = await fetchNodeChildren(nodeDatum);
    setTreeData(prev => addChildrenToNode(prev, nodeDatum.text, newChildren));
  }
};


  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    onToggle,
    foreignObjectProps
  }) =>{

    // const handleToggle = async (nodeDatum) => {
    //   toggleNode();  
    //   if (nodeDatum.children.length === 0) {
    //     // Fetch only if children are not loaded yet
    //     const newChildren = await fetchNodeChildren(nodeDatum);
    //     setTreeData(prev => addChildrenToNode(prev, nodeDatum.text, newChildren));
    //   }
    // };

  
    const getNodeImg = (mode) => {
      switch (mode) {
          case 'root':
              return 'global.svg';
          case 'region':
              return 'normalregion.svg';
          case 'city':
          case 'location':
            return 'exploca.svg';
          case 'facility':
              return 'expfac.svg';
          case 'node':
               return 'device.svg';
             // return 'expfac.svg';
          default:
              return '';
      }
  };

  //   const getCategoryClass = (category) => {
  //     switch (category) {
  //         case 'Critical':
  //             return 'critical';
  //         case 'MAJOR':
  //             return 'iconmajor';
  //         case 'WARNING':
  //             return 'iconwarn';
  //         case 'MINOR':
  //             return 'iconminor';
  //         case 'NORMAL':
  //             return 'iconnormal';
  //         case 'CLEARED':
  //             return 'iconclear';
  //         default:
  //             return '';
  //     }
  // };

  // <i className={getCategoryClass(event.severity)}></i>

  const conditinalhreff = `images/${getNodeImg(nodeDatum?.attributes?.type)}`;


 

    return (

    <g>
      {/* <circle r={15} onClick={toggleNode}></circle>  */}
      <g
        id="layer1"
        transform="translate(-104.44924,-147.80379)">
          <image
          width="20"
          height="20"
          
          // onClick={()=>handleToggle(nodeDatum.text)}
          // onClick={() => handleToggle(nodeDatum)}
          onClick={() => onToggle(nodeDatum)}
          preserveAspectRatio="none"
        //  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA&#10;GXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhZJREFUeNpkU79r21AQluQnJP+Q&#10;9PwHFAzBUAgkWUI8NBDo0jFThg7BQ5IhkwrtGjIUYsjibBk8eHCMGzqYjqW07lJaCCR/QBKyloIt&#10;g2yqRlj9zpzMsyP4dPfu3d377t49PUkSTf10XZcQe8A28MWyLBvyZRRFHyAb8A/m/NUECK5CbAF1&#10;oGQYxk7etjXTNFv94ZBcdoAeYpqzIErAST4Cb9O1sCxZdN1PSEL2LrBGdti6QpjtmZ9ychZ4Bf2W&#10;WBQ9txJPkrvJZLKK9TLwHHsd13HibC5Xhn6KBO8onmomShHwCBzg9C3AV9j9BFaYWdXzvE2sv3Ks&#10;dgh848ZdsFMvDeYEJTqE9+psWwOqBn77wBsYG5B/TNuuMiO1Tw8QAd9QaruhJNSDIS/o61tCHIdh&#10;WNKefs18Pv8+iuMrxfY3rU9O6QmzBT0mymoJKRzHuWX6NCOndDvE4Jqyg163kMv9eMwYOoZGLg4X&#10;BqojhLiHTj07A34BV4KVaQnCss/DQb8HtQ3HS46nZBUk3QCo2f+AMvAMWJpd40KHiaKvDNVxUUqf&#10;b8NnH2q0NHi2ezxMAXeYJq8E22bR806m3R0M6rwv2fdmGqvcddNz3c80wqkNY0wPgDa3FWa1lDFh&#10;7jHhtCNd03aTjKiF49GLQjYrgyBYx9Z3TkQjXVcfk774nFHrim5kXo/HIw9N+81mqp2a2118zv8F&#10;GABiYCHLuxABbQAAAABJRU5ErkJggg==&#10;"
          href={conditinalhreff}
          id="image1"
          x="98.44924"
          y="138.80379" />
          </g>
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps} width={300} height={100} x={10} y={-18}>
        {/* <img src={`images/${nodeDatum.attributes.img}`} alt="" width={50} height={50} /> */}
        <div>

          <p style={{ textAlign: "left",fontSize:'10px' }} >{nodeDatum.text}</p>
          {/* <p>{nodeDatum.attributes.img}</p> */}
          {/* {nodeDatum.children && (
                // <button style={{ width: "100%" }} >
                //   {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
                // </button>
              )} */}
        </div>
      </foreignObject>
    </g>
  )};

 const  pathClassFunc=(treeData) => {
    const type = treeData?.target?.data?.attributes?.type;

    switch (type) {
      case 'root':
          return 'root-link';
      case 'region':
          return 'region-link';
      case 'city':
        return 'city-link';
      case 'location':
        return 'location-link';
      case 'facility':
          return 'facility-link';
      case 'node':
           return 'node-link';
      default:
          return '';
  }
  }

  const  pathClassFunctwo=(newTreeData) => {
    const type = newTreeData?.target?.data?.attributes?.type;

    switch (type) {
      case 'root':
          return 'root-link';
      case 'region':
          return 'region-link';
      case 'city':
        return 'city-link';
      case 'location':
        return 'location-link';
      case 'facility':
          return 'facility-link';
      case 'node':
           return 'node-link';
      default:
          return '';
  }
  }



 
  const isVisible = useSelector(state => state.isVisible);

  return (
    <article className="display-f">
      <article className={isVisible ? 'leftsidebardisblock' : 'leftsidebardisnone'}>
        <LeftNavList className='leftsidebar' />
      </article>
      <article className="container-fluid" style={{position:'relative'}}>
        <article className="row">
          <article className="col-sm-5">
            <article className="border-allsd newtopobg" style={{ height: '90vh', margin: '5px' }}>

              {/* <Tree
                data={orgChart}

                rootNodeClassName="node__root"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
                // Statically apply same className(s) to all links
                pathClassFunc={() => 'custom-link'}
                pathClassFunc={() => ['custom-link', 'extra-custom-link'].join(' ')}
                pathClassFunc={getDynamicPathClass}
                /> */}
        
              <Tree
                data={treeData}
                translate={translate}
                nodeSize={{ x: 120, y: 100 }}
                // nodeSize={nodeSize}
                renderCustomNodeElement={(rd3tProps) =>
                  renderForeignObjectNode({ ...rd3tProps, foreignObjectProps, onToggle: handleToggle })
                }
                orientation="horizontal"
                pathClassFunc={pathClassFunc} 
              />
      
            </article>
          </article>
          <article className="col-sm-7">
            <article className="border-allsd" style={{ margin: '5px' }}>
              <ul className="clearfix linklist border-b">
                <li><button>Link View</button></li>
                <li><button>Network View</button></li>
              </ul>
              <article className="row">
                <article className="col-2"><h1 className="mapheading">Map</h1></article>
                <article className="col-10">
                  <span className="systmtopo" style={{ marginRight: '10px' }}> Region</span>
                  <label className="float-right systmtopo">
                    <input type="checkbox" className="inptcheck" />System Name
                  </label>
                </article>
              </article>
              <hr className="topohr" />
              <MapLat />
            </article>
          </article>
        </article>
        <article className="mapwhitecont">
          {/* <article className="newtopobg"> */}
          <Tree
                data={newTreeData}
                translate={translate}
                nodeSize={{ x: 120, y: 100 }}
                // nodeSize={nodeSize}
                 branchNodeClassName="newtopobg"
                renderCustomNodeElement={(rd3tProps) =>
                  renderForeignObjectNode({ ...rd3tProps, foreignObjectProps,onToggle: handleSecondaryToggle })
                }
                orientation="horizontal"
                pathClassFunc={pathClassFunctwo} 
              />
          {/* </article> */}
          
            </article>
      </article>
    </article>
  );
};

export default NewTopology;
