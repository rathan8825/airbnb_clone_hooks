import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './SuperHost.css';

class SuperHost extends Component{
    render(){
        // console.log(this.props.city);
        const { id, title, location, pricePerNight, imageUrl, rating } = this.props.superhosts;
        return(
            <div className="venue col s12">
                <Link to={`/venue/${id}`}>
                    <div className="image">
                        <img src={imageUrl} alt = "somethings wrong with this" />
                    </div>
                    <div className="location-stars">
                        <span className="location">{location}</span>
                        <span className="rating right"><i className="material-icons">star</i>{rating}</span>
                    </div>
                    <div className="title">${title}</div>
                    <div className="price-per-night">${pricePerNight}/night</div>
                    
                </Link>
            </div>
        )
    }
}
export default SuperHost;