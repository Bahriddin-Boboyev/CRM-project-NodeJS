const express = require("express");
const db = require("../../db");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postGroup = async (req, res) => {
  try {
    const { name, teacher_id, assistant_teacher_id } = req.body;

    if (teacher_id) {
      const existing = await db("stuff").where({ id: teacher_id }).first();

      if (!existing || existing.role !== "teacher") {
        return res.status(400).json({
          error: "Teacher mavjud emas.",
        });
      }
    }

    if (assistant_teacher_id) {
      const existing = await db("stuff")
        .where({ id: assistant_teacher_id })
        .first();

      if (!existing || existing.role !== "assistant_teacher") {
        return res.status(400).json({
          error: "Asistent teacher mavjud emas.",
        });
      }
    }

    const existingGroup = await db("groups").where({ name: name }).first();
      if(existingGroup){
        return res.status(500).json({error: `${name} - bu nomli guruh allaqachon mavjud!`})
      }
    const result = await db("groups")
      .insert({ name, teacher_id, assistant_teacher_id })
      .returning("*");

    res.status(201).json({
      group: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getGroups = async (req, res) => {
  try {
    const result = await db("groups")
      .leftJoin(
        "stuff as stuff_teacher",
        "stuff_teacher.id",
        "groups.teacher_id"
      )
      .leftJoin(
        "stuff as stuff_assistant ",
        "stuff_assistant.id",
        "groups.assistant_teacher_id"
      )
      .select(
        "groups.id",
        "groups.name",
        db.raw(
          "CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"
        ),
        db.raw(
          "CONCAT(stuff_assistant.first_name, ' ', stuff_assistant.last_name) as assistant_teacher"
        )
      );

    res.status(201).json({
      groups: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getSingleGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db("groups").where({ id: id }).returning("*").first();

    if (!result) {
      return res.status(404).json({ error: "group not found" });
    }
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const patchGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...changes } = req.body;

    const existing = await db("groups").where({ id: id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli gruh topilmadi`,
      });
    }
    const updated = await db("groups")
      .where({ id })
      .update({ ...changes })
      .returning(["id", "name", "teacher_id", "assistant_teacher_id"]);

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db("groups").where({ id: id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli guruh topilmadi`,
      });
    }
    const deleted = await db("groups")
      .where({ id })
      .delete()
      .returning(["id", "name", "teacher_id", "assistant_teacher_id"]);

    res.status(200).json({ deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const addStudentToGroup = async (req, res) => {
  try {
    const { id, student_id } = req.params;

    const existingGroup = await db("groups")
      .where({ id: id })
      .first()
      .returning("*");

    const existingStudent = await db("students")
      .where({ id: student_id })
      .first()
      .returning("*");

    if (!existingGroup || !existingStudent) {
      return res.status(404).json({ error: "group or student not found" });
    }

    const created = await db("student_groups")
      .insert({
        group_id: id,
        student_id,
      })
      .returning("*");

    res.status(201).json({ created: created[0] });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const studentGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await db("student_groups")
      .where({ group_id: id })
      .returning("*");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const students = group.map((g) => g.student_id);
    const student = await db("students").whereIn("id", students).returning("*");

    const joinStudentGroup = await db("groups").where({ id }).returning("*");

    joinStudentGroup[0].students = student;
    res.status(200).json({ group: joinStudentGroup });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteGroupStudent = async (req, res) => {
  try {
    const { id, student_id } = req.params;

    const existingGroup = await db("groups")
      .where({ id: id })
      .first()
      .returning("*");

    const existingStudent = await db("students")
      .where({ id: student_id })
      .first()
      .returning("*");

    if (!existingGroup || !existingStudent) {
      return res.status(404).json({ error: "group or student not found" });
    }

    const deleted = await db("student_groups")
      .where({ student_id })
      .delete()
      .returning("*");

    res.status(200).json({ deleted });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  postGroup,
  getGroups,
  getSingleGroup,
  patchGroups,
  deleteGroup,
  addStudentToGroup,
  studentGroup,
  deleteGroupStudent,
};
