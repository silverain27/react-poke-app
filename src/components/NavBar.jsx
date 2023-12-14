import React, { useEffect, useState } from 'react'
import {useLocation, useNavigate} from 'react-router'
import styled from 'styled-components'
import app from '../firebase'
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut} from 'firebase/auth'
import { setUserId } from 'firebase/analytics'


const initialUserData = localStorage.getItem("userData")? 
    JSON.parse(localStorage.getItem('userData')): {}


const NavBar = () => {
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    const [userData, setUserData] = useState(initialUserData)
    const [show, setShow] = useState(false);;
    const {pathname} = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) =>{
        if(!user){
            //메인 페이지로 이동 
            console.log("to main")
            navigate("/login")
        }else if(user && pathname ==="/login"){
            console.log("to login")
            navigate("/")
        }
        console.log(user)
      })
      return () => {
        unsubscribe()
      }
    }, [pathname])
    
    const handleLogout = () => {
        console.log("handle log out ")
        signOut(auth).then(()=>{
            setUserData({})
        })
        .catch(error =>{
            alert(error.message)
        })

    }
    const handleAuth=()=> {
        signInWithPopup(auth, provider) 
        .then(result=> {
                setUserData(result.user)
                localStorage.setItem("userData", JSON.stringify(result.user))
            }
        )
        .catch(error => {
            console.error(error)
        })
    }

    console.log(show) 

    const listener=()=> {
        if(window.scrollY>50) {
            setShow(true)
        } else {
            setShow(false)
        }
    }

    useEffect(()=> {
        window.addEventListener('scroll', listener) 
        return ()=> {
            window.removeEventListener('scroll', listener)
        }
    } , [])

return (
<NavWrapper show={show}>
    <Logo>
        <Image alt="Poke logo"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            onClick={()=> (window.location.href = "/")}
            />
    </Logo>

    {pathname === '/login' ?
        (
        <Login onClick={handleAuth}>로그인</Login>
        ) : <SignOut>
                <UserImg
                    src = {userData.photoURL}
                    alt = "user photo"
                />
            <Dropdown>
                <span onClick={handleLogout}> Sign Out </span>
            </Dropdown>
        </SignOut>    }

    </NavWrapper>
    )
}

    const UserImg = styled.img`
    border-radius: 50%;
    width: 100%;
    height: 100%;
    `


    const Dropdown = styled.div`
    position: absolute;
    top: 48px;
    right: 0px;
    background: rgb(19, 19, 19);
    border: 1px solid rgba(151, 151, 151, 0.34);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
    padding: 10px;
    font-size: 14px;
    letter-spacing: 3px;
    width: 100px;
    opacity: 0;
    color: white;
    `

    const SignOut = styled.div`
    position: relative;
    height: 48px;
    width: 48px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;

    &:hover {
    ${Dropdown} {
    opacity: 1;
    transition-duration: 1s;
    }
    }

    `

    const Login = styled.a`
    background-color: rgba(0,0,0,0.6);
    padding: 8px 16px;
    text-transform: uppercase;
    letter-spacing: 1.55px;
    border: 1px solid #f9f9f9;
    border-radius: 4px;
    transition: all 0.2s ease 0s;
    color: white;

    &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
    }

    `

    const Image = styled.img`
    cursor: pointer;
    width: 100%;
    `;

    const Logo = styled.a`
    padding: 0;
    width: 50px;
    margin-top: 4px;
    `

    const NavWrapper = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    display: flex;
    background-color: ${props => props.show ? "#B4B4FF" : "transparent"};
    justify-content: space-between;
    align-items: center;
    padding: 0 36px;
    letter-spacing: 16px;
    z-index: 100;
    `
export default NavBar