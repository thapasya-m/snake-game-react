import React, { Component } from 'react'
import * as config from '../settings'
class UserPortal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserLoggedIn: false,
            user: {
                email: "",
                pwd: ""
            },
            err: ""
        }
    }
    componentDidMount() {
        const isLogged = localStorage.getItem("loggedIn") ? true : false;
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
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
                    if (respJSON.data) {
                        this.setState({
                            isUserLoggedIn: true
                        })
                    } else {
                        this.setState({
                            err: respJSON.msg
                        })
                    }

                })
        }
    }
    render() {
        return (
            <div className="col-4">
                {this.state.isUserLoggedIn ?
                    <div>score board</div> :
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
