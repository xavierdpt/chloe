import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import './Auth.css';

class AuthPage extends Component {
    state = {
        isLogin: true
    };
    
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }
    submitHandler = event => {
        const {isLogin} = this.state;
        event.preventDefault();
        
        const email = this.emailRef.current.value;
        const password = this.passwordRef.current.value;

        if(email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        const request = isLogin?{
            query: `query { login(email: "${email}", password: "${password}") {userId token tokenExpiration}}`
        }:{
            query: `mutation { createUser(userInput: {email: "${email}", password: "${password}"}) { _id email }}`
        };

        fetch('http://localhost:8000/graphql', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed !');
            }
            return res.json();
        }).then(response => {
            if(response.data.login.token) {
                const {token, userId, tokenExpiration} = response.data.login;
                this.context.login(token, userId, tokenExpiration);
            }
        })
        .catch(console.log);
        
    }
    render() {
        const {isLogin} = this.state;
        return <form className="auth-form" onSubmit={this.submitHandler}>
            <h1>{isLogin?"Log in":"Sign up"}</h1>
            <div className="form-control">
                <label htmlFor="email">E-Mail</label>
                <input type="email" id="email" ref={this.emailRef} />
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordRef} />
            </div>
            <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={()=>this.setState({isLogin:!isLogin})}>Switch to {isLogin?'Signup':'Login'}</button>
            </div>
        </form>;
    }    
}

export default AuthPage;