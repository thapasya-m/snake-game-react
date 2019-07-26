import React, { Component } from 'react'
import * as config from '../settings'
import Moment from 'react-moment';

class UserPortal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserLoggedIn: false,
            user: {
                email: "",
                pwd: ""
            },
            err: "",
            scoreList: []
        }
    }
    componentDidMount() {
        const isLogged = localStorage.getItem("userEmailId") ? true : false;
        this.props.toggleSignIn(isLogged);
        this.setState({
            isUserLoggedIn: isLogged
        })
    }
    handleChange = (e) => {
        const input = e.target;
        let _user = this.state.user;
        _user[input.name] = input.value;
        this.setState({
            user: _user,
            err: ""
        })
    }
    validate = () => {
        const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(this.state.user.email)) {
            this.setState({ err: "invalid email" })
            return false
        }
        if (this.state.user.pwd === "") {
            this.setState({ err: "No password entered" })
            return false
        }
        return true;
    }
    submitBtnClicked = () => {
        if (this.validate()) {
            fetch(config.BASE_API + "/signIn",
                {
                    method: "POST",
                    body: JSON.stringify(this.state.user),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(response => {
                    return response.json()
                }).then(respJSON => {
                    console.log(respJSON)
                    if (respJSON.emailId) {
                        this.setState({
                            isUserLoggedIn: true
                        })
                        console.log("respJSON.data", respJSON.emailId);
                        localStorage.setItem("userEmailId",
                            respJSON.emailId)
                        this.props.toggleSignIn(true);
                    } else {
                        this.setState({
                            err: respJSON.msg
                        })
                    }

                })
        }
    }
    logout = () => {
        localStorage.removeItem("emailId");
        this.setState({
            isUserLoggedIn: false
        })
        this.props.toggleSignIn(false)
    }
    render() {
        return (
            <div className="col-4">
                {this.state.isUserLoggedIn ?
                    <div>
                        <header>Score Board</header>
                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Score</th>
                                    <th scope="col">When</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.scoreList.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.score}</td>
                                            <td>
                                                <Moment interval={0} format="MMM, DD YYYY HH:mm:ss">
                                                    {item.createdOn}
                                                </Moment>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button onClick={() => this.logout()}>log out</button>
                    </div> :
                    <div>
                        <header>Sign in/ Sign up</header>
                        <form className="text-left">
                            <div className="form-group">
                                <label>Email address</label>
                                <input name="email" onChange={this.handleChange} type="email" className="form-control" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input name="pwd" onChange={this.handleChange} type="password" className="form-control" placeholder="Password" />
                            </div>
                            <div className="invalid-feedback d-block">
                                {this.state.err}
                            </div>
                            <span className="btn btn-primary" onClick={() => this.submitBtnClicked()}>Submit</span>
                        </form>
                    </div>
                }
            </div>



        );
    }
}
export default UserPortal;
