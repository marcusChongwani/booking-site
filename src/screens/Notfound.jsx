import React from 'react'
import { Link } from 'react-router-dom'

export default function Notfound() {
  return (
    <div>
        <h2>Not Found</h2>
        <Link to="/">back home</Link>
    </div>
  )
}
