const mongoose = require("mongoose");

const chemicalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: String
    }
);

const doshaSchema = new mongoose.Schema(
    {
        vata: {
            type: Boolean,
            required: true
        },
        pitta: {
            type: Boolean,
            required: true
        },
        kapha: {
            type: Boolean,
            required: true
        }

    },
    {_id: false}
)

const essentialoilSchema = new mongoose.Schema(
    {
        modernName: {
            type: String,
            required: true
        },
        latinName: String,
        balancedDoshas: doshaSchema,
        chemicals: [chemicalSchema]
}
);

mongoose.model("Essentialoil", essentialoilSchema, "essentialoils");