exports.up = async function (knex) {
    await knex.schema.alterTable("products", (table) => {
        table.text("image_public_id");
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable("products", (table) => {
        table.dropColumn("image_public_id");
    });
};