import React, { useState } from 'react'
import { useHistory, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [responseError, setResponseError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    axios.post('http://localhost:8081/login', {
        user: {
            fullname: email,
            password: password
        }
    })
    .then( (res) => {
      const token = React.createContext("da");
        navigate("/tasks");
    }).catch( (err) => {
        setResponseError(err.response.data);
    })
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <label className='errorLabel'>{responseError}</label>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton btn btn-primary'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login