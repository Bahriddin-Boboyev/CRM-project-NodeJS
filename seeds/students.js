/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("students").del();
  await knex("students").insert([
    { first_name: "Twyla", last_name: "Shalliker" },
    { first_name: "Bastien", last_name: "Kench" },
    { first_name: "Bendick", last_name: "Hatwell" },
    { first_name: "Frazer", last_name: "Besantie" },
    { first_name: "Dale", last_name: "Bailes" },
  ]);
};
