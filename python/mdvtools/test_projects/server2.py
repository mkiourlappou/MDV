from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres@localhost/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

db = SQLAlchemy(app)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    files = db.relationship('File', backref='project', lazy=True)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    upload_timestamp = db.Column(db.DateTime, nullable=False, default=datetime.now)
    update_timestamp = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)


@app.route('/')
def index():
    return open('index.html').read()

@app.route('/upload', methods=['POST'])
def upload():
    try:
        project_name = request.form.get('project_name')
        if not project_name:
            return jsonify({'error': 'Project name is missing.'}), 400
        
        file = request.files['file']
        if not file:
            return jsonify({'error': 'No file selected.'}), 400

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)

        # Check if project exists
        project = Project.query.filter_by(name=project_name).first()
        if not project:
            project = Project(name=project_name)
            db.session.add(project)

        # Check if file with same name already exists in the project
        existing_file = File.query.filter_by(name=file.filename, project_id=project.id).first()
        if existing_file:
            # Replace the existing file in the file system
            os.remove(existing_file.file_path)

            # Update the database entry with new file path and update timestamp
            existing_file.file_path = file_path
            existing_file.update_timestamp = datetime.now()

            # Save the file to the uploads directory
            file.save(file_path)

            db.session.commit()

            return jsonify({'message': f'File "{file.filename}" under project "{project_name}" exists already. File has been replaced.'}), 200
        else:
            # Save the file to the uploads directory
            file.save(file_path)

            # Create a new file entry
            new_file = File(name=file.filename, file_path=file_path, project=project)
            db.session.add(new_file)
            db.session.commit()

            return jsonify({'message': f'File uploaded successfully under project "{project_name}"'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/delete_file', methods=['DELETE'])
def delete_file():
    try:
        file_id = request.args.get('file_id')
        if not file_id:
            return jsonify({'error': 'File ID is missing.'}), 400

        # Check if the file exists
        file = File.query.get(file_id)
        if not file:
            return jsonify({'error': 'File not found.'}), 404

        # Delete the file from the uploads directory
        if os.path.exists(file.file_path):
            os.remove(file.file_path)
        
        # Delete the file entry from the database
        db.session.delete(file)
        db.session.commit()
        return jsonify({'message': 'File deleted successfully.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5054)