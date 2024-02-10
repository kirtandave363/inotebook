const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require('express-validator');


// Route 1: Get All the notes of logged in user : GET: "api/notes/fetchallnotes, Login required"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
})

// Route 2: Add a Note: POST: "api/notes/addnote, Login required"
router.post("/addnote", fetchuser, [
    body('title', "Enter a valid name").isLength({ min: 3 }),
    body('description', "description must be atleast 5 characters").isLength({ min: 5 })
], async (req, res) => {

    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // destructing data from req header
    const { title, description, tag } = req.body;

    try {
        // saving a new note
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save()
        res.send(savednote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal Server error occured!");
    }
})

// Route 3: Update an existing note: Put: "api/notes/updatenote, Login required"

router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
    // creating new note object

    let newnote = {};
    if (title) { newnote.title = title };
    if (description) { newnote.description = description };
    if (tag) { newnote.tag = tag };

   
        // find the note to be updated and update it

        let note = await Notes.findById(req.params.id);

        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal Server error occured!");
    }
})

// Route 4: Delete an existing note: delete: "api/notes/deletenote, Login required"

router.delete("/deletenote/:id", fetchuser, async (req, res) => {

    // find the note to be delete and delete it
    try {
        let note = await Notes.findById(req.params.id);

        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", "note": note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal Server error occured!");
    }
})

module.exports = router;