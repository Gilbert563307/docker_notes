import React from 'react'
import { useForm } from "react-hook-form";

export default function NotesCreateNoteComponent() {
    return (
        <form className="row g-3">
            <div className="col-12">
                <label htmlFor="inputTitle" className="form-label">Title</label>
                <input type="text" className="form-control" id="inputTitle" />
            </div>
            <div className="col-12">
                <label htmlFor="inputDescription" className="form-label">Description</label>
                <textarea className="form-control" id="inputDescription" rows="5"></textarea>
            </div>
            <div className="col-md-6">
                <label htmlFor="inputPriority" className="form-label">Priority</label>
                <select className="form-select" id="inputPriority" aria-label="Priority select">
                    <option selected>Open this select menu</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                </select>
            </div>
            <div className="col-12">
                <button type="submit" className="btn btn-primary">Create</button>
            </div>
        </form>
    )
}
