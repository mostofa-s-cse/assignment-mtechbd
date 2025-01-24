// src/hooks/usePromotions.js
import { useDispatch, useSelector } from 'react-redux';
import { promotionActions } from '../store/reducers/promotionSlice'; // Adjust the path as necessary
import { authClient } from '../constants/axiosInstance';
import { useCallback } from 'react';

export const usePromotions = () => {
    const dispatch = useDispatch();
    const promotions = useSelector((state) => state.promotions.items);

    const fetchPromotions = useCallback(async () => {
        try {
            const response = await authClient.get('/promotions');
            if (response.status === 200) {
                dispatch(promotionActions.setPromotions(response.data.data)); // Use the 'data' array from the response
            }
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
        }
    }, [dispatch]);

    const createPromotion = async (promotionData) => {
        try {
            const response = await authClient.post('/promotions', promotionData);
            dispatch(promotionActions.addPromotion(response.data)); // Assuming the response contains the created promotion
        } catch (error) {
            alert('Failed to create promotion:', error);
            console.log('Failed to create promotion:', error);
        }
    };

    const editPromotion = async (promotionId, updatedData) => {
        try {
            const response = await authClient.put(`/promotions/${promotionId}`, updatedData);
            dispatch(promotionActions.updatePromotion(response.data)); // Assuming the response contains the updated promotion
        } catch (error) {
            console.error('Failed to edit promotion:', error);
        }
    };

    const togglePromotion = async (promotionId) => {
        try {
            const promotion = promotions.find((p) => p.id === promotionId);
            const response = await authClient.put(`/promotions/${promotionId}/isEnabled`, {
                isEnabled: !promotion.isEnabled,
            });
            dispatch(promotionActions.updatePromotion(response.data)); // Assuming the response contains the updated promotion
        } catch (error) {
            console.error('Failed to toggle promotion:', error);
        }
    };

    const deletePromotion = async (promotionId) => {
        try {
            await authClient.delete(`/promotions/${promotionId}`);
            dispatch(promotionActions.removePromotion(promotionId)); // Assuming the action removes the promotion by ID
        } catch (error) {
            console.error('Failed to delete promotion:', error);
        }
    };

    return { promotions, fetchPromotions, createPromotion, editPromotion, togglePromotion, deletePromotion };
};
