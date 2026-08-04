exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table.string("full_name", 255)
            .notNullable();

        table.string("email", 255)
            .notNullable()
            .unique();

        table.text("password_hash")
            .notNullable();

        table.string("role", 50)
            .notNullable()
            .defaultTo("CUSTOMER");

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamp("created_at")
            .defaultTo(knex.fn.now());

        table.timestamp("updated_at")
            .defaultTo(knex.fn.now());

    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
