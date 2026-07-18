import { useDispatch } from "react-redux";

import {
    addAddress,
    updateAddress,
    deleteAddress,
    makeAddressDefault,
    getOneAddress,
    getAllAddresses,
} from "../services/address.api";

import {
    setAddresses,
    setLoading,
    setError,
    clearError,
} from "../state/address.slice";

export const useAddress = () => {
    const dispatch = useDispatch();

    const handleGetAllAddresses = async () => {
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            const data = await getAllAddresses();
            dispatch(setAddresses(data.addresses));
            return data.addresses;
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message || error.message
                )
            );
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleAddAddress = async (addressFormData) => {
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            await addAddress(addressFormData);
            return await handleGetAllAddresses();
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message || error.message
                )
            );
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateAddress = async (addressId, addressFormData) => {
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            await updateAddress(addressId, addressFormData);
            return await handleGetAllAddresses();
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message || error.message
                )
            );
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteAddress = async (addressId) => {
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            await deleteAddress(addressId);
            return await handleGetAllAddresses();
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message || error.message
                )
            );
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleMakeAddressDefault = async (addressId) => {
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            await makeAddressDefault(addressId);
            return await handleGetAllAddresses();
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message || error.message
                )
            );
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetOneAddress = async (addressId) => {
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            const data = await getOneAddress(addressId);
            return data.address;
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message || error.message
                )
            );
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleAddAddress,
        handleUpdateAddress,
        handleDeleteAddress,
        handleMakeAddressDefault,
        handleGetAllAddresses,
        handleGetOneAddress,
    };
};