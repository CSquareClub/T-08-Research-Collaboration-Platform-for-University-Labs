# Database Schema

Below are the initial structures for the main MongoDB collections to be used in ResearchHub.

## Users Collection
Stores information about students, faculty, PIs, and admins.

```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique, Indexed)",
  "passwordHash": "String",
  "role": "String (Enum: Student, Faculty, PI, Admin)",
  "department": "String (Indexed)",
  "skills": ["String"],
  "interests": ["String"],
  "profilePicUrl": "String",
  "publications": ["ObjectId (Ref: Publications)"],
  "projects": ["ObjectId (Ref: Projects)"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Projects Collection
Stores research projects, ownership, required skills, and embedded milestones.

```json
{
  "_id": "ObjectId",
  "title": "String (Text Indexed)",
  "abstract": "String (Text Indexed)",
  "domain": "String (Indexed)",
  "status": "String (Enum: Open, Closed, Ongoing, Completed) (Indexed)",
  "requiredSkills": ["String"],
  "teamSizeNeeded": "Number",
  "owner": "ObjectId (Ref: Users)",
  "collaborators": ["ObjectId (Ref: Users)"],
  "milestones": [
    {
      "title": "String",
      "deadline": "Date",
      "progress": "Number (0-100)",
      "approved": "Boolean"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## CollaborationRequests Collection
Tracks requests from students to join a project.

```json
{
  "_id": "ObjectId",
  "fromUser": "ObjectId (Ref: Users)",
  "toUser": "ObjectId (Ref: Users) (Indexed)",
  "projectId": "ObjectId (Ref: Projects) (Indexed)",
  "status": "String (Enum: Pending, Accepted, Rejected) (Indexed)",
  "message": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Datasets Collection
Manages datasets linked to projects or owners, supporting versions.

```json
{
  "_id": "ObjectId",
  "title": "String (Text Indexed)",
  "description": "String",
  "owner": "ObjectId (Ref: Users) (Indexed)",
  "projectId": "ObjectId (Ref: Projects) (Indexed)",
  "fileUrl": "String",
  "access": "String (Enum: public, private)",
  "versions": [
    {
      "version": "Number",
      "url": "String",
      "uploadedAt": "Date"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Publications Collection
Links academic publications to the platform.

```json
{
  "_id": "ObjectId",
  "title": "String (Text Indexed)",
  "doi": "String (Unique, Indexed)",
  "authors": ["String"],
  "publicationDate": "Date",
  "pdfUrl": "String",
  "projectId": "ObjectId (Ref: Projects)",
  "createdAt": "Date"
}
```
