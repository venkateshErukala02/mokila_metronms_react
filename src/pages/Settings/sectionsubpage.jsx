import React,{useEffect, useState} from "react";
import '../ornms.css'
import { index } from "d3";
import './../Settings/settings.css';
import { useSelector } from "react-redux";
 

const SectionSubCont=({handleSubContainer,refreshSectionData,mode,section})=>{
    const currentUser = useSelector((state) => state?.loginuser?.node?.role);

    const isEditMode = mode === 'edit';

            const [selectedFile, setSelectedFile] = useState(null);
            const [lineData, setLineData] = useState([]);
            const [sectionName,setSectionName] =useState([]);
            const [lineNameSele,setLineNameSele] =useState('')
 const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
    const [lineLabelSel,setLineLabelSel] = useState('');
 const [showAddedSuccessPopup, setShowAddedSuccessPopup] = useState(false);
const [showSuccessMessage,setShowScuccessMessage] = useState('');


    const handleProfileContclose=()=>{
        handleSubContainer();
        setSectionName('');
        setLineNameSele('');
        setLineLabelSel('');
    }

    
    const getLineData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const username = 'admin';
                const password = 'admin';
                const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
          

            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setLineData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(()=>{
        const url= 'api/v2/treeview/regions'
        getLineData(url)
    },[])


    const handleAddSection = async () => {
        if (!sectionName?.trim()) return;
        const requestBody = isEditMode ? {
            id: section.id,
            name: sectionName,
            parent: lineNameSele,
            type : 1
        }:{
            name: sectionName,
            parent : lineNameSele,
            type: 1
        };

        const method = isEditMode ? 'PUT' :'POST';
        const url= isEditMode ? `api/v2/locations/${section.id}` :'api/v2/locations';

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                // alert('Section Created successfully')
                // handleProfileContclose();
                 setShowScuccessMessage(
                    isEditMode ? 'The section has been updated successfully.':
                    'The section has been created successfully.'
                )
                 setShowAddedSuccessPopup(true);
                if(refreshSectionData) refreshSectionData();
                setSectionName('');
                setLineNameSele('');
                setLineLabelSel('');
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); // Turn off loading state
        }

    }

    
const handleSelectLine=(e)=>{
    // const selected= JSON.parse(e.target.value);
    // const selectedValue = Number(selected.id);
    // const selectedText = selected.label;
    const selectedValue = Number(e.target.value);
  const selectedText = e.target.options[e.target.selectedIndex].text;
    setLineNameSele(selectedValue);
    setLineLabelSel(selectedText);  
}
 
useEffect(()=>{
    if(isEditMode && section){
        setSectionName(section.name || '');
        setLineNameSele(section.parentId || '');
    }else{
        setSectionName('');
        setLineNameSele('');
    }
},[section,mode])


    return(

        <>
        <article>
        <article className="row border-tlr" style={{margin:'0 0 0 5px'}}>
                            <article className="col-11">
                                <h1 className="regititle">Section</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 15px 0 10px'}}>
                                <label className="settinglabelsub">Section Name</label>
                                <input type="text" 
                                  value={sectionName}
                                  onChange={(e) => setSectionName(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                                <article>
                                    <label className="vlanlabel">Line</label>
                                    <article>
                                    <select  className="vlaninput" value={lineNameSele} onChange={handleSelectLine}>
                                    <option value="-1" label="Select">Select</option>
                                    {lineData && lineData.map((item,index) => (
                                            <option key={index} value={item.data.id}>{item.text}</option>
                                    ))}
                                          </select>  
                                    </article>
                                </article>


                                <article className="uploadcont">
                                <p className="notepara">Note:</p>
                                <ul className="notelist">
                                    <li>
                                    Special characters single quote(') and space are not allowed
                                    </li>
                                    <li>A maximum of 32 characters can be added</li>
                                </ul>
                                <hr className="hrnote" />
                                <center className="d-f">
                                        <button type="button" className="cancelbtn" onClick={handleProfileContclose}>Cancel</button>
                                        <button type="button" onClick={currentUser !== "Read-only" ? handleAddSection : undefined}
                                        className={`creatsetingbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`}
                                     title={currentUser === "Read-only" ? "Permission required" : ""}
                                        disabled={currentUser === "Read-only"}
                                        >
                                           {isEditMode ? 'Update':'Create'}
                                            </button>
                                </center>
                                </article>
                                </form>

                            </article>

                        </article>
        </article>

         {showAddedSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">{showSuccessMessage}</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() =>{ setShowAddedSuccessPopup(false);
                                            handleProfileContclose();
                                        }}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}
        
        </>
    )
}

export default SectionSubCont;