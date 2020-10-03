// Global so can maintain state
let counter = 0;
const startPort = process.env.PYTHON_SERVER_PORTS_START;
const numPorts = process.env.PYTHON_SERVER_NUMBER;
const rootPath = process.env.PYTHON_PORT_ROOT;
const endpoint = process.env.PYTHON_SERVER_ENDPOINT;
/**
 * Returns url for next request to be made for code compiling
 * uses global counter variable
 * Uses Round Robin to select the port number
 * @return python server URL to be used for next code compile request
 */
export const getPythonPath = () => {
    let retPort = parseInt(startPort) + counter;
    counter = (counter + 1) % numPorts;

    return `${rootPath}:${retPort}/${endpoint}`;
};