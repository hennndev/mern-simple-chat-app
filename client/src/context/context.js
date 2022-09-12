import React, { createContext, useState, useContext} from 'react'

const Context = createContext()
const useApp = () => useContext(Context) 

const Provider = ({children}) => {
    const [usersGroup, setUsersGroup] = useState(localStorage.getItem('usersGroup') || [])

    const storeUser = (payload) => {
        const updatedUsers = [...usersGroup, {...payload}]
        setUsersGroup(updatedUsers)
        localStorage.setItem('usersGroup', JSON.stringify(updatedUsers))
    }
    const removeUser = (payload) => {
        const updatedUsers = usersGroup.filter(user => user.id !== payload.id)
        setUsersGroup(updatedUsers)
        localStorage.setItem('usersGroup', JSON.stringify(updatedUsers))
    }
    return (
        <Context.Provider value={{
            usersGroup,
            storeUser,
            removeUser
        }}>
            {children}
        </Context.Provider>
    )
}

export {
    useApp,
    Provider
}