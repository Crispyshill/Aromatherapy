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

const essentialoilSchema = new mongoose.Schema(
    {
        modernName: {
            type: String,
            required: true
        },
        latinName: String,
        balancedDoshas: [String],
        chemicals: [chemicalSchema]
}
);

mongoose.model("Essentialoil", essentialoilSchema, "essentialoils");