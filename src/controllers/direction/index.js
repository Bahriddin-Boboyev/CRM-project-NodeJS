const express = require("express");
const db = require("../../db");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

const postDirection = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await db("direction").insert({ name }).returning("*");

    res.status(201).json({
      direction: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getDirection = async (req, res) => {
  try {
    const {
      q,
      limit = 2,
      offset = 0,
      order_by = "id",
      sort_order = "desc",
    } = req.query;

    const result = db("direction").select("id", "name");

    if (q) {
      result.andWhereILike("name", `%${q}%`);
    }
    const count = await result.clone().groupBy("id").count();
    result.orderBy(order_by, sort_order);
    result.limit(limit).offset(offset);

    const direction = await result;
    res.status(201).json({
      direction,
      directionInfo: {
        directionCount: count.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getSingleDirection = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db("direction")
      .select("id", "name")
      .where({ id })
      .returning("*");

    if (!result.length) {
      return res.status(404).json({ error: "direction not found" });
    }

    res.status(200).json({ result: result[0] });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateDirection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existing = db("direction").where({ id: id }).first();

    if (!existing) {
      return res.status(404).json({ error: "direction not found" });
    }

    const update = await db("direction")
      .where({ id })
      .update({ name })
      .returning("*");

    res.status(200).json({ update });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteDirection = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db("direction").where({ id: id }).first();

    if (!existing) {
      return res.status(404).json({ error: "direction not found" });
    }

    const deleted = await db("direction")
      .where({ id: id })
      .delete()
      .returning("*");

    res.status(200).json({ deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  postDirection,
  getDirection,
  getSingleDirection,
  updateDirection,
  deleteDirection,
};
