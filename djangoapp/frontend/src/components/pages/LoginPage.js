import React, {useContext} from 'react'
import AuthContext from './../../context/AuthContext'

const LoginPage = () => {

  let {loginUser} = useContext(AuthContext)

  return (
    <div>
      <form onSubmit={loginUser}>
        <input type="text" name='username' placeholder='Ingrese el nombre de usuario' />
        <input type="password" name='password' placeholder='Ingrese la contraseña' />
        <input type="submit" />
      </form>
    </div>
  )
}

export default LoginPage