import React from "react";
import SuperHost from './SuperHosts';

function SuperHosts(props){
    console.log(props);
    const superhosts = props.superhosts.map((venue,i) => {
        return(
            <div key = {i} className = "col s3">
                <SuperHost venue = {venue} key= {i} />
            </div>
        )
    })
    return(
        <div className = "venues">
            <h1 className = "main-header-text">{props.header}</h1>
                {superhosts}
        </div>
    )
}
export default SuperHosts;