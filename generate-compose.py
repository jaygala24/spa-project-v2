def get_start_config():
    return """version: "3.8"
services:"""

def get_node_config(node_port,python_port,num_python_servers,log_name,network):
    return """
    node:
        build: 
            context: .
        environment: 
            - NODE_ENV=production
            - PORT={}
            - JWT_KEY=mfdsioanf23412*(+^#
            - JWT_EXP=24h
            - PYTHON_PORT_ROOT=http://python
            - PYTHON_SERVER_CONTAINER_START=0
            - PYTHON_PORT={}
            - PYTHON_SERVER_NUMBER={}
            - PYTHON_SERVER_ENDPOINT=compile
            - PYTHON_CALLBACK_ENDPOINT=output
            - LOG_PATH=./logs/node.log
            - MONGO_USER=dummy_user
            - MONGO_PASSWORD=spa_deploy_dummy
        deploy:
            restart_policy:
                condition: on-failure
        ports: 
            - "{}:{}"
        volumes: 
            - {}:/app/logs
        networks: 
            - {}""".format(node_port,python_port,num_python_servers,node_port,node_port,log_name,network)


def get_python_config(num_server,node_port,python_port,log_name,network):
    return """
    python{}:
        build: 
            context: ./python-server
        deploy:
            restart_policy:
                condition: on-failure
        environment: 
            - NODE_SERVER_ROOT=http://node
            - NODE_SERVER_PORT={}
            - NODE_CALLBACK_ENDPOINT=api/api/output
            - PORT={}
            - LOG_PATH=./logs/python-server-{}.log
        volumes: 
            - {}:/app/logs
        networks: 
            - {}
    """.format(num_server,node_port,python_port,num_server,log_name,network)


def get_end_config(network,node_log,python_log):
    return """

networks: 
    {} :
volumes: 
    {} :
    {} :
""".format(network,node_log,python_log)

if __name__ == "__main__":
    print("Hello !\n")
    print("Please Give following config values, if left empty, will take defaults\n")

    # NODE PORT
    node_port_in = input("Please give Node Port (5000) : ")
    if node_port_in.strip() == '':
        node_port = 5000
    else:
        node_port = int(node_port_in)
    
    # Python Port
    python_port_in = input("Please give Python Port (5001) : ")
    if python_port_in.strip() == '':
        python_port = 5001
    else:
        python_port = int(python_port_in)
    
    # Total Python Servers
    num_python_servers_in = input("Please give number of Python Servers (1) : ")
    if num_python_servers_in.strip() == '':
        num_python_servers = 1
    else:
        num_python_servers = int(num_python_servers_in)

    # Network name 
    network_name = input("Give network name (spa): ")
    if network_name.strip() == '':
        network_name = "spa"

    # Log volume name for Node
    node_log_name = input("Give node log volume (node_logs): ")
    if node_log_name.strip() == '':
        node_log_name = "node_logs"

    # Log volume name for Python
    python_log_name = input("Give python log volume (python_logs): ")
    if python_log_name.strip() == '':
        python_log_name = "python_logs"
    
    print("Confirm Settings :")
    print("""
    node port = {}
    python port = {}
    number of python servers = {}
    Node Log Volume Name = {}
    Python Log volume Name = {}
    Network Name = {}
    """.format(node_port,python_port,num_python_servers,node_log_name,python_log_name,network_name))
    proceed = input("Confirm (Y/y) ? ")
    if proceed != 'Y' and proceed != 'y':
        exit(0)
    
    print("Creating docker-compose file...")
    with open("./docker-compose.yaml","w") as f:
        start_config = get_start_config()
        f.write(start_config)
        node_config = get_node_config(node_port,python_port,num_python_servers,node_log_name,network_name)
        f.write(node_config)
        for i in range(num_python_servers):
            python_config = get_python_config(i,node_port,python_port,python_log_name,network_name)
            f.write(python_config)

        end_config = get_end_config(network_name,node_log_name,python_log_name)
        f.write(end_config)
    print("Done.")