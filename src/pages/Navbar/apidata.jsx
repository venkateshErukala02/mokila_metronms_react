import React ,{useState,useEffect}from "react";

const ApiData=()=>{

    const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });




    const getData = async () => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
    
        try {
        //   const username = "admin";
        //    const password = "admin";
        //   const token = "YWRtaW46YWRtaW4=";
          // const encodedToken = btoa(token);  // This base64-encodes the string "admin:admin"
    
         const url = 'http://localhost:8980/ornms/api/v2/nodes?_s=&limit=50&offset=0&order=asc&orderBy=id';
          // const url = '/ornms/api/v2/dashboard/networkstatus?filter=productCode&ar=';
    
          const headers = new Headers();
          //  headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
          
          //   headers.set('Authorization', `Bearer ${token}`);
          //   headers.set('Accept-Encoding', 'gzip, deflate, br');
          //   headers.set('Connection', 'keep-alive');
          //   headers.set('Cookie', 'JSESSIONID=node01bp4i25ustv59jxlislq3auqv11.node0; JSESSIONID=node013n35ht4gctf8s0skqh00gl9t1.node0');
          //  headers.set('Accept', 'application/json, text/plain, */*');
          //  headers.set('Accept-Language', 'en-US,en;q=0.9');
          //  headers.set('Referer', 'http://192.168.31.249:8980/ornms/index.html');
          //  headers.set('Content-Type', 'application/json');
          //  headers.set('Authorization', `Bearer ${token}`);
          //  headers.set('Cache-Control', 'no-cache');
    
          //         headers.set('X-Requested-With', 'XMLHttpRequest');
          //  headers.set('X-Requested-With', 'XMLHttpRequest');
          headers.append('Origin','http://localhost:3002');
    
          headers.append('Content-Type', 'application/json');
          headers.append('Accept', 'application/json');
        //   headers.append('Authorization', 'Basic ' + btoa(username + ":" +  password));
          headers.append('Cookie', 'JSESSIONID=node0fr7r1h450lhr9agsyockb9kq6.node0; JSESSIONID=node0m5hnt836ho641dfqbsjkxg9d94.node0');
          headers.set('Cookie', 'JSESSIONID=node0fr7r1h450lhr9agsyockb9kq6.node0; JSESSIONID=node0m5hnt836ho641dfqbsjkxg9d94.node0');
          const options = {
            method: "GET",
            headers: headers,
            // mode: "no-cors",
           credentials: 'include', 
          };
    
          const response = await fetch(url, options);
          // const newOne = await response;
          // console.log("text", newOne);
          console.log("Response Status:", response.status); // Logs the status code
          console.log("Response Headers:", response.headers);
          console.log("hellolo",response);
          if (response.ok) {
            const data = await response.json();
            console.log("hhhl",data);
            setIsLoading(false);
            setUserData(data); 
            setIsError({ status: false, msg: "" }); 
          } else {
            throw new Error("Data not found or unauthorized access");
          }
        } catch (error) {
          setIsLoading(false);
          setIsError({ status: true, msg: error.message });
        }
      };
    
      useEffect(() => {
        getData();
      }, []);


    return(
        <>
            <section>
                <h1>Helllo</h1>
                {isLoading && <h1>Loading...</h1>}
      {isError?.status && <h1>{isError.msg}</h1>}
      <ul>
        {!isLoading && !isError?.status && userData.map(eachObj => (
          <li key={eachObj.id}>{eachObj.title}</li>
        ))}
      </ul>
            </section>
        </>
    )
}

export default ApiData;

