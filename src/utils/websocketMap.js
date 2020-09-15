// Utility to handle mapping of student's id to corresponding socket instance

// Global map for the studentId -> respective socket
const socketMap = new Map();

/**
 * saves socket to corresponding ID in map
 * @param {String} id - ID of student
 * @param {String} sock - instance of socket
 */
export const saveSocket = (id, sock) => {
    socketMap.set(id, sock);
}

/**
 * gets socket corresponding to given id
 * @param {String} id - ID of student
 * @return {WebSocket} socket object corresponding to id, if present in map
 */
export const getSocket = (id) => {
    return socketMap.get(id);
}


/**
 * removes the id->socket pair from map
 * DOES NOT CLOSE THE SOCKET
 * @param {String} id - ID of student
 * @return {WebSocket} socket object corresponding to id, if present in map
 */
export const removeSocket = (id) => {
    let ret = socketMap.get(id);
    socketMap.delete(id);
    return ret;
}