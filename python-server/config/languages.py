from enum import Enum

''' This is file that contains all configuration data for languages that our compiler can support
    In each Language class, there are two static methods:

    get_compile_profile : This gives the profile required for compiling the codefile for the language
                            FOr interpreted languages, this is simply the profile to invoke interpreter
    
    get_run_profile : This gives the profile required for running the compiled code for compiled languages
                        For interpreted languages this throws LookupError

    Each class also contain a list named 'invalid' which contain words that is found in code, the code will be rejected.
    This prevents form running code which has dangerous syscalls such as open etc.

    Each class has compile_time and run_time which are timeouts for respected operations in seconds
'''

class Lang_type(Enum):
    COMPILED = 0
    INTERPRETED = 1


class C:
    lang_name = 'C'
    ext = '.c'
    compiler = 'gcc'
    ops = '-o'
    type = Lang_type.COMPILED
    compile_time = 5
    run_time = 5
    invalid = ["fopen", "fscan", "fgetc", "fprintf",
               "fputs", "fseek", "rewind", "fclose", "exec", "open", "openfd"]

    @staticmethod
    def get_compile_profile(id):
        output = C.ops+'./temp/'+id+'/a.out'
        return [C.compiler, './temp/'+id+'/code'+C.ext, output]

    @staticmethod
    def get_run_profile(id):
        return ['./a.out']


class CPP:

    lang_name = 'C++'
    ext = '.cpp'
    compiler = 'g++'
    ops = '-o'
    type = Lang_type.COMPILED
    compile_time = 5
    run_time = 5
    invalid = ["ofstream", "ifstream", "fstream"]

    @staticmethod
    def get_compile_profile(id):
        output = CPP.ops+'./temp/'+id+'/a.out'
        return [CPP.compiler, './temp/'+id+'/code'+CPP.ext, output]

    @staticmethod
    def get_run_profile(id):
        return ['./a.out']

#! This should have a -std=c++14 flag in ops, but it caused error, should check before using
class CPP14:

    lang_name = 'C++'
    ext = '.cpp'
    compiler = 'g++'
    ops = ' -o '
    type = Lang_type.COMPILED
    compile_time = 5
    run_time = 5
    invalid = ["ofstream", "ifstream", "fstream"]

    @staticmethod
    def get_compile_profile(id):
        output = CPP14.ops+'./temp/'+id+'/a.out'
        return [CPP14.compiler, './temp/'+id+'/code'+CPP14.ext, output]

    @staticmethod
    def get_run_profile(id):
        return ['./a.out']


class JAVA:

    lang_name = 'Java'
    ext = '.java'
    compiler = 'javac'
    ops = ''
    type = Lang_type.COMPILED
    compile_time = 5
    run_time = 5
    invalid = ["write", "close"]

    @staticmethod
    def get_compile_profile(id):
        return [JAVA.compiler, './temp/'+id+'/code'+JAVA.ext]

    @staticmethod
    def get_run_profile(id):
        return ['java', 'Main']


class NODE:

    lang_name = 'Node'
    ext = '.js'
    compiler = 'node'
    ops = ''
    type = Lang_type.INTERPRETED
    compile_time = 5
    run_time = 5
    invalid = ['document.write']
    @staticmethod
    def get_compile_profile(id):
        output = NODE.ops+'./temp/'+id+'/a.out'
        return [NODE.compiler, './temp/'+id+'/code'+NODE.ext, output]

    @staticmethod
    def get_run_profile(id):
        raise LookupError()

#! PLease check the correct compiler command as per deploying system. It may not be 'python2' everywhere
class PYTHON2:

    lang_name = 'Python 2'
    ext = '.py'
    compiler = 'python2'
    ops = ''
    type = Lang_type.INTERPRETED
    invalid = ["open"]
    compile_time = 5
    run_time = 5
    @staticmethod
    def get_compile_profile(id):
        output = PYTHON2.ops+'./temp/'+id+'/a.out'
        return [PYTHON2.compiler, './temp/'+id+'/code'+PYTHON2.ext, output]

    @staticmethod
    def get_run_profile(id):
        raise LookupError()

#! PLease check the correct compiler command as per deploying system. It may not be 'python3' everywhere
class PYTHON3:

    lang_name = 'Python 3'
    ext = '.py'
    compiler = 'python3'
    ops = ''
    type = Lang_type.INTERPRETED
    invalid = ["open"]
    compile_time = 5
    run_time = 5
    @staticmethod
    def get_compile_profile(id):
        output = PYTHON3.ops+'./temp/'+id+'/a.out'
        return [PYTHON3.compiler, './temp/'+id+'/code'+PYTHON3.ext, output]

    @staticmethod
    def get_run_profile(id):
        raise LookupError()
