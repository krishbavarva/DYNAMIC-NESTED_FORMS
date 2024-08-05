import React from 'react'
import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <>
     <ul>
        <li><Link to='/'>Multi-step</Link></li>
        <li><Link to='/dynamic' >Dynamic-form</Link></li>
        <li><Link to='/advancevalidation' > Cross-field and advance validation</Link></li>
        <li><Link to='/nested' >Nested field</Link></li>
    </ul> 
    </>
  )
}
