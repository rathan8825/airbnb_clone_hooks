import React, { Component } from 'react';
import axios from 'axios';
import './SingleFullVenue.css';
import Point from './Point';
import Login from '../Login/Login'
import { connect } from 'react-redux';
import openModal from '../../../actions/openModal';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import swal from 'sweetalert';
import loadScript from '../../../utilityFunctions/loadScript';

class SingleFullVenue extends Component {
    state = {
        singleVenue:{},
        points: [],
        checkIn: "",
        checkOut: "",
        numberOfGuests: 1,
    }

    async componentDidMount(){
        const vId = this.props.match.params.vid;
        const url = `${window.apiHost}/venue/${vId}`;
        const resp = await axios.get(url);
        const singleVenue = resp.data;

        const pointsUrl = `${window.apiHost}/points/get`;
        const pointsResp = await axios.get(pointsUrl);
        const points = singleVenue.points.split(',').map((point,i) => {
            return(
                <Point pointDesc = {pointsResp.data} point = {point} key = {i}/>
            )
        })
        this.setState({singleVenue,points});

    }

    changeNumberOfGuests = (e)=>{this.setState({numberOfGuests: e.target.value})}
    changeCheckIn = (e)=>{this.setState({checkIn: e.target.value})}
    changeCheckOut = (e)=>{this.setState({checkOut: e.target.value})}

    reserveNow = async(e)=>{
        const startDayMoment = moment(this.state.checkIn,'YYYY-MM-DD');
        const endDayMoment = moment(this.state.checkOut, 'YYYY-MM-DD');
        const diffDays = endDayMoment.diff(startDayMoment,"days");
        if(diffDays < 1){
            //checkin date must be before checkout date
            swal({
                title: "checkout date must be after checkin date",
                icon: "error"
            })
        }else if(isNaN(diffDays)){
            //bad date
            swal({
                title: "please give a valid date",
                icon: "error"
            }) 
        }else{
            //diffdays is a valid number
            const pricePerNight = this.state.singleVenue.pricePerNight;
            const totalPrice = pricePerNight* diffDays
            //console.log(totalPrice)
            const scriptUrl = `https://js.stripe.com/v3`;
            const stripePublicKey = `pk_test_5198HtPL5CfCPYJ3X8TTrO06ChWxotTw6Sm2el4WkYdrfN5Rh7vEuVguXyPrTezvm3ntblRX8TpjAHeMQfHkEpTA600waD2fMrT`;
            //await waits until it gets its callback and then proceeds further
            //<script type = "text/javascript" src = "scriptUrl"></script> should be written as follows
            //moving the below code to its own module
            // await new Promise((resolve, reject)=>{
            //         const script = document.createElement('script');
            //         script.type = 'text/javascript';
            //         script.src = scriptUrl;
            //         script.onload = ()=>{
            //             console.log("The script has loaded!")
            //             resolve();
            //         }
            //         document.getElementsByTagName('head')[0].appendChild(script);
            //         console.log("The script has been added to the head!")
            //     })
            await loadScript(scriptUrl);//we dont need any variable,..we jus need to wait till it is done

            // console.log("lets run some stripe")
            const stripe = window.Stripe(stripePublicKey);
            const stripeSessionUrl = `${window.apiHost}/payment/create-session`;
            console.log(stripeSessionUrl);
            const data = {
                venueData: this.state.singleVenue,
                totalPrice,
                diffDays, 
                pricePerNight, 
                checkIn: this.state.checkIn, 
                checkOut: this.state.checkOut, 
                token: this.props.auth.token,
                numberOfGuests: this.state.numberOfGuests,  
                currency: 'USD',
            }
            console.log(data);
            const sessionVar = await axios.post(stripeSessionUrl,data);
            //console.log(sessionVar.data)
            stripe.redirectToCheckout({
                sessionId: sessionVar.data.id
            }).then((result) => {
                console.log(result)
                //this will run if the network fails
            })

        }
    }
    render(){
        console.log(this.props.auth)
        console.log(this.state.singleVenue);
        const sv = this.state.singleVenue;
        return(
            <div className = "row single-venue">
                <div className = "col s12 center">
                    <img src = {sv.imageUrl} alt = "oops"/>
                </div>
                <div className = "col s8 location-details offset-s2">
                    <div className= "col s8 left-details">
                        <div className = "location">{sv.location}</div>
                        <div className = "title">{sv.title}</div>
                        <div className = "guests">{sv.guests}</div>

                        <div className= "divider"></div>
                        {this.state.points}

                        <div className = "details">{sv.details}</div>
                        <div className = "amenities">{sv.amenities}</div>
                    </div>

                    <div className = "col s4 right-details">
                        <div className = "price-per-night">${sv.pricePerNight} <span> Per night</span></div>
                        <div className = "rating">{sv.rating}</div>
                        <div className = "col s6">
                            CHECK IN
                            <input type = "date" onChange={this.changeCheckIn} value={this.state.checkIn} />
                        </div>
                        <div className = "col s6">
                            CHECK OUT
                            <input type = "date" onChange={this.changeCheckOut} value={this.state.checkOut} />
                        </div>
                        <div className = "col s12">
                            <select className = "browser-default">
                                <option value= "1">1 guests</option>
                                <option value= "2">2 guests</option>
                                <option value= "3">3 guests</option>
                                <option value= "4">4 guests</option>
                                <option value= "5">5 guests</option>
                                <option value= "6">6 guests</option>
                                <option value= "7">7 guests</option>
                                <option value= "8">8 guests</option>
                            </select>
                        </div>
                        <div className = "col s12 center">
                            {this.props.auth.token ? <button onClick = {this.reserveNow} className = "btn red accent-2">Reserve</button>
                                : <div> you must <span className = "text-link" onClick = {() => {this.props.openModal("open",<Login />)}}>Login</span> to reserve</div>
                            }
                            
                        </div>
                    </div>
                </div>

            </div>
            )
    }
}
function mapStateToProps(state){
    return({
        auth: state.auth
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        openModal
    },dispatch )
}
export default connect(mapStateToProps,mapDispatchToProps)(SingleFullVenue);