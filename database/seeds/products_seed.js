/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

  await knex("products").del();

  await knex("products").insert([

    {
      name: "MacBook Pro 16",
      description: "Apple laptop",
      price: 95000,
      stock_quantity: 15,
      image_url: "/images/macbook.jpg"
    },

    {
      name: "Mechanical Keyboard",
      description: "RGB Keyboard",
      price: 3200,
      stock_quantity: 40,
      image_url: "/images/keyboard.jpg"
    },

    {
      name: "Gaming Mouse",
      description: "Wireless Gaming Mouse",
      price: 1800,
      stock_quantity: 60,
      image_url: "/images/mouse.jpg"
    }

  ]);

};
