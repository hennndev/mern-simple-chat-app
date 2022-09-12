let users = []

const addNewUser = (user) => {
    users.push(user)
    return users
}
const getCurrentUser = (userId) => {
    const currentUser = users.find(user => user.id === userId)
    return currentUser
}
const removeUser = (socketid) => {
    const userIdx = users.findIndex(user => user.id === socketid)
    users.splice(userIdx, 1)
    return users
}


module.exports = {
    addNewUser,
    getCurrentUser,
    removeUser
}