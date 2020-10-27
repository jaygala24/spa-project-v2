from config.languages import Lang_type
from config.lang_config import langs
from uuid import uuid4
import subprocess
import os
import shutil

# These are usually present in error report of compiler / interpreter
error_words = ['error', 'Error', 'exception', 'Exception']


# Helper Function
def del_files(id):
    shutil.rmtree('./temp/'+id+'/')

def compile_and_run_code(lang, code, ip):

    ''' Takes lang class, code string and input string , returning dict that contains:
    
        success : boolean if compile and run was successful or not
        stdout : string of the stdout of last stage
        stderr : string of the stderr of last stage
        timeout : boolean if the process was terminated due to timeout
    '''

    # create a temporary id
    id = str(uuid4())

    # create a temp folder in temp dir for teh id
    os.makedirs(name='./temp/'+id)

    # write code to the file
    codefile = open('./temp/'+id+'/'+'code'+lang.ext, mode='w+')
    codefile.write(code)
    codefile.flush()
    codefile.close()

    # write input to the file
    ipfile = open('./temp/'+id+'/ip.txt', 'w+')
    ipfile.write(ip)
    ipfile.flush()
    ipfile.close()

    # again open input file to use as input to the process
    # this must opened again, and not used the after writing, as after writing the cursor is at EOF,
    # so the file appears empty to the process
    ipfile = open('./temp/'+id+'/ip.txt', 'r')

    # save the cwd
    cwd = os.getcwd()

    stdout = ""
    stderr = ""

    try:
        # get the profile to be given to subprocess to run
        # this consists of compiler/interpreter, and argument given to it such as file name,output file name etc
        profile = lang.get_compile_profile(id)

        # Run the compiling/INterpreting stage
        # universal_newline=True is required for processing \n as well as \n\r 
        proc = subprocess.run(profile, stdin=ipfile, stdout=subprocess.PIPE,
                              stderr=subprocess.PIPE, universal_newlines=True, timeout=lang.compile_time)
        
        stdout = str(proc.stdout)
        stderr = str(proc.stderr)
        op = stdout+stderr
        
        # check if there was any error
        if any(c in op for c in error_words):
            ipfile.close()
            del_files(id)
            return {'success': False, 'stdout':stdout,'stderr':stderr, 'timeout': False}

        # if the language was compile type, now run the binary filegenerated
        if lang.type == Lang_type.COMPILED:
            profile = lang.get_run_profile(id)

            # for running , change teh directory, or sometimes it can cause errors
            os.chdir('./temp/'+id)

            
            # First Run without output , timeouts, we can directly exit, and there would not be too much memory uses
            # As the stdout and stderr is redirected to /dev/null
            try:
                temp = subprocess.run(profile, stdin=ipfile,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL ,universal_newlines=True, timeout=lang.run_time)
            except subprocess.TimeoutExpired:
                ipfile.close()

                os.chdir(cwd)
                del_files(id)
                return {'success': False, 'stdout':stdout,'stderr':stderr, 'timeout': True}
            except subprocess.CalledProcessError as e:
                # Nothing here, as the error will be caught in second run.
                # This try-catch was only for infinite loops
                pass

            # We close and open input again, as the previous run would have consumed it 
            # Till EOF
            ipfile.close();
            ipfile = open('./ip.txt', 'r')

            # Actual Run
            proc = subprocess.run(profile, stdin=ipfile, capture_output=True,check=True, universal_newlines=True, timeout=lang.run_time)
            os.chdir(cwd)

            stdout = str(proc.stdout)
            stderr = str(proc.stderr)
            op = stdout+stderr

            # check if there was any error
            if any(c in op for c in error_words):
                ipfile.close()
                del_files(id)
                return {'success': False, 'stdout':stdout,'stderr':stderr, 'timeout': False}

    except subprocess.TimeoutExpired:
        # if the compile/interpret/run did not happen in given time
        ipfile.close()

        os.chdir(cwd)
        del_files(id)
        return {'success': False, 'stdout':stdout,'stderr':stderr, 'timeout': True}
    except subprocess.CalledProcessError as e:
        # This is primarily to capture segmentation faults, and other errors
        # But as this works by the return code of compiled code, and is raised
        # If the return code is non-zero
        ipfile.close()

        os.chdir(cwd)
        del_files(id)

        # If the process was killed by signal, the returncode is -signalcode
        if e.returncode < 0:
            return {'success': False, 'stdout':e.stdout,'stderr':"Process Killed with Signal "+str(-e.returncode), 'timeout': False}
        else:
            # maybe the c code has return non-zero number
            return {'success': True, 'stdout':e.stdout,'stderr':e.stderr, 'timeout': False}
    else:
        # Everything was successful
        ipfile.close()
        del_files(id)
        return {'success': True, 'stdout':stdout,'stderr':stderr, 'timeout': False}

    
