exports.up = async function (knex) {

    await knex.schema.createTable("orders", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table.uuid("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("RESTRICT");

        table.string("status", 30)
            .notNullable()
            .defaultTo("pending");

        table.decimal("total_amount", 10, 2)
            .notNullable();

        table.text("stripe_payment_intent_id")
            .unique();

        table.timestamp("created_at")
            .defaultTo(knex.fn.now());

        table.timestamp("updated_at")
            .defaultTo(knex.fn.now());

    });

};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("orders");

};
