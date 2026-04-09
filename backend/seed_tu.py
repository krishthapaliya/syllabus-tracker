import urllib.request
import json
import random

SUBJECTS = [
    {"name": "Advanced Operating Systems", "code": "C.Sc. 538", "semester": "Semester 1", "teacher": "Prof. TBD"},
    {"name": "Object Oriented Software Engineering", "code": "C.Sc. 539", "semester": "Semester 1", "teacher": "Prof. TBD"},
    {"name": "Algorithms and Complexity", "code": "C.Sc. 540", "semester": "Semester 1", "teacher": "Prof. TBD"},
    
    {"name": "Compiler Optimization", "code": "C.Sc. 558", "semester": "Semester 2", "teacher": "Prof. TBD"},
    {"name": "Web Systems and Algorithms", "code": "C.Sc. 559", "semester": "Semester 2", "teacher": "Prof. TBD"},
    
    {"name": "Principles of Programming Languages", "code": "C.Sc. 618", "semester": "Semester 3", "teacher": "Prof. TBD"},
    {"name": "Advanced Cryptography", "code": "C.Sc. 619", "semester": "Semester 3", "teacher": "Prof. TBD"},
    {"name": "Literature Review in Research", "code": "C.Sc. 620", "semester": "Semester 3", "teacher": "Prof. TBD"},
    
    {"name": "Genetic Algorithms", "code": "C.Sc. 665", "semester": "Semester 4", "teacher": "Prof. TBD"},
    {"name": "Dissertation", "code": "C.Sc. 666", "semester": "Semester 4", "teacher": "Prof. TBD"}
]

COLORS = ['#6366f1', '#f59e0b', '#10b981', '#e11d48', '#3b82f6', '#14b8a6']

url = "http://127.0.0.1:8000/api/subjects/"

for index, sub in enumerate(SUBJECTS):
    data = {
        "name": sub["name"],
        "code": sub["code"],
        "semester": sub["semester"],
        "teacher": sub["teacher"],
        "color": random.choice(COLORS)
    }
    
    req = urllib.request.Request(url)
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(data)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    
    try:
        response = urllib.request.urlopen(req, jsondataasbytes)
        print(f"Added: {sub['name']} ({response.status})")
    except Exception as e:
        print(f"Failed to add {sub['name']}: {e}")
