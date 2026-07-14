import { useState, useEffect } from "react";
import '../ornms.css';
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";

const EncoderEventLog = ({ currentTab, nodeItemDt }) => {

    const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
    const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');
    const [eventLogDt, setEventLogDt] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [executedSearch, setExecutedSearch] = useState("");
    const [executedDate, setExecutedDate] = useState("");
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });

    const getEncoderLogData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        setEventLogDt([]);
        try {
            const options = {
                method: "GET",
              
            }
            const response = await fetch(url, options)
            const data = await response.text();
            if (response.ok) {
                setIsLoading(false);

                setEventLogDt(data || []);
                setIsLoading(false);
                setIsError({ status: false, msg: "" });

            }else if(response.status === '404'){
                setEventLogDt([]);

            } 
            else {
                throw new Error("data not found");
            }

        } catch (error) {
            setIsLoading(false)
            setIsError({ status: true, msg: error.message })
        }


    }


useEffect(() => {

  let url = "";

  if (currentTab === "encoder") {
    url= `api/v2/nodemanageview/enlog/${nodeDataId}`
  }

  if (url) {
    getEncoderLogData(url);
  }
}, [executedSearch, executedDate, searchTrigger, nodeIpaddress, currentTab, nodeItemDt]);

 const handleClearSearch = () => {
        setSearchText('');
        setSearch('');
    }

    const handleSearch = (searchText, selectedDate) => {
  setExecutedSearch(searchText);
  setExecutedDate(selectedDate);
  setSearchTrigger(prev => prev + 1); 
};



    return(
        <>
        <section className="container-fluid">
            <article className="border-tlr custom-row">
        {/* <input
                                type="text"
                                placeholder="Search text"
                                value={searchText}
                                className="form-controldistwo searchbar"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <label for="name" className="radiolabel" style={{ display: 'inline-block' }}>Time:</label>
        
                            <article className="trans-datepickerbg" style={{ display: 'inline-block', marginTop: '5px' }}>
                                <DatePicker
                                    selected={selectedDate}
                                    showTimeSelect
                                    dateFormat="yyyy-MM-dd"
                                    className="myDatepickercl"
                                    onChange={(date) => setSelectedDate(date)}
                                />
        
                            </article>
                            <button type="button" className="createbtn" style={{ marginLeft: '10px' }}
                                onClick={() => {
                                    handleSearch(searchText, selectedDate)
                                }
                                }
                            >Search</button>
                            {(searchText !== '' || search !== '') && (<button type="button" className="createbtn" style={{ marginLeft: '10px' }}
                                onClick={handleClearSearch}
                            >Clear Search</button>)}
                         */}
                          </article>

                           <article className="row" style={{ height: '83vh', overflowY: 'auto', border: '1px solid #21232712' }}>
                    <ul className="log-list">
                        {eventLogDt && String(eventLogDt)
                            .split('\n')
                            .filter(line => line.trim() !== '')
                            .map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                    </ul>

            </article>
                          </section>
        </>
    )
}


export default EncoderEventLog;