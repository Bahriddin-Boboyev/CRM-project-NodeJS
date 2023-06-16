/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("student_groups", (table) => {
    table
      .integer("group_id")
      .references("id")
      .inTable("groups")
      .onDelete("CASCADE");
    table
      .integer("student_id")
      .references("id")
      .inTable("students")
      .onDelete("CASCADE");
    table.date("joined_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("student_groups");
};
