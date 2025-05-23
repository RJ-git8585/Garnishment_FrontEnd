
/**
 * ProfileHeader Component
 *
 * This functional component renders a header section for the profile page.
 * It includes a welcome message and a horizontal line separator.
 *
 * @component
 * @returns {JSX.Element} The rendered ProfileHeader component.
 */
import {react,useState,useEffect,useLocation} from 'react'
function ProfileHeader( ) {
  return (
    <div>
        <div className="lg:flex lg:items-center lg:justify-between">
                  <div className="min-w-0 p-4 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-black-900 sm:truncate sm:text-3xl sm:tracking-tight">Welcome To GarnishEdge</h2>
                  </div>
        </div>
                <hr></hr>
   </div>
  )
}

export default ProfileHeader