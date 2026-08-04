exports.up = async function (knex) {

    await knex.schema.createTable("categories", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table.string("name", 255)
            .notNullable()
            .unique();

        table.text("description");

        table.timestamp("created_at")
            .defaultTo(knex.fn.now());

        table.timestamp("updated_at")
            .defaultTo(knex.fn.now());

    });

};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("categories");

};
