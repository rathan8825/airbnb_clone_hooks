import React from 'react';

function Point(props){
    //matches with the props.point to the titles we have in pointdesc props and displays the right point
    const descObj = props.pointDesc.find((point) => point.pointTitle === props.point);
    console.log(descObj);   
    return(
        <div>
            <div className = "point-title">{props.point}</div>
            <div className = "point-desc">{descObj.text}</div>
        </div>
    )
}

export default Point;