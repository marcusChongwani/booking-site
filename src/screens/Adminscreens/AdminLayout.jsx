import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import '../../components/Components.css'

export default function AdminLayout() {

    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <>
            <nav className="host-nav">
                <NavLink
                    to="."
                    end
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="commands"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Commands
                </NavLink>
                
                <NavLink
                    to="manageUsers"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Users
                </NavLink>

                <NavLink
                    to="feedback"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                   FeedBack
                </NavLink>

            </nav>
            <Outlet />
        </>
    )
}