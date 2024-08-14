import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import './Components.css'

export default function HostLayout() {
    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#ff5a5f"
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
                    to="visits"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    ListingClicks
                </NavLink>
                
                <NavLink
                    to="listings"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Listings
                </NavLink>

                <NavLink
                    to="create"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Create
                </NavLink>

            </nav>
            <Outlet />
        </>
    )
}