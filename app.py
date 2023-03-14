from flask import Flask, request, render_template, url_for, json, redirect

app = Flask(__name__)

@app.route("/")
def main():
    return redirect("/grades")

@app.route("/grades", methods=["GET", "POST", "PUT"])
def input_grade():
    if request.method != "GET":
        studentName = request.get_json().get("name")
        grade = request.get_json().get("grade")
        if studentName and grade >= 0:
            with open("./static/grades.json", "r") as jsonFile:
                gradesDict = json.load(jsonFile)
            with open("./static/grades.json", "w") as jsonFile:
                gradesDict.update({studentName: grade})
                json.dump(gradesDict, jsonFile)
            return json.dumps(gradesDict)
        else:
            return json.dumps("Error")
    return render_template('index.html')

@app.route("/grades/<name>", methods=["GET", "DELETE"])
def get_grade(name):
    with open("./static/grades.json", "r") as jsonFile:
        gradesDict = json.load(jsonFile)
    for key, value in gradesDict.items():
        if key == name:
            if request.method == "DELETE":
                gradesDict.pop(key)
                with open("./static/grades.json", "w") as jsonFile:
                    json.dump(gradesDict, jsonFile)
                return json.dumps(gradesDict)
            return json.dumps(f"{key}: {value}")
    return json.dumps("Not Found")

@app.route("/grades/all", methods=["GET"])
def get_all():
    with open("./static/grades.json", "r") as jsonFile:
        gradesDict = json.load(jsonFile)
        return json.dumps(gradesDict)

if __name__ == '__main__':
    app.run(debug=True)