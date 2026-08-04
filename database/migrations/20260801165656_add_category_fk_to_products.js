exports.up = async function (knex) {

    await knex.schema.alterTable("products", (table) => {

        table.foreign("category_id", "fk_products_category")
            .references("id")
            .inTable("categories")
            .onDelete("SET NULL");

    });

};

exports.down = async function (knex) {

    await knex.schema.alterTable("products", (table) => {

        table.dropForeign("category_id", "fk_products_category");

    });

};
