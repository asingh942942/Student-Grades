from flask import Flask, request, render_template, url_for, json, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///grades.sqlite"
db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    grade = db.Column(db.Float, unique=False, nullable=False)

@app.route("/")
def main():
    return redirect("/grades")

@app.route("/grades", methods=["GET", "POST", "PUT"])
def input_grade():
    if request.method != "GET":
        studentName = request.get_json().get("name")
        studentGrade = request.get_json().get("grade")
        if studentName and studentGrade >= 0:
            if request.method == "POST":
                student = Student(name=studentName, grade=studentGrade)
                db.session.add(student)
                db.session.commit()
                return redirect("/grades/all")
            elif request.method == "PUT":
                updateStudent = Student.query.filter_by(name=studentName).first()
                updateStudent.grade = studentGrade
                db.session.commit()
                return json.dumps({"Edited": updateStudent.name})
        else:
            return json.dumps("Incorrect Data")
    return render_template('index.html') 

@app.route("/grades/<studentName>", methods=["GET", "DELETE"])
def get_grade(studentName):
    student = Student.query.filter_by(name=studentName).first()
    if(bool(student)):
        if request.method == "DELETE":
            db.session.delete(student)
            db.session.commit()
            return json.dumps({"Deleted": student.name})
        return json.dumps(f"{student.name}: {student.grade}")
    else:
        return json.dumps("Not Found")

@app.route("/grades/all", methods=["GET"])
def get_all():
    entry_as_dict = {}
    for entry in Student.query.all():
        entry_as_dict[entry.name] = entry.grade
    if(entry_as_dict):
        return json.dumps(entry_as_dict)
    else:
        return json.dumps("Error")
    
@app.route("/database", methods=["GET"])
def get_database_all():
    db.create_all()
    return render_template("database.html", students = Student.query.all())

if __name__ == '__main__':
    app.run(debug=True)