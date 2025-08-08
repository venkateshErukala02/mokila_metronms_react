import React from "react";
import '../ornms.css'
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './../Topology/topology.css';



 const data=[0]
const TopotbOne=()=>{

    const chartData = data.links
    .map((link, index) => ({
        name: `${3 - index}m`,  // This will create names like '3m', '2m', '1m'
        throughputIn: parseFloat(link.throughputIn),
        throughputOut: parseFloat(link.throughputOut),
        throughputtotal: parseFloat(link.throughputIn) + parseFloat(link.throughputOut)
    }))
    .reverse();  // Now we can safely reverse the array after mapping

    

    return(
        <>
           <article style={{ width: "450px", height: "240px" }}>
                                      <ResponsiveContainer width="100%" height={240}>
                                          <AreaChart data={chartData}>
                                              <CartesianGrid strokeDasharray="3 3" />
                                              <XAxis dataKey="name" reversed fontFamily='Lato-Regular' letterSpacing='0.2px'
                                              />
                                              <YAxis ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} />
                                              <Tooltip />
                                              {/* <Legend /> */}
                                              <Area type="monotone" dataKey="throughputIn" stroke="#3fc5e1c4" fill="#569de3" fontFamily='Lato-Regular' letterSpacing='0.2px' />
                                              <Area type="monotone" dataKey="throughputOut" stroke="#82ca9d" fill="#58cce5" fontFamily='Lato-Regular' letterSpacing='0.2px' />
                                              <Area type="monotone" dataKey="throughputtotal" stroke="#82ca9d" fill="#b299cc" fontFamily='Lato-Regular' letterSpacing='0.2px' />
          
                                              <Line type="monotone" dataKey="throughputOut" stroke="#82ca9d" fontFamily='Lato-Regular' letterSpacing='0.2px' />
                                          </AreaChart>
                                      </ResponsiveContainer>
                                  </article>
        </>
    )
}

export default TopotbOne;