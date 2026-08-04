exports.up = async function (knex) {

    await knex.schema.createTable("order_items", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table.uuid("order_id")
            .notNullable()
            .references("id")
            .inTable("orders")
            .onDelete("CASCADE");

        table.uuid("product_id")
            .notNullable()
            .references("id")
            .inTable("products")
            .onDelete("RESTRICT");

        table.integer("quantity")
            .notNullable();

        table.decimal("unit_price", 10, 2)
            .notNullable();

        table.timestamp("created_at")
            .defaultTo(knex.fn.now());

    });

};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("order_items");

};
