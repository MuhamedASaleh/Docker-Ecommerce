/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.schema.createTable("products", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table.string("name", 255)
            .notNullable();

        table.text("description");

        table.decimal("price", 10, 2)
            .notNullable();

        table.integer("stock_quantity")
            .defaultTo(0)
            .notNullable();

        table.uuid("category_id");

        table.text("image_url");

        table.boolean("is_active")
            .defaultTo(true);

        table.timestamp("created_at")
            .defaultTo(knex.fn.now());

        table.timestamp("updated_at")
            .defaultTo(knex.fn.now());

    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("products");

};
