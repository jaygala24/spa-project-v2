// Global so can maintain state
let counter = 0;
const startContainer = process.env.PYTHON_SERVER_CONTAINER_START;
const numContainer = process.env.PYTHON_SERVER_NUMBER;
const rootPath = process.env.PYTHON_PORT_ROOT;
const endpoint = process.env.PYTHON_SERVER_ENDPOINT;
const retPort = process.env.PYTHON_PORT;
/**
 * Returns url for next request to be made for code compiling
 * uses global counter variable
 * Uses Round Robin to select the port number
 * @return python server URL to be used for next code compile request
 */
export const getPythonPath = () => {
    let containerPath = parseInt(startContainer) + counter;
    counter = (counter + 1) % numContainer;

    return `${rootPath}${containerPath}:${retPort}/${endpoint}`;
};