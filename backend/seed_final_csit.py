import urllib.request
import json
import random

API_URL = "http://127.0.0.1:8000/api"

# Clean existing data to avoid duplicates (optional but recommended for a fresh "init" feel)
def clean_db():
    print("Cleaning database...")
    try:
        # Fetch all
        for endpoint in ["subjects", "syllabus"]:
            with urllib.request.urlopen(f"{API_URL}/{endpoint}/") as res:
                items = json.loads(res.read().decode())
                for item in items:
                    req = urllib.request.Request(f"{API_URL}/{endpoint}/{item['id']}/", method="DELETE")
                    urllib.request.urlopen(req)
        print("Database cleaned.")
    except Exception as e:
        print(f"Clean failed: {e}")

DATA = [
    {
        "semester": "Semester 1",
        "subjects": [
            {
                "name": "Advanced Operating Systems", "code": "C.Sc. 538", "color": "#4f46e5", "teacher": "Prof. CDCSIT",
                "topics": [
                    {"topic": "Process Management and Synchronization", "unit": "Unit 1", "progress": 100, "status": "completed"},
                    {"topic": "Memory Management & Paging", "unit": "Unit 2", "progress": 80, "status": "in-progress"},
                    {"topic": "Protection and Security", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Distributed Special Purpose Systems", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            },
            {
                "name": "Object Oriented Software Engineering", "code": "C.Sc. 539", "color": "#10b981", "teacher": "Prof. Software Eng.",
                "topics": [
                    {"topic": "Software Life Cycle Models", "unit": "Unit 1", "progress": 100, "status": "completed"},
                    {"topic": "Requirement Analysis and Specification", "unit": "Unit 2", "progress": 100, "status": "completed"},
                    {"topic": "Object Oriented Design & Analysis", "unit": "Unit 3", "progress": 40, "status": "in-progress"},
                    {"topic": "Testing and Component Management", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            },
            {
                "name": "Algorithms and Complexity", "code": "C.Sc. 540", "color": "#f59e0b", "teacher": "Dr. Algorithm",
                "topics": [
                    {"topic": "Advanced Algorithm Analysis Techniques", "unit": "Unit 1", "progress": 100, "status": "completed"},
                    {"topic": "Computational Complexity Theory", "unit": "Unit 2", "progress": 90, "status": "in-progress"},
                    {"topic": "Online and PRAM Algorithms", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Mesh and Hypercube algorithms", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            },
            {
                "name": "Advanced Computer Architecture", "code": "C.Sc. 546", "color": "#a855f7", "teacher": "Prof. Hardware",
                "topics": [
                    {"topic": "Fundamentals of Computer Design", "unit": "Unit 1", "progress": 100, "status": "completed"},
                    {"topic": "Memory Hierarchy Design", "unit": "Unit 2", "progress": 50, "status": "in-progress"},
                    {"topic": "Instruction Level Parallelism", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Data Level Parallelism", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            }
        ]
    },
    {
        "semester": "Semester 2",
        "subjects": [
            {
                "name": "Compiler Optimization", "code": "C.Sc. 558", "color": "#e11d48", "teacher": "Dr. Compiler",
                "topics": [
                    {"topic": "Review of Compiler Structure", "unit": "Unit 1", "progress": 0, "status": "not-started"},
                    {"topic": "Dependence Analysis and Testing", "unit": "Unit 2", "progress": 0, "status": "not-started"},
                    {"topic": "Loop Optimization", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Interprocedural Analysis", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            },
            {
                "name": "Web Systems and Algorithms", "code": "C.Sc. 559", "color": "#06b6d4", "teacher": "Prof. Web",
                "topics": [
                    {"topic": "Searching and Link Analysis", "unit": "Unit 1", "progress": 0, "status": "not-started"},
                    {"topic": "Suggestions and Recommendations", "unit": "Unit 2", "progress": 0, "status": "not-started"},
                    {"topic": "Clustering and Grouping", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Semantic Web Technologies", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            },
            {
                "name": "Machine Learning", "code": "C.Sc. 561", "color": "#14b8a6", "teacher": "Dr. ML",
                "topics": [
                    {"topic": "Supervised Learning", "unit": "Unit 1", "progress": 0, "status": "not-started"},
                    {"topic": "Learning Theory", "unit": "Unit 2", "progress": 0, "status": "not-started"},
                    {"topic": "Unsupervised Learning", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Reinforcement Learning", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            }
        ]
    },
    {
        "semester": "Semester 3",
        "subjects": [
            {
                "name": "Principles of Programming Languages", "code": "C.Sc. 618", "color": "#f97316", "teacher": "Prof. PPL",
                "topics": [
                    {"topic": "Language Design Issues", "unit": "Unit 1", "progress": 0, "status": "not-started"},
                    {"topic": "Data Types and Abstraction", "unit": "Unit 2", "progress": 0, "status": "not-started"},
                    {"topic": "Subprogram Control", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Distributed Processing Paradigms", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            },
            {
                "name": "Advanced Cryptography", "code": "C.Sc. 619", "color": "#6366f1", "teacher": "Dr. Crypto",
                "topics": [
                    {"topic": "Shannon Theory and Classical Crypto", "unit": "Unit 1", "progress": 0, "status": "not-started"},
                    {"topic": "Block and Stream Ciphers", "unit": "Unit 2", "progress": 0, "status": "not-started"},
                    {"topic": "Public Key Cryptography", "unit": "Unit 3", "progress": 0, "status": "not-started"},
                    {"topic": "Key Management & Secret Sharing", "unit": "Unit 4", "progress": 0, "status": "not-started"}
                ]
            }
        ]
    },
    {
        "semester": "Semester 4",
        "subjects": [
            {
                "name": "Genetic Algorithms", "code": "C.Sc. 665", "color": "#ec4899", "teacher": "Dr. Genetic",
                "topics": [
                    {"topic": "Mathematical Foundation of GA", "unit": "Unit 1", "progress": 0, "status": "not-started"},
                    {"topic": "Advanced Operators and Search", "unit": "Unit 2", "progress": 0, "status": "not-started"},
                    {"topic": "Genetic Based Machine Learning", "unit": "Unit 3", "progress": 0, "status": "not-started"}
                ]
            },
            {
                "name": "Dissertation", "code": "C.Sc. 666", "color": "#8b5cf6", "teacher": "HOD CDCSIT",
                "topics": [
                    {"topic": "Research Methodology", "unit": "Unit 1", "progress": 0, "status": "not-started"},
                    {"topic": "Implementation and Validation", "unit": "Unit 2", "progress": 0, "status": "not-started"},
                    {"topic": "Thesis Writing and Defense", "unit": "Unit 3", "progress": 0, "status": "not-started"}
                ]
            }
        ]
    }
]

def push_data():
    for sem in DATA:
        semester_name = sem["semester"]
        for sub in sem["subjects"]:
            # 1. Push Subject
            sub_data = {
                "name": sub["name"],
                "code": sub["code"],
                "semester": semester_name,
                "teacher": sub["teacher"],
                "color": sub["color"]
            }
            req = urllib.request.Request(f"{API_URL}/subjects/", method="POST")
            req.add_header('Content-Type', 'application/json')
            res = urllib.request.urlopen(req, json.dumps(sub_data).encode())
            created_sub = json.loads(res.read().decode())
            print(f"Pushed Subject: {sub['name']}")
            
            # 2. Push Syllabus Topics
            for t in sub["topics"]:
                topic_data = {
                    "subjectId": created_sub["id"],
                    "topic": t["topic"],
                    "unit": t["unit"],
                    "progress": t["progress"],
                    "status": t["status"],
                    "description": f"Official TU MSc CSIT curriculum for {t['topic']}."
                }
                treq = urllib.request.Request(f"{API_URL}/syllabus/", method="POST")
                treq.add_header('Content-Type', 'application/json')
                urllib.request.urlopen(treq, json.dumps(topic_data).encode())
                print(f"  - Pushed Topic: {t['topic']}")

if __name__ == "__main__":
    clean_db()
    push_data()
    print("\n--- ALL DATA SEEDED SUCCESSFULLY ---")
