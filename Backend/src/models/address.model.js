import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      validate: {
        validator(value) {
          return /^[6-9]\d{9}$/.test(value);
        },
        message: "Please enter a valid 10-digit mobile number.",
      },
    },

    houseNumber: {
      type: String,
      required: [true, "House number is required"],
      trim: true,
    },

    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      validate: {
        validator(value) {
          return /^[1-9][0-9]{5}$/.test(value);
        },
        message: "Please enter a valid 6-digit pincode.",
      },
    },

    landmark: {
      type: String,
      trim: true,
      default: "",
    },

    addressType: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const addressModel = mongoose.model("Address", addressSchema);

export default addressModel;