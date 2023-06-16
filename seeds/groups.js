/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("groups").del();
  await knex("groups").insert([
    { name: "N82", teacher_id: "8", assistant_teacher_id: "9" },
  ]);
};
