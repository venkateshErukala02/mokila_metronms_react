import { useState, useEffect } from "react";

const ApiData = () => {

  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });

  const getData = async () => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const url = 'http://localhost:8980/ornms/api/v2/nodes?_s=&limit=50&offset=0&order=asc&orderBy=id';
      const headers = new Headers();
      headers.append('Origin', 'http://localhost:3002');
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Cookie', 'JSESSIONID=node0fr7r1h450lhr9agsyockb9kq6.node0; JSESSIONID=node0m5hnt836ho641dfqbsjkxg9d94.node0');
      headers.set('Cookie', 'JSESSIONID=node0fr7r1h450lhr9agsyockb9kq6.node0; JSESSIONID=node0m5hnt836ho641dfqbsjkxg9d94.node0');
      const options = {
        method: "GET",
        headers: headers,
        // mode: "no-cors",
        credentials: 'include',
      };

      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
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


  return (
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

