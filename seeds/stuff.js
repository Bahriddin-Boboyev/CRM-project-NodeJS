/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("stuff").del();
  await knex("stuff").insert([
    {
      first_name: "John",
      last_name: "Doe",
      role: "super_admin",
      username: "super",
      password: 12345,
    },
    {
      first_name: "Orzu",
      last_name: "Mirzayev",
      role: "teacher",
      username: "orzu1",
      password: 12345,
    },
    {
      first_name: "Quvonchbek",
      last_name: "Muysinov",
      role: "assistant_teacher",
      username: "ass_tech",
      password: 12345,
    },
  ]);
};
