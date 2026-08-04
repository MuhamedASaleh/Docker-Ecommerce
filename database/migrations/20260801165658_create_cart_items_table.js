exports.up = async function (knex) {

    await knex.schema.createTable("cart_items", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table.uuid("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.uuid("product_id")
            .notNullable()
            .references("id")
            .inTable("products")
            .onDelete("CASCADE");

        table.integer("quantity")
            .notNullable()
            .defaultTo(1);

        table.timestamp("created_at")
            .defaultTo(knex.fn.now());

        table.timestamp("updated_at")
            .defaultTo(knex.fn.now());

        table.unique(["user_id", "product_id"]);

    });

    await knex.raw(
        "ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity_positive CHECK (quantity > 0)"
    );

};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("cart_items");

};
