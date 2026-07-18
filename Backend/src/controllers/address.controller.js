import addressModel from "../models/address.model.js";

// Add New Address
export const addNewAddressController = async (req, res) => {
    try {
        const user = req.user._id;

        const hasAddress = await addressModel.exists({ user });

        const address = await addressModel.create({
            user,
            ...req.body,
            isDefault: !hasAddress
        });

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Addresses
export const getAllAddressesController = async (req, res) => {
    try {
        const user = req.user._id;

        const addresses = await addressModel
            .find({ user })
            .sort({
                isDefault: -1,
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            message: "Addresses fetched successfully",
            addresses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get One Address
export const getOneAddressController = async (req, res) => {
    try {
        const user = req.user._id;
        const { addressId } = req.params;

        const address = await addressModel.findOne({
            _id: addressId,
            user
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address fetched successfully",
            address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Address
export const updateExistingAddressController = async (req, res) => {
    try {
        const user = req.user._id;
        const { addressId } = req.params;

        const address = await addressModel.findOneAndUpdate(
            {
                _id: addressId,
                user
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Address
export const deleteAddressController = async (req, res) => {
    try {
        const user = req.user._id;
        const { addressId } = req.params;

        const address = await addressModel.findOneAndDelete({
            _id: addressId,
            user
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // If deleted address was default, make another address default
        if (address.isDefault) {
            const nextAddress = await addressModel.findOne({ user });

            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Make Address Default
export const makeAddressDefaultController = async (req, res) => {
    try {
        const user = req.user._id;
        const { addressId } = req.params;

        const address = await addressModel.findOne({
            _id: addressId,
            user
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Remove previous default
        await addressModel.updateMany(
            { user },
            { isDefault: false }
        );

        // Make selected address default
        address.isDefault = true;
        await address.save();

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};