import urllib.request
import json
import random

API_URL = "http://127.0.0.1:8000/api"

def get_subjects():
    try:
        with urllib.request.urlopen(f"{API_URL}/subjects/") as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching subjects: {e}")
        return []

def add_syllabus(topic_data):
    req = urllib.request.Request(f"{API_URL}/syllabus/")
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(topic_data).encode('utf-8')
    try:
        with urllib.request.urlopen(req, jsondata) as response:
            return response.status
    except Exception as e:
        print(f"Error adding syllabus topic {topic_data['topic']}: {e}")
        return None

subjects = get_subjects()

SYLLABUS_MAP = {
    "Advanced Operating Systems": [
        {"topic": "Process Synchronization and Deadlocks", "unit": "Unit 1", "progress": 100, "status": "completed"},
        {"topic": "Distributed System Architectures", "unit": "Unit 2", "progress": 60, "status": "in-progress"},
        {"topic": "Real-time Scheduling", "unit": "Unit 3", "progress": 0, "status": "not-started"},
        {"topic": "Case Studies: Linux & Windows Kernel", "unit": "Unit 4", "progress": 0, "status": "not-started"}
    ],
    "Object Oriented Software Engineering": [
        {"topic": "Requirements Engineering & Use Cases", "unit": "Unit 1", "progress": 100, "status": "completed"},
        {"topic": "System Modeling with UML", "unit": "Unit 2", "progress": 100, "status": "completed"},
        {"topic": "Design Patterns: Creational & Structural", "unit": "Unit 3", "progress": 40, "status": "in-progress"},
        {"topic": "Software Testing Strategies", "unit": "Unit 4", "progress": 0, "status": "not-started"}
    ],
    "Algorithms and Complexity": [
        {"topic": "Divide and Conquer Algorithms", "unit": "Unit 1", "progress": 100, "status": "completed"},
        {"topic": "Dynamic Programming Theory", "unit": "Unit 2", "progress": 100, "status": "completed"},
        {"topic": "Complexity Classes: P, NP, NP-Hard", "unit": "Unit 3", "progress": 10, "status": "in-progress"},
        {"topic": "Approximation Algorithms", "unit": "Unit 4", "progress": 0, "status": "not-started"}
    ]
}

print("Starting Syllabus Seeding...")
for subject in subjects:
    name = subject['name']
    if name in SYLLABUS_MAP:
        print(f"Adding syllabus for {name}...")
        for topic in SYLLABUS_MAP[name]:
            topic_data = {
                "subjectId": subject['id'],
                "topic": topic['topic'],
                "unit": topic['unit'],
                "status": topic['status'],
                "progress": topic['progress'],
                "description": f"Detailed study of {topic['topic']} as per TU MSc CSIT curriculum."
            }
            res = add_syllabus(topic_data)
            if res == 201:
                print(f"  - Added topic: {topic['topic']}")

print("Syllabus Seeding Complete!")
